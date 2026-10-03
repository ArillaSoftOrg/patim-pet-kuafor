"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { ServiceShowcaseLive } from "@/components/sections/ServiceShowcaseLive";
import { CTASection } from "@/components/sections/CTASection";
import { servicesPageRepository, SERVICES_PAGE_SYNC_PING_KEY } from "@/lib/content/servicesPageRepository";
import { useLiveContent } from "@/lib/content/useLiveContent";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { useLocalizedValue } from "@/lib/i18n/useLocalizedValue";
import { navHref, navLabel } from "@/lib/i18n/navLabels";
import { servicesPageTr } from "@/lib/i18n/content/servicesPage.tr";
import { servicesPageRu } from "@/lib/i18n/content/servicesPage.ru";
import type { ServicesPageContent } from "@/data/servicesPage";
import type { Service } from "@/data/services";
import type { NavItem } from "@/data/navigation";

const STORAGE_KEYS = [SERVICES_PAGE_SYNC_PING_KEY];

interface ServicesIndexContentProps {
  defaultServicesPage: ServicesPageContent;
  defaultServices: Service[];
  primaryCta: NavItem;
}

export function ServicesIndexContent({
  defaultServicesPage,
  defaultServices,
  primaryCta,
}: ServicesIndexContentProps) {
  // Turkish and Russian both bypass the Supabase-backed live content
  // (page_content has no locale dimension) and use their static
  // translation instead — see servicesPage.tr.ts / servicesPage.ru.ts.
  const { locale, dictionary } = useLocale();
  const liveContent = useLiveContent(defaultServicesPage, servicesPageRepository.get, STORAGE_KEYS);
  const content = useLocalizedValue(liveContent, servicesPageTr, servicesPageRu);

  return (
    <>
      <PageHeader
        eyebrow={content.header.eyebrow}
        title={content.header.title}
        description={content.header.description}
      />

      <Section tone="background">
        <Container size="wide">
          <ServiceShowcaseLive defaultServices={defaultServices} />
        </Container>
      </Section>

      <CTASection
        heading={content.cta.heading}
        description={content.cta.description}
        cta={{ label: navLabel(dictionary, primaryCta), href: navHref(locale, primaryCta) }}
      />
    </>
  );
}
