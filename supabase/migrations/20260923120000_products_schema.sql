-- Products schema for Kulapaws.
--
-- Adds public.products (the Supabase-backed counterpart to
-- src/data/products.ts's Product type) so admins can manage a real product
-- catalog from /admin/products, and the public /products, /products/[slug]
-- pages can read real, published products instead of the empty static
-- default. Mirrors public.services (20260906134100_initial_content_schema.sql)
-- field-for-field where the two models overlap (slug, image_id,
-- display_order, is_published, timestamps), plus the extra fields the
-- Product model needs: brand, category, short_description/description,
-- price.
--
-- Reuses public.set_updated_at() and public.is_admin(), both already
-- created by prior migrations (20260906134100_initial_content_schema.sql,
-- 20260906143000_admin_authorization.sql) — not redefined here.
--
-- Unlike 20260906150000_services_admin_select.sql and
-- 20260906160000_faqs_admin_select.sql (deferred admin-SELECT policies,
-- because ServiceForm/FaqForm have no publish/hide control so the gap was
-- harmless), the admin-SELECT policy below ships in the SAME migration as
-- everything else: ProductForm has an is_published toggle from day one, so
-- an admin must be able to see and edit hidden products immediately, not
-- after a follow-up migration.
--
-- No seed data: no real product has been confirmed yet (README.md §6 "Do
-- not create fake products", §21 "Never ... create fake product data /
-- create fake prices", §23). The table starts empty, exactly like
-- src/data/products.ts.
--
-- Wrapped in a single transaction, consistent with every prior migration.

begin;

-- ============================================================================
-- Table: products
-- ============================================================================

create table public.products (
  id                 uuid        primary key default gen_random_uuid(),
  slug               text        not null unique,
  name               text        not null,
  brand              text        not null,
  category           text        not null,
  short_description  text        not null,
  description        text        not null,
  image_id           uuid        references public.images(id) on delete set null,
  price              text,
  display_order      integer     not null default 0,
  is_published       boolean     not null default true,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

comment on table public.products is
  'Pet-care products shown on the public /products catalog. price is a free-form display string (e.g. "₺350"), matching Product.price — no currency/number column, since it is optional and purely display text, same convention as everywhere else prices appear in this app.';

create trigger set_updated_at
  before update on public.products
  for each row
  execute function public.set_updated_at();

-- ============================================================================
-- Row Level Security
-- ============================================================================

alter table public.products enable row level security;

-- Public: published products only. Mirrors services_public_select /
-- faqs_public_select exactly — this is what makes a hidden product's slug
-- return no row (and therefore 404) for anon/non-admin readers, at the
-- database layer, regardless of what any app-layer query does or forgets.
create policy "products_public_select" on public.products
  for select
  to anon, authenticated
  using (is_published = true);

-- Admin: every product, published or not. Shipped now (not deferred) — see
-- the note at the top of this file.
create policy "products_admin_select" on public.products
  for select
  to authenticated
  using (public.is_admin());

create policy "products_admin_insert" on public.products
  for insert
  to authenticated
  with check (public.is_admin());

create policy "products_admin_update" on public.products
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "products_admin_delete" on public.products
  for delete
  to authenticated
  using (public.is_admin());

-- ============================================================================
-- Grants
-- This project does not rely on default API grants — every table states
-- its intended privileges explicitly, same posture as every prior
-- migration. Revoke first (defensive; the table is new and should have no
-- privileges yet regardless), then grant only what RLS is designed to
-- allow.
-- ============================================================================

revoke all privileges on public.products from anon, authenticated;

grant select on public.products to anon, authenticated;
grant insert, update, delete on public.products to authenticated;

commit;
