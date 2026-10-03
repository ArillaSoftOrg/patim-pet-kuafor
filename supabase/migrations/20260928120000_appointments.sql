-- Appointments: persistence, double-booking protection and access control.
--
-- Backs the customer booking flow (/appointment) and the admin appointment
-- manager (/admin/appointments), replacing the browser-only mock storage.
-- Mirrors src/lib/appointments/types.ts Appointment, mapped by
-- src/lib/appointments/appointmentRow.ts.
--
-- Security model (see also src/lib/appointments/server/actions.ts):
--   - anon: NO table privileges at all — cannot read, insert, update or
--     delete appointments. The only anon-callable object is
--     get_booked_slots(), which returns taken time slots and nothing else
--     (no names, phones, addresses, pets or notes).
--   - Public creation goes exclusively through the Next.js Server Action,
--     which re-validates every field server-side and then calls
--     create_appointment() with the server-only secret key (service_role).
--     create_appointment() is NOT executable by anon or authenticated, so
--     the Server Action is the only way in.
--   - authenticated: SELECT and column-limited UPDATE privileges, but RLS
--     only lets rows through for public.is_admin() — the same admin
--     allow-list model used by every other table. No INSERT or DELETE for
--     anyone but service_role.
--   - Double booking is impossible at the database level: an exclusion
--     constraint rejects any two pending/confirmed appointments whose
--     [start, end + buffer) ranges overlap, including under concurrency.
--
-- Additive only: no existing table, policy, grant or data is modified.
-- Like the earlier migrations, this is written to be reviewed and applied
-- separately (SQL Editor or `supabase db push`), inside one transaction.

begin;

-- ============================================================================
-- Enum type
-- Mirrors src/lib/appointments/types.ts AppointmentStatus.
-- ============================================================================

create type public.appointment_status as enum ('pending', 'confirmed', 'completed', 'cancelled');

-- ============================================================================
-- Table: appointments
--
-- Dates/times are wall-clock values in the business time zone
-- (Europe/Istanbul, src/data/appointmentAvailability.ts), stored as plain
-- date + time — exactly how the app treats them — never converted to UTC.
--
-- service_title and price_* are snapshots taken at booking time, so later
-- service renames or pricing changes never alter an existing appointment.
-- There is deliberately no FK to services for the same reason.
--
-- buffer_minutes is the travel gap in force when the appointment was made
-- (appointmentAvailability.bufferMinutes), stored per row so the overlap
-- constraint follows the app config instead of hard-coding it here.
-- ============================================================================

create table public.appointments (
  id                     uuid        primary key default gen_random_uuid(),
  -- Client-generated idempotency key: resubmitting the same request (retry,
  -- double click, lost response) returns the existing row instead of
  -- creating a second one.
  request_id             uuid        not null,
  status                 public.appointment_status not null default 'pending',

  service_slug           text        not null,
  service_title          text        not null,

  pet_name               text        not null,
  pet_type               text        not null,
  pet_breed_id           text        not null,
  pet_size               text,
  pet_notes              text        not null default '',

  service_area           text        not null,
  address_line           text        not null,
  address_details        text        not null default '',

  slot_date              date        not null,
  start_time             time        not null,
  end_time               time        not null,
  buffer_minutes         smallint    not null default 30,
  -- The time this appointment occupies, including its travel buffer.
  slot_range             tsrange     generated always as (
    tsrange(
      slot_date + start_time,
      slot_date + end_time + make_interval(mins => buffer_minutes::integer),
      '[)'
    )
  ) stored,

  customer_name          text        not null,
  customer_phone         text        not null,
  -- Rate-limit key for create_appointment(): the last 10 digits, i.e. the
  -- national number, so "0540 …", "+90 540 …" and "90540…" count as the
  -- same customer instead of being a trivial way around the limit.
  customer_phone_key     text        generated always as (right(regexp_replace(customer_phone, '\D', '', 'g'), 10)) stored,
  customer_email         text,
  customer_notes         text        not null default '',

  price_kind             text        not null,
  price_amount           numeric(10, 2),
  price_currency         text        not null,

  -- Incremented on every update (trigger below). Admin writes use it for
  -- optimistic concurrency: an update only applies if the version it read
  -- is still current.
  version                integer     not null default 1,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now(),

  constraint appointments_request_id_key unique (request_id),

  -- Same limits as src/lib/appointments/validation.ts — a second line of
  -- defense behind the Server Action's own validation.
  constraint appointments_service_check check (
    char_length(service_slug) between 1 and 100 and char_length(service_title) between 1 and 100
  ),
  constraint appointments_pet_check check (
    char_length(pet_name) between 1 and 100
    and pet_type in ('dog', 'cat')
    and char_length(pet_breed_id) between 1 and 100
    and (pet_size is null or pet_size in ('small', 'medium', 'large'))
    and char_length(pet_notes) <= 1000
  ),
  constraint appointments_address_check check (
    char_length(service_area) between 1 and 100
    and char_length(address_line) between 1 and 200
    and char_length(address_details) <= 200
  ),
  constraint appointments_slot_check check (
    end_time > start_time and buffer_minutes between 0 and 240
  ),
  constraint appointments_customer_check check (
    char_length(customer_name) between 1 and 100
    and regexp_replace(customer_phone, '\D', '', 'g') ~ '^[0-9]{10,15}$'
    and char_length(customer_phone) <= 40
    and (customer_email is null or (char_length(customer_email) <= 200 and customer_email ~ '^[^\s@]+@[^\s@]+\.[^\s@]+$'))
    and char_length(customer_notes) <= 1000
  ),
  constraint appointments_price_check check (
    price_currency = 'TRY'
    and (
      (price_kind = 'priced' and price_amount is not null and price_amount >= 0)
      or (price_kind = 'on-request' and price_amount is null)
    )
  ),

  -- The double-booking guard. Two appointments that both still hold their
  -- slot (pending/confirmed) may never have overlapping ranges, buffer
  -- included. Enforced atomically by Postgres, so concurrent requests for
  -- the same time cannot both succeed; completed/cancelled appointments
  -- free their slot.
  constraint appointments_no_overlapping_slots
    exclude using gist (slot_range with &&)
    where (status in ('pending', 'confirmed'))
);

