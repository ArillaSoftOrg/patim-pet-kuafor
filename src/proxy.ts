import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createProxyClient } from "@/lib/supabase/proxyClient";
import { DEFAULT_LOCALE, LOCALE_COOKIE, LOCALE_COOKIE_MAX_AGE, isLocale } from "@/lib/i18n/config";
import { buildInternalPath, buildLocalizedPath, parseLocalizedPathname } from "@/lib/i18n/pathLocale";
import { matchPrefixedLocale } from "@/lib/i18n/acceptLanguage";

// Next.js 16 deprecated middleware.ts in favor of proxy.ts (same mechanism,
// renamed — see node_modules/next/dist/docs/01-app/03-api-reference/
// 03-file-conventions/proxy.md). This is a deliberate choice here, not a
// blind copy of the old middleware tutorial pattern:
//
// - Proxy is the one place guaranteed to run on every request under the
//   matcher below, including the background RSC fetches a client-side
//   Link navigation between two admin pages makes. A check placed only in
//   the (protected) layout would NOT get this guarantee: Next.js reuses an
//   already-rendered shared layout across sibling-route navigations rather
//   than re-running its Server Component logic every time, so it alone
//   cannot reliably gate every navigation — only the first entry into the
//   segment. Proxy closes that gap.
// - Since Next.js 16, proxy defaults to the Node.js runtime (not
//   Edge-only), so the two network calls below (JWT verification via
//   getUser(), and the is_admin() lookup) behave exactly as they would in
//   any other server context — no Edge-runtime workarounds needed here.
// - The (protected) layout still repeats this same check itself. Per
//   Next's own proxy docs: "Always verify authentication and authorization
//   inside each Server Function rather than relying on Proxy alone" — this
//   is defense in depth, not redundancy for its own sake.
async function handleAdmin(request: NextRequest, pathname: string): Promise<NextResponse> {
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const { supabase, response } = createProxyClient(request);

  // getUser() (never getSession()) — it revalidates the token against the
  // Supabase Auth server instead of just trusting whatever is in the
  // cookie, which is the difference between an authorization check and a
  // client-supplied claim.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const { data: isAdmin } = await supabase.rpc("is_admin");

  if (!isAdmin) {
    await supabase.auth.signOut();
    const denied = NextResponse.redirect(new URL("/admin/login?error=not_authorized", request.url));
    // signOut() above wrote its cookie-clearing instructions onto `response`
    // (via createProxyClient's setAll); carry them onto the redirect we're
    // actually returning, or the session cookie would survive the bounce.
    response.cookies.getAll().forEach((cookie) => denied.cookies.set(cookie));
    return denied;
  }

  return response;
}

// First-visit language detection AND localized-URL rewriting for the
// public site (en default, unprefixed with its own English segment names
// / tr, ru prefixed with a localized slug — see lib/i18n/routes.ts for
// the one centralized mapping and pathLocale.ts for how it's applied).
//
// Detection runs once per visitor: once the locale cookie exists — set
// here on detection, or by the LanguageSwitcher on a manual choice — this
// never redirects again, so a manual pick can never be overridden by
// re-detecting the browser language on a later visit.
//
// The rewrite is separate and unconditional: a public localized URL like
// "/tr/hizmetler" is transparently rewritten to the internal route it's
// actually implemented at ("/tr/services" — app/[locale]/services/
// page.tsx, re-exporting the English page, see that file) so there is
// only ever one page implementation. English requests are never
// rewritten — buildInternalPath and buildLocalizedPath produce the same
// path for the default locale.
//
// Both only ever apply to the fixed, known set of public pages
// (parseLocalizedPathname returns canonical: null for anything else) —
// sitemap.xml, robots.txt, the manifest, generated icons, and anything
// else that slips through the broad matcher below is left untouched.
function handleLocale(request: NextRequest, pathname: string): NextResponse {
  const parsed = parseLocalizedPathname(pathname);

  if (parsed.canonical === null) {
    return NextResponse.next();
  }

  const internalPath = buildInternalPath(parsed.locale, parsed.canonical, parsed.subPath);
  function rewriteOrNext(): NextResponse {
    if (internalPath === pathname) return NextResponse.next();
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = internalPath;
    return NextResponse.rewrite(rewriteUrl);
  }

  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  if (cookieLocale && isLocale(cookieLocale)) {
    return rewriteOrNext();
  }

  // Already on a prefixed URL (e.g. a shared /tr/hizmetler link) —
  // nothing to redirect, just remember it so detection doesn't run again.
  if (parsed.locale !== DEFAULT_LOCALE) {
    const response = rewriteOrNext();
    response.cookies.set(LOCALE_COOKIE, parsed.locale, { path: "/", maxAge: LOCALE_COOKIE_MAX_AGE });
    return response;
  }

  const detected = matchPrefixedLocale(request.headers.get("accept-language"));

  if (!detected) {
    const response = NextResponse.next();
    response.cookies.set(LOCALE_COOKIE, DEFAULT_LOCALE, { path: "/", maxAge: LOCALE_COOKIE_MAX_AGE });
    return response;
  }

  const target = request.nextUrl.clone();
  target.pathname = buildLocalizedPath(detected, parsed.canonical, parsed.subPath);
  const redirect = NextResponse.redirect(target);
  redirect.cookies.set(LOCALE_COOKIE, detected, { path: "/", maxAge: LOCALE_COOKIE_MAX_AGE });
  return redirect;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    return handleAdmin(request, pathname);
  }

  return handleLocale(request, pathname);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
