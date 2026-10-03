"use client";

import type { ReactElement } from "react";
import { businessRepository, BUSINESS_SYNC_PING_KEY } from "@/lib/content/businessRepository";
import { useLiveContent } from "@/lib/content/useLiveContent";
import { buildTelHref, buildWhatsAppHref } from "@/lib/business/contactLinks";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import type { Business } from "@/data/business";

const STORAGE_KEYS = [BUSINESS_SYNC_PING_KEY];

const linkClassName =
  "inline-flex items-center gap-2 text-[15px] text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm";

type IconProps = { className?: string };

function PhoneIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24c1.1.36 2.3.56 3.5.56a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.6 21 3 13.4 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.2.2 2.4.56 3.5a1 1 0 0 1-.24 1.06L6.6 10.8Z" />
    </svg>
  );
}

function WhatsAppIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.86 9.86 0 0 0 12.04 2Zm0 1.67c2.19 0 4.25.85 5.8 2.4a8.16 8.16 0 0 1 2.4 5.8c0 4.53-3.68 8.21-8.21 8.21a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.12.82.83-3.04-.2-.31a8.18 8.18 0 0 1-1.26-4.36c0-4.53 3.69-8.2 8.24-8.2Zm-4.53 4.3c-.16 0-.42.06-.64.3-.22.24-.85.83-.85 2.02 0 1.19.87 2.34.99 2.5.12.16 1.7 2.6 4.13 3.64.58.25 1.03.4 1.38.51.58.19 1.11.16 1.53.1.47-.07 1.43-.58 1.63-1.15.2-.56.2-1.04.14-1.15-.06-.1-.22-.16-.46-.28-.24-.12-1.43-.71-1.65-.79-.22-.08-.38-.12-.55.12-.16.24-.63.79-.77.95-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.34-.76-1.83-.2-.48-.4-.42-.55-.42Z" />
    </svg>
  );
}

interface ContactItem {
  key: string;
  href: string;
  label: string;
  external: boolean;
  Icon: (props: IconProps) => ReactElement;
}

// Phone, WhatsApp, and Instagram as icon+label links — the footer's full
// contact scope (service areas and other business details stay on
// /contact only). Always a left-aligned, tight vertical list — this is
// column 3 of the footer's 3-column layout on desktop (see Footer.tsx),
// and the 3rd stacked block on mobile.
export function LiveFooterContact({ defaultBusiness }: { defaultBusiness: Business }) {
  const { dictionary } = useLocale();
  const business = useLiveContent(defaultBusiness, businessRepository.get, STORAGE_KEYS);
  const instagram = business.socialLinks.find((link) => link.platform === "Instagram");

  const items = [
    business.phone && {
      key: "phone",
      href: buildTelHref(business.phone),
      label: business.phone,
      external: false,
      Icon: PhoneIcon,
    },
    business.whatsapp && {
      key: "whatsapp",
      href: buildWhatsAppHref(business.whatsapp, dictionary.shared.whatsappContact.message),
      label: dictionary.shared.whatsapp,
      external: true,
      Icon: WhatsAppIcon,
    },
    instagram && {
      key: "instagram",
      href: instagram.url,
      label: dictionary.shared.contactDetails.instagram,
      external: true,
      Icon: InstagramIcon,
    },
  ].filter((item): item is ContactItem => Boolean(item));

  if (items.length === 0) return null;

  return (
    <div className="flex flex-col items-start gap-2">
      {items.map(({ key, href, label, external, Icon }) => (
        <a
          key={key}
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          className={linkClassName}
        >
          <Icon className="h-4 w-4 flex-shrink-0" />
          {label}
        </a>
      ))}
    </div>
  );
}
