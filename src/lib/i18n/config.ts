// Single source of truth for supported locales. English is the source
// language and carries no URL prefix; Turkish and Russian are reached via
// a /tr or /ru prefix (see pathLocale.ts). This file has no "use client"
// or "server-only" markers on purpose — it's plain data/logic imported by
// proxy.ts (edge/Node request handling), Server Components, and Client
// Components alike, so it must stay runtime-agnostic.
export const LOCALES = ["en", "tr", "ru"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

// The subset of LOCALES that appear as a URL prefix. Kept as a separate
// list (rather than LOCALES.filter(...) inline everywhere) since several
// modules need "just the prefixed ones" — proxy's redirect check,
// generateStaticParams for the [locale] segment, and the switcher's path
// builder all key off this exact set.
export const PREFIXED_LOCALES = LOCALES.filter(
  (locale): locale is Exclude<Locale, typeof DEFAULT_LOCALE> => locale !== DEFAULT_LOCALE,
);

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function isPrefixedLocale(value: string): value is (typeof PREFIXED_LOCALES)[number] {
  return (PREFIXED_LOCALES as readonly string[]).includes(value);
}

// Always shown in their own language, regardless of the active locale —
// a Turkish speaker still looks for "Türkçe", not a translation of it.
export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  tr: "Türkçe",
  ru: "Русский",
};

// Written by both proxy.ts (first-visit detection) and the client
// LanguageSwitcher (manual choice) — same cookie, same shared mechanism,
// so a manual pick always wins over re-running detection on the next visit.
export const LOCALE_COOKIE = "kulapaws_locale";
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year
