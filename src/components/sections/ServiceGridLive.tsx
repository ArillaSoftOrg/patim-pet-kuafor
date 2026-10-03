"use client";

import { useCallback } from "react";
import { ServiceGrid } from "@/components/sections/ServiceGrid";
import { servicesRepository, SERVICES_SYNC_PING_KEY } from "@/lib/content/servicesRepository";
import { useLiveContent } from "@/lib/content/useLiveContent";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import type { Service } from "@/data/services";

const STORAGE_KEYS = [SERVICES_SYNC_PING_KEY];

interface ServiceGridLiveProps {
  defaultItems: Service[];
  heading?: string;
  description?: string;
  tone?: "background" | "surface" | "muted" | "secondary";
}

// Same default-first, override-after-mount pattern as LiveBusinessValue —
// renders the static defaults immediately, then swaps to the live
// (admin create/edit/delete) list, resolved for the visitor's locale, once
// servicesRepository.listResolved() resolves.
//
// A real Supabase service is never hidden just because a Turkish/Russian
// translation hasn't been written for it yet: listResolved() layers the
// static services.tr.ts/services.ru.ts text over the live rows by slug
// where a translation exists, and falls back to the live English text
// otherwise — see servicesRepository.ts.
export function ServiceGridLive({ defaultItems, heading, description, tone }: ServiceGridLiveProps) {
  const { locale, dictionary } = useLocale();
  const fetchResolved = useCallback(() => servicesRepository.listResolved(locale), [locale]);
  const items = useLiveContent(defaultItems, fetchResolved, STORAGE_KEYS);
  return (
    <ServiceGrid
      items={items}
      heading={heading}
      description={description}
      tone={tone}
      learnMoreLabel={dictionary.shared.learnMore}
      locale={locale}
    />
  );
}
