import type { Metadata } from "next";
import { ServicesIndexContent } from "@/components/content/ServicesIndexContent";
import { servicesPageContent } from "@/data/servicesPage";
import { services } from "@/data/services";
import { primaryCta } from "@/data/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbList } from "@/lib/seo/jsonLd";
import { OG_IMAGE, OG_SITE_DEFAULTS, TWITTER_CARD, TWITTER_IMAGE } from "@/lib/seo/socialDefaults";

const TITLE = "Grooming Services for Dogs & Cats";
const DESCRIPTION = servicesPageContent.header.description;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/services" },
  openGraph: {
    ...OG_SITE_DEFAULTS,
    title: TITLE,
    description: DESCRIPTION,
    url: "/services",
    images: [OG_IMAGE],
  },
  twitter: {
    card: TWITTER_CARD,
    title: TITLE,
    description: DESCRIPTION,
    images: [TWITTER_IMAGE],
  },
};

export default function ServicesPage() {
  return (
    <>
      <JsonLd
        data={buildBreadcrumbList([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ])}
      />
      <ServicesIndexContent
        defaultServicesPage={servicesPageContent}
        defaultServices={services}
        primaryCta={primaryCta}
      />
    </>
  );
}
