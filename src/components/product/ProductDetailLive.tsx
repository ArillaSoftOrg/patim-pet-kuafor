"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ProductDetail } from "@/components/product/ProductDetail";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { buttonVariants } from "@/components/ui/Button";
import { buildLocalizedPath } from "@/lib/i18n/pathLocale";
import { productsRepository, PRODUCTS_SYNC_PING_KEY } from "@/lib/content/productsRepository";
import { useLiveContent } from "@/lib/content/useLiveContent";
import { resolveImageSrc } from "@/lib/images/resolveImageSrc";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import type { Product } from "@/data/products";
import type { Business } from "@/data/business";

const STORAGE_KEYS = [PRODUCTS_SYNC_PING_KEY];

interface ProductDetailLiveProps {
  slug: string;
  defaultProduct: Product | null;
  business: Business;
}

// Exact mirror of ServiceDetailLive.tsx. The server only resolves
// name/short_description at request time (see resolveProductMetadata in
// app/products/[slug]/page.tsx), and src/data/products.ts ships empty (no
// real product confirmed), so every real, Supabase-backed product renders
// "not found" for a moment until this effect resolves the live list and
// finds the match by slug — the same accepted tradeoff already documented
// for admin-created services beyond the 3 shipped defaults.
//
// RLS (products_public_select) is what actually keeps a hidden product's
// slug inaccessible here: productsRepository.list() returns no row for it
// to a non-admin reader, so `match` stays null and this renders "not
// found" — not an app-layer is_published check that could be forgotten.
//
// ProductDetail itself still owns the English->Turkish swap (by slug, via
// products.tr.ts) once `match` is a real, live product — unchanged by this
// component, same division of responsibility as before this migration.
export function ProductDetailLive({ slug, defaultProduct, business }: ProductDetailLiveProps) {
  const { locale, dictionary } = useLocale();
  const products = useLiveContent<Product[]>(
    defaultProduct ? [defaultProduct] : [],
    productsRepository.list,
    STORAGE_KEYS,
  );
  const match = products.find((item) => item.slug === slug) ?? null;
  const [resolvedImage, setResolvedImage] = useState<string | null>(defaultProduct?.image ?? null);

  useEffect(() => {
    if (!match) return;
    let active = true;
    resolveImageSrc(match.image).then((src) => {
      if (active) setResolvedImage(src);
    });
    return () => {
      active = false;
    };
  }, [match]);

  if (!match) {
    return (
      <Section tone="background">
        <Container size="narrow">
          <EmptyState
            title={dictionary.shared.productNotFoundTitle}
            description={dictionary.shared.productNotFoundDescription}
            action={
              <Link
                href={buildLocalizedPath(locale, "/products")}
                className={buttonVariants({ variant: "secondary" })}
              >
                {dictionary.shared.backToProducts}
              </Link>
            }
          />
        </Container>
      </Section>
    );
  }

  return <ProductDetail product={{ ...match, image: resolvedImage }} business={business} />;
}
