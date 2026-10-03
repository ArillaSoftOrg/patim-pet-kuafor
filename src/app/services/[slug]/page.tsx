import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import { getServiceBySlug, services as defaultServices } from "@/data/services";
import { ServiceDetailLive } from "@/components/sections/ServiceDetailLive";
import { createPublicClient } from "@/lib/supabase/publicClient";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbList, buildServiceJsonLd } from "@/lib/seo/jsonLd";
import { OG_IMAGE, OG_SITE_DEFAULTS, TWITTER_CARD, TWITTER_IMAGE } from "@/lib/seo/socialDefaults";

export function generateStaticParams() {
  return defaultServices.map((service) => ({ slug: service.slug }));
}

interface ServiceSlugPageProps {
  params: Promise<{ slug: string }>;
}

interface ServiceMetadataFields {
  title: string;
  shortDescription: string;
}

function canonicalPath(slug: string): string {
  return `/services/${encodeURIComponent(slug)}`;
}

function staticFallback(slug: string): ServiceMetadataFields | null {
  const staticService = getServiceBySlug(slug);
  return staticService ? { title: staticService.title, shortDescription: staticService.shortDescription } : null;
}

// Shared by generateMetadata and the page component so both agree on
// whether a slug is valid — wrapped in React's cache() so, within a single
// request, they resolve to one Supabase call instead of two. Reflects
// what's actually live and publicly visible, including services created in
// /admin that never shipped as static defaults. Reads through the
// cookie-free anon-key client, so services_public_select
// (is_published = true) is what actually decides what this can see — same
// RLS boundary the public page itself uses, no service-role key involved.
//
// Supabase is the source of truth for publication state: a successful
// query that finds no row means unpublished/nonexistent, full stop — it
// does NOT fall through to the static defaults, or an admin unpublishing
// (or deleting) a shipped default service would keep resurrecting it from
// the static fallback. The static fallback exists ONLY for when the
// Supabase request itself fails (network/config error) — resilience for
// an outage, not a second source of truth for what's published.
const resolveServiceMetadata = cache(async (slug: string): Promise<ServiceMetadataFields | null> => {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("services")
      .select("title, short_description")
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      console.error(
        `resolveServiceMetadata: Supabase lookup failed for service "${slug}", falling back to static defaults:`,
        error.message,
      );
      return staticFallback(slug);
    }

    return data ? { title: data.title, shortDescription: data.short_description } : null;
  } catch (err) {
    console.error(
      `resolveServiceMetadata: Supabase client failed for service "${slug}", falling back to static defaults:`,
      err,
    );
    return staticFallback(slug);
  }
});

// Next still calls generateMetadata for a slug the page will 404 on (it
// runs independently, before the page's own notFound() check), so this
// keeps a plausible fallback for that transient case rather than assuming
// it's unreachable — the page component below is what actually decides
// the response status.
export async function generateMetadata({ params }: ServiceSlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  const canonical = canonicalPath(slug);
  const service = await resolveServiceMetadata(slug);

  if (!service) {
    return {
      title: "Service Not Found",
      description: "This service may have been removed, or the link is incorrect.",
      alternates: { canonical },
    };
  }

  return {
    title: service.title,
    description: service.shortDescription,
    alternates: { canonical },
    openGraph: {
      ...OG_SITE_DEFAULTS,
      title: service.title,
      description: service.shortDescription,
      url: canonical,
      images: [OG_IMAGE],
    },
    twitter: {
      card: TWITTER_CARD,
      title: service.title,
      description: service.shortDescription,
      images: [TWITTER_IMAGE],
    },
  };
}

export default async function ServiceSlugPage({ params }: ServiceSlugPageProps) {
  const { slug } = await params;
  const resolved = await resolveServiceMetadata(slug);

  if (!resolved) {
    notFound();
  }

  const staticService = getServiceBySlug(slug) ?? null;
  // The visible page body (overview/whoItsFor/process/image) still comes
  // entirely from ServiceDetailLive's own client-side fetch, unchanged —
  // rebuilding that per the same tradeoffs already weighed in the
  // Performance phase (it would trade away live cross-tab sync for a
  // gain that only matters between a Supabase edit and the next
  // rebuild). But `resolved` (title/shortDescription) is already
  // server-verified here — the same value generateMetadata and this
  // page's own JSON-LD use — so seeding ServiceDetailLive's initial
  // paint with it, instead of the plain static file, costs nothing extra
  // (same cached Supabase call) and guarantees the H1/description a
  // crawler sees on first paint always matches the metadata/JSON-LD,
  // even if a static default were ever stale relative to Supabase.
  const defaultService = staticService ? { ...staticService, ...resolved } : null;
  const path = canonicalPath(slug);

  return (
    <>
      <JsonLd
        data={buildBreadcrumbList([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: resolved.title, path },
        ])}
      />
      <JsonLd
        data={buildServiceJsonLd({ name: resolved.title, description: resolved.shortDescription, path })}
      />
      <ServiceDetailLive slug={slug} defaultService={defaultService} />
    </>
  );
}
