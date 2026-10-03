import type { Product } from "@/data/products";

// Russian translations of real, published products — keyed by the same
// slug as the Supabase-backed English/default row (see
// productsRepository.ts / ProductGridLive.tsx), same convention as
// services.ru.ts. Intentionally empty: no real product has been confirmed
// yet (README.md §6/§21/§23 — do not invent product data here), and even
// once real products exist in Supabase, this file only ever grows by a
// deliberate translation pass, not automatically — an admin-created
// product has no Russian entry until one is added here, and simply
// doesn't appear on the Russian site until then, rather than showing
// untranslated English mixed in (same tradeoff as products.tr.ts).
export const productsRu: Product[] = [];

export function getPublishedProductsRu(): Product[] {
  return productsRu.filter((product) => product.isPublished);
}

export function getProductRuBySlug(slug: string): Product | undefined {
  return productsRu.find((product) => product.slug === slug && product.isPublished);
}
