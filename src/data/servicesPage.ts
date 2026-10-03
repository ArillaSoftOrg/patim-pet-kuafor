export interface ServicesPageContent {
  header: {
    eyebrow: string;
    title: string;
    description: string;
  };
  cta: {
    heading: string;
    description: string;
  };
}

// Mirrors the copy previously hardcoded in src/app/services/page.tsx.
export const servicesPageContent: ServicesPageContent = {
  header: {
    eyebrow: "Services",
    title: "Grooming services for dogs and cats",
    description:
      "Every KulaPAWS service is delivered through our mobile setup, brought directly to your home.",
  },
  cta: {
    heading: "Not sure which service fits your pet?",
    description: "Reach out and we'll help you figure out the right fit.",
  },
};
