"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { useLocale } from "@/lib/i18n/LocaleProvider";

// /faq's page header is small enough (2 strings) to not warrant its own
// data file the way homepage/about/etc. have — translated directly via the
// dictionary's shared.faqPage namespace instead. Needs to be a Client
// Component (useLocale) since src/app/faq/page.tsx itself is a Server
// Component with no locale param (see app/[locale]/faq/page.tsx, which
// re-exports it unchanged for /tr, /ru).
export function FaqPageIntro() {
  const { dictionary } = useLocale();
  return <PageHeader title={dictionary.shared.faqPage.title} description={dictionary.shared.faqPage.description} />;
}
