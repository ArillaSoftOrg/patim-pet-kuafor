import type { Metadata } from "next";
import { AboutContent } from "@/components/content/AboutContent";
import { aboutContent } from "@/data/about";
import { primaryCta } from "@/data/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbList } from "@/lib/seo/jsonLd";
import { OG_IMAGE, OG_SITE_DEFAULTS, TWITTER_CARD, TWITTER_IMAGE } from "@/lib/seo/socialDefaults";

const TITLE = "About Us";
const DESCRIPTION = aboutContent.header.description;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/about" },
  openGraph: {
    ...OG_SITE_DEFAULTS,
    title: TITLE,
    description: DESCRIPTION,
    url: "/about",
    images: [OG_IMAGE],
  },
  twitter: {
    card: TWITTER_CARD,
    title: TITLE,
    description: DESCRIPTION,
    images: [TWITTER_IMAGE],
  },
};

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={buildBreadcrumbList([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />
      <AboutContent defaultAbout={aboutContent} primaryCta={primaryCta} />
    </>
  );
}
