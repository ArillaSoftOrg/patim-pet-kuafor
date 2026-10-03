import { createClient } from "@/lib/supabase/client";
import { localStorageAdapter } from "@/lib/storage/localStorageAdapter";
import { isManagedImageRef, deleteImage } from "@/lib/images/imagesRepository";
import { services as defaultServices } from "@/data/services";
import type { Service, ServiceProcessStep } from "@/data/services";
import { getServiceTrBySlug } from "@/lib/i18n/content/services.tr";
import { getServiceRuBySlug } from "@/lib/i18n/content/services.ru";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/config";

// Not real data — a same-origin, cross-tab notification only, same pattern
// as businessRepository's ping key. See useLiveContent for how this is used.
export const SERVICES_SYNC_PING_KEY = "kulapaws:sync:services";

function notifyOtherTabs() {
  localStorageAdapter.setItem(SERVICES_SYNC_PING_KEY, String(Date.now()));
}

function cleanupImage(imageId: string | null | undefined, context: string) {
  if (!imageId) return;
  deleteImage(imageId).catch((err) => {
    console.error(`Failed to clean up ${context}:`, err);
  });
}

// Services are a bounded, fully admin-owned list (unlike business info,
// which is a single overridable record), backed by a real multi-row table
// with a unique slug constraint — create/update/delete/rename are
// unambiguous. `slug` is the collection's id. Single-language: Supabase
// stores whatever language the admin typed (English today). TR/RU on the
// public site come from the static services.tr.ts/services.ru.ts files,
// resolved on top of the live rows by listResolved()/getResolvedBySlug().
export interface ServicesRepository {
  list(): Promise<Service[]>;
  // Locale-resolved reads for the public site. Rule: if a real static
  // translation exists for this slug, its translatable text overrides the
  // live row; the image always comes from the live Supabase row, and a
  // service with no translation yet is still returned — in English —
  // rather than dropped from the list. See services.tr.ts/services.ru.ts.
  listResolved(locale: Locale): Promise<Service[]>;
  getResolvedBySlug(slug: string, locale: Locale): Promise<Service | null>;
  create(service: Service): Promise<void>;
  update(originalSlug: string, service: Service): Promise<void>;
  remove(slug: string): Promise<void>;
  reset(): Promise<void>;
}

interface ServiceRow {
  slug: string;
  title: string;
  short_description: string;
  overview: string;
  who_its_for: string[] | null;
  process: ServiceProcessStep[] | null;
  image_id: string | null;
}

const UNIQUE_VIOLATION = "23505";

function duplicateSlugError(slug: string): Error {
  return new Error(`A service with slug "${slug}" already exists.`);
}

// The one place DB snake_case meets the app's existing camelCase Service
// shape — admin CRUD UI and public consumers keep working against the same
// TypeScript type regardless of backend. image stays a raw ref (a
// public.images.id, or null) either way — resolveImageSrc turns it into an
// actual URL downstream.
function rowToService(row: ServiceRow): Service {
  return {
    slug: row.slug,
    title: row.title,
    shortDescription: row.short_description,
    overview: row.overview,
    whoItsFor: row.who_its_for ?? [],
    process: row.process ?? [],
    image: row.image_id,
  };
}

// A live row's image_id is null until an admin uploads a photo through
// /admin/images — that's the normal, expected state for every shipped
// service today, not an error. Previously `list()` returned that null
// as-is, so the public site's own live-refresh (ServiceGridLive/
// ServiceDetailLive, both via useLiveContent) would replace the real photo
// ServiceCard/ServiceDetail rendered from `defaultServices` on first paint
// with a "coming soon" placeholder the moment the Supabase read resolved —
// a real image flashing to a placeholder post-hydration, not the reverse.
// Falling back to the matching static default's image here (the one place
// every consumer of list()/listResolved()/getResolvedBySlug() already
// funnels through) fixes it for all of them at once, and does so without
// masking a genuinely new admin-created service that has no static
// counterpart — `find()` returns undefined for those, so they correctly
// keep showing null (placeholder) until a real photo is uploaded, exactly
// as before.
function withDefaultImageFallback(service: Service): Service {
  if (service.image) return service;
  const fallbackImage = defaultServices.find((s) => s.slug === service.slug)?.image;
  return fallbackImage ? { ...service, image: fallbackImage } : service;
}

function serviceToRow(service: Service) {
  return {
    slug: service.slug,
    title: service.title,
    short_description: service.shortDescription,
    overview: service.overview,
    who_its_for: service.whoItsFor,
    process: service.process,
    image_id: isManagedImageRef(service.image) ? service.image : null,
  };
}

function translationFields(service: Service) {
  return {
    title: service.title,
    shortDescription: service.shortDescription,
    overview: service.overview,
    whoItsFor: service.whoItsFor,
    process: service.process,
  };
}

