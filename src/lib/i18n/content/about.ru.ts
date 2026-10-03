import type { AboutContent } from "@/data/about";

// Russian translation of the shipped default in src/data/about.ts. See
// homepage.ru.ts for the same-locale-content notes (English stays the
// source of truth; not wired into Supabase's page_content table).
export const aboutRu: AboutContent = {
  header: {
    eyebrow: "О нас",
    title: "Бренд по уходу за питомцами, созданный ради удобства и заботы",
    description:
      "KulaPAWS — это мобильная служба груминга для собак и кошек: мы приезжаем к вам с грумингом, мытьём и уходом за питомцем, без необходимости куда-либо ехать.",
  },
  mobileStory: {
    eyebrow: "Выездная служба",
    heading: "Почему мы приезжаем к вам",
    description:
      "Обычный груминг — это поездка на машине, зал ожидания и незнакомая обстановка. Идея KulaPAWS проще: приносить груминг в привычную для питомца среду.",
    // Matches the English default (src/data/about.ts) and homepage's own
    // mobileHighlight.image — same real Hero van photo, real default
    // instead of a placeholder. Still just the default; admin can still
    // override it via /admin/images.
    image: "/hero/hero-van-side.jpg",
  },
  values: {
    heading: "Что для нас важно",
    items: [
      { title: "Открытость", description: "Дружелюбный, понятный сервис без лишней суеты." },
      { title: "Забота", description: "Каждый визит строится вокруг комфорта вашего питомца." },
      { title: "Практичность", description: "Удобно, чисто и легко вписывается в ваш распорядок дня." },
    ],
  },
  cta: {
    heading: "Хотите узнать больше?",
    description: "Свяжитесь с нами, если у вас есть вопросы о KulaPAWS.",
  },
};
