export type FaqCategory =
  | "General"
  | "Dog Grooming"
  | "Cat Grooming"
  | "Mobile Service"
  | "Appointments"
  | "Products";

export const faqCategories: FaqCategory[] = [
  "General",
  "Dog Grooming",
  "Cat Grooming",
  "Mobile Service",
  "Appointments",
  "Products",
];

export interface Faq {
  id: string;
  category: FaqCategory;
  question: string;
  answer: string;
}

// Intentionally empty: real FAQs have not been confirmed yet. See
// README.md §6 (FAQ) and §23 — do not invent questions or answers here.
// Categories mirror README.md §6's FAQ grouping; the FAQ page groups items
// by `category` automatically once real entries are added here.
export const faqs: Faq[] = [];
