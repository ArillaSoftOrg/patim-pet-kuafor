import type { HomepageContent } from "@/data/homepage";

// Turkish translation of the shipped default in src/data/homepage.ts.
// English stays the single source of truth (see that file); this mirrors
// its shape exactly and is picked up only when locale === "tr" (see
// HomeContent.tsx). Not wired into Supabase (page_content has no locale
// dimension), so an admin edit made in English will not appear here — see
// the i18n content translation task notes for that known limitation.
export const homepageTr: HomepageContent = {
  hero: {
    heading: "Köpek bakımı, hakkıyla yapılır",
    description:
      "Patim Pet Kuaför, Çukurova, Adana'da bir köpek bakım salonudur — ırka özel tıraşlar, model kesimler ve uluslararası sertifikalı bir kuaförden tam kapsamlı bakım.",
    image: null,
    gallery: ["/hero/bichon-pink-ears.jpg", "/hero/chow-chow-playful.jpg", "/hero/akita-salon.jpg"],
    primaryCtaLabel: "Randevu Talep Et",
    secondaryCtaLabel: "Hizmetleri Keşfedin",
  },
  mobileSalon: {
    eyebrow: "Salonumuz",
    heading: "Patim Pet Kuaför'ün İçinde",
    description:
      "Çukurova, Adana'daki salonumuza gerçek bir bakış — mekan ve her randevunun arkasındaki ekip.",
    gallery: [
      {
        id: "exterior",
        alt: "Çukurova, Adana'da Patim Pet Kuaför'ün dış cephesi",
        caption: "Çukurova, Adana'daki salonumuz",
      },
      {
        id: "team-faik",
        alt: "Patim Pet Kuaför'ün sahibi ve kuaförü Faik Kopuz, yeni bakımı yapılmış bir Pomeranian ile",
        caption: "Faik Kopuz, sertifikalı kuaförümüz",
      },
      {
        id: "team-groomer",
        alt: "Bir Patim Pet Kuaför çalışanı bir Yorkshire Terrier üzerinde çalışıyor",
        caption: "Bakım ekibimiz iş başında",
      },
      {
        id: "faik-grooming-action",
        alt: "Faik Kopuz bakım masasında bir köpeğin tüyünü keserken",
        caption: "Özenli, elle yapılan bakım",
      },
    ],
  },
  beforeAfter: {
    eyebrow: "Gerçek Sonuçlar",
    heading: "Öncesi & Sonrası",
    description: "Salonumuzdaki gerçek bir bakım dönüşümünü görmek için kaydırıcıyı sürükleyin.",
    beforeLabel: "Önce",
    afterLabel: "Sonra",
    before: {
      src: "/before-after/labradoodle-before.jpg",
      alt: "Patim Pet Kuaför'de bakım randevusu öncesi uzun, şekilsiz kıvırcık tüylü bir köpek",
    },
    after: {
      src: "/before-after/labradoodle-after.jpg",
      alt: "Aynı köpek, Patim Pet Kuaför'de bakım sonrası düzgün bir teddy bear kesimle",
    },
  },
  servicesSection: {
    eyebrow: "Neler Sunuyoruz",
    heading: "Hizmetlerimiz",
    description: "Çukurova, Adana'daki salonumuzda köpek bakımı.",
    showcase: [
      {
        number: "01",
        title: "Köpek Yıkama & Kurutma",
        description: "Salonumuzda kapsamlı bir şampuanlı yıkama ve kurutma.",
        bullets: ["Nazik şampuanla yıkama", "Özenli kurutma", "Her ırk ve tüy tipi"],
        image: "/grooming/spaniel-result.jpg",
        imageAlt: "Patim Pet Kuaför'de yeni yıkanmış ve kurutulmuş İspanyol su köpeği türü bir köpek",
        slug: "dog-bath-blow-dry",
      },
      {
        number: "02",
        title: "Köpek Kuaförlüğü & Bakımı",
        description: "Uluslararası sertifikalı bir kuaför tarafından ırka özel tıraşlar ve model kesimler.",
        bullets: ["Irka özel veya model kesim", "Uluslararası sertifikalı kuaför", "Tam yıkama, tıraş ve şekillendirme"],
        image: "/grooming/toy-poodle-grey-result.jpg",
        imageAlt: "Patim Pet Kuaför'de tam tıraş sonrası yeni bakımı yapılmış gri bir Toy Poodle",
        slug: "dog-grooming",
      },
      {
        number: "03",
        title: "Tırnak Kesimi",
        description: "Köpekler için özenli tırnak kesimi.",
        bullets: ["Hızlı, özenli kesim", "Tek başına veya bakımla birlikte", "Her ırk"],
        image: "/grooming/shiba-mix-result.jpg",
        imageAlt: "Patim Pet Kuaför'de bakımı yapılmış bir Shiba/Husky melezi köpek",
        slug: "nail-trimming",
      },
      {
        number: "04",
        title: "Kulak Temizliği",
        description: "Köpekler için özel bir kulak temizleme hizmeti.",
        bullets: ["Nazik, özenli temizlik", "Rutin kulak hijyeni", "Her ırk"],
        image: "/grooming/pomeranian-mohawk-result.jpg",
        imageAlt: "Patim Pet Kuaför'de özel bir vurguyla bakımı yapılmış bir Pomeranian",
        slug: "ear-cleaning",
      },
      {
        number: "05",
        title: "Tam Kapsamlı Bakım Paketi",
        description: "Eksiksiz, tam kapsamlı köpek bakım hizmetimiz, tek bir ziyarette.",
        bullets: ["Yıkama, tıraş, tırnak ve kulak", "Tek bir ziyarette her şey", "En kapsamlı hizmetimiz"],
        image: "/grooming/chow-chow-portrait.jpg",
        imageAlt: "Patim Pet Kuaför'de tam teddy bear kesimle bakımı yapılmış bir Chow Chow",
        slug: "full-grooming-package",
      },
    ],
  },
  campaign: {
    eyebrow: "Randevu Alınıyor",
    heading: "Köpeğinizin bir sonraki bakımını ayırtın",
    description:
      "Online randevu talep edin ve köpeğinizi Çukurova, Adana'daki salonumuzda sakin ve profesyonel bir bakım deneyimi için getirin.",
    perks: [
      "Uluslararası sertifikalı kuaför",
      "Irka özel tıraşlar ve model kesimler",
      "Kolay online randevu talebi",
    ],
    ctaLabel: "Köpeğinizin Bakımını Ayırtın",
  },
  mobileHighlight: {
    eyebrow: "Salonumuz",
    heading: "Gerçek, özenli bir bakım salonu",
    description:
      "Patim Pet Kuaför, Çukurova, Adana'da kendine özgü bir köpek bakım salonudur — bir zincir mağaza ya da büyük bir mağazadaki bir uğrak noktası değil. Her köpek, sertifikalı kuaförümüzden odaklı ve özenli ilgi görür.",
    bullets: [
      "Uluslararası sertifikalı kuaför",
      "Irka özel tıraşlar ve model kesimler",
      "Çukurova, Adana'da ziyaret edebileceğiniz gerçek bir salon",
    ],
    image: "/salon/exterior.jpg",
  },
  whyKulapaws: {
    heading: "Neden Patim Pet Kuaför",
    description: "Gerçek sertifikasyon ve özenli bakım üzerine kurulmuş bir köpek bakım salonu.",
    items: [
      {
        title: "Sertifikalı kuaför",
        description: "Uluslararası sertifikalı, gerçek bakım uzmanlığıyla.",
      },
      {
        title: "Kişisel hizmet",
        description: "Gerçek, yerel bir salon — her köpek bireysel ilgi görür.",
      },
      {
        title: "Yerelde güvenilir",
        description: "Adana'da gerçek müşteriler tarafından 4,3 yıldızla değerlendirildi.",
      },
    ],
  },
  productsPreview: {
    heading: "Evcil Hayvan Bakım Ürünleri",
    description: "Bakım hizmetinin yanı sıra Patim Pet Kuaför, eviniz için bir pet shop olarak da hizmet verir.",
  },
  howItWorks: {
    heading: "Nasıl Çalışır",
    description: "Patim Pet Kuaför'de randevu almak çok kolay.",
    steps: [
      {
        title: "Randevu talep edin",
        description: "Köpeğiniz hakkında bilgi verin ve online bir zaman seçin — sizinle onaylayalım.",
      },
      {
        title: "Köpeğinizi getirin",
        description: "Randevu saatinizde Çukurova, Adana'daki salonumuzu ziyaret edin.",
      },
      {
        title: "Köpeğinizin bakımı yapılır",
        description: "Sertifikalı kuaförümüzle sakin ve profesyonel bir bakım seansı.",
      },
    ],
  },
  testimonials: {
    eyebrow: "MÜŞTERİ DENEYİMLERİ",
    heading: "Müşterilerimiz ne diyor?",
    description: "Patim Pet Kuaför'ün Google İşletme Profili'nden gerçek yorumlar (4,3 yıldız, 17 yorum).",
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
    heading: "Sıkça Sorulan Sorular",
  },
  finalCta: {
    heading: "Köpeğinizin bir sonraki bakımını ayırtmaya hazır mısınız?",
    description: "Online randevu talep edin, ziyaretinizi onaylayalım.",
  },
};
