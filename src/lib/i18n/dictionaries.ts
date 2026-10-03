import en from "@/lib/i18n/dictionaries/en.json";
import tr from "@/lib/i18n/dictionaries/tr.json";
import ru from "@/lib/i18n/dictionaries/ru.json";
import type { Locale } from "@/lib/i18n/config";

// English is the source of truth for the key set; tr/ru are expected to
// mirror its shape exactly (enforced structurally by this type, not just
// by convention) as more keys are added ahead of the future translation
// pass.
export type Dictionary = typeof en;

const dictionaries: Record<Locale, Dictionary> = { en, tr, ru };

// Plain JSON reads, safe in both Server and Client Components — no
// "server-only" guard here, since the client LocaleProvider needs this
// too (it resolves the dictionary from the URL locale on every render,
// not from a server-passed prop).
export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
