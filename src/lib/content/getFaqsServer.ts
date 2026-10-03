import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/publicClient";
import { faqs as defaultFaqs } from "@/data/faqs";
import { rowToFaq } from "@/lib/content/faqRow";
import type { Faq } from "@/data/faqs";
import type { FaqRow } from "@/lib/content/faqRow";

// Server-side counterpart to faqsRepository.list() (which uses the
// cookie-carrying browser client, for the public page's own live-refresh
// after hydration). Same anon-key, RLS-gated read (faqs_public_select,
// scoped to is_published = true) — no service-role key. Used so /faq's
// initial server-rendered HTML already contains the real, published FAQs
// instead of only showing them once the client-side fetch resolves.
//
// Supabase is authoritative once a query succeeds: a successful result —
// zero rows included — is returned as-is, exactly matching
// faqsRepository.list()'s own semantics. This must never fall back to
// src/data/faqs.ts's static default (intentionally empty — see that
// file) just because the live table happens to be empty; that would be a
// fake fallback masquerading as real content. The static default is used
// ONLY when the Supabase request itself fails (network/config error) —
// resilience for an outage, not a second source of truth.
export const getFaqsServer = cache(async (): Promise<Faq[]> => {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase.from("faqs").select("*").order("display_order", { ascending: true });

    if (error) {
      console.error("getFaqsServer: Supabase lookup failed, falling back to static defaults:", error.message);
      return defaultFaqs;
    }

    return (data as FaqRow[]).map(rowToFaq);
  } catch (err) {
    console.error("getFaqsServer: Supabase client failed, falling back to static defaults:", err);
    return defaultFaqs;
  }
});
