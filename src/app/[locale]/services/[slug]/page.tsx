// See app/[locale]/page.tsx for why this re-exports rather than duplicates.
// generateStaticParams here supplies `slug`; the parent [locale]/layout.tsx
// supplies `locale` — Next composes the two independently, so every
// (locale, slug) combination is still statically generated.
export { default, generateMetadata, generateStaticParams } from "@/app/services/[slug]/page";
