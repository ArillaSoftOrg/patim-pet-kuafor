"use client";

import { useCallback, useEffect, useState } from "react";
import { ServiceDetail } from "@/components/sections/ServiceDetail";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { servicesRepository, SERVICES_SYNC_PING_KEY } from "@/lib/content/servicesRepository";
import { businessRepository, BUSINESS_SYNC_PING_KEY } from "@/lib/content/businessRepository";
import { useLiveContent } from "@/lib/content/useLiveContent";
import { resolveImageSrc } from "@/lib/images/resolveImageSrc";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { navHref, navLabel } from "@/lib/i18n/navLabels";
import { buildLocalizedPath } from "@/lib/i18n/pathLocale";
import { primaryCta } from "@/data/navigation";
import { business as defaultBusiness } from "@/data/business";
import { appointmentHref } from "@/lib/appointments/links";
import { isServiceBookable } from "@/lib/appointments/pricing";
import type { Service } from "@/data/services";

const STORAGE_KEYS = [SERVICES_SYNC_PING_KEY];
const BUSINESS_STORAGE_KEYS = [BUSINESS_SYNC_PING_KEY];

interface ServiceDetailLiveProps {
  slug: string;
  defaultService: Service | null;
}

// The server only knows about the static default services at request time,
// so an admin-created service slug renders as "not found" until this
// effect resolves and fetches the live list from Supabase. Existing
// default services render immediately from `defaultService` (no flash) and
// are only replaced if the Supabase row differs from the shipped default.
//
// Locale resolution goes through servicesRepository.getResolvedBySlug —
// the SAME resolver ServiceGridLive/ServiceCard use — rather than this
// component doing its own separate tr/ru lookup. That matters for the
// image specifically: services.tr.ts/services.ru.ts ship `image: null` on
// every entry (there is no translated photo, only translated text — see
// that file), and getResolvedBySlug's merge (servicesRepository.ts's
// withStaticTranslation) only overlays the translatable *text* fields,
// always keeping the live row's real image. An earlier version of this
// component instead swapped in the whole static tr/ru object on a match,
// which replaced a real photo with `image: null` on every /tr and /ru
// service detail page — this is that fix.
export function ServiceDetailLive({ slug, defaultService }: ServiceDetailLiveProps) {
  const { locale, dictionary } = useLocale();
  const fetchResolved = useCallback(() => servicesRepository.getResolvedBySlug(slug, locale), [slug, locale]);
  const match = useLiveContent<Service | null>(defaultService, fetchResolved, STORAGE_KEYS);
  const [resolvedImage, setResolvedImage] = useState<string | null>(defaultService?.image ?? null);
  const business = useLiveContent(defaultBusiness, businessRepository.get, BUSINESS_STORAGE_KEYS);

  useEffect(() => {
    if (!match) return;
    let active = true;
    resolveImageSrc(match.image).then((src) => {
      if (active) setResolvedImage(src);
    });
    return () => {
      active = false;
    };
  }, [match]);

  if (!match) {
    return (
      <Section tone="background">
        <Container size="narrow">
          <EmptyState
            title={dictionary.shared.serviceNotFoundTitle}
            description={dictionary.shared.serviceNotFoundDescription}
          />
        </Container>
      </Section>
    );
  }

  // Services with configured pricing can be booked online, straight into
  // the booking flow with this service preselected. Others (e.g. created in
  // /admin/services but not yet priced) keep the contact route.
  const bookingCta = isServiceBookable(match.slug)
    ? {
        label: navLabel(dictionary, primaryCta),
        href: appointmentHref(match.slug, navHref(locale, primaryCta)),
        ariaLabel: dictionary.shared.bookServiceAriaTemplate.replace("{name}", match.title),
      }
    : undefined;

  return (
    <ServiceDetail
      service={{ ...match, image: resolvedImage }}
      bookingCta={bookingCta}
      cta={bookingCta ?? { label: dictionary.shared.contactUs, href: buildLocalizedPath(locale, "/contact") }}
      eyebrow={dictionary.shared.serviceEyebrow}
      backLabel={dictionary.shared.backToServices}
      backHref={buildLocalizedPath(locale, "/services")}
      overviewHeading={dictionary.shared.overview}
      imageLabel={
        locale === "tr"
          ? `${match.title} fotoğrafı yakında`
          : locale === "ru"
            ? `Фото «${match.title}» появится позже`
            : `${match.title} photo coming soon`
      }
      whoItsForHeading={dictionary.shared.whoItsFor}
      whatToExpectHeading={dictionary.shared.whatToExpect}
      ctaHeading={
        locale === "tr"
          ? `${match.title} randevusu almaya hazır mısınız?`
          : locale === "ru"
            ? `Готовы записаться на услугу «${match.title}»?`
            : `Ready to book ${match.title}?`
      }
      ctaDescription={
        bookingCta ? dictionary.shared.serviceBookingCtaDescription : dictionary.shared.serviceCtaDescription
      }
      whatsapp={business.whatsapp}
      whatsappButtonLabel={dictionary.shared.whatsapp}
      whatsappMessage={
        locale === "tr"
          ? `Merhaba! ${match.title} hakkında bilgi almak istiyorum.`
          : locale === "ru"
            ? `Здравствуйте! Хочу узнать подробнее об услуге «${match.title}».`
            : `Hi! I'd like to ask about ${match.title}.`
      }
      whatsappAriaLabel={
        locale === "tr"
          ? "KulaPAWS'a WhatsApp'tan yazın (yeni sekmede açılır)"
          : locale === "ru"
            ? "Написать KulaPAWS в WhatsApp (откроется в новой вкладке)"
            : "Message KulaPAWS on WhatsApp (opens in a new tab)"
      }
    />
  );
}
