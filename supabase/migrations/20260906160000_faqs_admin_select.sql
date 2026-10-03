-- Adds authenticated-admin SELECT access to ALL faqs rows (published or
-- not), without touching the existing public SELECT policy.
--
-- Same gap found and handled the same way for services
-- (20260906150000_services_admin_select.sql): the only SELECT policy on
-- public.faqs is faqs_public_select (20260906134100_initial_content_schema.sql),
-- scoped to `USING (is_published = true)` and granted to BOTH anon and
-- authenticated. 20260906143000_admin_authorization.sql added INSERT/
-- UPDATE/DELETE policies gated on public.is_admin() for faqs, but no
-- admin-scoped SELECT policy — so an authenticated admin's reads are
-- currently subject to the exact same is_published = true restriction as
-- an anonymous public visitor.
--
-- This isn't reachable through the current admin UI (FaqForm has no
-- is_published control, so every FAQ it creates is published by the
-- column's own default), so nothing is broken today. But
-- faqsRepository.list() deliberately does not filter on is_published
-- itself — it relies entirely on RLS — specifically so that the moment
-- this policy is applied, admins see every row through that same
-- unmodified query, with no further app change required. Until this
-- migration is applied, an FAQ that somehow became unpublished (a future
-- visibility toggle, or a manual DB edit) would silently disappear from
-- the admin list with no error and no indication anything is missing.
--
-- Additive only: a second, independent SELECT policy for `authenticated`.
-- Postgres OR's multiple applicable SELECT policies together, so this
-- strictly widens what an admin can see and does not narrow or replace
-- faqs_public_select — anon and non-admin authenticated reads are
-- unaffected.
--
-- NOT executed as part of the FAQ repository migration task. Review and
-- apply separately (ideally alongside 20260906150000_services_admin_select.sql,
-- which has the identical shape and status).

begin;

create policy "faqs_admin_select" on public.faqs
  for select
  to authenticated
  using (public.is_admin());

commit;
