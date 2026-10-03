// Renders the exact same page as the unprefixed "/" route — no content
// duplication, no drift. Metadata (including its canonical "/") is
// deliberately unchanged: until tr/ru have real translated content, /tr
// and /ru pages canonicalize to their English equivalent rather than
// being indexed as separate (currently identical) pages.
export { default, metadata } from "@/app/page";

// Route segment config (unlike `default`/`metadata`) must be declared
// literally in this file — Next statically parses it at build time and
// rejects a re-exported value. Same 60s ISR window as "/", see
// app/page.tsx and app/layout.tsx for why.
export const revalidate = 60;
