import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { FeatureSplit } from "@/components/sections/FeatureSplit";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { CTASection } from "@/components/sections/CTASection";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { buttonVariants } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CheckIcon } from "@/components/ui/CheckIcon";
import type { Service } from "@/data/services";
import type { NavItem } from "@/data/navigation";
import { primaryCta as defaultPrimaryCta } from "@/data/navigation";

interface ServiceDetailProps {
  service: Service;
  // All optional with English defaults matching the previous hardcoded
  // copy, so any caller that doesn't localize (none today besides
  // ServiceDetailLive, which always does) renders exactly as before. See
  // ServiceDetailLive.tsx for the localized values passed in for tr.
  cta?: NavItem;
  eyebrow?: string;
  backLabel?: string;
  backHref?: string;
  overviewHeading?: string;
  imageLabel?: string;
  whoItsForHeading?: string;
  whatToExpectHeading?: string;
  ctaHeading?: string;
  ctaDescription?: string;
  // Optional real business.whatsapp value — same one Hero already renders
  // on the homepage. Omitted (no number on record) leaves the CTA exactly
  // as it was before this prop existed.
  whatsapp?: string | null;
  whatsappButtonLabel?: string;
  whatsappMessage?: string;
  whatsappAriaLabel?: string;
  // Online booking for this service (the booking flow with it
  // preselected), shown as the page header's primary action. Omitted for
  // services that can't be booked online (see ServiceDetailLive).
  bookingCta?: NavItem & { ariaLabel: string };
}

// Shared template for every /services/[slug] page (README.md §6 calls for a
// consistent structural pattern across dog/cat/mobile grooming pages).
export function ServiceDetail({
  service,
  cta = defaultPrimaryCta,
  eyebrow = "Service",
  backLabel = "← View all services",
  backHref = "/services",
  overviewHeading = "Overview",
  imageLabel = `${service.title} photo coming soon`,
  whoItsForHeading = "Who It's For",
  whatToExpectHeading = "What to Expect",
  ctaHeading = `Ready to book ${service.title}?`,
  ctaDescription = "Call, WhatsApp, or message us on Instagram to set up a visit.",
  whatsapp,
  whatsappButtonLabel,
  whatsappMessage,
  whatsappAriaLabel,
  bookingCta,
}: ServiceDetailProps) {
  return (
    <>
      <PageHeader eyebrow={eyebrow} title={service.title} description={service.shortDescription}>
        {bookingCta && (
          <p className="mt-6">
            <Link
              href={bookingCta.href}
              aria-label={bookingCta.ariaLabel}
              className={buttonVariants({ variant: "primary", size: "lg", className: "w-full sm:w-auto" })}
            >
              {bookingCta.label}
            </Link>
          </p>
        )}
        <p className="mt-4">
          <Link
            href={backHref}
            className="text-[15px] font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          >
            {backLabel}
          </Link>
        </p>
      </PageHeader>

      <FeatureSplit
        heading={overviewHeading}
        description={service.overview}
        image={service.image}
        imageLabel={imageLabel}
        imageAlt={service.title}
        tone="surface"
      />

      <Section tone="muted">
        <Container size="content">
          <Heading level="h2">{whoItsForHeading}</Heading>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {service.whoItsFor.map((item) => (
              <Card key={item} className="flex items-start gap-3 p-4 sm:p-5">
                <CheckIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                <span className="text-[16px] text-foreground">{item}</span>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <ProcessSteps heading={whatToExpectHeading} steps={service.process} tone="background" />

      <CTASection
        heading={ctaHeading}
        description={ctaDescription}
        cta={cta}
        whatsapp={whatsapp}
        whatsappButtonLabel={whatsappButtonLabel}
        whatsappMessage={whatsappMessage}
        whatsappAriaLabel={whatsappAriaLabel}
      />
    </>
  );
}
