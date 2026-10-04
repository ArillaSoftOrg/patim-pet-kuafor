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
    title: "A dog grooming salon built on real experience",
    description:
      "Patim Pet Kuaför is a dog grooming salon in Çukurova, Adana, run by Faik Kopuz, an internationally certified pet groomer.",
  },
  mobileStory: {
    eyebrow: "Our Salon",
    heading: "Visit us in Çukurova, Adana",
    description:
      "Bring your dog to our salon for a calm, professional grooming experience — breed-specific trims, model cuts, baths, and full-service care, handled by our certified groomer.",
    // Real salon exterior photo — see public/salon/exterior.jpg (storefront
    // signage, Instagram handle @patimpetkuafor visible). Still just the
    // *default* — /admin/images' "About Page Image" slot overrides this.
    image: "/salon/exterior.jpg",
  },
  values: {
    heading: "What we care about",
    items: [
      { title: "Certified", description: "Internationally certified grooming, handled with real expertise." },
      { title: "Caring", description: "Every appointment is centered on your dog's comfort." },
      { title: "Personal", description: "A real, hands-on salon — not a chain." },
    ],
  },
  cta: {
    heading: "Want to learn more?",
    description: "Reach out with any questions about Patim Pet Kuaför.",
  },
};
