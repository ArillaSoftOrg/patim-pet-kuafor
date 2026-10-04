import type { Service } from "@/data/services";

// Russian translation of the shipped defaults in src/data/services.ts.
// Slugs are identical to the English defaults on purpose — service pages
// are matched by slug regardless of locale (see ServiceDetailLive.tsx).
// See homepage.ru.ts for the same-locale-content notes (not wired into
// Supabase's services table, which has no locale dimension).
export const servicesRu: Service[] = [
  {
    slug: "dog-bath-blow-dry",
    title: "Мытьё и сушка собак",
    shortDescription: "Тщательное мытьё шампунем и сушка в нашем салоне.",
    overview:
      "Бережное и тщательное мытьё и сушка для вашей собаки, выполняемые в нашем салоне грумерами Patim Pet Kuaför.",
    whoItsFor: [
      "Собаки, которым пора помыться",
      "Владельцы, которые хотят чистую, свежую шерсть между полными грумингами",
      "Любая порода и тип шерсти",
    ],
    process: [
      { title: "Приведите собаку", description: "Приведите собаку в наш салон в Чукурова, Адана." },
      { title: "Мытьё и сушка", description: "Полное мытьё шампунем и аккуратная сушка." },
      { title: "Заберите собаку", description: "Заберите свежевымытую, пушистую собаку." },
    ],
    image: "/grooming/spaniel-result.jpg",
  },
  {
    slug: "dog-grooming",
    title: "Груминг и уход за собаками",
    shortDescription: "Стрижки по породе и модельные стрижки от грумера с международной сертификацией.",
    overview:
      "Полный груминг и уход за собаками в нашем салоне — стрижки по породе и модельные стрижки, которые выполняет Фаик Копуз, грумер с международной сертификацией.",
    whoItsFor: [
      "Собаки, готовые к полной стрижке или модельной стрижке",
      "Владельцы, которые хотят стрижку по породе или по индивидуальному заказу",
      "Регулярный уход",
    ],
    process: [
      { title: "Приведите собаку", description: "Приведите собаку и расскажите, какой результат вы хотите." },
      { title: "Груминг", description: "Мытьё, стрижка и укладка в нашем салоне." },
      { title: "Заберите собаку", description: "Заберите свежевыстриженную собаку." },
    ],
    image: "/grooming/toy-poodle-grey-result.jpg",
  },
  {
    slug: "nail-trimming",
    title: "Стрижка когтей",
    shortDescription: "Аккуратная стрижка когтей для собак.",
    overview: "Стрижка когтей для собак, выполняемая аккуратно в нашем салоне отдельно или вместе с грумингом.",
    whoItsFor: [
      "Собаки, которым пора подстричь когти",
      "Владельцы, которым некомфортно стричь когти дома",
    ],
    process: [
      { title: "Приведите собаку", description: "Приведите собаку в наш салон." },
      { title: "Стрижка когтей", description: "Аккуратная, быстрая стрижка." },
      { title: "Заберите собаку", description: "Заберите собаку — готово." },
    ],
    image: "/grooming/shiba-mix-result.jpg",
  },
  {
    slug: "ear-cleaning",
    title: "Чистка ушей",
    shortDescription: "Услуга чистки ушей для собак.",
    overview: "Отдельная услуга чистки ушей для собак, выполняемая аккуратно в нашем салоне.",
    whoItsFor: [
      "Собаки, которым пора провести плановую гигиену ушей",
      "Породы, нуждающиеся в регулярном уходе за ушами",
    ],
    process: [
      { title: "Приведите собаку", description: "Приведите собаку в наш салон." },
      { title: "Чистка ушей", description: "Аккуратная, бережная чистка." },
      { title: "Заберите собаку", description: "Заберите собаку — готово." },
    ],
    image: "/grooming/pomeranian-mohawk-result.jpg",
  },
  {
    slug: "full-grooming-package",
    title: "Полный пакет груминга",
    shortDescription: "Полная комплексная услуга по уходу за собакой от Patim Pet Kuaför.",
    overview:
      "Наш полный, комплексный пакет по уходу за собакой — мытьё, стрижка, уход за когтями и чистка ушей за один визит.",
    whoItsFor: [
      "Собаки, которым нужен полный уход за один раз",
      "Владельцы, которые хотят решить всё за один визит",
    ],
    process: [
      { title: "Приведите собаку", description: "Приведите собаку на целый день." },
      { title: "Полный уход", description: "Мытьё, стрижка, уход за когтями и чистка ушей." },
      { title: "Заберите собаку", description: "Заберите собаку после полного ухода." },
    ],
    image: "/grooming/chow-chow-portrait.jpg",
  },
];

export function getServiceRuBySlug(slug: string): Service | undefined {
  return servicesRu.find((service) => service.slug === slug);
}
