import { createClient } from "@/lib/supabase/client";
import { localStorageAdapter } from "@/lib/storage/localStorageAdapter";
import { isManagedImageRef, deleteImage } from "@/lib/images/imagesRepository";
import { products as defaultProducts } from "@/data/products";
import type { Product } from "@/data/products";
import { rowToProduct } from "@/lib/content/productRow";
import type { ProductRow } from "@/lib/content/productRow";
import { getProductTrBySlug } from "@/lib/i18n/content/products.tr";
import { getProductRuBySlug } from "@/lib/i18n/content/products.ru";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/config";

// Not real data — a same-origin, cross-tab notification only, same pattern
// as services/faqsRepository's ping keys. See useLiveContent for how this
// is used.
export const PRODUCTS_SYNC_PING_KEY = "kulapaws:sync:products";

function notifyOtherTabs() {
  localStorageAdapter.setItem(PRODUCTS_SYNC_PING_KEY, String(Date.now()));
}

function cleanupImage(imageId: string | null | undefined, context: string) {
  if (!imageId) return;
  deleteImage(imageId).catch((err) => {
    console.error(`Failed to clean up ${context}:`, err);
  });
}

// Bounded, fully admin-owned collection, backed by a real multi-row table
// with a unique slug constraint, so create/update/delete are unambiguous.
// `slug` is the collection's id. Single-language: Supabase stores whatever
// language the admin typed (English today) — there is no translation
// table. TR/RU on the public site come from the static
// products.tr.ts/products.ru.ts files, resolved on top of the live rows by
// listResolved()/getResolvedBySlug() below.
export interface ProductsRepository {
  list(): Promise<Product[]>;
  // Locale-resolved reads for the public site. Rule: if a real static
  // translation exists for this slug, its translatable text (name,
  // category, descriptions) overrides the live row; every shared field
  // (image, price, isPublished) always comes from the live Supabase row,
  // and a product with no translation yet is still returned — in English —
  // rather than dropped from the list. See products.tr.ts/products.ru.ts.
  listResolved(locale: Locale): Promise<Product[]>;
  getResolvedBySlug(slug: string, locale: Locale): Promise<Product | null>;
  create(product: Product): Promise<void>;
  update(originalSlug: string, product: Product): Promise<void>;
  remove(slug: string): Promise<void>;
}

function translationFields(product: Product) {
  return {
    name: product.name,
    category: product.category,
    shortDescription: product.shortDescription,
    description: product.description,
  };
}

function staticLookup(slug: string, locale: Locale): Product | undefined {
  return locale === "tr" ? getProductTrBySlug(slug) : locale === "ru" ? getProductRuBySlug(slug) : undefined;
}

// English is always the live row as-is. For tr/ru, only the translatable
// text is taken from the static file (when a translation for this slug
// exists) — image/price/isPublished/slug/brand stay whatever the live row
// says, so an admin publishing/unpublishing, changing the price, or adding
// a photo is reflected immediately in every locale, and a product with no
// translation yet still shows (in English) instead of vanishing.
function withStaticTranslation(liveProduct: Product, locale: Locale): Product {
  if (locale === DEFAULT_LOCALE) return liveProduct;
  const staticMatch = staticLookup(liveProduct.slug, locale);
  return staticMatch ? { ...liveProduct, ...translationFields(staticMatch) } : liveProduct;
}

const UNIQUE_VIOLATION = "23505";

function duplicateSlugError(slug: string): Error {
  return new Error(`A product with slug "${slug}" already exists.`);
}

function productToRow(product: Product) {
  return {
    slug: product.slug,
    name: product.name,
    brand: product.brand,
    category: product.category,
    short_description: product.shortDescription,
    description: product.description,
    image_id: isManagedImageRef(product.image) ? product.image : null,
    price: product.price ?? null,
    is_published: product.isPublished,
  };
}

export const productsRepository: ProductsRepository = {
  async list() {
    // Wrapped in try/catch, not just the {data,error} check below: a
    // thrown exception (misconfigured client, a network failure that
    // rejects rather than resolves with an error field) would otherwise
    // propagate out of this call uncaught. ProductsManager's initial load
    // does `productsRepository.list().then(...)` with no .catch() — an
    // unhandled rejection there would leave its `products` state stuck at
    // null forever (perpetual loading spinner), same failure mode
    // getProductsServer.ts already guards against server-side.
    try {
      const supabase = createClient();
      // No is_published filter here on purpose: RLS (products_public_select)
      // already restricts anon/non-admin reads to published rows, and
      // products_admin_select lets an admin see every row through this
      // exact same query.
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) {
        console.error("productsRepository.list failed, falling back to defaults:", error.message);
        return defaultProducts;
      }
      return (data as ProductRow[]).map(rowToProduct);
    } catch (err) {
      console.error("productsRepository.list failed, falling back to defaults:", err);
      return defaultProducts;
    }
  },

  async listResolved(locale) {
    const liveProducts = await productsRepository.list();
    return liveProducts.map((product) => withStaticTranslation(product, locale));
  },

  async getResolvedBySlug(slug, locale) {
    const liveProducts = await productsRepository.list();
    const match = liveProducts.find((product) => product.slug === slug) ?? null;
    return match ? withStaticTranslation(match, locale) : null;
  },

  async create(product) {
    const supabase = createClient();
    const { count } = await supabase.from("products").select("*", { count: "exact", head: true });
    const { error } = await supabase
      .from("products")
      .insert({ ...productToRow(product), display_order: count ?? 0 });
    if (error) {
      throw error.code === UNIQUE_VIOLATION ? duplicateSlugError(product.slug) : new Error(error.message);
    }
    notifyOtherTabs();
  },

  async update(originalSlug, product) {
    const supabase = createClient();
    const { error } = await supabase.from("products").update(productToRow(product)).eq("slug", originalSlug);
    if (error) {
      throw error.code === UNIQUE_VIOLATION ? duplicateSlugError(product.slug) : new Error(error.message);
    }
    notifyOtherTabs();
  },

  async remove(slug) {
    const supabase = createClient();

    // Capture the image before deleting the row — deleting a product
    // doesn't cascade-delete its image (the FK only clears the other
    // direction, on the image being deleted).
    const { data: row } = await supabase.from("products").select("image_id").eq("slug", slug).maybeSingle();
    const imageId = (row as { image_id: string | null } | null)?.image_id ?? null;

    const { error } = await supabase.from("products").delete().eq("slug", slug);
    if (error) throw new Error(error.message);

    cleanupImage(imageId, `image for deleted product "${slug}"`);
    notifyOtherTabs();
  },
};
