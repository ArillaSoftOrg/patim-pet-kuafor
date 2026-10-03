"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { CheckIcon } from "@/components/ui/CheckIcon";
import { resolveImageSrc } from "@/lib/images/resolveImageSrc";
import { buildLocalizedPath } from "@/lib/i18n/pathLocale";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Service } from "@/data/services";

interface ServiceCardProps {
  service: Service;
  learnMoreLabel: string;
  locale?: Locale;
}

// service.image is a raw reference (a managed Supabase Storage images.id,
// or null), same as product.image — resolved client-side on mount, same
// pattern as ProductCard.
export function ServiceCard({ service, learnMoreLabel, locale = DEFAULT_LOCALE }: ServiceCardProps) {
  const [resolvedImage, setResolvedImage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    resolveImageSrc(service.image).then((src) => {
      if (active) setResolvedImage(src);
    });
    return () => {
      active = false;
    };
  }, [service.image]);

  // Top 2 only — the full list already has its own dedicated section on
  // the service detail page; this is a scannable preview, not a duplicate.
  const highlights = service.whoItsFor.slice(0, 2);

  return (
    <Card as="article" interactive className="relative flex flex-col gap-4 p-4 sm:p-5">
      <PhotoPlaceholder
        src={resolvedImage}
        label={getDictionary(locale).shared.photoComingSoonTemplate.replace("{name}", service.title)}
        aspect="video"
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
      />
      <div className="flex flex-1 flex-col">
        <h3 className="text-[19px] font-semibold text-foreground">
          <Link
            href={buildLocalizedPath(locale, "/services", `/${service.slug}`)}
            className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          >
            {service.title}
          </Link>
        </h3>
        <p className="mt-2 text-[15px] text-muted-foreground">{service.shortDescription}</p>
        {highlights.length > 0 && (
          <ul className="mt-4 flex flex-col gap-1.5">
            {highlights.map((item) => (
              <li key={item} className="flex items-start gap-2 text-[13.5px] text-foreground">
                <CheckIcon className="mt-[3px] flex-shrink-0 text-primary" />
                <span className="line-clamp-1">{item}</span>
              </li>
            ))}
          </ul>
        )}
        <span
          className="mt-5 inline-flex items-center text-[15px] font-semibold text-primary"
          aria-hidden="true"
        >
          {learnMoreLabel}
        </span>
      </div>
    </Card>
  );
}
