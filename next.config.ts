import type { NextConfig } from "next";

// Derived from the env var rather than hardcoded, so this works against
// whichever Supabase project is configured without ever needing the actual
// project URL pasted into source. Admin-uploaded images resolve to
// Supabase Storage public URLs (see resolveImageSrc) — next/image requires
// remote hosts to be allow-listed, or every one of them would silently
// fail to load.
const supabaseHostname = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: supabaseHostname
      ? [
          {
            protocol: "https",
            hostname: supabaseHostname,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
  },
};

export default nextConfig;
