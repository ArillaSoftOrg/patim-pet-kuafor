import type { Service } from "@/data/services";

// Turkish translation of the shipped defaults in src/data/services.ts.
// Slugs are identical to the English defaults on purpose — service pages
// are matched by slug regardless of locale (see ServiceDetailLive.tsx).
// See homepage.tr.ts for the same-locale-content notes (not wired into
// Supabase's services table, which has no locale dimension).
export const servicesTr: Service[] = [
  {
    slug: "wash-basic-care",
    title: "Yıkama & Bakım",
    shortDescription: "Nazik bir yıkama ve temel bakım — tırnak kesimi, kulak temizliği ve tarama, kapınıza kadar.",
    overview:
      "Yıkama & Bakım, evcil dostunuzun düzenli olarak ihtiyaç duyduğu temel bakımı kapsar: nazik bir şampuanlı yıkama, kapsamlı tarama, tırnak kesimi ve temel kulak hijyeni — hepsi mobil hizmetimizle evinizde sakin bir şekilde yapılır.",
    whoItsFor: [
      "Rutin yıkama ve temel bakıma ihtiyaç duyan evcil hayvanlar",
      "Tam tıraş olmadan temel bakımın halledilmesini isteyen sahipler",
      "Tam bakımlar arasında düzenli tırnak, kulak ve tüy bakımı",
    ],
    process: [
      { title: "Bize ulaşın", description: "Evcil dostunuz ve ihtiyaç duyduğu temel bakım hakkında bize bilgi verin." },
      { title: "Size geliyoruz", description: "Mobil bakım ekibimiz evinize gelir." },
      { title: "Yıkama & temel bakım", description: "Nazik bir yıkama, tarama, tırnak kesimi ve kulak temizliği, baştan sona." },
    ],
    image: null,
  },
  {
    slug: "wash-trim-care",
    title: "Yıkama + Tıraş Bakım",
    shortDescription: "Tam bir yıkama, uygun bir tıraş, tarama ve tamamlayıcı dokunuşlar.",
    overview:
      "Yıkama + Tıraş Bakım, temel bakımın üzerine uygun bir tıraş veya kesim ekler: tam bir şampuanlı yıkama, tarama, özenli tıraş ve tamamlayıcı dokunuşlar — hepsi mobil hizmetimizle evinizde yapılır.",
    whoItsFor: [
      "Tam bir yıkama ve yeni bir tıraşa hazır evcil hayvanlar",
      "Konforlu kalması için düzenli tıraş gerektiren tüy yapıları",
      "Evden çıkmadan eksiksiz bir bakım isteyen sahipler",
    ],
    process: [
      { title: "Bize ulaşın", description: "Evcil dostunuzun tüyü ve istediğiniz tıraş hakkında bize bilgi verin." },
      { title: "Size geliyoruz", description: "Mobil bakım ekibimiz evinize gelir." },
      { title: "Yıkama & tıraş", description: "Tam bir yıkama, tarama, uygun tıraş ve tamamlayıcı dokunuşlar." },
    ],
    image: null,
  },
  {
    slug: "dog-grooming",
    title: "Köpek Bakımı",
    shortDescription: "Her boy ve tüy tipinden köpekler için kapınıza kadar gelen bakım hizmeti.",
    overview:
      "KulaPAWS, köpeğinizin konforu göz önünde bulundurularak tasarlanmış bakım hizmetini mobil ekibimizle sunar; kafes yok, bekleme salonu yok, stresli araba yolculuğu yok.",
    whoItsFor: [
      "Geleneksel bakım salonlarında endişelenen köpekler",
      "Evden çıkmadan bakım yaptırmak isteyen sahipler",
      "Düzenli tüy, cilt ve tırnak bakımı",
    ],
    process: [
      { title: "Bize ulaşın", description: "Köpeğiniz ve aradığınız hizmet hakkında bize bilgi verin." },
      { title: "Size geliyoruz", description: "Mobil bakım ekibimiz evinize gelir." },
      { title: "Köpeğinizin bakımı yapılır", description: "Tanıdık bir ortamda sakin ve birebir bir bakım seansı." },
    ],
    image: null,
  },
  {
    slug: "cat-grooming",
    title: "Kedi Bakımı",
    shortDescription: "Taşıma çantası ve araba yolculuğu olmadan, evde düşük stresli kedi bakımı.",
    overview:
      "Kediler genellikle kendi ortamlarında en iyi şekilde uyum sağlar. KulaPAWS, kedi bakımını doğrudan evinize getirerek deneyimi olabildiğince sakin ve düşük stresli tutar.",
    whoItsFor: [
      "Seyahat ve yabancı ortamlardan strese giren kediler",
      "Taşıma çantasıyla yolculuk yapmadan bakım yaptırmak isteyen sahipler",
      "Düzenli tüy ve hijyen bakımı",
    ],
    process: [
      { title: "Bize ulaşın", description: "Kediniz ve ihtiyaçları hakkında birkaç detay paylaşın." },
      { title: "Size geliyoruz", description: "Ekibimiz, sizin alanınızda çalışmaya hazır şekilde gelir." },
      { title: "Kedinizin bakımı yapılır", description: "Evde, aceleye getirilmeyen nazik bir seans." },
    ],
    image: null,
  },
  {
    slug: "mobile-pet-grooming",
    title: "Mobil Evcil Hayvan Bakımı",
    shortDescription: "Profesyonel bakımın kolaylığı, kapınıza kadar getiriliyor.",
    overview:
      "Mobil bakım, KulaPAWS'ın temelini oluşturur: size gelen profesyonel evcil hayvan bakımı sayesinde dostunuz tanıdık ve konforlu bir ortamda bakılır.",
    whoItsFor: [
      "Salon ziyaretlerini zorlaştıran yoğun programlar",
      "Seyahat ve bekleme alanları olmadan daha iyi uyum sağlayan evcil hayvanlar",
      "Birebir bakım ilgisini tercih eden herkes",
    ],
    process: [
      { title: "Randevu ayırtın", description: "Size uygun bir zaman ayarlamak için bize ulaşın." },
      { title: "Geliyoruz", description: "Mobil bakım hizmetimiz doğrudan evinize gelir." },
      { title: "Şımartma zamanı", description: "Evcil dostunuzun bakımı, baştan sona yerinde yapılır." },
    ],
    image: null,
  },
];

export function getServiceTrBySlug(slug: string): Service | undefined {
  return servicesTr.find((service) => service.slug === slug);
}
