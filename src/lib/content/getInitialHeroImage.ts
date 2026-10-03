import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/publicClient";
import { resolveImageSrcServer } from "@/lib/images/resolveImageSrcServer";
import { homepage as defaultHomepage } from "@/data/homepage";

// The hero image is the homepage's LCP candidate, but HomeContent (a
// Client Component, for its live cross-tab admin-edit behavior) only
// discovered it via a post-mount effect — so the browser couldn't even
// start fetching the real photo until after hydration. This resolves just
// that one field server-side (not the full homepage content — that stays
// on the existing client live-fetch path) so the Server Component page
// can hand HomeContent a real initial src for SSR/first paint.
//
// Reads page_content directly (rather than going through
// homepageRepository, which uses the cookie-carrying browser client) via
// the same cookie-free anon client used elsewhere for public reads —
// page_content_public_select already scopes this to what's actually
// public, no service-role key. A DB miss or error falls back to the
// shipped static default's image ref, mirroring homepageRepository's own
// fallback behavior.
export const getInitialHeroImage = cache(async (): Promise<string | null> => {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("page_content")
      .select("content")
      .eq("key", "homepage")
      .maybeSingle();

    if (error || !data) {
      return resolveImageSrcServer(defaultHomepage.hero.image);
    }

    const content = data.content as { hero?: { image?: string | null } } | null;
    const heroImageRef = content?.hero?.image ?? defaultHomepage.hero.image;
    return resolveImageSrcServer(heroImageRef);
  } catch {
    return resolveImageSrcServer(defaultHomepage.hero.image);
  }
});
