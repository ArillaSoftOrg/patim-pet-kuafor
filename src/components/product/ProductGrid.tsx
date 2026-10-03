"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProductCard } from "@/components/product/ProductCard";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { buildLocalizedPath } from "@/lib/i18n/pathLocale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/config";
import type { Product } from "@/data/products";

interface ProductGridProps {
  items: Product[];
  limit?: number;
  emptyTitle?: string;
  emptyDescription?: string;
  // Defaults to English so any caller that doesn't localize (none today
  // besides ProductGridLive/HomeContent, which always do) still links to
  // the unprefixed English URL exactly as before.
  locale?: Locale;
  // Shows a category filter bar above the grid, derived client-side from
  // `items.category` — no extra fetch, filtering is instant. Off by
  // default so a bounded preview (e.g. the homepage's 3-item strip) is
  // unaffected; the bar itself only renders once there's more than one
  // distinct category to choose between, so a single-category catalog
  // never shows a filter with nothing to filter.
  showCategoryFilter?: boolean;
}

export function ProductGrid({
  items,
  limit,
  emptyTitle = "Products are on the way",
  emptyDescription = "Real KulaPAWS pet-care products will be listed here once confirmed.",
  locale = DEFAULT_LOCALE,
  showCategoryFilter = false,
}: ProductGridProps) {
  const dictionary = getDictionary(locale);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = useMemo(
    () => [...new Set(items.map((item) => item.category))].sort((a, b) => a.localeCompare(b)),
    [items],
  );
  const showFilterBar = showCategoryFilter && categories.length > 1;

  const filtered = showFilterBar && selectedCategory ? items.filter((item) => item.category === selectedCategory) : items;
  const visible = typeof limit === "number" ? filtered.slice(0, limit) : filtered;

  if (items.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        action={
          <Link
            href={buildLocalizedPath(locale, "/contact")}
            className={buttonVariants({ variant: "primary" })}
          >
            {dictionary.shared.contactUs}
          </Link>
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {showFilterBar && (
        <div
          role="group"
          aria-label={dictionary.shared.productFilter.filterLabel}
          className="flex flex-wrap gap-2 sm:gap-2.5"
        >
          <FilterPill
            label={dictionary.shared.productFilter.all}
            active={selectedCategory === null}
            onClick={() => setSelectedCategory(null)}
          />
          {categories.map((category) => (
            <FilterPill
              key={category}
              label={category}
              active={selectedCategory === category}
              onClick={() => setSelectedCategory(category)}
            />
          ))}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
        {visible.map((product) => (
          <ProductCard key={product.slug} product={product} locale={locale} />
        ))}
      </div>
    </div>
  );
}

function FilterPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-pill border px-4 py-2 text-[14px] font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-input bg-surface text-foreground hover:border-primary/60",
      )}
    >
      {label}
    </button>
  );
}
