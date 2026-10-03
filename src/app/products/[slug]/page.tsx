import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import { getProductBySlug, products as defaultProducts } from "@/data/products";
import { ProductDetailLive } from "@/components/product/ProductDetailLive";
import { createPublicClient } from "@/lib/supabase/publicClient";
import { business } from "@/data/business";

export function generateStaticParams() {
  return defaultProducts.map((product) => ({ slug: product.slug }));
}

interface ProductSlugPageProps {
  params: Promise<{ slug: string }>;
}

interface ProductMetadataFields {
  name: string;
  shortDescription: string;
}

function canonicalPath(slug: string): string {
  return `/products/${encodeURIComponent(slug)}`;
}

function staticFallback(slug: string): ProductMetadataFields | null {
  const staticProduct = getProductBySlug(slug);
  return staticProduct ? { name: staticProduct.name, shortDescription: staticProduct.shortDescription } : null;
}

// Shared by generateMetadata and the page component so both agree on
// whether a slug is valid — wrapped in React's cache() so, within a single
// request, they resolve to one Supabase call instead of two. Exact mirror
// of resolveServiceMetadata in app/services/[slug]/page.tsx.
//
// Reads through the cookie-free anon-key client, so products_public_select
// (is_published = true) is what actually decides what this can see — same
// RLS boundary the public page itself uses, no service-role key involved.
// A hidden or nonexistent product's slug resolves to null here, which is
// what makes it 404 instead of leaking a title/description. Stays
// English-only (DEFAULT_LOCALE) on purpose — same documented scope
// boundary as ProductDetail.tsx: metadata/notFound() are server-verified
// once per slug regardless of visitor locale.
//
const resolveProductMetadata = cache(async (slug: string): Promise<ProductMetadataFields | null> => {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("products")
      .select("name, short_description")
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      console.error(
        `resolveProductMetadata: Supabase lookup failed for product "${slug}", falling back to static defaults:`,
        error.message,
      );
      return staticFallback(slug);
    }

    return data ? { name: data.name, shortDescription: data.short_description } : null;
  } catch (err) {
    console.error(
      `resolveProductMetadata: Supabase client failed for product "${slug}", falling back to static defaults:`,
      err,
    );
    return staticFallback(slug);
  }
});

// Next still calls generateMetadata for a slug the page will 404 on (it
// runs independently, before the page's own notFound() check), so this
// keeps a plausible fallback for that transient case rather than assuming
// it's unreachable — the page component below is what actually decides
// the response status.
export async function generateMetadata({ params }: ProductSlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  const canonical = canonicalPath(slug);
  const product = await resolveProductMetadata(slug);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "This product may have been removed, or the link is incorrect.",
      alternates: { canonical },
    };
  }

  return {
    title: product.name,
    description: product.shortDescription,
    alternates: { canonical },
    // No real product has been confirmed as published yet — noindex until
    // one is, same policy as /products itself.
    robots: { index: false, follow: true },
  };
}

export default async function ProductSlugPage({ params }: ProductSlugPageProps) {
  const { slug } = await params;
  const resolved = await resolveProductMetadata(slug);

  if (!resolved) {
    notFound();
  }

  const staticProduct = getProductBySlug(slug) ?? null;
  // The visible page body (brand/description/image/price/CTA) still comes
  // entirely from ProductDetailLive's own client-side fetch, unchanged —
  // same tradeoff as ServiceSlugPage. But `resolved` (name/shortDescription)
  // is already server-verified here — the same value generateMetadata
  // uses — so seeding ProductDetailLive's initial paint with it, instead of
  // the plain static file, costs nothing extra (same cached Supabase call)
  // and guarantees the H1/description a crawler sees on first paint always
  // matches the metadata, even if a static default were ever stale
  // relative to Supabase.
  const defaultProduct = staticProduct ? { ...staticProduct, ...resolved } : null;

  return <ProductDetailLive slug={slug} defaultProduct={defaultProduct} business={business} />;
}
