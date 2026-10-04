import type { HomepageContent } from "@/data/homepage";

// Russian translation of the shipped default in src/data/homepage.ts.
// English stays the single source of truth (see that file); this mirrors
// its shape exactly and is picked up only when locale === "ru" (see
// HomeContent.tsx). Not wired into Supabase (page_content has no locale
// dimension), so an admin edit made in English will not appear here — same
// known limitation as homepage.tr.ts.
export const homepageRu: HomepageContent = {
  hero: {
    heading: "Груминг собак — сделан правильно",
    description:
      "Patim Pet Kuaför — салон груминга собак в Чукурова, Адана: стрижки по породе, модельные стрижки и полный уход от грумера с международной сертификацией.",
    image: null,
    gallery: ["/hero/bichon-pink-ears.jpg", "/hero/chow-chow-playful.jpg", "/hero/akita-salon.jpg"],
    primaryCtaLabel: "Записаться на приём",
    secondaryCtaLabel: "Смотреть услуги",
  },
  mobileSalon: {
    eyebrow: "Наш салон",
    heading: "Внутри Patim Pet Kuaför",
    description:
      "Настоящий взгляд на наш салон в Чукурова, Адана — пространство и команда за каждым визитом.",
    gallery: [
      {
        id: "exterior",
        alt: "Фасад Patim Pet Kuaför в Чукурова, Адана",
        caption: "Наш салон в Чукурова, Адана",
      },
      {
        id: "team-faik",
        alt: "Фаик Копуз, владелец и грумер Patim Pet Kuaför, со свежепостриженным померанским шпицем",
        caption: "Фаик Копуз, наш сертифицированный грумер",
      },
      {
        id: "team-groomer",
        alt: "Грумер Patim Pet Kuaför работает с йоркширским терьером",
        caption: "Наша команда грумеров за работой",
      },
      {
        id: "faik-grooming-action",
        alt: "Фаик Копуз подстригает шерсть собаки на груминг-столе",
        caption: "Внимательный, ручной груминг",
      },
    ],
  },
  beforeAfter: {
    eyebrow: "Реальные результаты",
    heading: "До и после",
    description: "Перетащите ползунок, чтобы увидеть настоящее преображение после груминга в нашем салоне.",
    beforeLabel: "До",
    afterLabel: "После",
    before: {
      src: "/before-after/labradoodle-before.jpg",
      alt: "Собака с длинной, неухоженной кудрявой шерстью перед грумингом в Patim Pet Kuaför",
    },
    after: {
      src: "/before-after/labradoodle-after.jpg",
      alt: "Та же собака с аккуратной стрижкой «плюшевый мишка» после груминга в Patim Pet Kuaför",
    },
  },
  servicesSection: {
    eyebrow: "Что мы предлагаем",
    heading: "Наши услуги",
    description: "Груминг собак в нашем салоне в Чукурова, Адана.",
    showcase: [
      {
        number: "01",
        title: "Мытьё и сушка собак",
        description: "Тщательное мытьё шампунем и сушка в нашем салоне.",
        bullets: ["Мытьё мягким шампунем", "Аккуратная сушка", "Любая порода и тип шерсти"],
        image: "/grooming/spaniel-result.jpg",
        imageAlt: "Свежевымытая и высушенная собака породы лаготто-романьоло в Patim Pet Kuaför",
        slug: "dog-bath-blow-dry",
      },
      {
        number: "02",
        title: "Груминг и уход за собаками",
        description: "Стрижки по породе и модельные стрижки от грумера с международной сертификацией.",
        bullets: ["Стрижка по породе или модельная", "Грумер с международной сертификацией", "Полное мытьё, стрижка и укладка"],
        image: "/grooming/toy-poodle-grey-result.jpg",
        imageAlt: "Свежепостриженный серый той-пудель после полной стрижки в Patim Pet Kuaför",
        slug: "dog-grooming",
      },
      {
        number: "03",
        title: "Стрижка когтей",
        description: "Аккуратная стрижка когтей для собак.",
        bullets: ["Быстрая, аккуратная стрижка", "Отдельно или вместе с грумингом", "Любая порода"],
        image: "/grooming/shiba-mix-result.jpg",
        imageAlt: "Ухоженная собака породы шиба/хаски-микс в Patim Pet Kuaför",
        slug: "nail-trimming",
      },
      {
        number: "04",
        title: "Чистка ушей",
        description: "Отдельная услуга чистки ушей для собак.",
        bullets: ["Бережная, аккуратная чистка", "Плановая гигиена ушей", "Любая порода"],
        image: "/grooming/pomeranian-mohawk-result.jpg",
        imageAlt: "Померанский шпиц с яркой стрижкой-акцентом в Patim Pet Kuaför",
        slug: "ear-cleaning",
      },
      {
        number: "05",
        title: "Полный пакет груминга",
        description: "Наша полная, комплексная услуга по уходу за собакой за один визит.",
        bullets: ["Мытьё, стрижка, когти и уши", "Всё за один визит", "Наша самая полная услуга"],
        image: "/grooming/chow-chow-portrait.jpg",
        imageAlt: "Чау-чау с полной стрижкой «плюшевый мишка» в Patim Pet Kuaför",
        slug: "full-grooming-package",
      },
    ],
  },
  campaign: {
    eyebrow: "Идёт запись",
    heading: "Запишите собаку на следующий груминг",
    description:
      "Запишитесь онлайн и приведите собаку на спокойный, профессиональный груминг в нашем салоне в Чукурова, Адана.",
    perks: [
      "Грумер с международной сертификацией",
      "Стрижки по породе и модельные стрижки",
      "Простая запись онлайн",
    ],
    ctaLabel: "Записать собаку на груминг",
  },
  mobileHighlight: {
    eyebrow: "Наш салон",
    heading: "Настоящий, внимательный салон груминга",
    description:
      "Patim Pet Kuaför — специализированный салон груминга собак в Чукурова, Адана — не сеть и не стойка в большом магазине. Каждая собака получает сосредоточенное, внимательное отношение от нашего сертифицированного грумера.",
    bullets: [
      "Грумер с международной сертификацией",
      "Стрижки по породе и модельные стрижки",
      "Настоящий салон, который можно посетить в Чукурова, Адана",
    ],
    image: "/salon/exterior.jpg",
  },
  whyKulapaws: {
    heading: "Почему Patim Pet Kuaför",
    description: "Салон груминга собак, построенный на настоящей сертификации и внимательной заботе.",
    items: [
      {
        title: "Сертифицированный грумер",
        description: "Международная сертификация и настоящий профессионализм в груминге.",
      },
      {
        title: "Индивидуальный подход",
        description: "Настоящий, местный салон — каждая собака получает индивидуальное внимание.",
      },
      {
        title: "Доверие на месте",
        description: "Рейтинг 4,3 от настоящих клиентов в Адане.",
      },
    ],
  },
  productsPreview: {
    heading: "Товары для животных",
    description: "Помимо груминга, Patim Pet Kuaför — это ещё и зоомагазин для дома.",
  },
  howItWorks: {
    heading: "Как это работает",
    description: "Записаться на груминг в Patim Pet Kuaför очень просто.",
    steps: [
      {
        title: "Запишитесь на приём",
        description: "Расскажите нам о своей собаке и выберите время онлайн — мы подтвердим запись.",
      },
      {
        title: "Приведите собаку",
        description: "Посетите наш салон в Чукурова, Адана в назначенное время.",
      },
      {
        title: "Собака получает уход",
        description: "Спокойный, профессиональный сеанс груминга с нашим сертифицированным грумером.",
      },
    ],
  },
  testimonials: {
    eyebrow: "ОТЗЫВЫ КЛИЕНТОВ",
    heading: "Что говорят наши клиенты?",
    description: "Реальные отзывы из профиля Patim Pet Kuaför в Google (рейтинг 4,3, 17 отзывов).",
    // Quoted verbatim in the reviewers' original Turkish rather than
    // translated — these are real, attributable quotes (see
    // src/data/homepage.ts), and translating a direct quote risks
    // misrepresenting what the reviewer actually wrote.
    items: [
      {
        text: "Güleryüzlü, bilgili, ilgili ve temiz bir mekan tavsiye ederim",
        name: "Murat Nadar",
        source: "Google",
        rating: 5,
      },
      {
        text: "İşinde cok iyi gonul rahatlığıyla patili dostunuzu güveneceğini tek adres",
        name: "Fatma Erkmen",
        source: "Google",
        rating: 5,
      },
      {
        text: "Güler yüz ve kaliteli hizmet. Tertemiz bir çalışma. Tavsiye ederim.",
        name: "Yusuf Tosun",
        source: "Google",
        rating: 5,
      },
    ],
  },
  faqPreview: {
    heading: "Часто задаваемые вопросы",
  },
  finalCta: {
    heading: "Готовы записать собаку на следующий груминг?",
    description: "Запишитесь онлайн, и мы подтвердим ваш визит.",
  },
};
