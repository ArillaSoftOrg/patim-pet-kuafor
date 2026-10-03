import { socialImageAlt, socialImageSize } from "@/lib/seo/socialImage";

// Next.js does not deep-merge `openGraph`/`twitter` metadata objects
// between a layout and a page — a page that defines its own object
// replaces the parent's entirely, rather than filling in only the fields
// it specifies. So every page that sets openGraph/twitter must spread
// these back in, or og:site_name/og:type/twitter:card silently disappear
// on that page (verified against actual rendered <head> output, not just
// docs).
export const OG_SITE_DEFAULTS = {
  type: "website" as const,
  siteName: "KulaPAWS",
};

export const TWITTER_CARD = "summary_large_image" as const;

// Same reason as above: opengraph-image.tsx/twitter-image.tsx only
// auto-attach to a page that has no page-level openGraph/twitter object of
// its own (verified — e.g. /products, which sets neither, gets the image
// for free) or that lives in the exact same route segment as the image
// file (the home page). Every other page that defines its own
// openGraph/twitter must reference the image explicitly, with the same
// dimensions/alt the generated image actually has.
export const OG_IMAGE = {
  url: "/opengraph-image",
  width: socialImageSize.width,
  height: socialImageSize.height,
  alt: socialImageAlt,
  type: "image/png",
};

export const TWITTER_IMAGE = {
  url: "/twitter-image",
  width: socialImageSize.width,
  height: socialImageSize.height,
  alt: socialImageAlt,
  type: "image/png",
};
