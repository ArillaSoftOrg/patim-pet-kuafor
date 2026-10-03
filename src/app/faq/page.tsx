import type { Metadata } from "next";
import { FaqPageIntro } from "@/components/content/FaqPageIntro";
import { FaqSectionsLive } from "@/components/content/FaqSectionsLive";
import { getFaqsServer } from "@/lib/content/getFaqsServer";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbList } from "@/lib/seo/jsonLd";
import { OG_IMAGE, OG_SITE_DEFAULTS, TWITTER_CARD, TWITTER_IMAGE } from "@/lib/seo/socialDefaults";

const TITLE = "Frequently Asked Questions";
const DESCRIPTION = "Answers about our services, mobile grooming, and products.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/faq" },
  openGraph: {
    ...OG_SITE_DEFAULTS,
    title: TITLE,
    description: DESCRIPTION,
    url: "/faq",
    images: [OG_IMAGE],
  },
  twitter: {
    card: TWITTER_CARD,
    title: TITLE,
    description: DESCRIPTION,
    images: [TWITTER_IMAGE],
  },
};

export default async function FaqPage() {
  // Server-resolved (see getFaqsServer.ts) so the real, published FAQs are
  // in the initial HTML instead of only appearing once FaqSectionsLive's
  // own client-side fetch resolves. FaqSectionsLive still re-fetches after
  // mount via useLiveContent — this only changes what it starts from.
  const faqs = await getFaqsServer();

  return (
    <>
      <JsonLd
        data={buildBreadcrumbList([
          { name: "Home", path: "/" },
          { name: "FAQ", path: "/faq" },
        ])}
      />
      <FaqPageIntro />

      <FaqSectionsLive mode="grouped" defaultFaqs={faqs} tone="background" />
    </>
  );
}
