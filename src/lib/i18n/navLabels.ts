import type { NavItem } from "@/data/navigation";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { isCanonicalPath } from "@/lib/i18n/routes";
import { buildLocalizedPath } from "@/lib/i18n/pathLocale";

// navigation.ts's `label` field is left as plain English on purpose —
// giving NavItem a translation-key shape instead would ripple into every
// consumer of primaryNav/footerNav/primaryCta (Hero, HomeContent, and
// others), which is more than this foundation should touch. Matching on
// the current English label text is a narrow, additive bridge scoped to
// just Header/Footer/MobileNavigation; navigation.ts itself is untouched.
const LABEL_KEYS: Record<string, keyof Dictionary["nav"]> = {
  Services: "services",
  Products: "products",
  About: "about",
  FAQ: "faq",
  Contact: "contact",
  Privacy: "privacy",
  "KVKK Notice": "kvkk",
  "Cookie Policy": "cookies",
  "Request Appointment": "requestAppointment",
};

export function navLabel(dictionary: Dictionary, item: NavItem): string {
  const key = LABEL_KEYS[item.label];
  return key ? dictionary.nav[key] : item.label;
}

// item.href values ("/services", "/contact", ...) are exactly the
// CanonicalPath keys in routes.ts — this just bridges NavItem's plain
// `string` href to the typed lookup, falling back to the raw href for
// anything not in the localized route set (defensive; every current nav
// item is covered).
export function navHref(locale: Locale, item: NavItem): string {
  return isCanonicalPath(item.href) ? buildLocalizedPath(locale, item.href) : item.href;
}
