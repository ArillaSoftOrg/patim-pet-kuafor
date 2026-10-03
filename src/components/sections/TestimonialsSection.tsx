"use client";

import { useSyncExternalStore } from "react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { StarIcon } from "@/components/ui/StarIcon";
import { Marquee } from "@/components/ui/marquee-01-utils/marquee";
import { cn } from "@/lib/cn";

export interface Testimonial {
  text: string;
  name: string;
  // Real customer photo path, once available — omit rather than fabricate.
  avatar?: string | null;
  // Only set this when the quote is a real, attributable review (e.g.
  // "Google" or "Instagram") — never label a fabricated quote with a real
  // platform name.
  source?: string;
  // 1-5. Optional — omit rather than guess.
  rating?: number;
}

type Tone = "background" | "surface" | "muted" | "secondary";

interface TestimonialsSectionProps {
  eyebrow: string;
  heading: string;
  description: string;
  items: Testimonial[];
  tone?: Tone;
}

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(callback: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribeReducedMotion, getReducedMotionSnapshot, getReducedMotionServerSnapshot);
}

// The left/right fade needs to end in the section's own solid background
// color (not just "transparent to white") to actually blend in, so it has
// to track the same `tone` Section is given.
const FADE_FROM_CLASS: Record<Tone, string> = {
  background: "from-background",
  surface: "from-surface",
  muted: "from-muted",
  secondary: "from-secondary",
};

// 290px on mobile, 320px from sm+ — narrow enough that the body text (a
// full sentence or two) wraps to 2-3 lines instead of stretching wide on
// one, "roughly 1 full card + a peek of the next" on a ~390px screen and
// several at once on desktop. min-h keeps a row's cards visually even in
// height even when one has a short quote and no rating stars; items-
// stretch on the marquee row (see Marquee) then makes every card in a row
// match whichever is tallest, on top of that floor.
const CARD_WIDTH_CLASS = "w-[290px] min-h-52 flex-none sm:w-80";

// Two horizontally-looping rows of testimonial cards — the layout/
// interaction concept from the shadcn/21st.dev "marquee-01" component
// (duplicated content, one row forward, one reversed, edge fades), rebuilt
// on top of the existing KulaPAWS TestimonialCard and copy; see Marquee
// (components/ui/marquee-01-utils/marquee.tsx) for the actual looping
// mechanism (CSS) and manual drag/wheel handling (JS, per-row, pauses only
// while — and briefly after — the visitor is actively interacting). There
// is no scroll/pause-on-hover CSS here that could second-guess that: see
// Marquee's own file comment for why an earlier hover-based pause was
// removed. Nothing in this file touches scrollTop, so normal page
// scrolling — including a vertical swipe that happens to start on a card
// — is completely unaffected by this section's presence.
export function TestimonialsSection({ eyebrow, heading, description, items, tone = "surface" }: TestimonialsSectionProps) {
  const reducedMotion = usePrefersReducedMotion();
  const half = Math.ceil(items.length / 2);
  const firstRow = items.slice(0, half);
  const secondRow = items.slice(half);
  const fadeFrom = FADE_FROM_CLASS[tone];

  return (
    <Section tone={tone}>
      <Container size="wide">
        <div className="max-w-[65ch]">
          <p className="text-[14px] font-medium uppercase tracking-wide text-primary">{eyebrow}</p>
          <Heading level="h2" className="mt-2">
            {heading}
          </Heading>
          <p className="mt-4 text-[16px] text-muted-foreground sm:text-[18px]">{description}</p>
        </div>

        {reducedMotion ? (
          // Reduced motion: no animation, no duplicated content — a plain,
          // fully readable wrapped row.
          <div className="mt-10 flex flex-wrap gap-4">
            {items.map((testimonial) => (
              <div key={testimonial.name} className={CARD_WIDTH_CLASS}>
                <TestimonialCard testimonial={testimonial} />
              </div>
            ))}
          </div>
        ) : (
          <div className="relative mt-10 flex flex-col gap-4">
            <Marquee>
              {firstRow.map((testimonial) => (
                <div key={testimonial.name} className={CARD_WIDTH_CLASS}>
                  <TestimonialCard testimonial={testimonial} />
                </div>
              ))}
            </Marquee>
            {secondRow.length > 0 && (
              <Marquee reverse>
                {secondRow.map((testimonial) => (
                  <div key={testimonial.name} className={CARD_WIDTH_CLASS}>
                    <TestimonialCard testimonial={testimonial} />
                  </div>
                ))}
              </Marquee>
            )}

            <div
              className={cn(
                "pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r to-transparent sm:w-24",
                fadeFrom,
              )}
              aria-hidden="true"
            />
            <div
              className={cn(
                "pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l to-transparent sm:w-24",
                fadeFrom,
              )}
              aria-hidden="true"
            />
          </div>
        )}
      </Container>
    </Section>
  );
}

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <article className="h-full rounded-2xl border border-border/70 bg-surface p-5 shadow-[0_10px_24px_-18px_#29252633]">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-soft-pink text-[13px] font-semibold text-primary">
          {initials(testimonial.name)}
        </div>
        <div className="min-w-0">
          <p className="truncate text-[14px] font-semibold text-foreground">{testimonial.name}</p>
          {testimonial.source && <p className="text-[12px] text-muted-foreground">{testimonial.source}</p>}
        </div>
      </div>
      {typeof testimonial.rating === "number" && (
        <div className="mt-3 flex gap-0.5">
          {Array.from({ length: 5 }, (_, index) => (
            <StarIcon key={index} filled={index < testimonial.rating!} />
          ))}
        </div>
      )}
      <p className="mt-3 whitespace-normal break-words text-[14px] leading-relaxed text-foreground">{testimonial.text}</p>
    </article>
  );
}
