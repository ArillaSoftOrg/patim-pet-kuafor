"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { DEFAULT_LOCALE, LOCALE_COOKIE, LOCALE_COOKIE_MAX_AGE, isLocale, type Locale } from "@/lib/i18n/config";
import { buildLocalizedPath, parseLocalizedPathname } from "@/lib/i18n/pathLocale";
import { getDictionary, type Dictionary } from "@/lib/i18n/dictionaries";

interface LocaleContextValue {
  locale: Locale;
  dictionary: Dictionary;
  switchLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

function readLocaleCookie(): Locale | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${LOCALE_COOKIE}=([^;]+)`));
  const value = match ? decodeURIComponent(match[1]) : null;
  return value && isLocale(value) ? value : null;
}

// Locale (and the current canonical page, for switching) is derived from
// the URL via usePathname + parseLocalizedPathname, not from client state
// seeded after mount — the same pathname resolves to the same locale on
// the server prerender and the client hydration of a statically generated
// route, so there is nothing to reconcile and no hydration mismatch is
// possible by construction. This is also why this provider needs no
// server-passed `locale`/`dictionary` props: it works identically for the
// unprefixed English tree and the /tr and /ru trees.
//
// /admin is the one exception: it has no locale-prefixed routes (admin is
// not part of the public localized route set — see routes.ts), so there is
// no URL to derive a locale from or to navigate to on switch. For that
// subtree only, locale is a standalone preference read from the same
// LOCALE_COOKIE on mount (defaulting to "en" for the very first render —
// both server and client agree on that before the effect runs, so this
// still can't hydration-mismatch) and updated in place by switchLocale
// instead of a navigation, since the admin URL doesn't change with locale.
export function LocaleProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const isAdmin = pathname.startsWith("/admin");

  const parsed = useMemo(() => parseLocalizedPathname(pathname), [pathname]);

  const [adminLocale, setAdminLocale] = useState<Locale>(DEFAULT_LOCALE);
  useEffect(() => {
    if (!isAdmin) return;
    // Deferred a tick (same shape as useLiveContent's post-mount fetch)
    // rather than read-and-setState synchronously in the effect body —
    // the cookie is a genuine external system, not state derivable from
    // props/state already available at render time.
    queueMicrotask(() => {
      const cookieLocale = readLocaleCookie();
      if (cookieLocale) setAdminLocale(cookieLocale);
    });
  }, [isAdmin]);

  const locale = isAdmin ? adminLocale : parsed.locale;
  const dictionary = useMemo(() => getDictionary(locale), [locale]);

  // <html lang> lives in the root layout (shared by /admin and every
  // locale), so it can't vary per-request without making that layout
  // dynamic. Setting it imperatively here — after hydration, outside
  // React's reconciliation of that attribute — keeps assistive tech and
  // browser UI correct without touching SSR output or forcing dynamic
  // rendering.
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const switchLocale = useCallback(
    (next: Locale) => {
      if (next === locale) return;
      document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}; SameSite=Lax`;
      if (isAdmin) {
        setAdminLocale(next);
        return;
      }
      // Falls back to that locale's home page if the current path isn't
      // one of the recognized public pages — still a correct destination,
      // just not a same-page equivalent for an unmapped path.
      const target = parsed.canonical
        ? buildLocalizedPath(next, parsed.canonical, parsed.subPath)
        : buildLocalizedPath(next, "/");
      router.push(target);
    },
    [isAdmin, locale, parsed, router],
  );

  const value = useMemo(() => ({ locale, dictionary, switchLocale }), [locale, dictionary, switchLocale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within a LocaleProvider");
  return ctx;
}
