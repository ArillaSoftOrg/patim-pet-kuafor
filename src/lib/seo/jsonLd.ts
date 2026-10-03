import { getSiteUrl } from "@/lib/seo/siteUrl";
import type { Business } from "@/data/business";

// Stable id for the one business entity every page can reference —
// Service JSON-LD's `provider` points at this instead of repeating the
// business's data in every node (see buildServiceJsonLd below).
export function organizationJsonLdId(): string {
  return `${getSiteUrl()}/#organization`;
}

// Organization, not LocalBusiness: Kulapaws is a mobile/service-area
// business with no address customers visit, and Google's LocalBusiness
// rich-result eligibility requires `address` — a business genuinely
// without one shouldn't claim that type just to get areaServed-style
// semantics. Organization supports telephone/logo/sameAs/areaServed too,
// without implying a claim this business can't back up. No `address`,
// `geo`, `openingHours`, `priceRange`, or ratings/review properties, full
// stop — none of that is real, confirmed data.
//
// Takes the resolved business data as a parameter rather than importing
// src/data/business.ts directly, so the caller decides where it comes
// from — see src/lib/content/getBusinessDataServer.ts, which resolves
// this from Supabase (falling back to the static default only on an
// actual query failure), keeping this JSON-LD and the visible page
// (LiveContactDetails, footer, homepage service areas) reading from the
// same source of truth instead of two that can silently drift apart.
export function buildOrganizationJsonLd(businessData: Business) {
  const siteUrl = getSiteUrl();
  const instagram = businessData.socialLinks.find((link) => link.platform === "Instagram");

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": organizationJsonLdId(),
    name: businessData.name,
    url: siteUrl,
    logo: `${siteUrl}${businessData.logoSrc}`,
    description: "Mobile dog and cat grooming serving Antalya and the surrounding coastal towns.",
    ...(businessData.phone ? { telephone: businessData.phone } : {}),
    ...(instagram ? { sameAs: [instagram.url] } : {}),
    ...(businessData.serviceAreas.length > 0
      ? { areaServed: businessData.serviceAreas.map((area) => ({ "@type": "Place", name: area })) }
      : {}),
  };
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export function buildBreadcrumbList(items: BreadcrumbItem[]) {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`,
    })),
  };
}

export interface ServiceJsonLdInput {
  name: string;
  description: string;
  path: string;
}

// Only fields backed by real, confirmed data: name/description come from
// the same live-resolved service record as the page's own metadata. No
// price, offers, ratings, reviews, address, service area, or opening
// hours on the Service node itself — `provider` is a bare @id reference
// to the one Organization node (buildOrganizationJsonLd, rendered
// site-wide from the root layout) rather than repeating business data in
// every Service — a bare `{"@id": ...}` is a complete, valid JSON-LD node
// reference on its own, so no name/type duplication is needed here.
export function buildServiceJsonLd({ name, description, path }: ServiceJsonLdInput) {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: `${siteUrl}${path}`,
    provider: { "@id": organizationJsonLdId() },
  };
}
