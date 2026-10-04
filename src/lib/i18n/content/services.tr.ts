import type { Service } from "@/data/services";

// Turkish translation of the shipped defaults in src/data/services.ts.
// Slugs are identical to the English defaults on purpose — service pages
// are matched by slug regardless of locale (see ServiceDetailLive.tsx).
// See homepage.tr.ts for the same-locale-content notes (not wired into
// Supabase's services table, which has no locale dimension).
export const servicesTr: Service[] = [
  {
    slug: "dog-bath-blow-dry",
    title: "Köpek Yıkama & Kurutma",
    shortDescription: "Salonumuzda kapsamlı bir şampuanlı yıkama ve kurutma.",
    overview:
      "Köpeğiniz için salonumuzda, Patim Pet Kuaför'ün kuaförleri tarafından yapılan nazik ve kapsamlı bir yıkama ve kurutma hizmeti.",
    whoItsFor: [
      "Rutin yıkamaya ihtiyaç duyan köpekler",
      "Tam bakımlar arasında temiz ve taze bir tüy isteyen sahipler",
      "Her ırk ve tüy tipi",
    ],
    process: [
      { title: "Bırakın", description: "Köpeğinizi Çukurova, Adana'daki salonumuza getirin." },
      { title: "Yıkama & kurutma", description: "Kapsamlı bir şampuanlı yıkama ve özenli kurutma." },
      { title: "Teslim alın", description: "Tazece yıkanmış, kabarmış köpeğinizi teslim alın." },
    ],
    image: "/grooming/spaniel-result.jpg",
  },
  {
    slug: "dog-grooming",
    title: "Köpek Kuaförlüğü & Bakımı",
    shortDescription: "Uluslararası sertifikalı bir kuaför tarafından ırka özel tıraşlar ve model kesimler.",
    overview:
      "Salonumuzda tam köpek kuaförlüğü ve bakımı — ırka uygun tıraşlar ve model kesimler, uluslararası sertifikalı evcil hayvan kuaförü Faik Kopuz tarafından yapılır.",
    whoItsFor: [
      "Tam bir tıraşa veya model kesime hazır köpekler",
      "Irka özel veya özel bir görünüm arayan sahipler",
      "Düzenli bakım ihtiyacı",
    ],
    process: [
      { title: "Bırakın", description: "Köpeğinizi getirin ve istediğiniz görünümü bize anlatın." },
      { title: "Kuaförlük", description: "Salonumuzda yıkama, tıraş ve şekillendirme." },
      { title: "Teslim alın", description: "Tazece bakımı yapılmış köpeğinizi teslim alın." },
    ],
    image: "/grooming/toy-poodle-grey-result.jpg",
  },
  {
    slug: "nail-trimming",
    title: "Tırnak Kesimi",
    shortDescription: "Köpekler için özenli tırnak kesimi.",
    overview: "Salonumuzda, tek başına bir ziyaret olarak veya bir bakımla birlikte özenle yapılan köpek tırnak kesimi.",
    whoItsFor: [
      "Rutin tırnak kesimine ihtiyaç duyan köpekler",
      "Evde tırnak kesmekte kendini rahat hissetmeyen sahipler",
    ],
    process: [
      { title: "Bırakın", description: "Köpeğinizi salonumuza getirin." },
      { title: "Tırnak kesimi", description: "Özenli, hızlı bir kesim." },
      { title: "Teslim alın", description: "Köpeğinizi teslim alın — işlem tamam." },
    ],
    image: "/grooming/shiba-mix-result.jpg",
  },
  {
    slug: "ear-cleaning",
    title: "Kulak Temizliği",
    shortDescription: "Köpekler için kulak temizleme hizmeti.",
    overview: "Salonumuzda özenle yapılan, köpekler için özel bir kulak temizleme hizmeti.",
    whoItsFor: [
      "Rutin kulak bakımına ihtiyaç duyan köpekler",
      "Düzenli kulak bakımı gereken ırklar",
    ],
    process: [
      { title: "Bırakın", description: "Köpeğinizi salonumuza getirin." },
      { title: "Kulak temizliği", description: "Özenli, nazik bir temizlik." },
      { title: "Teslim alın", description: "Köpeğinizi teslim alın — işlem tamam." },
    ],
    image: "/grooming/pomeranian-mohawk-result.jpg",
  },
  {
    slug: "full-grooming-package",
    title: "Tam Kapsamlı Bakım Paketi",
    shortDescription: "Patim Pet Kuaför'ün eksiksiz, tam kapsamlı köpek bakım hizmeti.",
    overview:
      "Eksiksiz, tam kapsamlı köpek bakım paketimiz — yıkama, tıraş, tırnak bakımı ve kulak temizliği tek bir ziyarette bir arada.",
    whoItsFor: [
      "Eksiksiz, tek seferde bakıma ihtiyaç duyan köpekler",
      "Her şeyin tek bir ziyarette halledilmesini isteyen sahipler",
    ],
    process: [
      { title: "Bırakın", description: "Köpeğinizi gün boyu için getirin." },
      { title: "Tam bakım", description: "Yıkama, tıraş, tırnak bakımı ve kulak temizliği." },
      { title: "Teslim alın", description: "Köpeğinizi, tam bakımı yapılmış şekilde teslim alın." },
    ],
    image: "/grooming/chow-chow-portrait.jpg",
  },
];

export function getServiceTrBySlug(slug: string): Service | undefined {
  return servicesTr.find((service) => service.slug === slug);
}
