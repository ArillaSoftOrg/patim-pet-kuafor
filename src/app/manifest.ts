import type { MetadataRoute } from "next";

// Truthful, not a PWA pitch: no service worker, no offline support, no
// install prompt beyond what a browser offers any site with a manifest.
// `display: "browser"` says exactly that — a normal site, not an app-like
// standalone experience. icons/theme colors mirror the real, existing
// brand assets (public/brand/logo.jpg via src/app/icon.jpg) and design
// tokens (src/app/globals.css) — nothing invented.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "KulaPAWS",
    short_name: "KulaPAWS",
    description: "Mobile pet grooming and pet-care products.",
    start_url: "/",
    display: "browser",
    background_color: "#fff9f4",
    theme_color: "#a83e68",
    icons: [
      {
        src: "/icon.jpg",
        sizes: "150x150",
        type: "image/jpeg",
      },
    ],
  };
}
