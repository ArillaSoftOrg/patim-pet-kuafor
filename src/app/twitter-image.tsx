import { ImageResponse } from "next/og";
import { renderSocialImageElement, socialImageAlt, socialImageSize } from "@/lib/seo/socialImage";

// Same image as opengraph-image.tsx (see src/lib/seo/socialImage.tsx) —
// Twitter's summary_large_image card uses the same 1200x630 asset rather
// than a second, separately maintained image.
export const runtime = "nodejs";
export const size = socialImageSize;
export const alt = socialImageAlt;
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(await renderSocialImageElement(), size);
}
