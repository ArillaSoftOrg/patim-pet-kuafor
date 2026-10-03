const LOCAL_DEV_SITE_URL = "http://localhost:3000";

function normalizeOrigin(rawUrl: string): string {
  const parsed = new URL(rawUrl);
  return `${parsed.protocol}//${parsed.host}`;
}

/**
 * Resolves the site's canonical origin (no trailing slash) from SITE_URL.
 * Falls back to localhost only outside production; production must set
 * SITE_URL explicitly once a real domain exists, or this throws.
 */
export function getSiteUrl(): string {
  const rawUrl = process.env.SITE_URL;

  if (!rawUrl) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "SITE_URL is not set. Configure it as an environment variable before building for production."
      );
    }
    return LOCAL_DEV_SITE_URL;
  }

  return normalizeOrigin(rawUrl);
}
