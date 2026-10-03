import type { Product } from "@/data/products";

// Turkish translations of real, published products — keyed by the same
// slug as the Supabase-backed English/default row (see
// productsRepository.ts / ProductGridLive.tsx), same convention as
// services.tr.ts. Intentionally empty: no real product has been confirmed
// yet (README.md §6/§21/§23 — do not invent product data here), and even
// once real products exist in Supabase, this file only ever grows by a
// deliberate translation pass, not automatically — an admin-created
// product has no Turkish entry until one is added here, and simply
// doesn't appear on the Turkish site until then, rather than showing
// untranslated English mixed in (same tradeoff as services.tr.ts).
export const productsTr: Product[] = [];

export function getPublishedProductsTr(): Product[] {
  return productsTr.filter((product) => product.isPublished);
}

export function getProductTrBySlug(slug: string): Product | undefined {
  return productsTr.find((product) => product.slug === slug && product.isPublished);
}
