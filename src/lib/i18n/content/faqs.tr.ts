import type { Faq } from "@/data/faqs";

// Turkish translations of the live FAQ rows in Supabase, keyed by `id`
// (the FAQ's stable identity — see faqsRepository.ts, question text is
// editable so it can't be the key). Unlike services.tr.ts/products.tr.ts,
// there is no static English default to mirror (src/data/faqs.ts ships
// empty on purpose — see that file) — these entries translate whatever
// real FAQs currently exist live. An id with no entry here is simply
// shown in English (see faqsRepository.ts's withStaticTranslation),
// exactly like an untranslated service or product.
export const faqsTr: Faq[] = [
  {
    id: "5ae65ca2-6de9-4c79-bab8-f9e26a582f32",
    category: "General",
    question: "KulaPAWS hangi hayvanlara hizmet veriyor?",
    answer: "KulaPAWS yalnızca köpekler ve kediler için bakım, yıkama ve evcil hayvan hizmeti sunar.",
  },
  {
    id: "ffb64610-ce74-4b84-ad93-e96ad940746c",
    category: "General",
    question: "KulaPAWS mobil bir bakım hizmeti mi?",
    answer:
      "Evet. KulaPAWS, müşterilerin ziyaret edebileceği bir mağazası olmayan mobil bir bakım hizmetidir. Bakım, yıkama ve evcil hayvan hizmetini doğrudan size getiriyoruz.",
  },
  {
    id: "3e810e0a-0d70-42ed-ab25-59c85a783b57",
    category: "General",
    question: "KulaPAWS hangi bölgelere hizmet veriyor?",
    answer: "KulaPAWS; Antalya Merkez, Kemer, Kumluca, Finike, Demre, Kaş, Kalkan ve Fethiye'ye hizmet vermektedir.",
  },
  {
    id: "87d11e44-2fd4-4a41-b970-a89bd4e835c7",
    category: "General",
    question: "Nasıl randevu alabilirim?",
    answer:
      "KulaPAWS'a telefon veya WhatsApp üzerinden +90 540 314 62 23 numarasından ulaşabilir, ya da Instagram'da @kulapaws.tr adresinden mesaj gönderebilirsiniz.",
  },
];

export function getFaqTrById(id: string): Faq | undefined {
  return faqsTr.find((faq) => faq.id === id);
}
