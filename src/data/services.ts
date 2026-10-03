export interface ServiceProcessStep {
  title: string;
  description: string;
}

export interface Service {
  slug: string;
  title: string;
  shortDescription: string;
  overview: string;
  whoItsFor: string[];
  process: ServiceProcessStep[];
  image: string | null;
}

// Category names and routes mirror the approved sitemap (README.md §5).
// Copy below is intentionally generic/provisional — no specific inclusions,
// pricing, or process claims until real business content is confirmed.
// Order matches the homepage's 01-05 ServiceShowcase numbering (see
// src/data/homepage.ts servicesSection.showcase) — display_order in the
// Supabase services table should follow the same sequence; see the prepared
// (not-yet-applied) migration for wash-basic-care/wash-trim-care.
export const services: Service[] = [
  {
    slug: "wash-basic-care",
    title: "Wash & Basic Care",
    shortDescription:
      "A gentle bath and the essential basics — nail care, ear cleaning, and brushing, brought to your door.",
    overview:
      "Wash & Basic Care covers what your pet needs on a regular basis: a gentle shampoo bath, thorough brushing, nail trimming, and basic ear hygiene — all done calmly at home through our mobile service.",
    whoItsFor: [
      "Pets due for a routine wash and basic upkeep",
      "Owners who want the essentials handled without a full trim",
      "Regular nail, ear, and coat maintenance between full grooms",
    ],
    process: [
      { title: "Reach out", description: "Tell us about your pet and what basic care they need." },
      { title: "We come to you", description: "Our mobile grooming setup arrives at your home." },
      { title: "Wash & basic care", description: "A gentle bath, brushing, nail trim, and ear cleaning, start to finish." },
    ],
    image: "/services/wash-basic-care.jpg",
  },
  {
    slug: "wash-trim-care",
    title: "Wash + Trim Care",
    shortDescription: "A full wash plus a coat-appropriate trim, brushing, and finishing touches.",
    overview:
      "Wash + Trim Care builds on the basics with a coat-appropriate trim or clip: a full shampoo wash, brushing, careful trimming, and finishing touches, delivered through our mobile service at home.",
    whoItsFor: [
      "Pets ready for a full wash and a fresh trim",
      "Coats that need regular clipping to stay comfortable",
      "Owners who want a complete groom without leaving home",
    ],
    process: [
      { title: "Reach out", description: "Tell us about your pet's coat and the trim you're looking for." },
      { title: "We come to you", description: "Our mobile grooming setup arrives at your home." },
      { title: "Wash & trim", description: "A full wash, brushing, coat-appropriate trim, and finishing touches." },
    ],
    image: "/services/wash-trim-care.jpg",
  },
  {
    slug: "dog-grooming",
    title: "Dog Grooming",
    shortDescription:
      "Grooming care for dogs of all sizes and coat types, brought to your door.",
    overview:
      "KulaPAWS offers dog grooming designed around your dog's comfort, delivered through our mobile service so there's no crate, no waiting room, and no stressful car ride.",
    whoItsFor: [
      "Dogs who get anxious in traditional grooming salons",
      "Owners who want grooming done without leaving home",
      "Regular coat, skin, and nail maintenance",
    ],
    process: [
      { title: "Request a visit", description: "Tell us about your dog and choose a time online." },
      { title: "We come to you", description: "Our mobile grooming setup arrives at your home." },
      { title: "Your dog is groomed", description: "A calm, one-on-one grooming session in a familiar setting." },
    ],
    image: "/services/dog-grooming-card.jpg",
  },
  {
    slug: "cat-grooming",
    title: "Cat Grooming",
    shortDescription:
      "Low-stress cat grooming at home, without the carrier or the car ride.",
    overview:
      "Cats tend to do best in their own environment. KulaPAWS brings cat grooming directly to your home, keeping the experience as calm and low-stress as possible.",
    whoItsFor: [
      "Cats who find travel and unfamiliar spaces stressful",
      "Owners who want grooming without a carrier trip",
      "Routine coat and hygiene maintenance",
    ],
    process: [
      { title: "Request a visit", description: "Share a few details about your cat and choose a time online." },
      { title: "We come to you", description: "Our team arrives ready to work in your space." },
      { title: "Your cat is groomed", description: "A gentle, unhurried session at home." },
    ],
    image: "/services/cat-grooming-card.jpg",
  },
  {
    slug: "mobile-pet-grooming",
    title: "Mobile Pet Grooming",
    shortDescription:
      "The convenience of professional grooming, delivered to your driveway.",
    overview:
      "Mobile grooming is at the core of what KulaPAWS does: professional pet grooming that comes to you, so your pet is cared for in a familiar, comfortable environment.",
    whoItsFor: [
      "Busy schedules that make salon visits difficult",
      "Pets that do better without travel or waiting areas",
      "Anyone who prefers one-on-one grooming attention",
    ],
    process: [
      { title: "Book a visit", description: "Request a time that works for you online." },
      { title: "We arrive", description: "Our mobile grooming service comes directly to your home." },
      { title: "Pampering happens", description: "Your pet is groomed on-site, start to finish." },
    ],
    image: "/hero/hero-van-front.jpg",
  },
];

export function getServiceBySlug(slug: string) {
  return services.find((service) => service.slug === slug);
}
