import { ImageResponse } from "next/og";
import { renderSocialImageElement, socialImageAlt, socialImageSize } from "@/lib/seo/socialImage";

// Reads the packaged logo from disk, so this needs the Node.js runtime
// (Edge has no fs access).
export const runtime = "nodejs";
export const size = socialImageSize;
export const alt = socialImageAlt;
export const contentType = "image/png";

// Applies to every route by default (Next.js file convention) unless a
// route defines its own — one reusable image, not one per page.
export default async function Image() {
  return new ImageResponse(await renderSocialImageElement(), size);
}
