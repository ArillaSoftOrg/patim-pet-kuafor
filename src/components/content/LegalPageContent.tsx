"use client";

import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { DataControllerBlock } from "@/components/content/DataControllerBlock";
import { legalCopy } from "@/data/legal";
import type { LegalDocument } from "@/data/legal";
import { legalCopyTr } from "@/lib/i18n/content/legal.tr";
import { legalCopyRu } from "@/lib/i18n/content/legal.ru";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { useLocalizedValue } from "@/lib/i18n/useLocalizedValue";
import { buildLocalizedPath } from "@/lib/i18n/pathLocale";

type LegalDocId = "kvkk" | "privacy" | "cookies";

function DocumentBody({ doc }: { doc: LegalDocument }) {
  return (
    <>
      <p className="text-[16px] text-foreground">{doc.intro}</p>
      {doc.sections.map((section) => (
        <section key={section.id} aria-labelledby={`legal-${section.id}`} className="flex flex-col gap-3">
          <Heading level="h4" as="h2" id={`legal-${section.id}`}>
            {section.heading}
          </Heading>
          {section.blocks.map((block, index) =>
            block.type === "list" ? (
              <ul key={index} className="flex flex-col gap-2 text-[15px] text-foreground">
                {block.items?.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p key={index} className="text-[15px] text-foreground">
                {block.text}
              </p>
            ),
          )}
        </section>
      ))}
    </>
  );
}

export function LegalPageContent({ doc }: { doc: LegalDocId }) {
  const { locale } = useLocale();
  const copy = useLocalizedValue(legalCopy, legalCopyTr, legalCopyRu);
  const activeDoc = copy[doc];

  const related = [
    { key: "privacy" as const, canonical: "/privacy" as const },
    { key: "kvkk" as const, canonical: "/kvkk" as const },
    { key: "cookies" as const, canonical: "/cookies" as const },
  ].filter((item) => item.key !== doc);

  return (
    <>
      <PageHeader title={activeDoc.title} description={`${copy.lastUpdatedLabel}: ${activeDoc.updated}`} />

      <Section tone="background">
        <Container size="narrow" className="flex flex-col gap-8">
          {copy.translationNotice && (
            <p className="rounded-lg border border-warning/30 bg-warning/10 px-4 py-3 text-[14px] text-warning">
              {copy.translationNotice}
            </p>
          )}

          <div className="flex flex-col gap-10">
            <DocumentBody doc={activeDoc} />
          </div>

          {activeDoc.showIdentity && <DataControllerBlock labels={copy.identityLabels} />}

          <nav aria-label={copy.relatedDocuments.heading} className="border-t border-border pt-6">
            <p className="text-[13px] font-medium uppercase tracking-wide text-muted-foreground">
              {copy.relatedDocuments.heading}
            </p>
            <ul className="mt-3 flex flex-col gap-2 sm:flex-row sm:gap-6">
              {related.map((item) => (
                <li key={item.key}>
                  <Link
                    href={buildLocalizedPath(locale, item.canonical)}
                    className="rounded-sm text-[15px] font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {copy.relatedDocuments[item.key]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </Container>
      </Section>
    </>
  );
}
