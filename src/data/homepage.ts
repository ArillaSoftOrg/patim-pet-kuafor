import type { Benefit } from "@/components/sections/BenefitsGrid";
import type { ProcessStep } from "@/components/sections/ProcessSteps";
import type { MobileSalonGalleryItem } from "@/components/sections/MobileSalonShowcase";
import type { ServiceShowcaseItem } from "@/components/sections/ServiceShowcase";
import type { Testimonial } from "@/components/sections/TestimonialsSection";

export interface HomepageContent {
  hero: {
    heading: string;
    description: string;
    image: string | null;
    // Curated real-photo set shown (crossfading) in the Hero's media panel
    // when no admin-uploaded `image` override is set — see HeroMedia.tsx.
    // Always fixed /public paths, not managed Supabase image refs, so it
    // isn't exposed in the admin content form.
    gallery: string[];
    primaryCtaLabel: string;
    secondaryCtaLabel: string;
  };
  mobileSalon: {
    eyebrow: string;
    heading: string;
    description: string;
    gallery: MobileSalonGalleryItem[];
  };
  // A genuine two-image drag-to-reveal comparison (see BeforeAfterSlider.tsx)
  // — not the old pre-composited-graphic carousel (BeforeAfterShowcase.tsx).
  // Only one verified real pair exists today (see before/after sourcing
  // notes below); this shape holds exactly one pair rather than a gallery,
  // since fabricating additional unverified pairs is explicitly out.
  beforeAfter: {
    eyebrow: string;
    heading: string;
    description: string;
    beforeLabel: string;
    afterLabel: string;
    before: { src: string; alt: string };
    after: { src: string; alt: string };
  };
  servicesSection: {
    eyebrow: string;
    heading: string;
    description: string;
    // Curated scroll-driven showcase content (see ServiceShowcase.tsx) —
    // always fixed /public image paths and a hand-picked slug where a real
    // /services/[slug] page exists, same "not managed Supabase image refs"
    // pattern as hero.gallery/mobileSalon.gallery above, so it isn't
    // exposed in the admin content form. This is a distinct, richer
    // presentation from the plain services list on /services (still
    // powered live by servicesRepository) — see HomeContent.tsx.
    showcase: ServiceShowcaseItem[];
  };
  campaign: {
    eyebrow: string;
    heading: string;
    description: string;
    perks: string[];
    ctaLabel: string;
  };
  mobileHighlight: {
    eyebrow: string;
    heading: string;
    description: string;
    bullets: string[];
    image: string | null;
  };
  whyKulapaws: {
    heading: string;
    description: string;
    items: Benefit[];
  };
  productsPreview: {
    heading: string;
    description: string;
  };
  howItWorks: {
    heading: string;
    description: string;
    steps: ProcessStep[];
  };
  testimonials: {
    eyebrow: string;
    heading: string;
    description: string;
    items: Testimonial[];
  };
  faqPreview: {
    heading: string;
  };
  finalCta: {
    heading: string;
    description: string;
  };
}

