"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { LiveContactDetails } from "@/components/content/LiveContactDetails";
import { contactPageRepository, CONTACT_PAGE_SYNC_PING_KEY } from "@/lib/content/contactPageRepository";
import { useLiveContent } from "@/lib/content/useLiveContent";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { useLocalizedValue } from "@/lib/i18n/useLocalizedValue";
import { contactPageTr } from "@/lib/i18n/content/contactPage.tr";
import { contactPageRu } from "@/lib/i18n/content/contactPage.ru";
import type { ContactPageContent } from "@/data/contactPage";
import type { Business } from "@/data/business";

const STORAGE_KEYS = [CONTACT_PAGE_SYNC_PING_KEY];

interface ContactContentProps {
  defaultContactPage: ContactPageContent;
  defaultBusiness: Business;
}

export function ContactContent({ defaultContactPage, defaultBusiness }: ContactContentProps) {
  const { dictionary } = useLocale();
  // Turkish and Russian both bypass the Supabase-backed live content
  // (page_content has no locale dimension) and use their static
  // translation instead — see contactPage.tr.ts / contactPage.ru.ts.
  const liveContent = useLiveContent(defaultContactPage, contactPageRepository.get, STORAGE_KEYS);
  const content = useLocalizedValue(liveContent, contactPageTr, contactPageRu);

  return (
    <>
      <PageHeader title={content.title} description={content.description} />

      <Section tone="background">
        <Container size="content" className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-16">
          <Card className="flex flex-col gap-6">
            <Heading level="h3">{dictionary.shared.contactDetails.heading}</Heading>
            <LiveContactDetails defaultBusiness={defaultBusiness} />
          </Card>

          <div className="flex flex-col gap-6">
            <Heading level="h3">{dictionary.shared.contactForm.heading}</Heading>

            <div
              id="contact-form-note"
              role="status"
              className="flex items-start gap-3 rounded-lg border border-warning/30 bg-warning/10 px-4 py-3 text-warning"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.6}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="mt-0.5 h-5 w-5 flex-shrink-0"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 11v5" />
                <circle cx="12" cy="8" r="0.5" fill="currentColor" stroke="none" />
              </svg>
              <p className="text-[14px] leading-snug">
                <span className="block font-semibold">{dictionary.shared.contactForm.unavailableTitle}</span>
                {dictionary.shared.contactForm.disclaimer}
              </p>
            </div>

            <form aria-describedby="contact-form-note">
              <fieldset disabled className="flex flex-col gap-5">
                <legend className="sr-only">{dictionary.shared.contactForm.heading}</legend>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-[14px] font-medium text-foreground">
                      {dictionary.shared.contactForm.name} <span aria-hidden="true">*</span>
                    </label>
                    <Input id="name" name="name" type="text" autoComplete="name" required />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-[14px] font-medium text-foreground">
                      {dictionary.shared.contactForm.email} <span aria-hidden="true">*</span>
                    </label>
                    <Input id="email" name="email" type="email" autoComplete="email" required />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="phone" className="text-[14px] font-medium text-foreground">
                    {dictionary.shared.contactForm.phoneOptional}
                  </label>
                  <Input id="phone" name="phone" type="tel" autoComplete="tel" />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className="text-[14px] font-medium text-foreground">
                    {dictionary.shared.contactForm.message} <span aria-hidden="true">*</span>
                  </label>
                  <Textarea id="message" name="message" required />
                </div>

                <div>
                  <Button type="submit" disabled>
                    {dictionary.shared.contactForm.send}
                  </Button>
                </div>
              </fieldset>
            </form>
          </div>
        </Container>
      </Section>
    </>
  );
}
