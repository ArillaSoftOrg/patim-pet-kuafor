import type { Locale } from "@/lib/i18n/config";

// The public route set this i18n foundation covers. "/" is handled
// distinctly (no URL segment to localize) everywhere this is consumed.
export const CANONICAL_PATHS = [
  "/",
  "/services",
  "/about",
  "/contact",
  "/faq",
  "/privacy",
  "/kvkk",
  "/cookies",
  "/products",
  "/appointment",
] as const;
export type CanonicalPath = (typeof CANONICAL_PATHS)[number];

export function isCanonicalPath(value: string): value is CanonicalPath {
  return (CANONICAL_PATHS as readonly string[]).includes(value);
}

// The one centralized locale -> pathname mapping. Adding a new localized
// public page means adding one line here — proxy.ts's rewrite/redirect,
// the LanguageSwitcher, and Header/Footer/MobileNavigation's nav links
// all derive their URLs from this single table via pathLocale.ts; none of
// them hardcode a translated slug themselves.
//
// English values equal `canonical` itself (its own key) — the internal
// file-system route (app/[locale]/services/page.tsx, etc.) is always
// reachable at the plain English segment name; only the *public*,
// user-facing tr/ru URL uses a localized slug, applied via a proxy
// rewrite (see pathLocale.ts's buildInternalPath / buildLocalizedPath).
//
// These are placeholder machine-safe slugs (ASCII, no diacritics) picked
// for the URL only — visible nav text comes from the separate
// dictionaries in lib/i18n/dictionaries/. Page-body content translation
// is still future work; this foundation only makes the URLs localizable.
export const LOCALE_PATHS: Record<CanonicalPath, Record<Locale, string>> = {
  "/": { en: "", tr: "", ru: "" },
  "/services": { en: "/services", tr: "/hizmetler", ru: "/uslugi" },
  "/about": { en: "/about", tr: "/hakkimizda", ru: "/o-nas" },
  "/contact": { en: "/contact", tr: "/iletisim", ru: "/kontakty" },
  "/faq": { en: "/faq", tr: "/sss", ru: "/voprosy-otvety" },
  "/privacy": { en: "/privacy", tr: "/gizlilik", ru: "/konfidentsialnost" },
  "/kvkk": { en: "/kvkk", tr: "/kvkk", ru: "/kvkk" },
  "/cookies": { en: "/cookies", tr: "/cerez-politikasi", ru: "/politika-cookie" },
  "/products": { en: "/products", tr: "/urunler", ru: "/tovary" },
  "/appointment": { en: "/appointment", tr: "/randevu", ru: "/zapis" },
};