function staticLookup(slug: string, locale: Locale): Service | undefined {
  return locale === "tr" ? getServiceTrBySlug(slug) : locale === "ru" ? getServiceRuBySlug(slug) : undefined;
}

// English is always the live row as-is. For tr/ru, only the translatable
// text is taken from the static file (when a translation for this slug
// exists) — image stays whatever the live row says, so an admin adding a
// photo is reflected immediately in every locale, and a service with no
// translation yet still shows (in English) instead of vanishing.
function withStaticTranslation(liveService: Service, locale: Locale): Service {
  if (locale === DEFAULT_LOCALE) return liveService;
  const staticMatch = staticLookup(liveService.slug, locale);
  return staticMatch ? { ...liveService, ...translationFields(staticMatch) } : liveService;
}

export const servicesRepository: ServicesRepository = {
  async list() {
    try {
      const supabase = createClient();
      // No is_published filter here on purpose: RLS (services_public_select)
      // already restricts anon/non-admin reads to published rows, and an
      // admin-scoped SELECT policy (prepared, not yet applied — see
      // supabase/migrations/20260906150000_services_admin_select.sql) is
      // meant to let admins see everything through this exact same query
      // once it lands, with no app code change required.
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) {
        console.error("servicesRepository.list failed, falling back to defaults:", error.message);
        return defaultServices;
      }
      return (data as ServiceRow[]).map(rowToService).map(withDefaultImageFallback);
    } catch (err) {
      console.error("servicesRepository.list failed, falling back to defaults:", err);
      return defaultServices;
    }
  },

  async listResolved(locale) {
    const liveServices = await servicesRepository.list();
    return liveServices.map((service) => withStaticTranslation(service, locale));
  },

  async getResolvedBySlug(slug, locale) {
    const liveServices = await servicesRepository.list();
    const match = liveServices.find((service) => service.slug === slug) ?? null;
    return match ? withStaticTranslation(match, locale) : null;
  },

  async create(service) {
    const supabase = createClient();
    const { count } = await supabase.from("services").select("*", { count: "exact", head: true });
    const { error } = await supabase
      .from("services")
      .insert({ ...serviceToRow(service), display_order: count ?? 0 });
    if (error) {
      throw error.code === UNIQUE_VIOLATION ? duplicateSlugError(service.slug) : new Error(error.message);
    }
    notifyOtherTabs();
  },

  async update(originalSlug, service) {
    const supabase = createClient();
    const { error } = await supabase.from("services").update(serviceToRow(service)).eq("slug", originalSlug);
    if (error) {
      throw error.code === UNIQUE_VIOLATION ? duplicateSlugError(service.slug) : new Error(error.message);
    }
    notifyOtherTabs();
  },

  async remove(slug) {
    const supabase = createClient();

    // Capture the image before deleting the row — deleting a service
    // doesn't cascade-delete its image (the FK only clears the other
    // direction, on the image being deleted).
    const { data: row } = await supabase.from("services").select("image_id").eq("slug", slug).maybeSingle();
    const imageId = (row as { image_id: string | null } | null)?.image_id ?? null;

    const { error } = await supabase.from("services").delete().eq("slug", slug);
    if (error) throw new Error(error.message);

    cleanupImage(imageId, `image for deleted service "${slug}"`);
    notifyOtherTabs();
  },

  async reset() {
    const supabase = createClient();
    const defaultSlugs = defaultServices.map((service) => service.slug);

    // Capture every existing service's image before it's overwritten or
    // removed, so each can be cleaned up (best-effort) once the reset
    // itself has succeeded. Shipped defaults ship with no image, so
    // anything captured here is orphaned by the reset.
    const { data: existingRows } = await supabase.from("services").select("image_id");
    const previousImageIds = ((existingRows as { image_id: string | null }[] | null) ?? [])
      .map((row) => row.image_id)
      .filter((id): id is string => Boolean(id));

    // Restore the shipped defaults in place first (upsert by slug) rather
    // than deleting everything up front — if this fails partway (network,
    // RLS), existing rows are left exactly as they were instead of gone
    // with nothing put back.
    const { error: upsertError } = await supabase.from("services").upsert(
      defaultServices.map((service, index) => ({
        ...serviceToRow(service),
        display_order: index,
        is_published: true,
      })),
      { onConflict: "slug" },
    );
    if (upsertError) throw new Error(upsertError.message);

    // Only once the defaults are confirmed restored, remove anything else
    // (admin-created services not among the 3 shipped defaults).
    const { error: deleteError } = await supabase
      .from("services")
      .delete()
      .not("slug", "in", `(${defaultSlugs.join(",")})`);
    if (deleteError) throw new Error(deleteError.message);

    // Only after both DB steps above have succeeded, best-effort clean up
    // every image that was attached to any service before the reset.
    for (const imageId of previousImageIds) {
      cleanupImage(imageId, `orphaned image ${imageId} after services reset`);
    }

    notifyOtherTabs();
  },
};
