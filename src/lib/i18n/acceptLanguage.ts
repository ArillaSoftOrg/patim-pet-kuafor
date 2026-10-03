import { PREFIXED_LOCALES, type Locale } from "@/lib/i18n/config";

// Minimal Accept-Language parser scoped to exactly what proxy.ts needs —
// picking the first supported non-default locale a browser prefers. Not a
// general-purpose BCP47 matcher (see the Next.js i18n guide's suggestion
// of @formatjs/intl-localematcher + negotiator): with only 3 locales and
// English as an unconditional fallback, that dependency weight isn't
// justified for this foundation.
function parseAcceptLanguage(header: string | null): string[] {
  if (!header) return [];
  return header
    .split(",")
    .map((part) => {
      const [tag, qPart] = part.trim().split(";q=");
      const q = qPart ? parseFloat(qPart) : 1;
      return { tag: tag.trim().toLowerCase(), q: Number.isNaN(q) ? 1 : q };
    })
    .sort((a, b) => b.q - a.q)
    .map((entry) => entry.tag);
}

// Returns a prefixed locale (tr/ru) only if the browser explicitly prefers
// one over English; null means "no redirect" — English is the unprefixed
// default, so there's nowhere to redirect a default preference to.
export function matchPrefixedLocale(header: string | null): Locale | null {
  for (const tag of parseAcceptLanguage(header)) {
    const primary = tag.split("-")[0];
    const match = PREFIXED_LOCALES.find((locale) => locale === primary);
    if (match) return match;
  }
  return null;
}
