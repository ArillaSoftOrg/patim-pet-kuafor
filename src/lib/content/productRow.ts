import type { Product } from "@/data/products";

// Shared by productsRepository.ts (browser client, admin CRUD + the public
// page's own live-refresh) and getProductsServer.ts (server, cookie-free
// client, for /products' and /products/[slug]'s initial server-rendered
// HTML) — one conversion, so the two can never drift into disagreeing
// about what a product row means. Same pattern as faqRow.ts.
//
// `id` exists on the row (the table's primary key) but not on the domain
// Product type — like Service, Product's app-level identity is its unique
// `slug`, not the row id, so create/update/delete all key off slug.
export interface ProductRow {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  short_description: string;
  description: string;
  image_id: string | null;
  price: string | null;
  is_published: boolean;
}

export function rowToProduct(row: ProductRow): Product {
  return {
    slug: row.slug,
    name: row.name,
    brand: row.brand,
    category: row.category,
    shortDescription: row.short_description,
    description: row.description,
    image: row.image_id,
    price: row.price ?? undefined,
    isPublished: row.is_published,
  };
}