// Real business facts and real review text only — see src/data/business.ts
// and the project's source material (Google Business Profile, Instagram
// @patimpetkuafor) for what's confirmed. Patim Pet Kuaför is a storefront
// salon in Çukurova, Adana — not a mobile/van service — and offers dog
// grooming only (no cat grooming is listed anywhere in the source
// material), so no copy here claims either.
//
// Photos below are curated from the full @patimpetkuafor Instagram archive
// (gallery-dl export, 110 real photos reviewed) — not the small initial
// hand-picked set. Four other Instagram accounts were present in the same
// export (patimpetmarket, poodle_eysan, turkishpupy, zeusunatasi) but none
// has a confirmed ownership link to this business (patimpetmarket has zero
// photos; the other three are 2-4 file incidental pulls, not this
// account's own content) — none of their files are used anywhere.
export const homepage: HomepageContent = {
  hero: {
    heading: "Dog grooming, done right",
    description:
      "Patim Pet Kuaför is a dog grooming salon in Çukurova, Adana — breed-specific trims, model cuts, and full-service care from an internationally certified groomer.",
    image: null,
    gallery: ["/hero/akita-salon.jpg", "/hero/pomeranian-boutique.jpg", "/hero/frenchie-puppy-bed.jpg"],
    primaryCtaLabel: "Request Appointment",
    secondaryCtaLabel: "Explore Services",
  },
  mobileSalon: {
    eyebrow: "Our Salon",
    heading: "Inside Patim Pet Kuaför",
    description: "A real look at our salon in Çukurova, Adana — the space and the team behind every appointment.",
    gallery: [
      {
        id: "exterior",
        alt: "Patim Pet Kuaför storefront in Çukurova, Adana",
        caption: "Our salon in Çukurova, Adana",
      },
      {
        id: "team-faik",
        alt: "Faik Kopuz, owner and groomer at Patim Pet Kuaför, with a freshly groomed Pomeranian",
        caption: "Faik Kopuz, our certified groomer",
      },
      {
        id: "team-groomer",
        alt: "A Patim Pet Kuaför groomer working on a Yorkshire Terrier",
        caption: "Our grooming team at work",
      },
      {
        id: "faik-grooming-action",
        alt: "Faik Kopuz trimming a dog's coat at the grooming table",
        caption: "Hands-on, careful grooming",
      },
    ],
  },
  // Source: the SAME Instagram carousel post (3580036553405216578) — two
  // photos of the same curly-coated dog against the same marble-tile
  // backdrop, matching face/markings in both frames. Strongest possible
  // evidence tier (same post), not a cross-post breed/color match like the
  // pairing this replaced.
  beforeAfter: {
    eyebrow: "Real Results",
    heading: "Before & After",
    description: "Drag the slider to see a real grooming transformation at our salon.",
    beforeLabel: "Before",
    afterLabel: "After",
    before: {
      src: "/before-after/labradoodle-before.jpg",
      alt: "A curly-coated dog with a long, unstyled coat before a grooming appointment at Patim Pet Kuaför",
    },
    after: {
      src: "/before-after/labradoodle-after.jpg",
      alt: "The same dog with a neatly trimmed teddy-bear cut after grooming at Patim Pet Kuaför",
    },
  },
  servicesSection: {
    eyebrow: "What We Offer",
    heading: "Our Services",
    description: "Dog grooming at our salon in Çukurova, Adana.",
    showcase: [
      {
        number: "01",
        title: "Dog Bath & Blow-Dry",
        description: "A thorough shampoo wash and blow-dry at our salon.",
        bullets: ["Gentle shampoo wash", "Careful blow-dry", "Any breed or coat type"],
        image: "/grooming/spaniel-result.jpg",
        imageAlt: "A freshly bathed and blow-dried spaniel-type dog at Patim Pet Kuaför",
        slug: "dog-bath-blow-dry",
      },
      {
        number: "02",
        title: "Dog Grooming & Care",
        description: "Breed-specific trims and model cuts, by an internationally certified groomer.",
        bullets: ["Breed-specific or model cut", "Internationally certified groomer", "Full bath, trim, and style"],
        image: "/grooming/toy-poodle-grey-result.jpg",
        imageAlt: "A freshly groomed grey Toy Poodle after a full trim at Patim Pet Kuaför",
        slug: "dog-grooming",
      },
      {
        number: "03",
        title: "Nail Trimming",
        description: "Careful nail trimming for dogs.",
        bullets: ["Quick, careful trim", "Standalone or with a groom", "Any breed"],
        image: "/grooming/shiba-mix-result.jpg",
        imageAlt: "A groomed Shiba/Husky-mix dog at Patim Pet Kuaför",
        slug: "nail-trimming",
      },
      {
        number: "04",
        title: "Ear Cleaning",
        description: "A dedicated ear cleaning service for dogs.",
        bullets: ["Gentle, careful clean", "Routine ear hygiene", "Any breed"],
        image: "/grooming/pomeranian-mohawk-result.jpg",
        imageAlt: "A groomed Pomeranian with a styled accent at Patim Pet Kuaför",
        slug: "ear-cleaning",
      },
      {
        number: "05",
        title: "Full Grooming Package",
        description: "Our complete, comprehensive dog care service, in one visit.",
        bullets: ["Wash, trim, nails, and ears", "All in a single visit", "Our most complete service"],
        image: "/grooming/chow-chow-portrait.jpg",
        imageAlt: "A freshly groomed Chow Chow with a full teddy-bear cut at Patim Pet Kuaför",
        slug: "full-grooming-package",
      },
    ],
  },
  campaign: {
    eyebrow: "Now Booking",
    heading: "Book your dog's next groom",
    description:
      "Request an appointment online and bring your dog in for a calm, professional grooming experience at our salon in Çukurova, Adana.",
    perks: [
      "Internationally certified groomer",
      "Breed-specific trims and model cuts",
      "Easy online appointment requests",
    ],
    ctaLabel: "Book Your Dog's Groom",
  },
  mobileHighlight: {
    eyebrow: "Our Salon",
    heading: "A real, hands-on grooming salon",
    description:
      "Patim Pet Kuaför is a dedicated dog grooming salon in Çukurova, Adana — not a chain, and not a drop-in counter at a larger store. Every dog gets focused, careful attention from our certified groomer.",
    bullets: [
      "Internationally certified groomer",
      "Breed-specific trims and model cuts",
      "A real salon you can visit in Çukurova, Adana",
    ],
    image: "/salon/exterior.jpg",
  },
  whyKulapaws: {
    heading: "Why Patim Pet Kuaför",
    description: "A dog grooming salon built on real certification and hands-on care.",
    items: [
      { title: "Certified groomer", description: "Internationally certified, with real grooming expertise." },
      { title: "Personal service", description: "A real, local salon — every dog gets individual attention." },
      { title: "Trusted locally", description: "Rated 4.3 stars by real customers in Adana." },
    ],
  },
  productsPreview: {
    heading: "Pet-Care Products",
    description: "Alongside grooming, Patim Pet Kuaför is also a pet shop for the home.",
  },
  howItWorks: {
    heading: "How It Works",
    description: "Booking a groom at Patim Pet Kuaför is straightforward.",
    steps: [
      { title: "Request an appointment", description: "Tell us about your dog and choose a time online — we'll confirm it with you." },
      { title: "Bring your dog in", description: "Visit our salon in Çukurova, Adana at your appointment time." },
      { title: "Your dog is groomed", description: "A calm, professional grooming session with our certified groomer." },
    ],
  },
  testimonials: {
    eyebrow: "Customer Experiences",
    heading: "What do our customers say?",
    description: "Real reviews from Patim Pet Kuaför's Google Business Profile (4.3 stars, 17 reviews).",
    // Quoted verbatim in the reviewers' original Turkish rather than
    // translated — these are real, attributable quotes, and translating a
    // direct quote risks misrepresenting what the reviewer actually wrote.
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
    heading: "Frequently Asked Questions",
  },
  finalCta: {
    heading: "Ready to book your dog's next groom?",
    description: "Request an appointment online and we'll confirm your visit.",
  },
};
