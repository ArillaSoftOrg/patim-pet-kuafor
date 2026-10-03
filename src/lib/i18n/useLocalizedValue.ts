"use client";

import { useLocale } from "@/lib/i18n/LocaleProvider";

// Turkish and Russian both have real page-body translations now (see
// src/lib/i18n/content/*.tr.ts and *.ru.ts). `ru` defaults to `en` so any
// call site not yet updated with a Russian value keeps its previous
// behavior. Centralizing the fallback policy here means every
// content-picking call site (HomeContent, AboutContent, ServiceGridLive,
// ...) stays a one-line call instead of repeating the same locale check.
export function useLocalizedValue<T>(en: T, tr: T, ru: T = en): T {
  const { locale } = useLocale();
  if (locale === "tr") return tr;
  if (locale === "ru") return ru;
  return en;
}
