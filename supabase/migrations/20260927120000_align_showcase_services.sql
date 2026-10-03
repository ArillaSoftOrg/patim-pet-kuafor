-- Aligns the live public.services table with the homepage's 5-item
-- ServiceShowcase (src/data/homepage.ts servicesSection.showcase / the
-- 01-05 stacking cards on the homepage).
--
-- Context: the homepage showcase presents 5 services (Wash & Basic Care,
-- Wash + Trim Care, Dog Grooming, Cat Grooming, Mobile Pet Grooming), but
-- the live services table only has 3 rows (dog-grooming, cat-grooming,
-- mobile-pet-grooming — the original shipped defaults; confirmed via the
-- table's public read API, unchanged since the initial seed in
-- 20260906134100_initial_content_schema.sql). Two showcase items had no
-- matching service, so their homepage cards could not link anywhere. This
-- migration adds the missing two rows, in the same shape/style as the
-- initial seed, and renumbers display_order so /services lists all 5 in
-- the same order the homepage showcase presents them.
--
-- Non-destructive: only inserts 2 new rows (skipped if they already exist)
-- and reorders (never deletes/overwrites content of) the existing 3.
--
-- NOT executed as part of this task — this repo's anon key cannot write to
-- public.services (INSERT/UPDATE are admin-gated via public.is_admin(), see
-- 20260906143000_admin_authorization.sql), and no live data should be
-- changed without review. Apply via the Supabase SQL Editor (or run
-- individual statements) once reviewed, OR skip this file entirely and use
-- the existing /admin/services "Add Service" form instead — see the
-- accompanying task report for both options and their tradeoffs.

begin;

-- New: wash-basic-care, wash-trim-care (src/data/services.ts) ---------------

insert into public.services (slug, title, short_description, overview, who_its_for, process, image_id, display_order)
values
(
  'wash-basic-care',
  'Wash & Basic Care',
  'A gentle bath and the essential basics — nail care, ear cleaning, and brushing, brought to your door.',
  $txt$Wash & Basic Care covers what your pet needs on a regular basis: a gentle shampoo bath, thorough brushing, nail trimming, and basic ear hygiene — all done calmly at home through our mobile service.$txt$,
  ARRAY[
    'Pets due for a routine wash and basic upkeep',
    'Owners who want the essentials handled without a full trim',
    'Regular nail, ear, and coat maintenance between full grooms'
  ],
  $json$[
    {"title": "Reach out", "description": "Tell us about your pet and what basic care they need."},
    {"title": "We come to you", "description": "Our mobile grooming setup arrives at your home."},
    {"title": "Wash & basic care", "description": "A gentle bath, brushing, nail trim, and ear cleaning, start to finish."}
  ]$json$::jsonb,
  null,
  0
),
(
  'wash-trim-care',
  'Wash + Trim Care',
  'A full wash plus a coat-appropriate trim, brushing, and finishing touches.',
  $txt$Wash + Trim Care builds on the basics with a coat-appropriate trim or clip: a full shampoo wash, brushing, careful trimming, and finishing touches, delivered through our mobile service at home.$txt$,
  ARRAY[
    'Pets ready for a full wash and a fresh trim',
    'Coats that need regular clipping to stay comfortable',
    'Owners who want a complete groom without leaving home'
  ],
  $json$[
    {"title": "Reach out", "description": "Tell us about your pet's coat and the trim you're looking for."},
    {"title": "We come to you", "description": "Our mobile grooming setup arrives at your home."},
    {"title": "Wash & trim", "description": "A full wash, brushing, coat-appropriate trim, and finishing touches."}
  ]$json$::jsonb,
  null,
  1
)
on conflict (slug) do nothing;

-- Renumber the 3 original defaults to sit after the two new rows, so
-- display_order matches the homepage showcase's 01-05 sequence.

update public.services set display_order = 2 where slug = 'dog-grooming';
update public.services set display_order = 3 where slug = 'cat-grooming';
update public.services set display_order = 4 where slug = 'mobile-pet-grooming';

commit;