comment on table public.appointments is
  'Appointment requests. Public inserts only via the create_appointment() function (service_role, called by the booking Server Action); admin read/update via RLS on public.is_admin(). Overlapping pending/confirmed slots are rejected by an exclusion constraint.';

create index appointments_slot_date_idx on public.appointments (slot_date, start_time);
create index appointments_phone_recent_idx on public.appointments (customer_phone_key, created_at);

create trigger set_updated_at
  before update on public.appointments
  for each row
  execute function public.set_updated_at();

-- ============================================================================
-- Trigger: status transitions + version
--
-- The allowed transitions mirror appointmentStatusTransitions in
-- src/lib/appointments/types.ts. The app checks them first; this makes
-- them impossible to bypass for any role.
-- ============================================================================

create or replace function public.appointments_before_update()
returns trigger
language plpgsql
set search_path = ''
as $fn$
begin
  if new.status is distinct from old.status and not (
       (old.status = 'pending'   and new.status in ('confirmed', 'cancelled'))
    or (old.status = 'confirmed' and new.status in ('pending', 'completed', 'cancelled'))
    or (old.status = 'completed' and new.status = 'confirmed')
    or (old.status = 'cancelled' and new.status = 'pending')
  ) then
    raise exception 'invalid_status_transition'
      using errcode = 'P0001', detail = format('%s -> %s', old.status, new.status);
  end if;

  if new.id <> old.id or new.request_id <> old.request_id or new.created_at <> old.created_at then
    raise exception 'immutable_column' using errcode = 'P0001';
  end if;

  new.version := old.version + 1;
  return new;
end;
$fn$;

create trigger appointments_before_update
  before update on public.appointments
  for each row
  execute function public.appointments_before_update();

-- ============================================================================
-- Row Level Security + grants
-- Default privilege grants are disabled on this project (see the initial
-- schema migration), so every privilege is stated explicitly.
-- ============================================================================

alter table public.appointments enable row level security;

create policy "appointments_admin_select" on public.appointments
  for select
  to authenticated
  using (public.is_admin());

create policy "appointments_admin_update" on public.appointments
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- No INSERT or DELETE policy for anyone: appointments are created only via
-- create_appointment() (service_role, which bypasses RLS) and never deleted
-- through the API — cancelling is a status change.

revoke all privileges on public.appointments from anon, authenticated;

grant select on public.appointments to authenticated;

-- Admins may change status and the editable booking details only — never
-- id, request_id, service, timestamps, version or generated columns.
grant update (
  status,
  pet_name, pet_type, pet_breed_id, pet_size, pet_notes,
  service_area, address_line, address_details,
  slot_date, start_time, end_time,
  customer_name, customer_phone, customer_email, customer_notes,
  price_kind, price_amount, price_currency
) on public.appointments to authenticated;

grant all privileges on public.appointments to service_role;

-- ============================================================================
-- Function: public.get_booked_slots(p_from, p_to)
--
-- The ONLY appointment data anon can see: which times are taken (by
-- pending/confirmed appointments) in a date range. SECURITY DEFINER so it
-- can read the table without anon holding any privilege on it; it returns
-- three columns and never any customer, pet or address data.
-- ============================================================================

