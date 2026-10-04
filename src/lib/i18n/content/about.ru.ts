import type { AboutContent } from "@/data/about";

// Russian translation of the shipped default in src/data/about.ts. See
// homepage.ru.ts for the same-locale-content notes (English stays the
// source of truth; not wired into Supabase's page_content table).
export const aboutRu: AboutContent = {
  header: {
    eyebrow: "О нас",
    title: "Салон груминга собак, построенный на реальном опыте",
    description:
      "Patim Pet Kuaför — салон груминга собак в Чукурова, Адана, которым руководит Фаик Копуз, грумер с международной сертификацией.",
  },
  mobileStory: {
    eyebrow: "Наш салон",
    heading: "Посетите наш салон в Чукурова, Адана",
    description:
      "Приводите свою собаку в наш салон для спокойного и профессионального груминга — стрижки по породе, модельные стрижки, мытьё и полный уход от нашего сертифицированного грумера.",
    // Real salon exterior photo — see public/salon/exterior.jpg.
    image: "/salon/exterior.jpg",
  },
  values: {
    heading: "Что для нас важно",
    items: [
      { title: "Сертификация", description: "Международная сертификация и реальный профессионализм." },
      { title: "Забота", description: "Каждый визит строится вокруг комфорта вашей собаки." },
      { title: "Индивидуальный подход", description: "Настоящий, семейный салон — не сетевая точка." },
    ],
  },
  cta: {
    heading: "Хотите узнать больше?",
    description: "Свяжитесь с нами, если у вас есть вопросы о Patim Pet Kuaför.",
  },
};
