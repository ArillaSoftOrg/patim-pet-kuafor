import type { Faq, FaqCategory } from "@/data/faqs";

// Shared by faqsRepository.ts (browser client, for the public page's own
// live-refresh after hydration) and getFaqsServer.ts (server, cookie-free
// client, for /faq's initial server-rendered HTML) — one conversion, so
// the two can never drift into disagreeing about what a faq row means.
export interface FaqRow {
  id: string;
  category: FaqCategory;
  question: string;
  answer: string;
}

export function rowToFaq(row: FaqRow): Faq {
  return {
    id: row.id,
    category: row.category,
    question: row.question,
    answer: row.answer,
  };
}
