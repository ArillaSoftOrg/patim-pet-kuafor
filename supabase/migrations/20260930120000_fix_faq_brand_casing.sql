-- Fixes brand-name casing in the two live public.faqs rows that spell it
-- "Kulapaws" instead of "KulaPAWS" (both in the question AND the answer on
-- each row) — found while doing an i18n pass over the public site, which
-- the task called for keeping consistently "KulaPAWS" everywhere.
-- Everything else about the text is unchanged; no rows added or removed,
-- no other columns touched.
--
-- NOT executed as part of this task — this repo's anon key cannot write to
-- public.faqs (UPDATE is admin-gated), and no live data should be changed
-- without review. Apply via the Supabase SQL Editor once reviewed, OR make
-- the same two edits by hand through /admin/content's FAQ manager.

begin;

update public.faqs set
  question = 'What animals does KulaPAWS serve?',
  answer = 'KulaPAWS provides grooming, washing, and pet care for dogs and cats only.'
  where id = '5ae65ca2-6de9-4c79-bab8-f9e26a582f32'
    and question = 'What animals does Kulapaws serve?';

update public.faqs set
  question = 'Is KulaPAWS a mobile grooming service?',
  answer = 'Yes. KulaPAWS is a mobile grooming service with no storefront for customers to visit. We bring grooming, washing, and pet care directly to you.'
  where id = 'ffb64610-ce74-4b84-ad93-e96ad940746c'
    and question = 'Is Kulapaws a mobile grooming service?';

commit;
