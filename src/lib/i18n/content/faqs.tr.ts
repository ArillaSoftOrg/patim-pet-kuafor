import type { Faq } from "@/data/faqs";

// Turkish translations of the live FAQ rows in Supabase, keyed by `id`
// (the FAQ's stable identity — see faqsRepository.ts, question text is
// editable so it can't be the key). Unlike services.tr.ts/products.tr.ts,
// there is no static English default to mirror (src/data/faqs.ts ships
// empty on purpose — see that file) — these entries translate whatever
// real FAQs currently exist live. An id with no entry here is simply
// shown in English (see faqsRepository.ts's withStaticTranslation),
// exactly like an untranslated service or product.
// NOTE: these entries are keyed to specific FAQ row ids from the
// previous (KulaPAWS) deployment and do not match any row in Patim Pet
// Kuaför's own Supabase `faqs` table, which currently ships empty — see
// src/data/faqs.ts. Content below is updated to real Patim Pet Kuaför
// facts for when equivalent FAQs are authored, but these specific ids
// will need to be replaced with the real ids once FAQs are created via
// /admin/content.
export const faqsTr: Faq[] = [
  {
    id: "5ae65ca2-6de9-4c79-bab8-f9e26a582f32",
    category: "General",
    question: "Patim Pet Kuaför hangi hayvanlara hizmet veriyor?",
    answer: "Patim Pet Kuaför yalnızca köpekler için bakım ve kuaförlük hizmeti sunar.",
  },
  {
    id: "ffb64610-ce74-4b84-ad93-e96ad940746c",
    category: "General",
    question: "Patim Pet Kuaför mobil bir hizmet mi?",
    answer:
      "Hayır. Patim Pet Kuaför, Çukurova, Adana'da ziyaret edebileceğiniz gerçek bir salondur. Köpeğinizi randevu saatinizde salonumuza getirirsiniz.",
  },
  {
    id: "3e810e0a-0d70-42ed-ab25-59c85a783b57",
    category: "General",
    question: "Patim Pet Kuaför nerede?",
    answer: "Beyazevler, 80001. Sk. Hilmibüyükgenç Apt No: 4/A Zemin Kat, 01000 Çukurova/Adana adresinde bulunuyoruz.",
  },
  {
    id: "87d11e44-2fd4-4a41-b970-a89bd4e835c7",
    category: "General",
    question: "Nasıl randevu alabilirim?",
    answer:
      "Patim Pet Kuaför'e telefon veya WhatsApp üzerinden +90 543 853 93 53 numarasından ulaşabilir, ya da Instagram'da @patimpetkuafor adresinden mesaj gönderebilirsiniz.",
  },
];

export function getFaqTrById(id: string): Faq | undefined {
  return faqsTr.find((faq) => faq.id === id);
}
