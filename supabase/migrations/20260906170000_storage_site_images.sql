-- Supabase Storage bucket + access policies for admin-managed site images.
--
-- Scope: Storage only. public.images (the metadata table) already has
-- everything it needs from prior migrations:
--   - images_public_select: SELECT, USING (true), to anon + authenticated
--   - images_admin_insert/update/delete: gated on public.is_admin(),
--     to authenticated
-- (20260906134100_initial_content_schema.sql,
--  20260906143000_admin_authorization.sql). Nothing about public.images is
-- touched here.
--
-- The bucket is public-read (public = true) because these are public
-- website assets (logo, service photos, page imagery) — every image ever
-- referenced by an `images` row is meant to be visible on the public site.
-- That public flag is what serves objects to visitors, through Supabase's
-- public URL/CDN path, without ever evaluating storage.objects RLS — so
-- anon does not need, and does not get, a SELECT policy here at all.
--
-- Writes (and the admin SELECT policy below, which Storage's update/remove
-- operations require in order to first locate the object) are restricted
-- to authenticated admins via public.is_admin(), mirroring the exact same
-- authorization model already used for every content table.
--
-- storage.objects already has RLS enabled by Supabase platform default on
-- every project — this migration does not (and should not) alter that.
--
-- NOT executed as part of this planning task. Review and apply separately,
-- before any application code starts writing to this bucket.

begin;

-- ============================================================================
-- Bucket: site-images
-- MIME type and size restrictions are enforced by Storage itself at the
-- bucket level (server-side, on every upload attempt) — not just the
-- client-side check ImageSlotEditor already does today. This is a real
-- hardening improvement: today a crafted request bypassing the client
-- entirely would not be blocked; once this bucket config exists, Storage
-- rejects it before the object is ever written.
-- ============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-images',
  'site-images',
  true,
  8388608, -- 8 MB, matching ImageSlotEditor's existing client-side limit
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;

-- ============================================================================
-- storage.objects policies, scoped to this bucket only
-- ============================================================================

-- No anon/public SELECT policy: public website delivery goes through
-- Storage's public URL path (governed by the bucket's public = true flag,
-- not RLS), so anon has no policy of any kind on storage.objects — not
-- SELECT, not INSERT/UPDATE/DELETE.

-- Admin SELECT. Required because Storage's update and remove operations
-- need to locate the existing object first, which goes through this same
-- SELECT policy — without it, an admin's own replace/delete calls would
-- fail even though the corresponding UPDATE/DELETE policy below allows the
-- write itself.
create policy "site_images_admin_select" on storage.objects
  for select
  to authenticated
  using (bucket_id = 'site-images' and public.is_admin());

-- Admin-only writes. anon has no policy at all here — no grant, no
-- USING/WITH CHECK that could ever match it — so it cannot upload, replace,
-- or delete objects in this bucket under any condition.
create policy "site_images_admin_insert" on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'site-images' and public.is_admin());

create policy "site_images_admin_update" on storage.objects
  for update
  to authenticated
  using (bucket_id = 'site-images' and public.is_admin())
  with check (bucket_id = 'site-images' and public.is_admin());

create policy "site_images_admin_delete" on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'site-images' and public.is_admin());

commit;
