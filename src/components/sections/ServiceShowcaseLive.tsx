"use client";

import { useCallback, useEffect, useState } from "react";
import { StackingServiceCards } from "@/components/sections/ServiceShowcase";
import type { ServiceShowcaseItem } from "@/components/sections/ServiceShowcase";
import { servicesRepository, SERVICES_SYNC_PING_KEY } from "@/lib/content/servicesRepository";
import { useLiveContent } from "@/lib/content/useLiveContent";
import { resolveImageSrc } from "@/lib/images/resolveImageSrc";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import type { Service } from "@/data/services";

const STORAGE_KEYS = [SERVICES_SYNC_PING_KEY];

interface ServiceShowcaseLiveProps {
  defaultServices: Service[];
}

function toShowcaseItem(service: Service, index: number, image: string): ServiceShowcaseItem {
  return {
    number: String(index + 1).padStart(2, "0"),
    title: service.title,
    description: service.shortDescription,
    bullets: service.whoItsFor,
    image,
    imageAlt: service.title,
    slug: service.slug,
  };
}

// The standalone /services page's service list, in the same stacking-card
// interaction as the homepage's ServiceShowcase (StackingServiceCards is
// the exact same, unmodified piece — see that file) — replacing the plain
// grid ServiceGridLive rendered before. Unlike the homepage's hand-curated
// showcase (fixed /public photos, editorial bullets), this is fed by the
// live, admin-editable service list — the same source ServiceGridLive
// used, so /services always reflects whatever /admin/services currently
// has, including a real admin-uploaded photo.
export function ServiceShowcaseLive({ defaultServices }: ServiceShowcaseLiveProps) {
  const { locale, dictionary } = useLocale();
  const fetchResolved = useCallback(() => servicesRepository.listResolved(locale), [locale]);
  const services = useLiveContent(defaultServices, fetchResolved, STORAGE_KEYS);

  // Seeded synchronously from whatever `services` already is — on first
  // paint that's `defaultServices`, every shipped default's `image` a
  // plain /public path (see src/data/services.ts), so something real
  // renders immediately with no async round trip or empty-state flash.
  // Only a genuinely managed image ref (an admin-uploaded photo, a
  // Supabase images.id) needs the resolveImageSrc() below to become a
  // displayable URL.
  const [items, setItems] = useState<ServiceShowcaseItem[]>(() =>
    defaultServices.map((service, index) => toShowcaseItem(service, index, service.image ?? "")),
  );

  useEffect(() => {
    let active = true;
    Promise.all(services.map((service) => resolveImageSrc(service.image))).then((images) => {
      if (!active) return;
      const resolved = services
        .map((service, index) => ({ service, index, image: images[index] }))
        .filter((entry): entry is { service: Service; index: number; image: string } => Boolean(entry.image))
        .map(({ service, index, image }) => toShowcaseItem(service, index, image));
      setItems(resolved);
    });
    return () => {
      active = false;
    };
  }, [services]);

  return <StackingServiceCards items={items} viewDetailsLabel={dictionary.shared.viewServiceDetails} locale={locale} />;
}
