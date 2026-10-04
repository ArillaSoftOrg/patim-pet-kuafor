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

// Real services, taken directly from Patim Pet Kuaför's Google Business
// Profile "Hizmetler" (Services) list — dog grooming only; no cat grooming
// or mobile/house-call service is offered or claimed, since neither is
// confirmed anywhere in the source material. Copy below stays close to
// the five listed services; no pricing, inclusions, or process claims
// beyond what's directly supported by that list and the business's
// Instagram bio (breed-specific trim, model cut, internationally
// certified groomer).
export const services: Service[] = [
  {
    slug: "dog-bath-blow-dry",
    title: "Dog Bath & Blow-Dry",
    shortDescription: "A thorough shampoo wash and blow-dry at our salon.",
    overview:
      "A gentle, thorough bath and blow-dry for your dog, done at our salon by Patim Pet Kuaför's groomers.",
    whoItsFor: [
      "Dogs due for a routine wash",
      "Owners who want a clean, fresh coat between full grooms",
      "Any breed and coat type",
    ],
    process: [
      { title: "Drop off", description: "Bring your dog to our salon in Çukurova, Adana." },
      { title: "Bath & blow-dry", description: "A full shampoo wash and careful blow-dry." },
      { title: "Pick up", description: "Collect your freshly washed, fluffed dog." },
    ],
    image: "/grooming/spaniel-result.jpg",
  },
  {
    slug: "dog-grooming",
    title: "Dog Grooming & Care",
    shortDescription: "Breed-specific trims and model cuts, by an internationally certified groomer.",
    overview:
      "Full dog grooming and care at our salon — breed-appropriate trims and model cuts, handled by Faik Kopuz, an internationally certified pet groomer.",
    whoItsFor: [
      "Dogs ready for a full trim or styled cut",
      "Owners looking for a breed-specific or custom look",
      "Regular grooming upkeep",
    ],
    process: [
      { title: "Drop off", description: "Bring your dog in and tell us the look you're after." },
      { title: "Grooming", description: "Bath, trim, and styling at our salon." },
      { title: "Pick up", description: "Collect your freshly groomed dog." },
    ],
    image: "/grooming/toy-poodle-grey-result.jpg",
  },
  {
    slug: "nail-trimming",
    title: "Nail Trimming",
    shortDescription: "Careful nail trimming for dogs.",
    overview: "Nail trimming for dogs, done carefully at our salon as a standalone visit or alongside a groom.",
    whoItsFor: [
      "Dogs due for a routine nail trim",
      "Owners who aren't comfortable trimming nails at home",
    ],
    process: [
      { title: "Drop off", description: "Bring your dog to our salon." },
      { title: "Nail trim", description: "A careful, quick trim." },
      { title: "Pick up", description: "Collect your dog — done." },
    ],
    image: "/grooming/shiba-mix-result.jpg",
  },
  {
    slug: "ear-cleaning",
    title: "Ear Cleaning",
    shortDescription: "Ear cleaning service for dogs.",
    overview: "A dedicated ear cleaning service for dogs, done carefully at our salon.",
    whoItsFor: [
      "Dogs due for routine ear hygiene",
      "Breeds that need regular ear care",
    ],
    process: [
      { title: "Drop off", description: "Bring your dog to our salon." },
      { title: "Ear cleaning", description: "A careful, gentle clean." },
      { title: "Pick up", description: "Collect your dog — done." },
    ],
    image: "/grooming/pomeranian-mohawk-result.jpg",
  },
  {
    slug: "full-grooming-package",
    title: "Full Grooming Package",
    shortDescription: "Patim Pet Kuaför's complete, comprehensive dog care service.",
    overview:
      "Our full, comprehensive dog care package — wash, trim, nail care, and ear cleaning together in one visit.",
    whoItsFor: [
      "Dogs due for complete, all-in-one care",
      "Owners who want everything handled in a single visit",
    ],
    process: [
      { title: "Drop off", description: "Bring your dog in for the day." },
      { title: "Full care", description: "Bath, trim, nail care, and ear cleaning." },
      { title: "Pick up", description: "Collect your dog, fully groomed." },
    ],
    image: "/grooming/chow-chow-portrait.jpg",
  },
];

export function getServiceBySlug(slug: string) {
  return services.find((service) => service.slug === slug);
}
