import type { Metadata } from "next";
import { LegalPageContent } from "@/components/content/LegalPageContent";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbList } from "@/lib/seo/jsonLd";
import { legalCopy } from "@/data/legal";

const TITLE = legalCopy.cookies.title;

export const metadata: Metadata = {
  title: TITLE,
  description: legalCopy.cookies.intro,
  alternates: { canonical: "/cookies" },
};

export default function CookiesPage() {
  return (
    <>
      <JsonLd
        data={buildBreadcrumbList([
          { name: "Home", path: "/" },
          { name: TITLE, path: "/cookies" },
        ])}
      />
      <LegalPageContent doc="cookies" />
    </>
  );
}
