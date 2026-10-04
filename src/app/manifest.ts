import type { MetadataRoute } from "next";

// Truthful, not a PWA pitch: no service worker, no offline support, no
// install prompt beyond what a browser offers any site with a manifest.
// `display: "browser"` says exactly that — a normal site, not an app-like
// standalone experience. icons/theme colors mirror the real, existing
// brand assets (public/brand/logo.png via src/app/icon.jpg) and design
// tokens (src/app/globals.css) — nothing invented.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Patim Pet Kuaför",
    short_name: "Patim Pet",
    description: "Dog grooming salon in Çukurova, Adana.",
    start_url: "/",
    display: "browser",
    background_color: "#fdf8f2",
    theme_color: "#3c1704",
    icons: [
      {
        src: "/icon.jpg",
        sizes: "512x512",
        type: "image/jpeg",
      },
    ],
  };
}
