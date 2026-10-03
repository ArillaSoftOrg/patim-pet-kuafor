import { createClient } from "@/lib/supabase/client";
import { localStorageAdapter } from "@/lib/storage/localStorageAdapter";
import { isManagedImageRef, deleteImage } from "@/lib/images/imagesRepository";
import { business as defaultBusiness } from "@/data/business";
import type { Business } from "@/data/business";
import type { ContentRepository } from "@/lib/content/types";
import { rowToBusiness } from "@/lib/content/businessRow";
import type { BusinessRow } from "@/lib/content/businessRow";

// Not real data — a same-origin, cross-tab notification only. A native
// localStorage write fires the "storage" event in every OTHER open tab
// (never the tab that wrote it); useLiveContent already listens for that,
// so touching this key after a Supabase write lets an already-open public
// tab refresh without a full reload. No business data is ever stored here.
export const BUSINESS_SYNC_PING_KEY = "kulapaws:sync:business";

function notifyOtherTabs() {
  localStorageAdapter.setItem(BUSINESS_SYNC_PING_KEY, String(Date.now()));
}

function businessToRow(value: Business) {
  return {
    id: 1,
    name: value.name,
    tagline: value.tagline,
    phone: value.phone,
    email: value.email,
    whatsapp: value.whatsapp,
    address: value.address,
    service_areas: value.serviceAreas,
    business_hours: value.businessHours,
    social_links: value.socialLinks,
    logo_image_id: isManagedImageRef(value.logoSrc) ? value.logoSrc : null,
  };
}

export const businessRepository: ContentRepository<Business> = {
  async get() {
    const supabase = createClient();
    const { data, error } = await supabase.from("business").select("*").eq("id", 1).maybeSingle();
    if (error || !data) {
      if (error) console.error("businessRepository.get failed, falling back to defaults:", error.message);
      return defaultBusiness;
    }
    return rowToBusiness(data as BusinessRow);
  },

  async set(value) {
    const supabase = createClient();
    const { error } = await supabase.from("business").upsert(businessToRow(value), { onConflict: "id" });
    if (error) throw new Error(error.message);

    notifyOtherTabs();
  },

  async reset() {
    const supabase = createClient();

    // Capture the current logo before it's overwritten, so it can be
    // cleaned up (best-effort) once the reset itself has succeeded.
    const { data: currentRow } = await supabase.from("business").select("logo_image_id").eq("id", 1).maybeSingle();
    const previousLogoImageId = (currentRow as { logo_image_id: string | null } | null)?.logo_image_id ?? null;

    const { error } = await supabase
      .from("business")
      .upsert(businessToRow(defaultBusiness), { onConflict: "id" });
    if (error) throw new Error(error.message);

    if (previousLogoImageId) {
      deleteImage(previousLogoImageId).catch((err) => {
        console.error("Failed to clean up previous logo image after business reset:", err);
      });
    }

    notifyOtherTabs();
  },
};
