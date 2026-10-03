"use client";

import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { buttonVariants } from "@/components/ui/Button";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { buildLocalizedPath } from "@/lib/i18n/pathLocale";

// See src/app/not-found.tsx for why this is a separate Client Component —
// the `metadata` export there requires that file to stay a Server
// Component, same pattern as FaqPageIntro/LegalPageContent.
export function NotFoundContent() {
  const { locale, dictionary } = useLocale();
  const t = dictionary.notFound;

  return (
    <Section tone="background">
      <Container size="content" className="flex flex-col items-center gap-5 py-20 text-center sm:py-28">
        <p className="text-[14px] font-medium uppercase tracking-wide text-primary">404</p>
        <Heading level="h1">{t.title}</Heading>
        <p className="max-w-[50ch] text-[16px] text-muted-foreground sm:text-[18px]">{t.description}</p>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <Link href={buildLocalizedPath(locale, "/")} className={buttonVariants({ variant: "primary" })}>
            {t.backToHome}
          </Link>
          <Link href={buildLocalizedPath(locale, "/services")} className={buttonVariants({ variant: "secondary" })}>
            {t.viewServices}
          </Link>
        </div>
      </Container>
    </Section>
  );
}
