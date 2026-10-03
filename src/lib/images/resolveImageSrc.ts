import { createClient } from "@/lib/supabase/client";
import { isManagedImageRef } from "@/lib/images/imagesRepository";

const publicUrlCache = new Map<string, string>();

// Turns a stored image reference into something an <img>/<Image> can
// render: a plain path/URL (e.g. a packaged default like "/brand/logo.jpg")
// is returned as-is; a managed images.id ref is resolved to its Supabase
// Storage public URL. Content records only ever hold the reference string
// — this is the one place that turns a reference into an actual
// displayable URL.
//
// A DB error or a missing row resolves to null rather than throwing, so a
// dangling reference (e.g. an image deleted out from under a stale
// page_content JSONB field, which has no enforced FK) degrades to "no
// image" instead of crashing the page.
export async function resolveImageSrc(ref: string | null | undefined): Promise<string | null> {
  if (!ref) return null;
  if (!isManagedImageRef(ref)) return ref;

  const cached = publicUrlCache.get(ref);
  if (cached) return cached;

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("images")
      .select("storage_bucket, storage_path")
      .eq("id", ref)
      .maybeSingle();
    if (error || !data) return null;

    const { data: publicUrlData } = supabase.storage.from(data.storage_bucket).getPublicUrl(data.storage_path);
    publicUrlCache.set(ref, publicUrlData.publicUrl);
    return publicUrlData.publicUrl;
  } catch {
    return null;
  }
}
