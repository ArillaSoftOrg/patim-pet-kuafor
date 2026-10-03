import type { Metadata } from "next";
import { NotFoundContent } from "@/components/content/NotFoundContent";

// The App Router's not-found convention already makes the response a real
// HTTP 404 — nothing here needs to (or can) change that. This also covers
// /services/[slug]'s own notFound() call, since it renders the nearest
// not-found boundary, which is this file. No `robots` field here: Next
// already injects `<meta name="robots" content="noindex">` automatically
// for any 404 response (verified against actual rendered output) — adding
// one here would just produce a second, redundant robots tag.
//
// `metadata` requires this to stay a Server Component, so the actual
// locale-aware body lives in NotFoundContent (a small Client Component,
// same pattern as FaqPageIntro/PrivacyPageContent) — title stays English,
// same established boundary as every other page's <title>/<meta
// description> across this site.
export const metadata: Metadata = {
  title: "Page Not Found",
};

export default function NotFound() {
  return <NotFoundContent />;
}
