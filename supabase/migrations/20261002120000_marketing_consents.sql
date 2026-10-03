-- Marketing-communication consent records (SMS / WhatsApp / email opt-in).
--
-- This table exists so a marketing-consent flow can be switched on later
-- per customer/package (see src/lib/messaging/featureFlags.ts:
-- marketingConsentEnabled) without a schema migration at that point.
-- While the flag is off for a deployment, the booking UI never shows a
-- marketing checkbox, so nothing is ever written to this table — this
-- migration only prepares the architecture, it does not activate anything.
--
-- Deliberately a separate table from public.appointments: an appointment
-- is a service request and must never itself be read as marketing
-- consent (see the KVKK Aydınlatma Metni — service-related processing
-- relies on contract/legitimate-interest bases, never on this consent).
-- A consent record may optionally reference the appointment it was
-- collected alongside, purely for traceability.
--
-- Security model mirrors appointments.sql:
--   - anon: no table privileges at all.
--   - Public writes go exclusively through record_marketing_consent(),
--     called by a Server Action with the server-only secret key
--     (service_role) after re-validating the request — see
--     src/lib/marketing/server/actions.ts. record_marketing_consent() is
--     not executable by anon or authenticated.
--   - authenticated: SELECT only, gated by public.is_admin() — read-only,
--     for a future CRM/admin consent view. No UPDATE or DELETE grant for
--     anyone but service_role: revocation (unsubscribe) handling is a
--     later feature and is not built in this migration, only the
--     revoked_at column it will eventually write to.
--
-- Additive only: no existing table, policy, grant or data is modified.

begin;

-- ============================================================================
-- Table: marketing_consents
-- Mirrors src/lib/marketing/types.ts MarketingConsent, mapped by
-- src/lib/marketing/consentRow.ts.
-- ============================================================================

create table public.marketing_consents (
  id                 uuid        primary key default gen_random_uuid(),
  -- Which appointment this consent was collected alongside, if any. Not a
  -- cascading reference: appointments are never deleted (only their
  -- status changes), so this can never dangle.
  appointment_id     uuid        references public.appointments (id),

  customer_phone     text,
  customer_email     text,
  -- Same normalization as appointments.customer_phone_key, for future
  -- admin lookup/dedupe by phone.
  customer_phone_key text        generated always as (right(regexp_replace(coalesce(customer_phone, ''), '\D', '', 'g'), 10)) stored,

  -- Which channel(s) this consent covers. A text[] (not an enum[]) kept in
  -- sync with src/lib/marketing/types.ts's MarketingConsentChannel via the
  -- check constraint below — simpler to extend than an enum type if a
  -- future channel (e.g. push notifications) is added.
  channels           text[]      not null,

  -- Where consent was collected, e.g. "appointment_booking".
  source             text        not null,
  -- The exact, localized checkbox/disclosure text the customer saw —
  -- snapshotted so a later wording change never rewrites what was agreed.
  consent_text       text        not null,
  -- Which edition of that wording (src/lib/marketing/consentVersion.ts).
  consent_version    text        not null,
  locale             text        not null,

  granted_at         timestamptz not null default now(),
  -- Set once a future unsubscribe/withdrawal flow revokes this consent.
  -- Null = still active. Not built in this migration beyond the column.
  revoked_at         timestamptz,

  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),

  constraint marketing_consents_contact_check check (
    customer_phone is not null or customer_email is not null
  ),
  constraint marketing_consents_channels_check check (
    array_length(channels, 1) > 0
    and channels <@ array['sms', 'whatsapp', 'email']::text[]
  ),
  constraint marketing_consents_locale_check check (locale in ('tr', 'en', 'ru')),
  constraint marketing_consents_revoked_after_granted check (
    revoked_at is null or revoked_at >= granted_at
  ),
  constraint marketing_consents_text_check check (
    char_length(source) between 1 and 100
    and char_length(consent_text) between 1 and 2000
    and char_length(consent_version) between 1 and 50
  )
);

comment on table public.marketing_consents is
  'Optional marketing-communication consent records (SMS/WhatsApp/email), collected separately from appointment booking. Public inserts only via record_marketing_consent() (service_role); admin read-only via RLS on public.is_admin(). Not written to by any shipped UI while marketingConsentEnabled is false.';

create index marketing_consents_appointment_idx on public.marketing_consents (appointment_id);
create index marketing_consents_phone_recent_idx on public.marketing_consents (customer_phone_key, created_at);

create trigger set_updated_at
  before update on public.marketing_consents
  for each row
  execute function public.set_updated_at();

-- ============================================================================
-- Row Level Security + grants
-- ============================================================================

alter table public.marketing_consents enable row level security;

create policy "marketing_consents_admin_select" on public.marketing_consents
  for select
  to authenticated
  using (public.is_admin());

-- No INSERT, UPDATE or DELETE policy for anyone: rows are created only via
-- record_marketing_consent() (service_role, which bypasses RLS). There is
-- deliberately no admin UPDATE grant yet — revocation is a later feature.

revoke all privileges on public.marketing_consents from anon, authenticated;

grant select on public.marketing_consents to authenticated;

grant all privileges on public.marketing_consents to service_role;

-- ============================================================================
-- Function: public.record_marketing_consent(p_consent)
--
-- Called only by recordMarketingConsentAction with the server-only secret
-- key, after that action has confirmed messagingFeatureFlags
-- .marketingConsentEnabled and validated the request. Mirrors
-- create_appointment()'s jsonb_populate_record pattern.
-- ============================================================================

create or replace function public.record_marketing_consent(p_consent jsonb)
returns public.marketing_consents
language plpgsql
security invoker
set search_path = ''
as $fn$
declare
  v_row public.marketing_consents;
begin
  insert into public.marketing_consents (
    appointment_id, customer_phone, customer_email, channels,
    source, consent_text, consent_version, locale
  )
  select
    r.appointment_id, r.customer_phone, r.customer_email, r.channels,
    r.source, r.consent_text, r.consent_version, r.locale
  from jsonb_populate_record(null::public.marketing_consents, p_consent) r
  returning * into v_row;

  return v_row;
end;
$fn$;

comment on function public.record_marketing_consent(jsonb) is
  'Inserts an optional marketing-communication consent record. Executable by service_role only — called by recordMarketingConsentAction after confirming the feature is enabled and the request is valid.';

revoke all on function public.record_marketing_consent(jsonb) from public, anon, authenticated;
grant execute on function public.record_marketing_consent(jsonb) to service_role;

commit;
