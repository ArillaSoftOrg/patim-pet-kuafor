export interface AboutValueItem {
  title: string;
  description: string;
}

export interface AboutContent {
  header: {
    eyebrow: string;
    title: string;
    description: string;
  };
  mobileStory: {
    eyebrow: string;
    heading: string;
    description: string;
    image: string | null;
  };
  values: {
    heading: string;
    items: AboutValueItem[];
  };
  cta: {
    heading: string;
    description: string;
  };
}

// Mirrors the copy previously hardcoded in src/app/about/page.tsx, now
// centralized so it can be edited from /admin/content without touching
// the page component.
export const aboutContent: AboutContent = {
  header: {
    eyebrow: "About",
    title: "A pet-care brand built around convenience and care",
    description:
      "KulaPAWS is a mobile grooming service for dogs and cats — we bring grooming, washing, and pet care to you, with no storefront to visit.",
  },
  mobileStory: {
    eyebrow: "Mobile Service",
    heading: "Why we come to you",
    description:
      "Traditional grooming means a car ride, a waiting room, and an unfamiliar space. KulaPAWS was built around a simpler idea: bring the grooming to your pet's own environment instead.",
    // Reuses the same real Hero van photo homepage.mobileHighlight.image
    // already does (see src/data/homepage.ts) — a real, existing, vivid
    // KulaPAWS asset rather than a new one; a 16:9 shot with the van fully
    // in frame, which is what FeatureSplit's image slot (aspect="video")
    // here expects. Still just the *default* — /admin/images' "About Page
    // Image" slot overrides this the same way it always has.
    image: "/hero/hero-van-side.jpg",
  },
  values: {
    heading: "What we care about",
    items: [
      { title: "Approachable", description: "Friendly, straightforward service without the fuss." },
      { title: "Caring", description: "Every appointment is centered on your pet's comfort." },
      { title: "Practical", description: "Convenient, clean, and easy to fit into your routine." },
    ],
  },
  cta: {
    heading: "Want to learn more?",
    description: "Reach out with any questions about KulaPAWS.",
  },
};
