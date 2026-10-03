import type { Metadata } from "next";
import { LegalPageContent } from "@/components/content/LegalPageContent";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbList } from "@/lib/seo/jsonLd";
import { legalCopy } from "@/data/legal";

const TITLE = legalCopy.privacy.title;

export const metadata: Metadata = {
  title: TITLE,
  description: legalCopy.privacy.intro,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <JsonLd
        data={buildBreadcrumbList([
          { name: "Home", path: "/" },
          { name: TITLE, path: "/privacy" },
        ])}
      />
      <LegalPageContent doc="privacy" />
    </>
  );
}
