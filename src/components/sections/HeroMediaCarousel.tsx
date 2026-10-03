"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";

interface HeroMediaCarouselProps {
  images: string[];
  alt: string;
}

// Same full-cycle length as the desktop crossfade (see HeroMedia.tsx's
// CYCLE_SECONDS) — one auto-advance per image, split evenly, so both
// variants take the same 11.34s (3.78s/image) to cycle through the gallery
// once, and feel identically paced.
const CYCLE_SECONDS = 11.34;
// How long each crossfade takes — matches HeroMedia.tsx's OVERLAP_SECONDS.
// Long enough that outgoing/incoming images visibly cross-dissolve rather
// than cut.
const CROSSFADE_MS = 900;
// Same smooth ease-in-out as the desktop crossfade (see globals.css's
// hero-media-cycle) — a snappier ease-out here read as an abrupt cut
// instead of a continuous, cinematic dissolve.
const CROSSFADE_EASING = "ease-in-out";

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

// useSyncExternalStore (rather than effect+setState) since this reads a
// live browser API — the recommended React pattern for subscribing to an
// external source, and it stays correct through SSR/hydration.
function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribeReducedMotion, getReducedMotionSnapshot, getReducedMotionServerSnapshot);
}

// Auto-advancing crossfade carousel for the Hero's vehicle photos below lg
// (see Hero.tsx, which shows this instead of the desktop HeroMedia
// crossfade). Visually matches the desktop treatment — a soft, overlapping
// crossfade between stacked, absolutely-positioned layers (outgoing/
// incoming visibly cross-dissolve, cinematic rather than a cut), each with
// a subtle continuous Ken Burns zoom/pan (see .hero-carousel-layer in
// globals.css). Advances on a timer only — no pointer/touch handling here,
// by design: the Hero must never respond to a manual swipe (see the mobile
// Hero requirements), unlike BeforeAfterShowcase/MobileSalonShowcase below
// it on the page, which are user-driven.
export function HeroMediaCarousel({ images, alt }: HeroMediaCarouselProps) {
  const count = images.length;
  const isAnimated = count > 1;
  const [index, setIndex] = useState(0);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!isAnimated || reducedMotion) return;
    const slideMs = (CYCLE_SECONDS / count) * 1000;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, slideMs);
    return () => window.clearInterval(id);
  }, [count, isAnimated, reducedMotion]);

  return (
    <div
      {...(isAnimated ? { role: "img", "aria-label": alt } : {})}
      className="relative mx-auto aspect-video w-full max-w-[560px] overflow-hidden rounded-xl border border-border/70 shadow-[0_24px_48px_-20px_#a83e6847]"
    >
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt={isAnimated ? "" : alt}
          fill
          sizes="100vw"
          preload={i === 0}
          draggable={false}
          className={cn(
            "pointer-events-none object-cover",
            isAnimated && "hero-carousel-layer transition-opacity",
            i === index ? "opacity-100" : "opacity-0",
          )}
          style={
            isAnimated
              ? {
                  transitionDuration: `${CROSSFADE_MS}ms`,
                  transitionTimingFunction: CROSSFADE_EASING,
                  animationDelay: `${-(i * (9 / count))}s`,
                }
              : undefined
          }
        />
      ))}
    </div>
  );
}
