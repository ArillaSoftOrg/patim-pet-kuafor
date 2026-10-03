import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo/siteUrl";

// robots.txt is not security — it's a request crawlers can ignore, and
// disallowing /admin here would stop well-behaved crawlers from ever
// fetching it, which means they'd never see its noindex directive
// (src/app/admin/layout.tsx) or get redirected to /admin/login. Real
// protection is Supabase Auth + the is_admin() authorization check
// (src/proxy.ts, src/app/admin/(protected)/layout.tsx), unaffected by
// this file. Public crawling stays fully allowed; noindex on /admin and
// /products is what actually keeps them out of results. /privacy, /kvkk
// and /cookies are real, finished pages and are deliberately indexable.
export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
