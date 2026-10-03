import type { HomepageContent } from "@/data/homepage";

// Turkish translation of the shipped default in src/data/homepage.ts.
// English stays the single source of truth (see that file); this mirrors
// its shape exactly and is picked up only when locale === "tr" (see
// HomeContent.tsx). Not wired into Supabase (page_content has no locale
// dimension), so an admin edit made in English will not appear here — see
// the i18n content translation task notes for that known limitation.
export const homepageTr: HomepageContent = {
  hero: {
    heading: "Kapınıza gelen mobil evcil hayvan bakımı",
    description:
      "KulaPAWS, Antalya bölgesinde köpek ve kedileriniz için mobil bakım hizmetini kapınıza kadar getirir; evcil dostunuz evinin tanıdık ortamında sakin ve rahat kalır.",
    image: null,
    gallery: ["/hero/hero-van-side.jpg", "/hero/hero-van-front.jpg", "/hero/hero-van-rear.jpg"],
    primaryCtaLabel: "Randevu Talep Et",
    secondaryCtaLabel: "Hizmetleri Keşfedin",
  },
  mobileSalon: {
    eyebrow: "Aracımızla Tanışın",
    heading: "Mobil Salonumuzla Tanışın",
    description:
      "Bakımı kapınıza kadar getiren aracın içine gerçek bir bakış — aletler, kurulum ve her randevunun arkasındaki ekip.",
    gallery: [
      {
        id: "van-exterior-front",
        alt: "Dışarıda park halindeki KulaPAWS mobil bakım aracı",
        caption: "Donanımlı bakım aracımız",
      },
      {
        id: "van-exterior-side",
        alt: "KulaPAWS mobil evcil hayvan salonu aracının yan görünümü",
        caption: "Kedi ve köpekler için hazır",
      },
      {
        id: "mobile-groom-dog",
        alt: "Araç içinde yeni bakımı yapılmış, kucağa alınmış bir köpek",
        caption: "Evcil dostunuzun güvende hissettiği yerde bakım",
      },
      {
        id: "mobile-groom-pomeranian",
        alt: "Araçta banyo sonrası kurutulan bir Pomeranian",
        caption: "Araç içinde banyo ve kurutma",
      },
      {
        id: "pomeranian-after-groom",
        alt: "Bakımı tamamlanmış tüylü bir Pomeranian",
        caption: "Taranmış, tıraşlanmış ve mutlu",
      },
      {
        id: "groomers-at-work",
        alt: "KulaPAWS bakım ekibi araç içinde birlikte çalışıyor",
        caption: "Bakım ekibimiz iş başında",
      },
      {
        id: "cat-after-groom",
        alt: "Bakım seansı sonrası kucağa alınmış bir kedi",
        caption: "Kediler de aynı özenli bakımı alıyor",
      },
      {
        id: "cat-clipper-groom",
        alt: "Araç içindeki bakım masasında tıraş edilen bir Scottish Fold kedi",
        caption: "Kediler için de özenli, elle tıraş",
      },
    ],
  },
  beforeAfter: {
    eyebrow: "Gerçek Sonuçlar",
    heading: "Öncesi & Sonrası",
    description: "Mobil bakım seanslarımızdan bazılarının gerçek dönüşümüne bir bakış.",
    prevLabel: "Önceki fotoğraf",
    nextLabel: "Sonraki fotoğraf",
    goToSlideLabel: "Fotoğrafa git",
    gallery: [
      {
        id: "before-after-01",
        alt: "Tüylü bir köpeğin bakım öncesi ve sonrası fotoğrafları; tam yıkama ve tıraş",
        width: 1086,
        height: 1448,
      },
      {
        id: "before-after-02",
        alt: "Kıvırcık tüylü bir köpeğin bakım öncesi ve sonrası fotoğrafları; düzenli, şekillendirilmiş tıraş",
        width: 1254,
        height: 1254,
      },
      {
        id: "before-after-03",
        alt: "Küçük beyaz bir köpeğin bakım öncesi ve sonrası fotoğrafları; temiz, şekillendirilmiş tüyler",
        width: 1144,
        height: 1375,
      },
      {
        id: "before-after-04",
        alt: "Küçük bir köpeğin bakım öncesi ve sonrası fotoğrafları; düzenli yüz ve tüy tıraşı",
        width: 1254,
        height: 1254,
      },
      {
        id: "before-after-05",
        alt: "Kıvırcık tüylü bir yavru köpeğin bakım öncesi ve sonrası fotoğrafları; tam yıkama, tıraş ve bandana ile son dokunuş",
        width: 1345,
        height: 1170,
      },
      {
        id: "before-after-06",
        alt: "Kayısı rengi kıvırcık tüylü bir köpeğin bakım öncesi ve sonrası fotoğrafları; düzenli, yuvarlak hatlı tıraş",
        width: 1345,
        height: 1170,
      },
      {
        id: "before-after-07",
        alt: "Bir Golden Retriever'ın bakım öncesi ve sonrası fotoğrafları; tam yıkama ve kurutma",
        width: 1345,
        height: 1170,
      },
      {
        id: "before-after-08",
        alt: "Gri bir British Shorthair kedinin bakım öncesi ve sonrası fotoğrafları; düzenli tüy tıraşı",
        width: 1345,
        height: 1170,
      },
    ],
  },
  servicesSection: {
    eyebrow: "Neler Sunuyoruz",
    heading: "Hizmetlerimiz",
    description: "Evcil dostunuzun ihtiyaçlarına göre tasarlanmış bakım hizmeti, evinizin neresinde olursa olsun.",
    showcase: [
      {
        number: "01",
        title: "Yıkama & Bakım",
        description: "Tırnak kesimi, kulak temizliği, tarama ve temel bakım.",
        bullets: ["Nazik şampuanla yıkama", "Tırnak kesimi ve kulak temizliği", "Tarama ve düğüm açma"],
        image: "/services/wash-basic-care.jpg",
        imageAlt: "KulaPAWS aracında banyo sonrası kurutulan bir Pomeranian",
        slug: "wash-basic-care",
      },
      {
        number: "02",
        title: "Yıkama + Tıraş Bakım",
        description: "Yıkama, uygun tıraş, tarama ve tamamlayıcı bakım.",
        bullets: ["Yıkama ve kurutma", "Irka veya isteğe uygun tıraş", "Tarama ve son rötuşlar"],
        image: "/services/wash-trim-care.jpg",
        imageAlt: "Bakımı yeni tamamlanmış tüylü bir Pomeranian",
        slug: "wash-trim-care",
      },
      {
        number: "03",
        title: "Köpek Bakımı",
        description: "Köpeğin ırkı, tüy yapısı ve ihtiyacına göre bakım.",
        bullets: ["Irk ve tüy tipine uygun bakım", "Evde, tanıdık bir ortamda", "Düzenli tırnak ve kulak bakımı"],
        image: "/services/dog-grooming-card.jpg",
        imageAlt: "KulaPAWS aracında bakımı yapılan bir yavru köpek",
        slug: "dog-grooming",
      },
      {
        number: "04",
        title: "Kedi Bakımı",
        description: "Kediler için daha sakin, kontrollü ve özenli bakım.",
        bullets: ["Sakin ve düşük stresli yaklaşım", "Taşıma çantası veya araba yolculuğu yok", "Tarama ve temel bakım"],
        image: "/services/cat-grooming-card.jpg",
        imageAlt: "KulaPAWS aracında bakımı yapılan bir kedi",
        slug: "cat-grooming",
      },
      {
        number: "05",
        title: "Mobil Evcil Hayvan Bakımı",
        description: "KulaPAWS bakım aracıyla hizmet doğrudan müşterinin bulunduğu yere gelir.",
        bullets: ["Bakım aracı kapınıza gelir", "Bekleme salonu veya taşıma derdi yok", "Baştan sona birebir ilgi"],
        image: "/hero/hero-van-front.jpg",
        imageAlt: "KulaPAWS mobil bakım aracı",
        slug: "mobile-pet-grooming",
      },
    ],
  },
  campaign: {
    eyebrow: "Randevu Alınıyor",
    heading: "Evcil dostunuzun bir sonraki bakımı, yolculuk stresi olmadan",
    description:
      "Kafes, araba yolculuğu ve bekleme salonuna gerek yok. Mobil bakım randevusu alın, evcil dostunuza tam evinde sakin ve birebir bir deneyim yaşatın.",
    perks: [
      "Doğrudan kapınıza gelir",
      "Sakin, birebir ilgi",
      "Gününüze uyan esnek randevu saatleri",
    ],
    ctaLabel: "Bakım Randevusu Alın",
  },
  mobileHighlight: {
    eyebrow: "Mobil Hizmet",
    heading: "Bakım hizmeti, kapınıza kadar",
    description:
      "Kafes yok, araba yolculuğu yok, bekleme salonu yok. Mobil bakım hizmetimiz sayesinde evcil dostunuz, tam evinizde tanıdık ve stressiz bir ortamda özenle bakılır.",
    bullets: [
      "Bakım, evcil dostunuzun en rahat hissettiği yerde gerçekleşir",
      "Taşıma veya bırakma gerekmez",
      "Baştan sona birebir ilgi",
    ],
    image: "/hero/hero-van-side.jpg",
  },
  whyKulapaws: {
    heading: "Neden KulaPAWS",
    description: "Yakın, şefkatli ve güvenilir hissettirmek için tasarlanmış bir evcil hayvan bakım markası.",
    items: [
      {
        title: "Doğası gereği şefkatli",
        description: "Her ziyaret, sadece bakımı değil, evcil dostunuzun konforunu da önceliklendirir.",
      },
      {
        title: "Gerçekten pratik",
        description: "Mobil hizmet sayesinde bakım günün size uyar, tersi değil.",
      },
      {
        title: "Temiz ve profesyonel",
        description: "Her randevuya tutarlı ve özenli bir yaklaşım.",
      },
    ],
  },
  productsPreview: {
    heading: "Evcil Hayvan Bakım Ürünleri",
    description: "Bakım hizmetinin yanı sıra KulaPAWS, eviniz için evcil hayvan bakım ürünleri de sunar.",
  },
  howItWorks: {
    heading: "Nasıl Çalışır",
    description: "Evcil dostunuzun evde bakımını yaptırmak çok kolay.",
    steps: [
      {
        title: "Bize ulaşın",
        description: "Evcil dostunuzun ihtiyaçlarını paylaşmak için bizi telefon, WhatsApp veya Instagram üzerinden arayın.",
      },
      {
        title: "Size geliyoruz",
        description: "Mobil bakım hizmetimiz evinize gelir.",
      },
      {
        title: "Evcil dostunuz şımartılır",
        description: "Yerinde, sakin ve birebir bir bakım seansı.",
      },
    ],
  },
  testimonials: {
    eyebrow: "MÜŞTERİ DENEYİMLERİ",
    heading: "Evcil dostlarını bize emanet edenler ne diyor?",
    description: "KulaPAWS'ı kapılarında ağırlayan evcil hayvan sahiplerinden birkaç söz.",
    // TEMPORARY — see the matching note in src/data/homepage.ts for what
    // these are and why (no `source` is set on any of them; none are real,
    // attributable reviews).
    items: [
      {
        text: "KulaPAWS kapımıza kadar geldi, köpeğimiz hiç strese girmedi — ikimiz için de çok rahat bir deneyimdi.",
        name: "Elif A.",
        rating: 5,
      },
      {
        text: "Kafes yok, araba yolculuğu yok, evde sakin bir bakım. Kedimiz süreç boyunca gerçekten rahattı.",
        name: "Mert Y.",
        rating: 5,
      },
      {
        text: "Yaşlı köpeğimize karşı çok nazik ve sabırlılardı. Kesinlikle tekrar randevu alacağız.",
        name: "Ayşe K.",
        rating: 4,
      },
      {
        text: "Randevu almak kolaydı ve tam zamanında geldiler. Araçta ihtiyaç duydukları her şey var.",
        name: "Caner B.",
        rating: 5,
      },
      {
        text: "Pomeranian'ımız kabarık ve mutlu görünüyordu bakım sonrası. Detaylara çok dikkat ediyorlar.",
        name: "Zeynep T.",
        rating: 5,
      },
      {
        text: "Bakımcının bize gelmesi, endişeli kedimiz için gerçekten fark yarattı.",
        name: "Baran S.",
        rating: 5,
      },
      {
        text: "Profesyonel, samimi ve hayvanlarla arası gerçekten iyi. Mobil hizmeti kesinlikle tavsiye ederim.",
        name: "Deniz K.",
        rating: 5,
      },
      {
        text: "WhatsApp'tan hızlı dönüş yapıyorlar ve günümüze göre esnek randevu saatleri sunuyorlar.",
        name: "Selin M.",
        rating: 4,
      },
      {
        text: "Köpeğimiz genelde bakım gününden hoşlanmaz ama bu sefer tüm ziyaret boyunca sakindi.",
        name: "Onur Ç.",
        rating: 5,
      },
    ],
  },
  faqPreview: {
    heading: "Sıkça Sorulan Sorular",
  },
  finalCta: {
    heading: "Evcil dostunuzun bir sonraki bakımını ayırtmaya hazır mısınız?",
    description: "Bize ulaşın, başlamanıza yardımcı olalım.",
  },
};
