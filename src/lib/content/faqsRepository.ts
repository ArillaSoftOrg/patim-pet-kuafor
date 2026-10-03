import { createClient } from "@/lib/supabase/client";
import { localStorageAdapter } from "@/lib/storage/localStorageAdapter";
import { faqs as defaultFaqs } from "@/data/faqs";
import type { Faq } from "@/data/faqs";
import { rowToFaq } from "@/lib/content/faqRow";
import type { FaqRow } from "@/lib/content/faqRow";
import { getFaqTrById } from "@/lib/i18n/content/faqs.tr";
import { getFaqRuById } from "@/lib/i18n/content/faqs.ru";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/config";

// Not real data — a same-origin, cross-tab notification only, same pattern
// as business/servicesRepository's ping keys. See useLiveContent for how
// this is used.
export const FAQS_SYNC_PING_KEY = "kulapaws:sync:faqs";

function notifyOtherTabs() {
  localStorageAdapter.setItem(FAQS_SYNC_PING_KEY, String(Date.now()));
}

// Same bounded, fully admin-owned collection model as servicesRepository.
// `id` is the collection's id (question text is editable, so it can't be
// the id) — generated client-side by FaqForm via crypto.randomUUID().
// Single-language: Supabase stores whatever language the admin typed
// (English today). TR/RU on the public site come from the static
// faqs.tr.ts/faqs.ru.ts files, resolved on top of the live rows by
// listResolved() — same convention as products/services, see those
// repositories for the full rationale.
export interface FaqsRepository {
  list(): Promise<Faq[]>;
  // Locale-resolved reads for the public site. Rule: if a real static
  // translation exists for this id, its question/answer override the live
  // row; a FAQ with no translation yet is still returned — in English —
  // rather than dropped, exactly like an untranslated service or product.
  listResolved(locale: Locale): Promise<Faq[]>;
  create(faq: Faq): Promise<void>;
  update(id: string, faq: Faq): Promise<void>;
  remove(id: string): Promise<void>;
  reset(): Promise<void>;
}

function staticLookup(id: string, locale: Locale): Faq | undefined {
  return locale === "tr" ? getFaqTrById(id) : locale === "ru" ? getFaqRuById(id) : undefined;
}

// English is always the live row as-is. For tr/ru, only question/answer
// come from the static file (when a translation for this id exists) —
// category stays whatever the live row says (it's a fixed enum, not free
// text, and dictionary.shared.faqCategories already translates its label).
function withStaticTranslation(liveFaq: Faq, locale: Locale): Faq {
  if (locale === DEFAULT_LOCALE) return liveFaq;
  const staticMatch = staticLookup(liveFaq.id, locale);
  return staticMatch ? { ...liveFaq, question: staticMatch.question, answer: staticMatch.answer } : liveFaq;
}

function faqToRow(faq: Faq) {
  return {
    id: faq.id,
    category: faq.category,
    question: faq.question,
    answer: faq.answer,
  };
}

// A UUID no real row will ever have — used as an always-true "delete
// everything" filter, since Postgrest requires an explicit filter for
// delete-many and `id` is a uuid column (unlike servicesRepository's text
// slug, an empty-string filter isn't a valid uuid literal here).
const NIL_UUID = "00000000-0000-0000-0000-000000000000";

export const faqsRepository: FaqsRepository = {
  async list() {
    try {
      const supabase = createClient();
      // No is_published filter here on purpose: RLS (faqs_public_select)
      // already restricts anon/non-admin reads to published rows, and an
      // admin-scoped SELECT policy (prepared, not yet applied — see
      // supabase/migrations/20260906160000_faqs_admin_select.sql) is meant to
      // let admins see everything through this exact same query once it
      // lands, with no app code change required.
      const { data, error } = await supabase
        .from("faqs")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) {
        console.error("faqsRepository.list failed, falling back to defaults:", error.message);
        return defaultFaqs;
      }
      return (data as FaqRow[]).map(rowToFaq);
    } catch (err) {
      console.error("faqsRepository.list failed, falling back to defaults:", err);
      return defaultFaqs;
    }
  },

  async listResolved(locale) {
    const liveFaqs = await faqsRepository.list();
    return liveFaqs.map((faq) => withStaticTranslation(faq, locale));
  },

  async create(faq) {
    const supabase = createClient();
    const { count } = await supabase.from("faqs").select("*", { count: "exact", head: true });
    const { error } = await supabase.from("faqs").insert({ ...faqToRow(faq), display_order: count ?? 0 });
    if (error) throw new Error(error.message);
    notifyOtherTabs();
  },

  async update(id, faq) {
    const supabase = createClient();
    const { error } = await supabase.from("faqs").update(faqToRow(faq)).eq("id", id);
    if (error) throw new Error(error.message);
    notifyOtherTabs();
  },

  async remove(id) {
    const supabase = createClient();
    const { error } = await supabase.from("faqs").delete().eq("id", id);
    if (error) throw new Error(error.message);
    notifyOtherTabs();
  },

  async reset() {
    const supabase = createClient();
    const defaultIds = defaultFaqs.map((faq) => faq.id);

    // Restore shipped defaults in place first (upsert by id) rather than
    // deleting everything up front — if this fails partway, existing rows
    // are left exactly as they were instead of gone with nothing put back.
    if (defaultFaqs.length > 0) {
      const { error: upsertError } = await supabase.from("faqs").upsert(
        defaultFaqs.map((faq, index) => ({ ...faqToRow(faq), display_order: index, is_published: true })),
        { onConflict: "id" },
      );
      if (upsertError) throw new Error(upsertError.message);
    }

    // Only once any defaults are confirmed restored, remove everything
    // else. src/data/faqs.ts currently ships an empty array, so this branch
    // (no defaults to preserve) simply clears the table — the same
    // "reset to nothing" behavior the old localStorage.removeItem had.
    const { error: deleteError } =
      defaultIds.length > 0
        ? await supabase.from("faqs").delete().not("id", "in", `(${defaultIds.join(",")})`)
        : await supabase.from("faqs").delete().neq("id", NIL_UUID);
    if (deleteError) throw new Error(deleteError.message);

    notifyOtherTabs();
  },
};
