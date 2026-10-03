-- Adds authenticated-admin SELECT access to ALL services rows (published or
-- not), without touching the existing public SELECT policy.
--
-- Gap found while implementing the Services Supabase migration: the only
-- SELECT policy on public.services is services_public_select
-- (20260906134100_initial_content_schema.sql), scoped to
-- `USING (is_published = true)` and granted to BOTH anon and authenticated.
-- 20260906143000_admin_authorization.sql added INSERT/UPDATE/DELETE
-- policies gated on public.is_admin() for services, but no admin-scoped
-- SELECT policy — so an authenticated admin's reads are currently subject
-- to the exact same is_published = true restriction as an anonymous public
-- visitor.
--
-- This isn't reachable through the current admin UI (ServiceForm has no
-- is_published control, so every service it creates is published by the
-- column's own default), so nothing is broken today. But
-- servicesRepository.list() deliberately does not filter on is_published
-- itself — it relies entirely on RLS — specifically so that the moment
-- this policy is applied, admins see every row through that same
-- unmodified query, with no further app change required. Until this
-- migration is applied, a service that somehow became unpublished (a
-- future visibility toggle, or a manual DB edit) would silently disappear
-- from the admin list with no error and no indication anything is missing.
--
-- Additive only: a second, independent SELECT policy for `authenticated`.
-- Postgres OR's multiple applicable SELECT policies together, so this
-- strictly widens what an admin can see and does not narrow or replace
-- services_public_select — anon and non-admin authenticated reads are
-- unaffected.
--
-- NOT executed as part of the Services repository migration task. Review
-- and apply separately.

begin;

create policy "services_admin_select" on public.services
  for select
  to authenticated
  using (public.is_admin());

commit;
