export interface Product {
  slug: string;
  name: string;
  brand: string;
  category: string;
  shortDescription: string;
  description: string;
  // null until a real product photo exists — rendered as a
  // PhotoPlaceholder, same convention as src/data/services.ts.
  image: string | null;
  price?: string;
  isPublished: boolean;
}

// Intentionally empty: no real product has been confirmed yet. Do not add
// placeholder/demo products here — see README.md §6 ("Do not create fake
// products") and §21 ("Never ... create fake product data / create fake
// prices"). The Product shape above is ready for real entries as soon as
// they're confirmed (name, slug, brand, category, both descriptions, image,
// optional price, isPublished); every public consumer goes through
// getPublishedProducts()/getProductBySlug() below, so populating this array
// (or swapping these exports for a Supabase-backed repository, mirroring
// src/lib/content/servicesRepository.ts) doesn't require touching any UI.
export const products: Product[] = [];

export function getPublishedProducts(): Product[] {
  return products.filter((product) => product.isPublished);
}

// Public accessor — deliberately excludes unpublished products, same as an
// invalid slug, so a hidden product's page is indistinguishable from one
// that doesn't exist at all.
export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug && product.isPublished);
}
