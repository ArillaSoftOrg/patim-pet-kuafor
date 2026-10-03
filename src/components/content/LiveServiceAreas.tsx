"use client";

import { business as defaultBusiness } from "@/data/business";
import { businessRepository, BUSINESS_SYNC_PING_KEY } from "@/lib/content/businessRepository";
import { useLiveContent } from "@/lib/content/useLiveContent";
import { useLocale } from "@/lib/i18n/LocaleProvider";

const STORAGE_KEYS = [BUSINESS_SYNC_PING_KEY];

// Self-contained (own default + own live fetch, like LiveLogo/
// LiveBusinessName) so it can drop into any section without that section
// needing to thread business data through as a prop. One line of real
// service-area names — no per-city claims, no separate pages. The area
// names themselves (business.serviceAreas) are real Turkish place names
// already (Antalya Merkez, Kemer, ...) and are not translated — only the
// "Serving:" label is locale-aware.
export function LiveServiceAreas() {
  const { dictionary } = useLocale();
  const business = useLiveContent(defaultBusiness, businessRepository.get, STORAGE_KEYS);
  if (business.serviceAreas.length === 0) return null;

  return (
    <p className="mt-6 text-[15px] text-foreground">
      <span className="font-medium">{dictionary.shared.servingLabel}</span> {business.serviceAreas.join(", ")}
    </p>
  );
}
