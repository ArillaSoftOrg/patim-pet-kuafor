import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { getSiteUrl } from "@/lib/seo/siteUrl";
import { OG_SITE_DEFAULTS, TWITTER_CARD } from "@/lib/seo/socialDefaults";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildOrganizationJsonLd } from "@/lib/seo/jsonLd";
import { getBusinessDataServer } from "@/lib/content/getBusinessDataServer";
import { LocaleProvider } from "@/lib/i18n/LocaleProvider";
import "./globals.css";

// Without this, getBusinessDataServer's Supabase fetch (below) has no
// route segment config anywhere above it, so Next's default for a fetch
// discovered with no Request-time API in play is effectively
// `revalidate: false` — cached indefinitely, not just "until next
// deploy": Next's fetch/Data Cache is persisted on disk in
// .next/cache/fetch-cache and survives across builds that reuse an
// existing .next directory, so a stale response can outlive many
// deploys (reproduced directly: a build that reused an older
// .next/cache served visibly different Organization JSON-LD on
// different pages of the very same production build). This project
// doesn't set `cacheComponents` in next.config.ts, so `revalidate` here
// (a literal — Next's static analysis for route segment config requires
// that, not an imported constant or expression) is still the current,
// correct API for it. It's the SAME 60s policy as src/app/page.tsx's own
// `revalidate` (there, for the hero image fetch) and
// src/app/sitemap.ts's (for the published-service query) — not a
// coincidence, one shared bounded-freshness policy for every
// server-side public Supabase read this app makes, applied at each
// route segment that actually needs it since Next requires the literal
// at each site. Being a root layout, this alone covers every other page
// under it (/, /about, /contact, /services, /services/[slug], /privacy,
// /products, /faq) — "lowest revalidate across layout+page wins for the
// whole route" per Next's own docs, so none of those pages need their
// own copy of this value merely to inherit it. Not force-dynamic: still
// static/ISR, just no longer cached forever.
export const revalidate = 60;

// Self-hosted via next/font (downloaded at build time, served from this
// site's own domain — no runtime request to Google, no render-blocking
// external <link>, and automatic metrics-matched fallback substitution to
// avoid layout shift while each font loads). Variable-font mode (no
// `weight` given) so the existing per-element Tailwind weight classes
// (font-bold/font-semibold, etc. — see Heading.tsx and the buttons/nav
// classes) keep working unchanged. `latin-ext` covers Turkish
// (ç/ğ/ı/İ/ö/ş/ü); Manrope adds `cyrillic` too, for the Russian locale —
// Fraunces has no Cyrillic glyphs in Google Fonts at all, so Russian
// headings fall back to the next font in the stack for those characters,
// which is a font-coverage limit, not a bug.
const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  variable: "--font-fraunces",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "KulaPAWS",
    template: "%s | KulaPAWS",
  },
  description: "Mobile pet grooming and pet-care products.",
  // No `locale` — the only confirmed language signal is <html lang="en">
  // below, which has no territory (US, GB, ...); business.address is
  // still null, so there's no confirmed location to justify one over
  // another. Covers routes with no page-level openGraph/twitter of their
  // own (admin, products, privacy); every other page re-spreads
  // OG_SITE_DEFAULTS/TWITTER_CARD itself — see socialDefaults.ts for why.
  // og:image/twitter:image come from opengraph-image.tsx/twitter-image.tsx.
  openGraph: OG_SITE_DEFAULTS,
  // No `site`/`creator` handle — none is confirmed.
  twitter: {
    card: TWITTER_CARD,
  },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const businessData = await getBusinessDataServer();

  return (
    <html lang="en" className={`h-full antialiased ${fraunces.variable} ${manrope.variable}`}>
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        <LocaleProvider>
          <SiteChrome
            header={<Header />}
            footer={<Footer />}
            businessJsonLd={<JsonLd data={buildOrganizationJsonLd(businessData)} />}
          >
            {children}
          </SiteChrome>
        </LocaleProvider>
      </body>
    </html>
  );
}
