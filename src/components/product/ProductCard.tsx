"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { resolveImageSrc } from "@/lib/images/resolveImageSrc";
import { buildLocalizedPath } from "@/lib/i18n/pathLocale";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Product } from "@/data/products";

// product.image is a raw reference (a managed Supabase Storage images.id,
// a packaged default path, or null) — not yet a displayable URL. Resolved
// client-side on mount, same pattern as ServiceDetailLive's single-image
// resolution, just applied per-card since (unlike ServiceGrid) this grid
// shows a photo for every item.
export function ProductCard({ product, locale = DEFAULT_LOCALE }: { product: Product; locale?: Locale }) {
  const [resolvedImage, setResolvedImage] = useState<string | null>(null);
  const dictionary = getDictionary(locale);

  useEffect(() => {
    let active = true;
    resolveImageSrc(product.image).then((src) => {
      if (active) setResolvedImage(src);
    });
    return () => {
      active = false;
    };
  }, [product.image]);

  return (
    <Card as="article" interactive className="relative flex h-full flex-col gap-4 p-5 sm:p-6">
      <PhotoPlaceholder
        src={resolvedImage}
        label={dictionary.shared.photoComingSoonTemplate.replace("{name}", product.name)}
        aspect="square"
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
      />
      <div className="flex flex-1 flex-col">
        <span className="inline-flex w-fit items-center rounded-full bg-secondary px-2.5 py-1 text-[12px] font-medium text-secondary-foreground">
          {product.category}
        </span>
        <h3 className="mt-3 text-[17px] font-semibold text-foreground">
          <Link
            href={buildLocalizedPath(locale, "/products", `/${product.slug}`)}
            className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          >
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 text-[13px] font-medium text-muted-foreground">{product.brand}</p>
        <p className="mt-2 line-clamp-2 text-[14px] text-muted-foreground">{product.shortDescription}</p>
        <div className="mt-auto flex items-center gap-3 pt-4">
          {product.price && (
            <span className="text-[15px] font-semibold text-foreground">{product.price}</span>
          )}
          <span className="ml-auto text-[14px] font-medium text-primary" aria-hidden="true">
            {dictionary.shared.learnMore}
          </span>
        </div>
      </div>
    </Card>
  );
}
