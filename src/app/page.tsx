import type { Metadata } from "next";
import { HomeContent } from "@/components/content/HomeContent";
import { OG_IMAGE, OG_SITE_DEFAULTS, TWITTER_CARD, TWITTER_IMAGE } from "@/lib/seo/socialDefaults";
import { getInitialHeroImage } from "@/lib/content/getInitialHeroImage";
import { getProductsServer } from "@/lib/content/getProductsServer";
import { faqs } from "@/data/faqs";
import { primaryCta } from "@/data/navigation";
import { homepage } from "@/data/homepage";

// Kept independent of homepage.hero.description (the on-page hero copy):
// that copy mentions pet-care products, but src/data/products.ts is
// currently empty (no real product has been confirmed), so metadata
// stays scoped to the one thing that's actually real today — mobile dog
// and cat grooming — rather than claiming a product offering that isn't
// live yet.
const TITLE = "KulaPAWS | Mobile Dog & Cat Grooming";
const DESCRIPTION =
  "KulaPAWS offers mobile dog and cat grooming, delivered to your home so your pet can be groomed in a calm, familiar space.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    ...OG_SITE_DEFAULTS,
    title: TITLE,
    description: DESCRIPTION,
    url: "/",
    images: [OG_IMAGE],
  },
  twitter: {
    card: TWITTER_CARD,
    title: TITLE,
    description: DESCRIPTION,
    images: [TWITTER_IMAGE],
  },
};

// Without this, the server-resolved hero image (getInitialHeroImage,
// below) would be cached indefinitely — Next's default for a route with no
// Request-time APIs (revalidate: false, i.e. Infinity) — so an admin's new
// hero photo wouldn't reach the initial HTML until the next deploy. This
// project doesn't set `cacheComponents` in next.config.ts, so it's on
// Next 16's previous caching model, where a numeric route segment
// `revalidate` (must be a literal, not an expression) is still the current
// supported way to do this — not force-dynamic: the page stays static/ISR,
// served instantly from cache, and Next regenerates it in the background
// at most once per window. 60s is a deliberately short but non-trivial
// window for a marketing homepage — fresh enough that admin edits show up
// within a minute, without regenerating on every request. Text content
// (homepage.*) is untouched by this — it stays on the existing client-side
// useLiveContent path, which still runs after hydration exactly as before.
export const revalidate = 60;

export default async function Home() {
  const initialHeroImage = await getInitialHeroImage();
  // Server-resolved real, published products (see getProductsServer.ts) —
  // same source /products itself reads, so the homepage preview and the
  // full catalog never disagree about what's actually published.
  const publishedProducts = await getProductsServer();

  return (
    <HomeContent
      defaultHomepage={homepage}
      initialHeroImage={initialHeroImage}
      products={publishedProducts}
      defaultFaqs={faqs}
      primaryCta={primaryCta}
    />
  );
}
