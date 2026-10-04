export interface SocialLink {
  platform: string;
  url: string;
}

export interface Business {
  name: string;
  tagline: string | null;
  phone: string | null;
  email: string | null;
  whatsapp: string | null;
  address: string | null;
  serviceAreas: string[];
  businessHours: string | null;
  socialLinks: SocialLink[];
  logoSrc: string;
}

// Central business record (shape mirrors README.md §7 "Business Data
// Needed"). Unknown values stay null/empty — never invented. Update this
// file only, once real business facts are confirmed; no page component
// should need to change to pick up new values here.
//
// Patim Pet Kuaför is a physical storefront salon (not a mobile/van
// service) — customers bring their pet to the shop. All facts below are
// verified from the business's own Google Business Profile and Instagram
// (@patimpetkuafor): address, phone/WhatsApp number, and service area are
// real. `tagline` and `email` are not confirmed anywhere and stay null
// rather than inventing them. `businessHours` stays null here because the
// structured per-day hours live in the admin/Supabase content model this
// field doesn't capture (see Google listing: Mon 09:00–17:00, Tue–Sun
// 09:00–19:00) — enter them via /admin/business once that UI supports a
// weekly schedule.
//
// This file is the code-level fallback only. The live Supabase `business`
// row (edited via /admin/business) still needs these same values entered
// there for them to take effect on a deployed site — updating this file
// does not change production data (see businessRepository.ts).
export const business: Business = {
  name: "Patim Pet Kuaför",
  tagline: null,
  phone: "+90 543 853 93 53",
  email: null,
  whatsapp: "+90 543 853 93 53",
  address: "Beyazevler, 80001. Sk. Hilmibüyükgenç Apt No: 4/A Zemin Kat, 01000 Çukurova/Adana",
  serviceAreas: ["Çukurova", "Adana"],
  businessHours: null,
  socialLinks: [{ platform: "Instagram", url: "https://www.instagram.com/patimpetkuafor/" }],
  logoSrc: "/brand/logo.png",
};
