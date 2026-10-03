import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/publicClient";
import { products as defaultProducts } from "@/data/products";
import { rowToProduct } from "@/lib/content/productRow";
import type { Product } from "@/data/products";
import type { ProductRow } from "@/lib/content/productRow";

// Server-side counterpart to productsRepository.list()/listResolved()
// (which use the cookie-carrying browser client, for the public page's own
// live-refresh after hydration). Same anon-key, RLS-gated read
// (products_public_select, scoped to is_published = true) — no
// service-role key. Used so /products' initial server-rendered HTML
// already contains the real, published products instead of only showing
// them once the client-side fetch resolves. Exact mirror of
// getFaqsServer.ts.
//
// Stays English-only (DEFAULT_LOCALE) on purpose — this is just the SSR
// seed for the initial paint of a page shared across every locale (see
// app/[locale]/products/page.tsx, which re-exports this same route), same
// documented scope boundary ProductDetail.tsx already has for
// generateMetadata. The client-side ProductGridLive takes over within one
// render and resolves the visitor's actual locale (via
// productsRepository.listResolved, layering the static tr/ru translation
// on top of these same live rows).
export const getProductsServer = cache(async (): Promise<Product[]> => {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      console.error("getProductsServer: Supabase lookup failed, falling back to static defaults:", error.message);
      return defaultProducts;
    }

    return (data as ProductRow[]).map(rowToProduct);
  } catch (err) {
    console.error("getProductsServer: Supabase client failed, falling back to static defaults:", err);
    return defaultProducts;
  }
});
