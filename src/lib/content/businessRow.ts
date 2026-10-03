import { business as defaultBusiness } from "@/data/business";
import type { Business, SocialLink } from "@/data/business";

// Shared by businessRepository.ts (browser client, for the public page's
// own live-refresh after hydration) and getBusinessDataServer.ts (server,
// cookie-free client, for JSON-LD) — one conversion, so the two can never
// drift into disagreeing about what a business row means.
export interface BusinessRow {
  name: string;
  tagline: string | null;
  phone: string | null;
  email: string | null;
  whatsapp: string | null;
  address: string | null;
  service_areas: string[] | null;
  business_hours: string | null;
  social_links: SocialLink[] | null;
  logo_image_id: string | null;
}

// logo_image_id null means "use the packaged default logo asset"; a real
// value is a public.images.id, resolved to an actual URL downstream by
// resolveImageSrc/resolveImageSrcServer — logoSrc itself stays a raw ref
// either way.
export function rowToBusiness(row: BusinessRow): Business {
  return {
    name: row.name,
    tagline: row.tagline,
    phone: row.phone,
    email: row.email,
    whatsapp: row.whatsapp,
    address: row.address,
    serviceAreas: row.service_areas ?? [],
    businessHours: row.business_hours,
    socialLinks: row.social_links ?? [],
    logoSrc: row.logo_image_id ?? defaultBusiness.logoSrc,
  };
}
