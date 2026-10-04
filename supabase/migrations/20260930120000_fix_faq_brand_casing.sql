-- Fixes brand-name casing in the two live public.faqs rows that spell it
-- inconsistently (both in the question AND the answer on each row) —
-- found while doing an i18n pass over the public site, which the task
-- called for keeping the brand name consistently cased everywhere.
-- Everything else about the text is unchanged; no rows added or removed,
-- no other columns touched.
--
-- Rebranded for Patim Pet: these two rows (matched by fixed id, inserted
-- directly through the admin panel rather than by any seed migration) do
-- not exist in a freshly-migrated database, so this UPDATE matches zero
-- rows here — left in place only for history/consistency, not because it
-- does anything on a new project.
--
-- NOT executed as part of this task — this repo's anon key cannot write to
-- public.faqs (UPDATE is admin-gated), and no live data should be changed
-- without review. Apply via the Supabase SQL Editor once reviewed, OR make
-- the same two edits by hand through /admin/content's FAQ manager.

begin;

update public.faqs set
  question = 'What animals does Patim Pet serve?',
  answer = 'Patim Pet provides grooming, washing, and pet care for dogs and cats only.'
  where id = '5ae65ca2-6de9-4c79-bab8-f9e26a582f32'
    and question = 'What animals does Patim Pet serve?';

update public.faqs set
  question = 'Is Patim Pet a mobile grooming service?',
  answer = 'Yes. Patim Pet is a mobile grooming service with no storefront for customers to visit. We bring grooming, washing, and pet care directly to you.'
  where id = 'ffb64610-ce74-4b84-ad93-e96ad940746c'
    and question = 'Is Patim Pet a mobile grooming service?';

commit;
