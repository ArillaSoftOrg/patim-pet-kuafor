import { DEFAULT_LOCALE, PREFIXED_LOCALES, type Locale } from "@/lib/i18n/config";
import { CANONICAL_PATHS, LOCALE_PATHS, type CanonicalPath } from "@/lib/i18n/routes";

export interface ParsedLocalizedPath {
  locale: Locale;
  // null for any path outside the known public route set (sitemap.xml,
  // robots.txt, the manifest, generated icons, /admin, unknown paths, ...).
  canonical: CanonicalPath | null;
  // The un-translated remainder after the matched segment, e.g.
  // "/dog-grooming" for a service detail page — a service's [slug] is
  // content, not chrome, so it's never looked up in LOCALE_PATHS.
  subPath: string;
}

function stripLocalePrefix(pathname: string): { locale: Locale; remainder: string } {
  for (const locale of PREFIXED_LOCALES) {
    const prefix = `/${locale}`;
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
      return { locale, remainder: pathname.slice(prefix.length) || "/" };
    }
  }
  return { locale: DEFAULT_LOCALE, remainder: pathname };
}

// Resolves an actual request/browser pathname — already locale-prefixed
// and, for tr/ru, already using the localized slug (e.g. "/tr/hizmetler"
// or "/tr/hizmetler/dog-grooming") — to which canonical page it is.
export function parseLocalizedPathname(pathname: string): ParsedLocalizedPath {
  const { locale, remainder } = stripLocalePrefix(pathname);

  if (remainder === "/") {
    return { locale, canonical: "/", subPath: "" };
  }

  for (const canonical of CANONICAL_PATHS) {
    if (canonical === "/") continue;
    const segment = LOCALE_PATHS[canonical][locale];
    if (remainder === segment) {
      return { locale, canonical, subPath: "" };
    }
    if (remainder.startsWith(`${segment}/`)) {
      return { locale, canonical, subPath: remainder.slice(segment.length) };
    }
  }

  return { locale, canonical: null, subPath: "" };
}

// The public, user-facing URL for a canonical page in `locale` — what
// nav links, the switcher, and proxy's first-visit redirect point at.
// English is always unprefixed with its own segment name, so existing
// English URLs never change.
export function buildLocalizedPath(locale: Locale, canonical: CanonicalPath, subPath = ""): string {
  const prefix = locale === DEFAULT_LOCALE ? "" : `/${locale}`;
  const segment = canonical === "/" ? "" : LOCALE_PATHS[canonical][locale];
  const path = `${prefix}${segment}${subPath}`;
  return path === "" ? "/" : path;
}

// The internal file-system route a canonical page actually lives at
// (app/[locale]/services/page.tsx et al. use plain English segment
// names) — what proxy.ts rewrites a localized public URL to. For English
// this is always identical to buildLocalizedPath's output, so English
// requests are never rewritten.
export function buildInternalPath(locale: Locale, canonical: CanonicalPath, subPath = ""): string {
  const prefix = locale === DEFAULT_LOCALE ? "" : `/${locale}`;
  const segment = canonical === "/" ? "" : canonical;
  const path = `${prefix}${segment}${subPath}`;
  return path === "" ? "/" : path;
}
