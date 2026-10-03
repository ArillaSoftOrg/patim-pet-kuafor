-- Initial Supabase content schema for Kulapaws.
--
-- Replaces the local-only content repositories (src/lib/content/*Repository.ts)
-- with equivalent Supabase tables. This migration only creates schema +
-- seeds shipped defaults; no admin write policies and no Supabase Auth exist
-- yet, so every table is public-read-only (services/faqs further restricted
-- to published rows) and closed to all writes until a follow-up
-- authorization task adds admin policies.
--
-- No Products or Appointments schema. No Storage bucket created here.
--
-- Wrapped in a single transaction: all DDL/DML below either applies in full
-- or not at all, so a failure partway through (e.g. in the SQL Editor, which
-- does not implicitly wrap pasted scripts in a transaction) can never leave
-- a half-created schema behind.

begin;

-- ============================================================================
-- Reusable updated_at trigger function
--
-- gen_random_uuid(), used below for uuid primary key defaults, is built into
-- core Postgres since v13 and needs no extension on current Supabase
-- Postgres versions, so none is created here.
-- ============================================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $fn$
begin
  new.updated_at = now();
  return new;
end;
$fn$;

comment on function public.set_updated_at() is
  'Sets updated_at = now() on every UPDATE. Attached as a BEFORE UPDATE trigger on all tables that carry an updated_at column.';

-- ============================================================================
-- Enum types
-- ============================================================================

-- Mirrors src/data/faqs.ts FaqCategory. A fixed enum matches the current
-- closed category set; revisit as a lookup table only if admins need to add
-- categories without a migration.
create type public.faq_category as enum (
  'General',
  'Dog Grooming',
  'Cat Grooming',
  'Mobile Service',
  'Appointments',
  'Products'
);

-- ============================================================================
-- Table: images
-- Metadata only — actual bytes live in Supabase Storage (bucket created in a
-- later step, not this migration). No uploaded_by yet: Supabase Auth does
-- not exist.
-- ============================================================================

create table public.images (
  id             uuid        primary key default gen_random_uuid(),
  storage_bucket text        not null,
  storage_path   text        not null unique,
  mime_type      text        not null,
  width          integer,
  height         integer,
  alt_text       text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

comment on table public.images is
  'Metadata for uploaded images. storage_bucket/storage_path point into Supabase Storage; no image bytes are stored here.';

create trigger set_updated_at
  before update on public.images
  for each row
  execute function public.set_updated_at();

-- ============================================================================
-- Table: business (singleton)
-- Mirrors src/data/business.ts Business / src/lib/content/businessRepository.ts.
-- Singleton enforced by the fixed id = 1 primary key + check constraint.
-- ============================================================================

create table public.business (
  id              smallint    primary key default 1,
  name            text        not null,
  tagline         text,
  phone           text,
  email           text,
  whatsapp        text,
  address         text,
  service_areas   text[]      not null default '{}',
  business_hours  text,
  social_links    jsonb       not null default '[]'::jsonb,
  logo_image_id   uuid        references public.images(id) on delete set null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  constraint business_is_singleton check (id = 1)
);

comment on table public.business is
  'Singleton business info row (id is always 1). logo_image_id null means "use the packaged default logo asset", matching the app-layer fallback in businessRepository.get().';

create trigger set_updated_at
  before update on public.business
  for each row
  execute function public.set_updated_at();

-- ============================================================================
-- Table: services
-- Mirrors src/data/services.ts Service / src/lib/content/servicesRepository.ts.
-- ============================================================================

create table public.services (
  id                 uuid        primary key default gen_random_uuid(),
  slug               text        not null unique,
  title              text        not null,
  short_description  text        not null,
  overview           text        not null,
  who_its_for        text[]      not null default '{}',
  process            jsonb       not null default '[]'::jsonb,
  image_id           uuid        references public.images(id) on delete set null,
  display_order      integer     not null default 0,
  is_published       boolean     not null default true,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

comment on table public.services is
  'Grooming services shown on the public site. process is an ordered JSONB array of {title, description} steps, mirroring ServiceProcessStep[].';

create trigger set_updated_at
  before update on public.services
  for each row
  execute function public.set_updated_at();

-- ============================================================================
-- Table: faqs
-- Mirrors src/data/faqs.ts Faq / src/lib/content/faqsRepository.ts.
-- ============================================================================

create table public.faqs (
  id             uuid            primary key default gen_random_uuid(),
  category       public.faq_category not null,
  question       text            not null,
  answer         text            not null,
  display_order  integer         not null default 0,
  is_published   boolean         not null default true,
  created_at     timestamptz     not null default now(),
  updated_at     timestamptz     not null default now()
);

comment on table public.faqs is
  'FAQ entries grouped by category on the public FAQ page.';

create trigger set_updated_at
  before update on public.faqs
  for each row
  execute function public.set_updated_at();

-- ============================================================================
-- Table: page_content
-- Generalizes homepageRepository / aboutRepository / servicesPageRepository /
-- contactPageRepository into one typed-JSONB, content-key table. Each key is
-- its own singleton by virtue of being the primary key.
-- ============================================================================

create table public.page_content (
  key         text        primary key,
  content     jsonb       not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint page_content_key_allowed check (
    key in ('homepage', 'about', 'servicesPage', 'contactPage')
  )
);

comment on table public.page_content is
  'One row per static page''s editable copy. content is the full HomepageContent/AboutContent/ServicesPageContent/ContactPageContent JSON shape, verbatim. Any image references nested inside content (e.g. hero.image) are plain images.id strings with no enforced FK, since Postgres cannot constrain values inside JSONB.';

create trigger set_updated_at
  before update on public.page_content
  for each row
  execute function public.set_updated_at();

-- ============================================================================
-- Row Level Security
-- Enabled on every table. No write policies yet — INSERT/UPDATE/DELETE are
-- refused for every role (including authenticated) until a follow-up task
-- adds real admin authorization.
-- ============================================================================

alter table public.images       enable row level security;
alter table public.business     enable row level security;
alter table public.services     enable row level security;
alter table public.faqs         enable row level security;
alter table public.page_content enable row level security;

create policy "images_public_select" on public.images
  for select
  to anon, authenticated
  using (true);

create policy "business_public_select" on public.business
  for select
  to anon, authenticated
  using (true);

create policy "services_public_select" on public.services
  for select
  to anon, authenticated
  using (is_published = true);

create policy "faqs_public_select" on public.faqs
  for select
  to anon, authenticated
  using (is_published = true);

create policy "page_content_public_select" on public.page_content
  for select
  to anon, authenticated
  using (true);

-- ============================================================================
-- Grants
-- Automatic API table exposure / default privilege grants are disabled on
-- this project, so grants must be set explicitly per table. Revoke first
-- (defensive — these tables are new and should have no privileges yet
-- regardless), then grant only what RLS is designed to allow: SELECT.
-- No INSERT/UPDATE/DELETE grants to anon or authenticated at this stage.
-- ============================================================================

revoke all privileges on public.images       from anon, authenticated;
revoke all privileges on public.business     from anon, authenticated;
revoke all privileges on public.services     from anon, authenticated;
revoke all privileges on public.faqs         from anon, authenticated;
revoke all privileges on public.page_content from anon, authenticated;

grant select on public.images       to anon, authenticated;
grant select on public.business     to anon, authenticated;
grant select on public.services     to anon, authenticated;
grant select on public.faqs         to anon, authenticated;
grant select on public.page_content to anon, authenticated;

-- ============================================================================
-- Seed data
-- Generated from the real shipped defaults in src/data/*.ts — not invented.
-- faqs.ts ships an empty array, so no faqs rows are seeded here.
-- ============================================================================

-- business (src/data/business.ts)
insert into public.business (id, name, tagline, phone, email, whatsapp, address, service_areas, business_hours, social_links, logo_image_id)
values (
  1,
  'Kulapaws',
  null,
  null,
  null,
  null,
  null,
  '{}',
  null,
  '[]'::jsonb,
  null
);

-- services (src/data/services.ts)
insert into public.services (slug, title, short_description, overview, who_its_for, process, image_id, display_order)
values
(
  'dog-grooming',
  'Dog Grooming',
  'Grooming care for dogs of all sizes and coat types, brought to your door.',
  $txt$Kulapaws offers dog grooming designed around your dog's comfort, delivered through our mobile service so there's no crate, no waiting room, and no stressful car ride.$txt$,
  ARRAY[
    'Dogs who get anxious in traditional grooming salons',
    'Owners who want grooming done without leaving home',
    'Regular coat, skin, and nail maintenance'
  ],
  $json$[
    {"title": "Reach out", "description": "Tell us about your dog and what you're looking for."},
    {"title": "We come to you", "description": "Our mobile grooming setup arrives at your home."},
    {"title": "Your dog is groomed", "description": "A calm, one-on-one grooming session in a familiar setting."}
  ]$json$::jsonb,
  null,
  0
),
(
  'cat-grooming',
  'Cat Grooming',
  'Low-stress cat grooming at home, without the carrier or the car ride.',
  'Cats tend to do best in their own environment. Kulapaws brings cat grooming directly to your home, keeping the experience as calm and low-stress as possible.',
  ARRAY[
    'Cats who find travel and unfamiliar spaces stressful',
    'Owners who want grooming without a carrier trip',
    'Routine coat and hygiene maintenance'
  ],
  $json$[
    {"title": "Reach out", "description": "Share a few details about your cat and their needs."},
    {"title": "We come to you", "description": "Our team arrives ready to work in your space."},
    {"title": "Your cat is groomed", "description": "A gentle, unhurried session at home."}
  ]$json$::jsonb,
  null,
  1
),
(
  'mobile-pet-grooming',
  'Mobile Pet Grooming',
  'The convenience of professional grooming, delivered to your driveway.',
  'Mobile grooming is at the core of what Kulapaws does: professional pet grooming that comes to you, so your pet is cared for in a familiar, comfortable environment.',
  ARRAY[
    'Busy schedules that make salon visits difficult',
    'Pets that do better without travel or waiting areas',
    'Anyone who prefers one-on-one grooming attention'
  ],
  $json$[
    {"title": "Book a visit", "description": "Reach out to set up a time that works for you."},
    {"title": "We arrive", "description": "Our mobile grooming service comes directly to your home."},
    {"title": "Pampering happens", "description": "Your pet is groomed on-site, start to finish."}
  ]$json$::jsonb,
  null,
  2
);

-- page_content: homepage (src/data/homepage.ts)
insert into public.page_content (key, content)
values (
  'homepage',
  $json$
  {
    "hero": {
      "heading": "Mobile pet grooming that comes to you",
      "description": "Kulapaws brings professional dog and cat grooming, plus pet-care products, directly to your door — so your pet stays calm and comfortable at home.",
      "image": null,
      "primaryCtaLabel": "Request Appointment",
      "secondaryCtaLabel": "Explore Services"
    },
    "servicesSection": {
      "heading": "Our Services",
      "description": "Grooming care built around your pet, wherever home is."
    },
    "mobileHighlight": {
      "eyebrow": "Mobile Service",
      "heading": "Grooming, delivered to your door",
      "description": "No crate, no car ride, no waiting room. Our mobile grooming service means your pet is cared for in a familiar, low-stress setting — right at home.",
      "bullets": [
        "Grooming happens where your pet is most comfortable",
        "No transport or drop-off required",
        "One-on-one attention from start to finish"
      ],
      "image": null
    },
    "whyKulapaws": {
      "heading": "Why Kulapaws",
      "description": "A pet-care brand built to feel approachable, caring, and easy to trust.",
      "items": [
        {"title": "Caring by default", "description": "Every visit is centered on your pet's comfort, not just the groom."},
        {"title": "Genuinely convenient", "description": "Mobile service means grooming fits into your day, not the other way around."},
        {"title": "Clean & professional", "description": "A consistent, careful approach to every appointment."}
      ]
    },
    "productsPreview": {
      "heading": "Pet-Care Products",
      "description": "Alongside grooming, Kulapaws offers pet-care products for the home."
    },
    "howItWorks": {
      "heading": "How It Works",
      "description": "Getting your pet groomed at home is straightforward.",
      "steps": [
        {"title": "Reach out", "description": "Contact us to share what your pet needs."},
        {"title": "We come to you", "description": "Our mobile grooming service arrives at your home."},
        {"title": "Your pet is pampered", "description": "A calm, one-on-one grooming session on-site."}
      ]
    },
    "faqPreview": {
      "heading": "Frequently Asked Questions"
    },
    "finalCta": {
      "heading": "Ready to book your pet's next groom?",
      "description": "Reach out and we'll help you get started."
    }
  }
  $json$::jsonb
);

-- page_content: about (src/data/about.ts)
insert into public.page_content (key, content)
values (
  'about',
  $json$
  {
    "header": {
      "eyebrow": "About",
      "title": "A pet-care brand built around convenience and care",
      "description": "Kulapaws is a mobile pet grooming and pet-care brand, focused on making grooming easier for pets and their people."
    },
    "mobileStory": {
      "eyebrow": "Mobile Service",
      "heading": "Why we come to you",
      "description": "Traditional grooming means a car ride, a waiting room, and an unfamiliar space. Kulapaws was built around a simpler idea: bring the grooming to your pet's own environment instead.",
      "image": null
    },
    "values": {
      "heading": "What we care about",
      "items": [
        {"title": "Approachable", "description": "Friendly, straightforward service without the fuss."},
        {"title": "Caring", "description": "Every appointment is centered on your pet's comfort."},
        {"title": "Practical", "description": "Convenient, clean, and easy to fit into your routine."}
      ]
    },
    "cta": {
      "heading": "Want to learn more?",
      "description": "Reach out with any questions about Kulapaws."
    }
  }
  $json$::jsonb
);

-- page_content: servicesPage (src/data/servicesPage.ts)
insert into public.page_content (key, content)
values (
  'servicesPage',
  $json$
  {
    "header": {
      "eyebrow": "Services",
      "title": "Grooming services for dogs and cats",
      "description": "Every Kulapaws service is delivered through our mobile setup, brought directly to your home."
    },
    "cta": {
      "heading": "Not sure which service fits your pet?",
      "description": "Reach out and we'll help you figure out the right fit."
    }
  }
  $json$::jsonb
);

-- page_content: contactPage (src/data/contactPage.ts)
insert into public.page_content (key, content)
values (
  'contactPage',
  $json$
  {
    "title": "Contact us",
    "description": "Send us a message and we'll get back to you."
  }
  $json$::jsonb
);

commit;
