import type { AboutContent } from "@/data/about";

// Turkish translation of the shipped default in src/data/about.ts. See
// homepage.tr.ts for the same-locale-content notes (English stays the
// source of truth; not wired into Supabase's page_content table).
export const aboutTr: AboutContent = {
  header: {
    eyebrow: "Hakkımızda",
    title: "Gerçek deneyim üzerine kurulmuş bir köpek kuaförü salonu",
    description:
      "Patim Pet Kuaför, Çukurova, Adana'da, uluslararası sertifikalı evcil hayvan kuaförü Faik Kopuz tarafından işletilen bir köpek bakım salonudur.",
  },
  mobileStory: {
    eyebrow: "Salonumuz",
    heading: "Çukurova, Adana'daki salonumuzu ziyaret edin",
    description:
      "Köpeğinizi sertifikalı kuaförümüzün elinde sakin ve profesyonel bir bakım deneyimi için salonumuza getirin — ırka özel tıraşlar, model kesimler, banyo ve tam kapsamlı bakım.",
    // Real salon exterior photo — see public/salon/exterior.jpg.
    image: "/salon/exterior.jpg",
  },
  values: {
    heading: "Bizim için önemli olan",
    items: [
      { title: "Sertifikalı", description: "Uluslararası sertifikalı, gerçek uzmanlıkla yapılan bakım." },
      { title: "Şefkatli", description: "Her randevu, köpeğinizin konforu etrafında şekillenir." },
      { title: "Kişisel", description: "Gerçek, yakından ilgilenen bir salon — zincir mağaza değil." },
    ],
  },
  cta: {
    heading: "Daha fazla bilgi mi almak istiyorsunuz?",
    description: "Patim Pet Kuaför hakkında sorularınız için bize ulaşın.",
  },
};
