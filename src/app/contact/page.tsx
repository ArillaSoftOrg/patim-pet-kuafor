import type { Metadata } from "next";
import { ContactContent } from "@/components/content/ContactContent";
import { contactPageContent } from "@/data/contactPage";
import { business } from "@/data/business";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbList } from "@/lib/seo/jsonLd";
import { OG_IMAGE, OG_SITE_DEFAULTS, TWITTER_CARD, TWITTER_IMAGE } from "@/lib/seo/socialDefaults";

const TITLE = "Contact Us";
const DESCRIPTION = contactPageContent.description;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/contact" },
  openGraph: {
    ...OG_SITE_DEFAULTS,
    title: TITLE,
    description: DESCRIPTION,
    url: "/contact",
    images: [OG_IMAGE],
  },
  twitter: {
    card: TWITTER_CARD,
    title: TITLE,
    description: DESCRIPTION,
    images: [TWITTER_IMAGE],
  },
};

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={buildBreadcrumbList([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />
      <ContactContent defaultContactPage={contactPageContent} defaultBusiness={business} />
    </>
  );
}
