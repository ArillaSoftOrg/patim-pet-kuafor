import type { Faq } from "@/data/faqs";

// Russian translations of the live FAQ rows in Supabase — see faqs.tr.ts
// for the full rationale (same file, mirrored).
export const faqsRu: Faq[] = [
  {
    id: "5ae65ca2-6de9-4c79-bab8-f9e26a582f32",
    category: "General",
    question: "Каких животных обслуживает KulaPAWS?",
    answer: "KulaPAWS предоставляет груминг, мытьё и уход только для собак и кошек.",
  },
  {
    id: "ffb64610-ce74-4b84-ad93-e96ad940746c",
    category: "General",
    question: "KulaPAWS — это мобильный груминг?",
    answer:
      "Да. KulaPAWS — это мобильный груминг без салона, который можно посетить. Мы привозим груминг, мытьё и уход за питомцем прямо к вам.",
  },
  {
    id: "3e810e0a-0d70-42ed-ab25-59c85a783b57",
    category: "General",
    question: "Какие районы обслуживает KulaPAWS?",
    answer: "KulaPAWS обслуживает Анталья Меркез, Кемер, Кумлуджа, Финике, Демре, Каш, Калкан и Фетхие.",
  },
  {
    id: "87d11e44-2fd4-4a41-b970-a89bd4e835c7",
    category: "General",
    question: "Как записаться на приём?",
    answer:
      "Вы можете связаться с KulaPAWS по телефону или WhatsApp: +90 540 314 62 23, либо написать в Instagram: @kulapaws.tr.",
  },
];

export function getFaqRuById(id: string): Faq | undefined {
  return faqsRu.find((faq) => faq.id === id);
}
