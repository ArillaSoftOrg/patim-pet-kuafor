"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { FeatureSplit } from "@/components/sections/FeatureSplit";
import { BenefitsGrid } from "@/components/sections/BenefitsGrid";
import { CTASection } from "@/components/sections/CTASection";
import { aboutRepository, ABOUT_SYNC_PING_KEY } from "@/lib/content/aboutRepository";
import { businessRepository, BUSINESS_SYNC_PING_KEY } from "@/lib/content/businessRepository";
import { useLiveContent } from "@/lib/content/useLiveContent";
import { resolveImageSrc } from "@/lib/images/resolveImageSrc";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { useLocalizedValue } from "@/lib/i18n/useLocalizedValue";
import { navHref, navLabel } from "@/lib/i18n/navLabels";
import { buildLocalizedPath } from "@/lib/i18n/pathLocale";
import { aboutTr } from "@/lib/i18n/content/about.tr";
import { aboutRu } from "@/lib/i18n/content/about.ru";
import { business as defaultBusiness } from "@/data/business";
import type { AboutContent as AboutContentData } from "@/data/about";
import type { NavItem } from "@/data/navigation";

const STORAGE_KEYS = [ABOUT_SYNC_PING_KEY];
const BUSINESS_STORAGE_KEYS = [BUSINESS_SYNC_PING_KEY];

interface AboutContentProps {
  defaultAbout: AboutContentData;
  primaryCta: NavItem;
}

export function AboutContent({ defaultAbout, primaryCta }: AboutContentProps) {
  const { locale, dictionary } = useLocale();
  // Turkish and Russian both bypass the Supabase-backed live content
  // (page_content has no locale dimension) and use their static
  // translation instead — see about.tr.ts / about.ru.ts.
  const liveAbout = useLiveContent(defaultAbout, aboutRepository.get, STORAGE_KEYS);
  const about = useLocalizedValue(liveAbout, aboutTr, aboutRu);
  const business = useLiveContent(defaultBusiness, businessRepository.get, BUSINESS_STORAGE_KEYS);
  const [image, setImage] = useState<string | null>(defaultAbout.mobileStory.image);

  useEffect(() => {
    let active = true;
    resolveImageSrc(about.mobileStory.image).then((resolved) => {
      if (active) setImage(resolved);
    });
    return () => {
      active = false;
    };
  }, [about.mobileStory.image]);

  return (
    <>
      <PageHeader
        eyebrow={about.header.eyebrow}
        title={about.header.title}
        description={about.header.description}
      />

      <FeatureSplit
        eyebrow={about.mobileStory.eyebrow}
        heading={about.mobileStory.heading}
        description={about.mobileStory.description}
        image={image}
        imageLabel={dictionary.shared.aboutImageLabel}
        imageAlt={dictionary.shared.aboutImageAlt}
        tone="surface"
        cta={{ label: dictionary.shared.exploreServices, href: buildLocalizedPath(locale, "/services") }}
      />

      <BenefitsGrid heading={about.values.heading} tone="muted" items={about.values.items} />

      <CTASection
        heading={about.cta.heading}
        description={about.cta.description}
        cta={{ label: navLabel(dictionary, primaryCta), href: navHref(locale, primaryCta) }}
        whatsapp={business.whatsapp}
        whatsappButtonLabel={dictionary.shared.whatsapp}
        whatsappMessage={
          locale === "tr"
            ? "Merhaba! KulaPAWS hakkında bir sorum var."
            : locale === "ru"
              ? "Здравствуйте! У меня есть вопрос о KulaPAWS."
              : "Hi! I have a question about KulaPAWS."
        }
        whatsappAriaLabel={
          locale === "tr"
            ? "KulaPAWS'a WhatsApp'tan yazın (yeni sekmede açılır)"
            : locale === "ru"
              ? "Написать KulaPAWS в WhatsApp (откроется в новой вкладке)"
              : "Message KulaPAWS on WhatsApp (opens in a new tab)"
        }
      />
    </>
  );
}