create or replace function public.get_booked_slots(p_from date default null, p_to date default null)
returns table (slot_date date, start_time text, end_time text)
language sql
stable
security definer
set search_path = ''
as $fn$
  select a.slot_date, to_char(a.start_time, 'HH24:MI'), to_char(a.end_time, 'HH24:MI')
  from public.appointments a
  where a.status in ('pending', 'confirmed')
    and (p_from is null or a.slot_date >= p_from)
    and (p_to is null or a.slot_date <= p_to)
  order by a.slot_date, a.start_time;
$fn$;

comment on function public.get_booked_slots(date, date) is
  'Taken time slots (pending/confirmed appointments) between p_from and p_to, inclusive. Exposes date/start/end only — no personal data. SECURITY DEFINER; callable by anon.';

revoke all on function public.get_booked_slots(date, date) from public;
grant execute on function public.get_booked_slots(date, date) to anon, authenticated, service_role;

-- ============================================================================
-- Function: public.create_appointment(p_request_id, p_appointment)
--
-- Called only by the booking Server Action with the server-only secret key,
-- AFTER it has re-validated the request against the app's rules (service,
-- pet, pricing, service area, business hours, lead time, availability).
-- This function adds the guarantees only the database can give:
--   1. Idempotency: an existing row with the same request_id is returned
--      as-is, so retries and double submits never create duplicates.
--   2. Rate limiting: at most 3 appointments per phone number (national
--      number, however it's formatted) per rolling hour, serialized per
--      number with an advisory lock so concurrent requests can't slip past
--      the count together.
--   3. Double booking: the exclusion constraint rejects overlapping slots
--      (SQLSTATE 23P01), whatever the app believed a moment earlier.
-- Status is always forced to 'pending'.
-- ============================================================================

create or replace function public.create_appointment(p_request_id uuid, p_appointment jsonb)
returns public.appointments
language plpgsql
security invoker
set search_path = ''
as $fn$
declare
  v_row public.appointments;
  v_phone_key text := right(regexp_replace(coalesce(p_appointment ->> 'customer_phone', ''), '\D', '', 'g'), 10);
  v_recent integer;
begin
  select * into v_row from public.appointments where request_id = p_request_id;
  if found then
    return v_row;
  end if;

  perform pg_advisory_xact_lock(hashtextextended('kulapaws:appointments:phone:' || v_phone_key, 0));

  -- Re-check after taking the lock: a concurrent duplicate of this very
  -- request may have committed while we waited.
  select * into v_row from public.appointments where request_id = p_request_id;
  if found then
    return v_row;
  end if;

  select count(*) into v_recent
  from public.appointments
  where customer_phone_key = v_phone_key
    and created_at > now() - interval '1 hour';
  if v_recent >= 3 then
    raise exception 'rate_limited' using errcode = 'P0001';
  end if;

  insert into public.appointments (
    request_id, status, service_slug, service_title,
    pet_name, pet_type, pet_breed_id, pet_size, pet_notes,
    service_area, address_line, address_details,
    slot_date, start_time, end_time, buffer_minutes,
    customer_name, customer_phone, customer_email, customer_notes,
    price_kind, price_amount, price_currency
  )
  select
    p_request_id, 'pending', r.service_slug, r.service_title,
    r.pet_name, r.pet_type, r.pet_breed_id, r.pet_size, coalesce(r.pet_notes, ''),
    r.service_area, r.address_line, coalesce(r.address_details, ''),
    r.slot_date, r.start_time, r.end_time, coalesce(r.buffer_minutes, 30),
    r.customer_name, r.customer_phone, r.customer_email, coalesce(r.customer_notes, ''),
    r.price_kind, r.price_amount, r.price_currency
  from jsonb_populate_record(null::public.appointments, p_appointment) r
  returning * into v_row;

  return v_row;
end;
$fn$;

comment on function public.create_appointment(uuid, jsonb) is
  'Creates a pending appointment (idempotent on request_id, rate limited per phone). Executable by service_role only — called by the booking Server Action after server-side validation.';

revoke all on function public.create_appointment(uuid, jsonb) from public, anon, authenticated;
grant execute on function public.create_appointment(uuid, jsonb) to service_role;

-- ============================================================================
-- Realtime
-- Lets the admin appointment list refresh live when appointments change on
-- another device. Supabase Realtime applies the RLS SELECT policy above to
-- each subscriber, so only admins receive row data. Guarded so re-running
-- (or applying where Realtime isn't set up) doesn't fail.
-- ============================================================================

do $do$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime')
     and not exists (
       select 1 from pg_publication_tables
       where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'appointments'
     )
  then
    alter publication supabase_realtime add table public.appointments;
  end if;
end;
$do$;

commit;
