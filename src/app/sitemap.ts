import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo/siteUrl";
import { createPublicClient } from "@/lib/supabase/publicClient";
import { services as defaultServices } from "@/data/services";

// sitemap.ts is its own route segment — it isn't nested under
// src/app/layout.tsx, so that file's `revalidate` doesn't cover this one;
// it needs its own copy of the same literal. Without it, getServiceSlugs'
// Supabase read would be cached indefinitely (see layout.tsx for the full
// explanation of why and how this was verified) — an admin publishing or
// unpublishing a service could go unreflected in the sitemap for an
// unbounded number of deploys. Same 60s policy as layout.tsx/page.tsx.
export const revalidate = 60;

// services_public_select (is_published = true) already restricts this to
// exactly the published rows — same anon-key, RLS-gated read used by
// generateMetadata for /services/[slug], no service-role key. Only an
// actual Supabase error/exception falls back to the shipped static
// slugs; an empty (but successful) result is a real state — e.g. every
// service unpublished — and is left as-is rather than papered over.
async function getServiceSlugs(): Promise<string[]> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase.from("services").select("slug");

    if (error) {
      console.error("sitemap: Supabase services lookup failed, falling back to static defaults:", error.message);
      return defaultServices.map((service) => service.slug);
    }

    return (data ?? []).map((row) => row.slug as string);
  } catch (err) {
    console.error("sitemap: Supabase client failed, falling back to static defaults:", err);
    return defaultServices.map((service) => service.slug);
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const serviceSlugs = Array.from(new Set(await getServiceSlugs()));

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/services`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/appointment`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/about`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${siteUrl}/faq`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/contact`, changeFrequency: "yearly", priority: 0.5 },
  ];

  const serviceRoutes: MetadataRoute.Sitemap = serviceSlugs.map((slug) => ({
    url: `${siteUrl}/services/${encodeURIComponent(slug)}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...serviceRoutes];
}
