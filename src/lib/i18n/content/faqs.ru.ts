import type { Faq } from "@/data/faqs";

// Russian translations of the live FAQ rows in Supabase — see faqs.tr.ts
// for the full rationale (same file, mirrored).
// NOTE: these entries are keyed to specific FAQ row ids from the
// previous (KulaPAWS) deployment and do not match any row in Patim Pet
// Kuaför's own Supabase `faqs` table, which currently ships empty — see
// src/data/faqs.ts. Content below is updated to real Patim Pet Kuaför
// facts for when equivalent FAQs are authored, but these specific ids
// will need to be replaced with the real ids once FAQs are created via
// /admin/content.
export const faqsRu: Faq[] = [
  {
    id: "5ae65ca2-6de9-4c79-bab8-f9e26a582f32",
    category: "General",
    question: "Каких животных обслуживает Patim Pet Kuaför?",
    answer: "Patim Pet Kuaför предоставляет груминг и уход только для собак.",
  },
  {
    id: "ffb64610-ce74-4b84-ad93-e96ad940746c",
    category: "General",
    question: "Patim Pet Kuaför — это выездная служба?",
    answer:
      "Нет. Patim Pet Kuaför — это настоящий салон, который можно посетить в Чукурова, Адана. Вы приводите свою собаку к нам на приём.",
  },
  {
    id: "3e810e0a-0d70-42ed-ab25-59c85a783b57",
    category: "General",
    question: "Где находится Patim Pet Kuaför?",
    answer: "Мы находимся по адресу: Beyazevler, 80001. Sk. Hilmibüyükgenç Apt No: 4/A Zemin Kat, 01000 Çukurova/Adana.",
  },
  {
    id: "87d11e44-2fd4-4a41-b970-a89bd4e835c7",
    category: "General",
    question: "Как записаться на приём?",
    answer:
      "Вы можете связаться с Patim Pet Kuaför по телефону или WhatsApp: +90 543 853 93 53, либо написать в Instagram: @patimpetkuafor.",
  },
];

export function getFaqRuById(id: string): Faq | undefined {
  return faqsRu.find((faq) => faq.id === id);
}
