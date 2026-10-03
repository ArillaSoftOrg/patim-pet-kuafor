import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/publicClient";
import { isManagedImageRef } from "@/lib/images/imagesRepository";

// Server-side counterpart to resolveImageSrc.ts (which uses the browser
// client, for client components' own live-refresh). Same anon-key,
// RLS-gated read (images_public_select, USING (true)) — no service-role
// key. Wrapped in cache() so multiple callers within one request/build
// resolve the same ref only once. Exists to give a Server Component the
// real image URL for its first paint, instead of leaving that discovery
// entirely to a post-hydration client effect.
export const resolveImageSrcServer = cache(async (ref: string | null | undefined): Promise<string | null> => {
  if (!ref) return null;
  if (!isManagedImageRef(ref)) return ref;

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("images")
      .select("storage_bucket, storage_path")
      .eq("id", ref)
      .maybeSingle();
    if (error || !data) return null;

    const { data: publicUrlData } = supabase.storage.from(data.storage_bucket).getPublicUrl(data.storage_path);
    return publicUrlData.publicUrl;
  } catch {
    return null;
  }
});
