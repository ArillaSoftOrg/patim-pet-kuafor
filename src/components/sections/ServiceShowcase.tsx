"use client";

import Link from "next/link";
import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { CheckIcon } from "@/components/ui/CheckIcon";
import { buttonVariants } from "@/components/ui/Button";
import { buildLocalizedPath } from "@/lib/i18n/pathLocale";
import type { Locale } from "@/lib/i18n/config";

export interface ServiceShowcaseItem {
  // "01".."05" — shown on each card.
  number: string;
  title: string;
  description: string;
  // 2-3 short, conservative benefit/inclusion lines — no pricing, no
  // medical/veterinary claims (README §16 / DESIGN.md Imagery & content
  // rules apply here the same as everywhere else).
  bullets: string[];
  // Always a fixed /public path (see the `showcase` field comment on
  // HomepageContent in src/data/homepage.ts) — real KulaPAWS photography
  // only, cropped to 16:9 ahead of time so it drops in clean.
  image: string;
  imageAlt: string;
  // Matches a real Service.slug (src/data/services.ts) when a detail page
  // exists for this presentation — the CTA only renders when this is set,
  // per the task's "CTA where an existing valid service route exists" rule.
  slug?: string;
}

interface ServiceShowcaseProps {
  eyebrow: string;
  heading: string;
  description: string;
  items: ServiceShowcaseItem[];
  viewDetailsLabel: string;
  locale: Locale;
}

// Premium, image-led presentation of the 5 curated service offerings —
// custom-built for KulaPAWS: warm cream surface, the existing brand
// palette (primary pink, near-black foreground text — no new colors), and
// rounded real photography.
//
// Desktop (lg+) uses a "stacking cards" interaction — borrowing only the
// *concept* of cards progressively stacking as the page scrolls (each new
// card rising to cover the previous one, which stays partially visible
// peeking out above it), not any particular site's visual design. See
// DesktopStackingShowcase for exactly how, and why it's plain CSS
// `position: sticky` rather than anything scroll-jacking. Below lg,
// MobileStackedShowcase recreates the same sticky-stacking mechanism at a
// mobile-appropriate scale (smaller peek, smaller scale step) rather than a
// different interaction — same reasoning: plain `position: sticky`, so
// normal document scrolling is never touched, no wheel/touch interception,
// no scrollIntoView, no snapping.
export function ServiceShowcase({ eyebrow, heading, description, items, viewDetailsLabel, locale }: ServiceShowcaseProps) {
  return (
    <Section tone="surface">
      <Container size="wide">
        <div className="max-w-[65ch]">
          <p className="text-[14px] font-medium uppercase tracking-wide text-primary">{eyebrow}</p>
          <Heading level="h2" className="mt-2">
            {heading}
          </Heading>
          <p className="mt-4 text-[16px] text-muted-foreground sm:text-[18px]">{description}</p>
        </div>

        <StackingServiceCards items={items} viewDetailsLabel={viewDetailsLabel} locale={locale} />
      </Container>
    </Section>
  );
}

// The responsive stacking-card interaction only, with no heading/eyebrow
// block and no Section/Container of its own — extracted so a caller that
// already renders its own page heading (the standalone /services page, via
// ServiceShowcaseLive.tsx) can reuse the exact same interaction without a
// second, redundant heading. ServiceShowcase above is unchanged behavior —
// it just delegates to this instead of inlining the same two divs.
export function StackingServiceCards({
  items,
  viewDetailsLabel,
  locale,
}: {
  items: ServiceShowcaseItem[];
  viewDetailsLabel: string;
  locale: Locale;
}) {
  return (
    <>
      <div className="lg:hidden">
        <MobileStackedShowcase items={items} viewDetailsLabel={viewDetailsLabel} locale={locale} />
      </div>

      <div className="hidden lg:block">
        <DesktopStackingShowcase items={items} viewDetailsLabel={viewDetailsLabel} locale={locale} />
      </div>
    </>
  );
}

// How much lower (px) each successive card's sticky offset sits than the
// one before it — this, combined with each card wrapper being exactly as
// tall as its own card (no extra vh padding), is the entire mechanism:
// once a card is stuck at its offset and the next one arrives and sticks
// slightly lower, the next one's higher stacking order visually covers
// everything of the previous card except this many pixels peeking above
// it. No scroll listener, no scroll-jacking, no wheel interception — it's
// exactly one CSS property (`position: sticky`) per card plus a per-index
// `top`/`z-index`, so normal page scrolling is never touched or observed.
const STICKY_TOP_BASE = 96;
const STICKY_TOP_STEP = 22;

