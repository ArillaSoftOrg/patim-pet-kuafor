import { getSiteUrl } from "@/lib/seo/siteUrl";
import type { Business } from "@/data/business";

// Stable id for the one business entity every page can reference —
// Service JSON-LD's `provider` points at this instead of repeating the
// business's data in every node (see buildServiceJsonLd below).
export function organizationJsonLdId(): string {
  return `${getSiteUrl()}/#organization`;
}

// LocalBusiness, not bare Organization: Patim Pet Kuaför is a real
// storefront salon with a confirmed, visitable address (Google Business
// Profile, Çukurova/Adana), which is exactly what LocalBusiness's
// rich-result eligibility is for — unlike a service-area-only business
// with nothing customers visit, claiming this type here is backed by a
// real, confirmed fact. Still no `geo`, `openingHours`, `priceRange`, or
// ratings/review properties — none of those are confirmed structured
// data (the 4.3-star/17-review rating is real but only verified via
// Google's own listing, not independently confirmable here, so it isn't
// asserted as aggregateRating).
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
    "@type": "LocalBusiness",
    "@id": organizationJsonLdId(),
    name: businessData.name,
    url: siteUrl,
    logo: `${siteUrl}${businessData.logoSrc}`,
    description: "Dog grooming salon in Çukurova, Adana.",
    ...(businessData.phone ? { telephone: businessData.phone } : {}),
    ...(businessData.address ? { address: businessData.address } : {}),
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
