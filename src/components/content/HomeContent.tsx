"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Hero } from "@/components/sections/Hero";
import { MobileSalonShowcase } from "@/components/sections/MobileSalonShowcase";
import { BeforeAfterShowcase } from "@/components/sections/BeforeAfterShowcase";
import { CampaignSection } from "@/components/sections/CampaignSection";
import { ServiceShowcase } from "@/components/sections/ServiceShowcase";
import { FeatureSplit } from "@/components/sections/FeatureSplit";
import { BenefitsGrid } from "@/components/sections/BenefitsGrid";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { FaqSectionsLive } from "@/components/content/FaqSectionsLive";
import { LiveServiceAreas } from "@/components/content/LiveServiceAreas";
import { CTASection } from "@/components/sections/CTASection";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { ProductGridLive } from "@/components/product/ProductGridLive";
import { homepageRepository, HOMEPAGE_SYNC_PING_KEY } from "@/lib/content/homepageRepository";
import { useLiveContent } from "@/lib/content/useLiveContent";
import { resolveImageSrc } from "@/lib/images/resolveImageSrc";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { useLocalizedValue } from "@/lib/i18n/useLocalizedValue";
import { navHref, navLabel } from "@/lib/i18n/navLabels";
import { buildLocalizedPath } from "@/lib/i18n/pathLocale";
import { homepageTr } from "@/lib/i18n/content/homepage.tr";
import { homepageRu } from "@/lib/i18n/content/homepage.ru";
import type { HomepageContent } from "@/data/homepage";
import type { Faq } from "@/data/faqs";
import type { Product } from "@/data/products";
import type { NavItem } from "@/data/navigation";

const STORAGE_KEYS = [HOMEPAGE_SYNC_PING_KEY];

interface HomeContentProps {
  defaultHomepage: HomepageContent;
  // Server-resolved (see src/lib/content/getInitialHeroImage.ts) so the
  // hero — the homepage's LCP candidate — has a real src in the initial
  // HTML instead of only being discoverable after this component mounts
  // and its own effect below resolves it. null when there's no hero photo
  // yet, same as the static default.
  initialHeroImage: string | null;
  products: Product[];
  defaultFaqs: Faq[];
  primaryCta: NavItem;
}