function DesktopStackingShowcase({
  items,
  viewDetailsLabel,
  locale,
}: {
  items: ServiceShowcaseItem[];
  viewDetailsLabel: string;
  locale: Locale;
}) {
  return (
    <div className="relative mt-12 pb-16">
      {items.map((item, index) => {
        const href = item.slug ? buildLocalizedPath(locale, "/services", `/${item.slug}`) : undefined;
        return (
          <div
            key={item.number}
            className="sticky"
            style={{ top: `${STICKY_TOP_BASE + index * STICKY_TOP_STEP}px`, zIndex: index + 1 }}
          >
            <article
              className="mx-auto grid max-w-[1080px] origin-top grid-cols-[1.15fr_0.85fr] items-center gap-10 overflow-hidden rounded-3xl border border-border/70 bg-surface p-8 shadow-[0_30px_60px_-28px_#a83e6847] xl:gap-14 xl:p-10"
              style={{ transform: `scale(${1 - index * 0.015})` }}
            >
              <div className="relative aspect-video overflow-hidden rounded-2xl">
                <Image src={item.image} alt={item.imageAlt} fill sizes="(min-width: 1280px) 45vw, 50vw" className="object-cover" />
              </div>

              <div>
                <span className="text-[14px] font-bold text-primary/70">{item.number}</span>
                <Heading level="h3" className="mt-2">
                  {item.title}
                </Heading>
                <p className="mt-3 text-[16px] text-muted-foreground">{item.description}</p>
                <ul className="mt-5 flex flex-col gap-2">
                  {item.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2 text-[15px] text-foreground">
                      <CheckIcon className="mt-[3px] flex-shrink-0 text-primary" />
                      {bullet}
                    </li>
                  ))}
                </ul>
                {href && (
                  <Link href={href} className={buttonVariants({ variant: "primary", className: "mt-6" })}>
                    {viewDetailsLabel}
                  </Link>
                )}
              </div>
            </article>
          </div>
        );
      })}
    </div>
  );
}

// Same mechanism as DesktopStackingShowcase above (see that component's
// comment for the full explanation), retuned for mobile card sizes: a much
// smaller peek per layer (12px vs. desktop's 22px) and a smaller per-layer
// scale step, so 5 stacked cards never drift far enough to look broken on
// a 360-390px viewport, while still reading clearly as "next card
// progressively covers the previous one, which keeps peeking out behind
// it." No IntersectionObserver, no scroll listener, no reduced-motion
// branch — `position: sticky` is driven entirely by the browser's own
// native scroll, not a programmatic animation, so there is nothing here
// for prefers-reduced-motion to disable (same as the desktop version).
const MOBILE_STICKY_TOP_BASE = 72;
const MOBILE_STICKY_TOP_STEP = 12;

function MobileStackedShowcase({
  items,
  viewDetailsLabel,
  locale,
}: {
  items: ServiceShowcaseItem[];
  viewDetailsLabel: string;
  locale: Locale;
}) {
  return (
    <div className="relative mt-10 pb-10">
      {items.map((item, index) => {
        const href = item.slug ? buildLocalizedPath(locale, "/services", `/${item.slug}`) : undefined;
        return (
          <div
            key={item.number}
            className="sticky"
            style={{ top: `${MOBILE_STICKY_TOP_BASE + index * MOBILE_STICKY_TOP_STEP}px`, zIndex: index + 1 }}
          >
            <article
              className="mx-auto origin-top overflow-hidden rounded-2xl border border-border/70 bg-surface shadow-[0_16px_32px_-20px_#a83e6847]"
              style={{ transform: `scale(${1 - index * 0.02})` }}
            >
              <div className="relative aspect-[16/10]">
                <Image src={item.image} alt={item.imageAlt} fill sizes="100vw" className="object-cover" />
              </div>
              <div className="bg-surface p-5">
                <span className="text-[13px] font-bold text-primary/70">{item.number}</span>
                <Heading level="h3" className="mt-1 text-[20px]">
                  {item.title}
                </Heading>
                <p className="mt-2 text-[14.5px] text-muted-foreground">{item.description}</p>
                <ul className="mt-3 flex flex-col gap-1.5">
                  {item.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2 text-[13.5px] text-foreground">
                      <CheckIcon className="mt-[3px] flex-shrink-0 text-primary" />
                      {bullet}
                    </li>
                  ))}
                </ul>
                {href && (
                  <Link href={href} className={buttonVariants({ variant: "primary", className: "mt-4 w-full" })}>
                    {viewDetailsLabel}
                  </Link>
                )}
              </div>
            </article>
          </div>
        );
      })}
    </div>
  );
}
