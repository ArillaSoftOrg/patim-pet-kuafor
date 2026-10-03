-- Admin authorization for Kulapaws.
--
-- Adds a locked-down admin allow-list (public.admin_users), a reusable
-- public.is_admin() check, and admin-gated write access (INSERT/UPDATE/
-- DELETE) on top of the public-read tables created in
-- 20260906134100_initial_content_schema.sql. Existing public SELECT access
-- is untouched.
--
-- No application login is implemented by this migration — it only prepares
-- the database side of admin authorization for a later Supabase Auth
-- integration. No email or user UUID is hard-coded here; authorizing the
-- first real admin is a manual, one-time step run separately (see the
-- accompanying report), never checked into version control.
--
-- Wrapped in a single transaction, consistent with the initial schema
-- migration, so a failure partway through cannot leave a half-applied state.

begin;

-- ============================================================================
-- Table: admin_users
--
-- A minimal allow-list: a user_id present here is an admin, full stop. RLS
-- is enabled but intentionally has NO policies at all, and no grants are
-- given to anon or authenticated — the table is fully invisible and
-- unwritable through the API in every direction:
--   - no SELECT policy => the allow-list is never exposed publicly, and not
--     even to ordinary authenticated users (no way to enumerate admins or
--     check membership except through is_admin(), which only returns a
--     boolean for the caller's own auth.uid()).
--   - no INSERT policy => no self-registration path exists; a user can
--     never add themselves.
-- The table's owner (the role migrations run as) still bypasses RLS by
-- default, which is what makes the manual one-time authorization INSERT
-- (run directly in the SQL Editor, not through this migration) possible.
-- ============================================================================

create table public.admin_users (
  user_id    uuid        primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

comment on table public.admin_users is
  'Admin allow-list. Presence of a row means that auth.users.id is an admin. No RLS policies exist on this table by design — it is reachable only via public.is_admin(), never directly through the API.';

alter table public.admin_users enable row level security;

-- Defensive, matching the explicit-grants posture established in the
-- initial schema migration: this project does not rely on default API
-- grants, so state the intended (zero) privileges outright rather than by
-- omission.
revoke all privileges on public.admin_users from anon, authenticated;

-- ============================================================================
-- Function: public.is_admin()
--
-- SECURITY DEFINER so the internal lookup against admin_users runs as the
-- function's owner (bypassing admin_users' own RLS/grants) rather than as
-- whatever role is calling it — this is what lets an authenticated caller
-- get a true/false answer without ever being granted direct access to the
-- allow-list table, and avoids any RLS-recursion hazard from a caller-
-- context lookup against a table that itself has no read policy.
--
-- search_path is pinned explicitly (rather than inherited from the caller)
-- so a malicious search_path can't redirect an unqualified identifier to an
-- attacker-controlled object — standard hardening for SECURITY DEFINER
-- functions. Every identifier below is schema-qualified regardless, as a
-- second layer of the same defense.
-- ============================================================================

create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public, pg_temp
as $fn$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  );
$fn$;

comment on function public.is_admin() is
  'True if the current auth.uid() is present in public.admin_users. SECURITY DEFINER: evaluates admin_users membership regardless of the caller''s own (nonexistent) grants on that table.';

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- ============================================================================
-- Write access: business, services, faqs, page_content, images
--
-- Existing public SELECT policies/grants from the initial schema migration
-- are untouched. Each table below gets:
--   - INSERT/UPDATE/DELETE table privileges granted to authenticated only
--     (anon receives nothing here, and keeps its pre-existing SELECT-only
--     access).
--   - INSERT/UPDATE/DELETE RLS policies gated on public.is_admin(), so an
--     authenticated-but-not-admin user has the table privilege but every
--     write is still rejected by RLS.
-- INSERT policies only need WITH CHECK (there is no existing row to
-- evaluate); DELETE policies only need USING (there is no new row);
-- UPDATE policies need both, so a non-admin can neither select rows to
-- modify nor produce a row that would pass the check on write.
-- ============================================================================

-- business ---------------------------------------------------------------

grant insert, update, delete on public.business to authenticated;

create policy "business_admin_insert" on public.business
  for insert
  to authenticated
  with check (public.is_admin());

create policy "business_admin_update" on public.business
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "business_admin_delete" on public.business
  for delete
  to authenticated
  using (public.is_admin());

-- services -----------------------------------------------------------------

grant insert, update, delete on public.services to authenticated;

create policy "services_admin_insert" on public.services
  for insert
  to authenticated
  with check (public.is_admin());

create policy "services_admin_update" on public.services
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "services_admin_delete" on public.services
  for delete
  to authenticated
  using (public.is_admin());

-- faqs -----------------------------------------------------------------------

grant insert, update, delete on public.faqs to authenticated;

create policy "faqs_admin_insert" on public.faqs
  for insert
  to authenticated
  with check (public.is_admin());

create policy "faqs_admin_update" on public.faqs
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "faqs_admin_delete" on public.faqs
  for delete
  to authenticated
  using (public.is_admin());

-- page_content ---------------------------------------------------------------

grant insert, update, delete on public.page_content to authenticated;

create policy "page_content_admin_insert" on public.page_content
  for insert
  to authenticated
  with check (public.is_admin());

create policy "page_content_admin_update" on public.page_content
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "page_content_admin_delete" on public.page_content
  for delete
  to authenticated
  using (public.is_admin());

-- images -----------------------------------------------------------------------

grant insert, update, delete on public.images to authenticated;

create policy "images_admin_insert" on public.images
  for insert
  to authenticated
  with check (public.is_admin());

create policy "images_admin_update" on public.images
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "images_admin_delete" on public.images
  for delete
  to authenticated
  using (public.is_admin());

commit;
