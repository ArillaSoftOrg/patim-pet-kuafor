import type { Benefit } from "@/components/sections/BenefitsGrid";
import type { ProcessStep } from "@/components/sections/ProcessSteps";
import type { MobileSalonGalleryItem } from "@/components/sections/MobileSalonShowcase";
import type { BeforeAfterGalleryItem } from "@/components/sections/BeforeAfterShowcase";
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
  beforeAfter: {
    eyebrow: string;
    heading: string;
    description: string;
    prevLabel: string;
    nextLabel: string;
    goToSlideLabel: string;
    gallery: BeforeAfterGalleryItem[];
  };
  servicesSection: {
    eyebrow: string;
    heading: string;
    description: string;
    // Curated scroll-driven showcase content (see ServiceShowcase.tsx) —
    // always fixed /public image paths and a hand-picked slug where a real
    // /services/[slug] page exists, same "not managed Supabase image refs"
    // pattern as hero.gallery/mobileSalon.gallery/beforeAfter.gallery above,
    // so it isn't exposed in the admin content form. This is a distinct,
    // richer presentation from the plain services list on /services (still
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
    // TEMPORARY DEMO TESTIMONIALS — REPLACE WITH VERIFIED GOOGLE/INSTAGRAM
    // REVIEWS. See the `items` assignment below for the full note.
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

// Provisional, generic copy (README.md §7 flags real homepage content —
// tagline, hero headline, process steps, etc. — as not yet collected).
// Centralized here so replacing it with confirmed content is a data edit,
// not a page-component edit.
export const homepage: HomepageContent = {
  hero: {
    heading: "Mobile pet grooming that comes to you",
    description:
      "KulaPAWS brings mobile dog and cat grooming to your door across the Antalya area — so your pet stays calm and comfortable at home.",
    image: null,
    gallery: ["/hero/hero-van-side.jpg", "/hero/hero-van-front.jpg", "/hero/hero-van-rear.jpg"],
    primaryCtaLabel: "Request Appointment",
    secondaryCtaLabel: "Explore Services",
  },
  mobileSalon: {
    eyebrow: "Meet The Van",
    heading: "Meet Our Mobile Salon",
    description:
      "A real look inside the van that brings grooming to your door — the tools, the setup, and the team behind every appointment.",
    gallery: [
      {
        id: "van-exterior-front",
        alt: "KulaPAWS mobile grooming van parked outside",
        caption: "Our fully-equipped grooming van",
      },
      {
        id: "van-exterior-side",
        alt: "Side view of the KulaPAWS mobile pet salon van",
        caption: "Kitted out for dogs and cats",
      },
      {
        id: "mobile-groom-dog",
        alt: "A freshly groomed dog held up inside the van",
        caption: "Grooming, right where your pet feels safe",
      },
      {
        id: "mobile-groom-pomeranian",
        alt: "A Pomeranian being dried after its bath in the van",
        caption: "Bath and blow-dry, on board",
      },
      {
        id: "pomeranian-after-groom",
        alt: "A fluffy Pomeranian after grooming",
        caption: "Fluffed, trimmed, and happy",
      },
      {
        id: "groomers-at-work",
        alt: "KulaPAWS groomers working together inside the van",
        caption: "Our groomers at work",
      },
      {
        id: "cat-after-groom",
        alt: "A groomed cat held up after its session",
        caption: "Cats get the same gentle care",
      },
      {
        id: "cat-clipper-groom",
        alt: "A Scottish Fold cat being clipped on the grooming table inside the van",
        caption: "Careful, hands-on trimming for cats too",
      },
    ],
  },
  beforeAfter: {
    eyebrow: "Real Results",
    heading: "Before & After",
    description: "A real look at the transformation from some of our mobile grooming sessions.",
    prevLabel: "Previous photo",
    nextLabel: "Next photo",
    goToSlideLabel: "Go to photo",
    gallery: [
      {
        id: "before-after-01",
        alt: "Before and after grooming photos of a fluffy dog, showing a full coat wash and trim",
        width: 1086,
        height: 1448,
      },
      {
        id: "before-after-02",
        alt: "Before and after grooming photos of a curly-coated dog, showing a tidy, shaped trim",
        width: 1254,
        height: 1254,
      },
      {
        id: "before-after-03",
        alt: "Before and after grooming photos of a small white dog, showing a clean, shaped coat",
        width: 1144,
        height: 1375,
      },
      {
        id: "before-after-04",
        alt: "Before and after grooming photos of a small dog, showing a neat face and coat trim",
        width: 1254,
        height: 1254,
      },
      {
        id: "before-after-05",
        alt: "Before and after grooming photos of a curly-coated puppy, showing a full wash, trim, and a bandana finish",
        width: 1345,
        height: 1170,
      },
      {
        id: "before-after-06",
        alt: "Before and after grooming photos of an apricot curly-coated dog, showing a neat, rounded trim",
        width: 1345,
        height: 1170,
      },
      {
        id: "before-after-07",
        alt: "Before and after grooming photos of a Golden Retriever, showing a full wash and blow-dry",
        width: 1345,
        height: 1170,
      },
      {
        id: "before-after-08",
        alt: "Before and after grooming photos of a grey British Shorthair cat, showing a neat coat trim",
        width: 1345,
        height: 1170,
      },
    ],
  },
  servicesSection: {
    eyebrow: "What We Offer",
    heading: "Our Services",
    description: "Grooming care built around your pet, wherever home is.",
    showcase: [
      {
        number: "01",
        title: "Wash & Basic Care",
        description: "Nail trimming, ear cleaning, brushing, and essential upkeep.",
        bullets: ["Gentle shampoo wash", "Nail trim and ear cleaning", "Brushing and de-matting"],
        image: "/services/wash-basic-care.jpg",
        imageAlt: "A Pomeranian being dried after its bath in the KulaPAWS van",
        slug: "wash-basic-care",
      },
      {
        number: "02",
        title: "Wash + Trim Care",
        description: "A wash, a coat-appropriate trim, brushing, and finishing touches.",
        bullets: ["Wash and blow-dry", "Breed-appropriate or custom trim", "Brushing and finishing touches"],
        image: "/services/wash-trim-care.jpg",
        imageAlt: "A freshly trimmed and groomed Pomeranian",
        slug: "wash-trim-care",
      },
      {
        number: "03",
        title: "Dog Grooming",
        description: "Grooming tailored to your dog's breed, coat, and needs.",
        bullets: ["Tailored to breed and coat type", "Calm, familiar home setting", "Routine nail and ear care"],
        image: "/services/dog-grooming-card.jpg",
        imageAlt: "A puppy being groomed inside the KulaPAWS van",
        slug: "dog-grooming",
      },
      {
        number: "04",
        title: "Cat Grooming",
        description: "A calmer, more controlled, and attentive approach for cats.",
        bullets: ["Calm, low-stress approach", "No carrier or car ride", "Brushing and essential care"],
        image: "/services/cat-grooming-card.jpg",
        imageAlt: "A cat being groomed inside the KulaPAWS van",
        slug: "cat-grooming",
      },
      {
        number: "05",
        title: "Mobile Pet Grooming",
        description: "The KulaPAWS grooming van brings the service directly to you.",
        bullets: ["The grooming van comes to your door", "No waiting room or transport", "One-on-one attention start to finish"],
        image: "/hero/hero-van-front.jpg",
        imageAlt: "The KulaPAWS mobile grooming van",
        slug: "mobile-pet-grooming",
      },
    ],
  },
  campaign: {
    eyebrow: "Now Booking",
    heading: "Your pet's next groom, without the stress of getting there",
    description:
      "Skip the crate, the car ride, and the waiting room. Book a mobile grooming appointment and give your pet a calm, one-on-one experience — right at home.",
    perks: [
      "Comes directly to your door",
      "Calm, one-on-one attention",
      "Flexible scheduling that fits your day",
    ],
    ctaLabel: "Book Your Pet's Groom",
  },
  mobileHighlight: {
    eyebrow: "Mobile Service",
    heading: "Grooming, delivered to your door",
    description:
      "No crate, no car ride, no waiting room. Our mobile grooming service means your pet is cared for in a familiar, low-stress setting — right at home.",
    bullets: [
      "Grooming happens where your pet is most comfortable",
      "No transport or drop-off required",
      "One-on-one attention from start to finish",
    ],
    // Reuses one of the Hero's own vehicle photos (see hero.gallery above) —
    // same real van, already a clean 16:9 shot with the pet mural fully
    // visible, so no new asset/crop was needed for this landscape panel.
    image: "/hero/hero-van-side.jpg",
  },
  whyKulapaws: {
    heading: "Why KulaPAWS",
    description: "A pet-care brand built to feel approachable, caring, and easy to trust.",
    items: [
      { title: "Caring by default", description: "Every visit is centered on your pet's comfort, not just the groom." },
      { title: "Genuinely convenient", description: "Mobile service means grooming fits into your day, not the other way around." },
      { title: "Clean & professional", description: "A consistent, careful approach to every appointment." },
    ],
  },
  productsPreview: {
    heading: "Pet-Care Products",
    description: "Alongside grooming, KulaPAWS offers pet-care products for the home.",
  },
  howItWorks: {
    heading: "How It Works",
    description: "Getting your pet groomed at home is straightforward.",
    steps: [
      { title: "Request a visit", description: "Tell us about your pet and choose a time online — we'll confirm it with you." },
      { title: "We come to you", description: "Our mobile grooming service arrives at your home." },
      { title: "Your pet is pampered", description: "A calm, one-on-one grooming session on-site." },
    ],
  },
  testimonials: {
    eyebrow: "Customer Experiences",
    heading: "What do the pet parents who trust us say?",
    description: "A few words from pet parents who've had KulaPAWS come to their door.",
    // TEMPORARY DEMO TESTIMONIALS — REPLACE WITH VERIFIED GOOGLE/INSTAGRAM
    // REVIEWS. These are placeholder quotes written to demonstrate the
    // testimonials layout only — no `source` is set on any of them because
    // none of them are real, attributable reviews (see the `source` field
    // note on Testimonial in TestimonialsSection.tsx). Swap this array for
    // real reviews once collected; the shape (text/name/avatar?/source?/
    // rating?) is designed so that's a data-only change.
    items: [
      {
        text: "KulaPAWS came right to our door and our dog didn't feel stressed at all — such a relaxed experience for both of us.",
        name: "Elif A.",
        rating: 5,
      },
      {
        text: "No crate, no car ride, just a calm groom at home. Our cat actually seemed comfortable the whole time.",
        name: "Mert Y.",
        rating: 5,
      },
      {
        text: "The team was gentle and patient with our older dog. We'll definitely be booking again.",
        name: "Ayşe K.",
        rating: 4,
      },
      {
        text: "Booking was easy and they showed up right on time. The van has everything they need.",
        name: "Caner B.",
        rating: 5,
      },
      {
        text: "Our Pomeranian came out looking fluffy and happy. Great attention to detail.",
        name: "Zeynep T.",
        rating: 5,
      },
      {
        text: "Having the groomer come to us made such a difference for our anxious cat.",
        name: "Baran S.",
        rating: 5,
      },
      {
        text: "Professional, friendly, and clearly good with animals. Highly recommend the mobile service.",
        name: "Deniz K.",
        rating: 5,
      },
      {
        text: "Quick to respond on WhatsApp and flexible with scheduling around our day.",
        name: "Selin M.",
        rating: 4,
      },
      {
        text: "Our dog usually hates grooming day, but this time he was calm the whole visit.",
        name: "Onur Ç.",
        rating: 5,
      },
    ],
  },
  faqPreview: {
    heading: "Frequently Asked Questions",
  },
  finalCta: {
    heading: "Ready to book your pet's next groom?",
    description: "Request an appointment online and we'll confirm your visit.",
  },
};
