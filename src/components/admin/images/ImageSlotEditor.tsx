"use client";

import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { Button } from "@/components/ui/Button";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { FormError } from "@/components/admin/forms/FormError";
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_SIZE_BYTES, isManagedImageRef, uploadImage, deleteImage } from "@/lib/images/imagesRepository";
import { resolveImageSrc } from "@/lib/images/resolveImageSrc";
import { useLocale } from "@/lib/i18n/LocaleProvider";

interface ImageSlotEditorProps {
  label: string;
  currentRef: string | null;
  defaultRef: string | null;
  onChange: (nextRef: string | null) => Promise<void>;
  aspect?: "square" | "video" | "portrait";
  fit?: "cover" | "contain";
}

// One reusable "pick from device / preview / persist / reset" unit. Bytes
// go to Supabase Storage via uploadImage(); only the returned images.id ref
// is ever handed to onChange, which is responsible for writing that ref
// into the right content record (business.logo_image_id, services.image_id,
// or a page_content JSONB field). `aspect`/`fit` are fixed per slot (e.g.
// the logo always uses "square"/"contain") so a replacement image is
// always shown at the same ratio as the slot it fills.
//
// Replace/reset order matters: onChange (the reference switch) always runs
// BEFORE any cleanup of the image it replaced, and cleanup failures are
// logged, not surfaced as a blocking error — the user-visible action (the
// upload or reset) already succeeded; only a harmless orphan cleanup
// failed.
export function ImageSlotEditor({
  label,
  currentRef,
  defaultRef,
  onChange,
  aspect = "video",
  fit = "cover",
}: ImageSlotEditorProps) {
  const { dictionary } = useLocale();
  const t = dictionary.admin.images;
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let active = true;
    resolveImageSrc(currentRef).then((src) => {
      if (active) setPreviewSrc(src);
    });
    return () => {
      active = false;
    };
  }, [currentRef]);

  function cleanupReplacedImage(previousRef: string | null, context: string) {
    if (!isManagedImageRef(previousRef)) return;
    deleteImage(previousRef).catch((err) => {
      console.error(`Failed to clean up ${context} for "${label}":`, err);
    });
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setError(null);

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setError(t.invalidType);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setError(t.tooLarge);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    setSaving(true);
    const previousRef = currentRef;
    try {
      const newRef = await uploadImage(file);
      await onChange(newRef);
      // Only after the reference switch above succeeded — never before —
      // clean up the image it replaced.
      cleanupReplacedImage(previousRef, "replaced image");
    } catch (err) {
      setError(err instanceof Error ? err.message : t.saveFailed);
    } finally {
      setSaving(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function handleReset() {
    setError(null);
    setSaving(true);
    const previousRef = currentRef;
    try {
      await onChange(defaultRef);
      cleanupReplacedImage(previousRef, "reset image");
    } catch (err) {
      setError(err instanceof Error ? err.message : t.resetFailed);
    } finally {
      setSaving(false);
    }
  }

  const isDefault = currentRef === defaultRef;

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4">
      <span className="text-[14px] font-medium text-foreground">{label}</span>
      <PhotoPlaceholder
        src={previewSrc}
        label={t.noImageSetTemplate.replace("{label}", label)}
        aspect={aspect}
        fit={fit}
        className="max-w-xs"
      />
      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_IMAGE_TYPES.join(",")}
          onChange={handleFileChange}
          disabled={saving}
          aria-label={t.chooseImageAriaTemplate.replace("{label}", label)}
          className="text-[14px] text-muted-foreground file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-2 file:text-[14px] file:font-medium file:text-secondary-foreground"
        />
        {!isDefault && (
          <Button type="button" variant="tertiary" onClick={handleReset} disabled={saving}>
            {t.resetToDefault}
          </Button>
        )}
      </div>
      <FormError message={error} />
    </div>
  );
}