export function HomeContent({
  defaultHomepage,
  initialHeroImage,
  products: defaultProducts,
  defaultFaqs,
  primaryCta,
}: HomeContentProps) {
  const { locale, dictionary } = useLocale();
  const liveHomepage = useLiveContent(defaultHomepage, homepageRepository.get, STORAGE_KEYS);
  // Turkish and Russian both bypass the Supabase-backed live content and
  // use their static translation instead — page_content has no locale
  // dimension, so the live fetch above can only ever resolve to English
  // (see homepage.tr.ts / homepage.ru.ts for the full reasoning). English
  // behavior is unchanged.
  const homepage = useLocalizedValue(liveHomepage, homepageTr, homepageRu);
  const [heroImage, setHeroImage] = useState<string | null>(initialHeroImage ?? defaultHomepage.hero.image);
  const [highlightImage, setHighlightImage] = useState<string | null>(defaultHomepage.mobileHighlight.image);

  useEffect(() => {
    let active = true;
    resolveImageSrc(homepage.hero.image).then((resolved) => {
      if (active) setHeroImage(resolved);
    });
    return () => {
      active = false;
    };
  }, [homepage.hero.image]);

  useEffect(() => {
    let active = true;
    resolveImageSrc(homepage.mobileHighlight.image).then((resolved) => {
      if (active) setHighlightImage(resolved);
    });
    return () => {
      active = false;
    };
  }, [homepage.mobileHighlight.image]);

  return (
    <>
      <Hero
        heading={homepage.hero.heading}
        description={homepage.hero.description}
        image={heroImage}
        gallery={homepage.hero.gallery}
        primaryCta={{ label: homepage.hero.primaryCtaLabel, href: navHref(locale, primaryCta) }}
        secondaryCta={{ label: homepage.hero.secondaryCtaLabel, href: buildLocalizedPath(locale, "/services") }}
        imageAlt={dictionary.shared.heroImageAlt}
      />

      <MobileSalonShowcase
        eyebrow={homepage.mobileSalon.eyebrow}
        heading={homepage.mobileSalon.heading}
        description={homepage.mobileSalon.description}
        gallery={homepage.mobileSalon.gallery}
        tone="surface"
      />

      <BeforeAfterShowcase
        eyebrow={homepage.beforeAfter.eyebrow}
        heading={homepage.beforeAfter.heading}
        description={homepage.beforeAfter.description}
        gallery={homepage.beforeAfter.gallery}
        prevLabel={homepage.beforeAfter.prevLabel}
        nextLabel={homepage.beforeAfter.nextLabel}
        placeholderLabel={dictionary.shared.galleryPlaceholderLabel}
        tone="background"
      />

      <CampaignSection
        eyebrow={homepage.campaign.eyebrow}
        heading={homepage.campaign.heading}
        description={homepage.campaign.description}
        perks={homepage.campaign.perks}
        cta={{ label: homepage.campaign.ctaLabel, href: navHref(locale, primaryCta) }}
      />

      <ServiceShowcase
        eyebrow={homepage.servicesSection.eyebrow}
        heading={homepage.servicesSection.heading}
        description={homepage.servicesSection.description}
        items={homepage.servicesSection.showcase}
        viewDetailsLabel={dictionary.shared.viewServiceDetails}
        locale={locale}
      />

      <FeatureSplit
        eyebrow={homepage.mobileHighlight.eyebrow}
        heading={homepage.mobileHighlight.heading}
        description={homepage.mobileHighlight.description}
        bullets={homepage.mobileHighlight.bullets}
        image={highlightImage}
        cta={{
          label: dictionary.shared.howMobileGroomingWorks,
          href: buildLocalizedPath(locale, "/services", "/mobile-pet-grooming"),
        }}
        imageLabel={dictionary.shared.mobileHighlightImageLabel}
        imageAlt={dictionary.shared.mobileHighlightImageAlt}
        tone="muted"
      >
        <LiveServiceAreas />
      </FeatureSplit>

      <BenefitsGrid
        heading={homepage.whyKulapaws.heading}
        description={homepage.whyKulapaws.description}
        items={homepage.whyKulapaws.items}
        tone="surface"
      />

      <Section tone="background">
        <Container size="wide">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div className="max-w-[65ch]">
              <Heading level="h2">{homepage.productsPreview.heading}</Heading>
              <p className="mt-4 text-[16px] text-muted-foreground sm:text-[18px]">
                {homepage.productsPreview.description}
              </p>
            </div>
            <Link
              href={buildLocalizedPath(locale, "/products")}
              className="text-[15px] font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            >
              {dictionary.shared.viewAllProducts}
            </Link>
          </div>
          <div className="mt-10">
            <ProductGridLive
              defaultItems={defaultProducts}
              limit={3}
              emptyTitle={dictionary.shared.productsEmptyTitle}
              emptyDescription={dictionary.shared.productsEmptyDescription}
            />
          </div>
        </Container>
      </Section>

      <ProcessSteps
        heading={homepage.howItWorks.heading}
        description={homepage.howItWorks.description}
        steps={homepage.howItWorks.steps}
        tone="muted"
      />

      <TestimonialsSection
        eyebrow={homepage.testimonials.eyebrow}
        heading={homepage.testimonials.heading}
        description={homepage.testimonials.description}
        items={homepage.testimonials.items}
        tone="background"
      />

      <FaqSectionsLive
        mode="flat"
        heading={homepage.faqPreview.heading}
        defaultFaqs={defaultFaqs}
        viewAllCta={{ label: dictionary.shared.visitFaqPage, href: buildLocalizedPath(locale, "/faq") }}
        tone="surface"
      />

      <CTASection
        heading={homepage.finalCta.heading}
        description={homepage.finalCta.description}
        cta={{ label: navLabel(dictionary, primaryCta), href: navHref(locale, primaryCta) }}
      />
    </>
  );
}
