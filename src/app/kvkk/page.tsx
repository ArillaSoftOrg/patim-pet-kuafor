import type { Metadata } from "next";
import { LegalPageContent } from "@/components/content/LegalPageContent";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbList } from "@/lib/seo/jsonLd";
import { legalCopy } from "@/data/legal";

const TITLE = legalCopy.kvkk.title;

export const metadata: Metadata = {
  title: TITLE,
  description: legalCopy.kvkk.intro,
  alternates: { canonical: "/kvkk" },
};

export default function KvkkPage() {
  return (
    <>
      <JsonLd
        data={buildBreadcrumbList([
          { name: "Home", path: "/" },
          { name: TITLE, path: "/kvkk" },
        ])}
      />
      <LegalPageContent doc="kvkk" />
    </>
  );
}
