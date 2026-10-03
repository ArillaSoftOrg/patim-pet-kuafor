import { createClient } from "@/lib/supabase/client";

export const SITE_IMAGES_BUCKET = "site-images";

// Mirrors the bucket's own allowed_mime_types/file_size_limit
// (supabase/migrations/20260906170000_storage_site_images.sql) — validated
// here too so a rejected upload fails fast with a clear message instead of
// a round trip to Storage, and so any future caller of uploadImage() gets
// the same guarantee without depending on UI-layer checks.
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
export const MAX_IMAGE_SIZE_BYTES = 8 * 1024 * 1024;

const EXTENSIONS_BY_MIME_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// A managed image ref is always a real public.images.id (a uuid). Anything
// else — a packaged default path like "/brand/logo.jpg", or null/undefined
// — is a static asset this module doesn't own, and is returned/passed
// through unchanged by callers.
export function isManagedImageRef(value: string | null | undefined): value is string {
  return typeof value === "string" && UUID_PATTERN.test(value);
}

interface ImageRow {
  storage_bucket: string;
  storage_path: string;
}

// Uploads bytes to Storage at a brand-new, immutable uuid-based path —
// never reused, never overwritten, which is what avoids a CDN serving
// stale bytes after a replace — and records the public.images metadata row
// that makes it referenceable. Returns the new images.id; callers store
// this string as the "ref" in Business/Service/page_content records,
// exactly where a "local:<uuid>" IndexedDB ref used to live.
export async function uploadImage(file: File): Promise<string> {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    throw new Error("Please choose a JPEG, PNG, WebP, or GIF image.");
  }
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error("That image is too large — please choose a file under 8 MB.");
  }

  const supabase = createClient();
  const extension = EXTENSIONS_BY_MIME_TYPE[file.type] ?? "bin";
  const path = `${crypto.randomUUID()}.${extension}`;

  const { error: uploadError } = await supabase.storage.from(SITE_IMAGES_BUCKET).upload(path, file, {
    contentType: file.type,
    cacheControl: "31536000",
    upsert: false,
  });
  if (uploadError) throw new Error(uploadError.message);

  const { data, error: insertError } = await supabase
    .from("images")
    .insert({ storage_bucket: SITE_IMAGES_BUCKET, storage_path: path, mime_type: file.type })
    .select("id")
    .single();

  if (insertError) {
    // The upload above succeeded, but the object isn't referenceable
    // without a metadata row — remove the now-orphaned object rather than
    // leave Storage bytes nothing will ever point to.
    await supabase
      .storage.from(SITE_IMAGES_BUCKET)
      .remove([path])
      .catch(() => {});
    throw new Error(insertError.message);
  }

  return (data as { id: string }).id;
}

// Best-effort cleanup for an image no longer referenced by anything.
// Callers must only invoke this AFTER the record that used to point at it
// has already been switched to something else (a new image, a default, or
// nothing) — never before, so a failure here can never leave a live
// reference broken.
//
// Deletes the metadata row first, then the Storage object: if the object
// delete fails, the result is an orphaned Storage object (harmless dead
// weight, reconcilable later), never a metadata row pointing at nothing —
// the safer of the two possible half-finished states.
export async function deleteImage(id: string): Promise<void> {
  const supabase = createClient();

  const { data, error: fetchError } = await supabase
    .from("images")
    .select("storage_bucket, storage_path")
    .eq("id", id)
    .maybeSingle();
  if (fetchError) throw new Error(fetchError.message);
  if (!data) return;

  const { storage_bucket, storage_path } = data as ImageRow;

  const { error: deleteRowError } = await supabase.from("images").delete().eq("id", id);
  if (deleteRowError) throw new Error(deleteRowError.message);

  const { error: deleteObjectError } = await supabase.storage.from(storage_bucket).remove([storage_path]);
  if (deleteObjectError) throw new Error(deleteObjectError.message);
}
