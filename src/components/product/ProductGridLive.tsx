"use client";

import { useCallback } from "react";
import { ProductGrid } from "@/components/product/ProductGrid";
import { productsRepository, PRODUCTS_SYNC_PING_KEY } from "@/lib/content/productsRepository";
import { useLiveContent } from "@/lib/content/useLiveContent";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import type { Product } from "@/data/products";

const STORAGE_KEYS = [PRODUCTS_SYNC_PING_KEY];

interface ProductGridLiveProps {
  defaultItems: Product[];
  limit?: number;
  emptyTitle?: string;
  emptyDescription?: string;
  // See ProductGrid's own prop doc — passed straight through.
  showCategoryFilter?: boolean;
}

// Renders the server-resolved published products immediately (defaultItems,
// English, from getProductsServer), then swaps to the live (admin
// create/edit/delete/publish) list resolved for the visitor's locale once
// productsRepository.listResolved() resolves.
//
// A real Supabase product is never hidden just because a Turkish/Russian
// translation hasn't been written for it yet: listResolved() layers the
// static products.tr.ts/products.ru.ts text over the live rows by slug
// where a translation exists, and falls back to the live English text
// otherwise — see productsRepository.ts.
export function ProductGridLive({ defaultItems, limit, emptyTitle, emptyDescription, showCategoryFilter }: ProductGridLiveProps) {
  const { locale } = useLocale();
  const fetchResolved = useCallback(() => productsRepository.listResolved(locale), [locale]);
  const items = useLiveContent(defaultItems, fetchResolved, STORAGE_KEYS);
  return (
    <ProductGrid
      items={items}
      limit={limit}
      emptyTitle={emptyTitle}
      emptyDescription={emptyDescription}
      locale={locale}
      showCategoryFilter={showCategoryFilter}
    />
  );
}
