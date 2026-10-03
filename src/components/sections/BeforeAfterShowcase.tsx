"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { resolveImageSrc } from "@/lib/images/resolveImageSrc";

// How long a manual step (prev/next button, swipe, or arrow key) takes to
// tween one card-step around the ring.
const STEP_TWEEN_MS = 600;
// Slow idle spin — degrees per second, frame-rate independent (see the
// rAF loop below, which scales by real elapsed time rather than a fixed
// per-frame increment).
const AUTO_DEGREES_PER_SECOND = 6;
// Quiet period after the user stops manually interacting before the idle
// spin resumes.
const RESUME_DELAY_MS = 1600;
// Minimum horizontal drag distance (px) before a swipe/drag counts as a
// manual step instead of being ignored.
const SWIPE_THRESHOLD_PX = 40;

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

export interface BeforeAfterGalleryItem {
  // Falls back to the real file at public/before-after/{id}.jpg when
  // `image` (below) is unset. Each file/image is a single comparison
  // graphic (left half = before, right half = after) — there is no
  // separate "after" image to pair it with. Ignored when `placeholder` is
  // set (see below).
  id: string;
  alt: string;
  width: number;
  height: number;
  // Admin-uploaded replacement (a managed public.images.id ref), if set —
  // takes priority over the packaged public/before-after/{id}.jpg default.
  // Shared across every locale (see ImagesManager.tsx), same as
  // hero.image/about.mobileStory.image — only alt text is localized.
  image?: string | null;
  // TEMPORARY: marks a preview-only slot with no real photo yet — renders a
  // neutral dashed "coming soon" box instead of an image, so the gallery's
  // length/spacing can be judged before the real photo exists. Every
  // placeholder entry in src/data/homepage.ts (and its tr/ru mirrors) is
  // commented the same way — search for "TEMPORARY" there when the real
  // photo is ready: swap `placeholder: true` for the real `id`, or delete
  // the entry outright, and remove this flag if no longer needed anywhere.
  placeholder?: boolean;
}

interface BeforeAfterShowcaseProps {
  eyebrow: string;
  heading: string;
  description: string;
  gallery: BeforeAfterGalleryItem[];
  prevLabel: string;
  nextLabel: string;
  // Localized label shown inside a `placeholder` card's neutral box (see
  // dictionary key `shared.galleryPlaceholderLabel`). Only read for
  // placeholder items.
  placeholderLabel: string;
  tone?: "background" | "surface" | "muted" | "secondary";
}

// A 3D "ring" gallery — mechanically the same idea as a standard rotateY +
// translateZ + perspective carousel (a well-known, generic CSS 3D-carousel
// technique, not any one site's proprietary code): every card sits at a
// fixed angle around a ring (`rotateY(cardAngle) translateZ(radius)`,
// radius supplied per breakpoint via CSS custom properties — see the
// [--baw-radius:...] classes below, so no JS viewport measurement/
// hydration-mismatch risk), and the ring itself is rotated by the current
// `rotation` value. Whichever card's angle is currently closest to the
// viewer (smallest |cardAngle - rotation|) reads as the dominant, front-
// facing card — its opacity/scale peaks at 1 and falls off with angular
// distance (see applyCardStyles), which is what gives "center card
// dominant, left/right visible in perspective" for free, at any rotation.
//
// Deliberately does NOT tie rotation to window.scrollY/document scroll
// progress the way the reference demo apparently does — that's an
// explicit requirement here (never touch/derive from global scroll), and
// the idle auto-spin below already gives the same "always slowly moving"
// feel without it. Everything else (rotateY ring, translateZ radius,
// perspective, front-card-dominant falloff) mirrors the reference's
// mechanics; only the motion *driver* differs (time-based rAF here, not
// scroll-based).
export function BeforeAfterShowcase({
  eyebrow,
  heading,
  description,
  gallery,
  prevLabel,
  nextLabel,
  placeholderLabel,
  tone = "surface",
}: BeforeAfterShowcaseProps) {
  const count = gallery.length;
  const angleStep = 360 / count;
  const reducedMotion = usePrefersReducedMotion();

  // Starts from the packaged default path for every item (a synchronous,
  // zero-flash first paint for the common case, since most items have no
  // admin override) and is only ever upgraded per-index once/if
  // resolveImageSrc resolves a real managed ref for that item — same
  // "render the default immediately, swap in the live value after" split
  // every other image slot in this app already uses (see ServiceCard.tsx).
  const [resolvedImages, setResolvedImages] = useState<string[]>(() =>
    gallery.map((item) => `/before-after/${item.id}.jpg`),
  );

  useEffect(() => {
    let active = true;
    Promise.all(gallery.map((item) => (item.image ? resolveImageSrc(item.image) : Promise.resolve(null)))).then(
      (resolved) => {
        if (!active) return;
        setResolvedImages((prev) => prev.map((fallback, index) => resolved[index] ?? fallback));
      },
    );
    return () => {
      active = false;
    };
  }, [gallery]);

  const rotationRef = useRef(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const ringRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const autoFrameRef = useRef<number | null>(null);
  const stepFrameRef = useRef<number | null>(null);
  const resumeTimerRef = useRef<number | null>(null);
  const dragStartX = useRef(0);
  const dragStartY = useRef(0);
  const activePointerId = useRef<number | null>(null);

  // Writes every card's opacity/scale/pointer-events from the current
  // rotation, and the ring wrapper's own rotateY — the only per-frame DOM
  // writes this does; each card's own rotateY/translateZ is static (set
  // once via React props, since it never changes), so a full rotation
  // update is one ring-transform write plus one style write per card, not
  // a React re-render every frame.
  const applyCardStyles = useCallback(() => {
    const rotation = rotationRef.current;
    if (ringRef.current) {
      ringRef.current.style.transform = `rotateY(${-rotation}deg)`;
    }
    let nearestIndex = 0;
    let nearestDiff = Infinity;
    for (let i = 0; i < count; i++) {
      const cardAngle = i * angleStep;
      let diff = (cardAngle - rotation) % 360;
      if (diff > 180) diff -= 360;
      else if (diff < -180) diff += 360;
      const absDiff = Math.abs(diff);
      if (absDiff < nearestDiff) {
        nearestDiff = absDiff;
        nearestIndex = i;
      }
      const el = cardRefs.current[i];
      if (!el) continue;
      // Falls off to fully faint by 90° — the front card plus its two
      // immediate ±45° neighbors read clearly; anything further around the
      // ring (2+ steps away) recedes to a near-invisible ghost instead of
      // staying part-way visible, which is what kept every card readable
      // as a distinct "center + left/right" trio instead of a blurred pile
      // of overlapping translucent cards at tighter radii/small screens.
      const opacity = absDiff <= 90 ? Math.max(1 - absDiff / 90, 0.05) : 0.03;
      const scale = 1 - Math.min(absDiff, 90) / 90 * 0.28;
      el.style.opacity = String(opacity);
      el.style.transform = `rotateY(${cardAngle}deg) translateZ(var(--baw-radius)) scale(${scale})`;
      el.style.pointerEvents = absDiff > angleStep * 0.6 ? "none" : "auto";
      el.style.zIndex = String(Math.round(1000 - absDiff));
    }
    if (nearestIndex !== activeIndexRef.current) {
      activeIndexRef.current = nearestIndex;
      setActiveIndex(nearestIndex);
    }
  }, [count, angleStep]);

  const stopAuto = useCallback(() => {
    if (autoFrameRef.current !== null) {
      cancelAnimationFrame(autoFrameRef.current);
      autoFrameRef.current = null;
    }
  }, []);

  const startAuto = useCallback(() => {
    if (reducedMotion || count <= 1) return;
    stopAuto();
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      rotationRef.current += AUTO_DEGREES_PER_SECOND * dt;
      applyCardStyles();
      autoFrameRef.current = requestAnimationFrame(tick);
    };
    autoFrameRef.current = requestAnimationFrame(tick);
  }, [reducedMotion, count, stopAuto, applyCardStyles]);

  const clearResumeTimer = useCallback(() => {
    if (resumeTimerRef.current !== null) {
      window.clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
  }, []);

  const scheduleResumeAuto = useCallback(() => {
    clearResumeTimer();
    if (reducedMotion || count <= 1) return;
    resumeTimerRef.current = window.setTimeout(() => {
      resumeTimerRef.current = null;
      startAuto();
    }, RESUME_DELAY_MS);
  }, [clearResumeTimer, reducedMotion, count, startAuto]);

  // Steps exactly one card left/right from wherever the ring currently
  // is (including mid-idle-spin), via a frame-rate-independent eased
  // tween — or an instant jump under reduced motion.
  const step = useCallback(
    (direction: 1 | -1) => {
      stopAuto();
      clearResumeTimer();
      if (stepFrameRef.current !== null) {
        cancelAnimationFrame(stepFrameRef.current);
        stepFrameRef.current = null;
      }

      const nearest = Math.round(rotationRef.current / angleStep);
      const targetRotation = (nearest + direction) * angleStep;

      if (reducedMotion) {
        rotationRef.current = targetRotation;
        applyCardStyles();
        scheduleResumeAuto();
        return;
      }

      const start = rotationRef.current;
      const change = targetRotation - start;
      const startTime = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - startTime) / STEP_TWEEN_MS, 1);
        const eased = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2; // easeInOutQuad
        rotationRef.current = start + change * eased;
        applyCardStyles();
        if (t < 1) {
          stepFrameRef.current = requestAnimationFrame(tick);
        } else {
          stepFrameRef.current = null;
          scheduleResumeAuto();
        }
      };
      stepFrameRef.current = requestAnimationFrame(tick);
    },
    [angleStep, reducedMotion, stopAuto, clearResumeTimer, applyCardStyles, scheduleResumeAuto],
  );

  useEffect(() => {
    applyCardStyles();
    startAuto();
    return () => {
      stopAuto();
      clearResumeTimer();
      if (stepFrameRef.current !== null) cancelAnimationFrame(stepFrameRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  useEffect(() => {
    if (reducedMotion) {
      stopAuto();
    } else {
      startAuto();
    }
  }, [reducedMotion, stopAuto, startAuto]);

  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (count <= 1) return;
    activePointerId.current = event.pointerId;
    dragStartX.current = event.clientX;
    dragStartY.current = event.clientY;
    stopAuto();
    clearResumeTimer();
  }

  function endDrag(event: ReactPointerEvent<HTMLDivElement>) {
    if (activePointerId.current !== event.pointerId) return;
    const dx = event.clientX - dragStartX.current;
    const dy = event.clientY - dragStartY.current;
    activePointerId.current = null;
    // A drag that's more vertical than horizontal is the user trying to
    // scroll the page — never treat that as a gallery step (and since we
    // never call preventDefault here, native vertical scrolling was never
    // blocked in the first place).
    if (Math.abs(dx) >= SWIPE_THRESHOLD_PX && Math.abs(dx) >= Math.abs(dy)) {
      step(dx < 0 ? 1 : -1);
    } else {
      scheduleResumeAuto();
    }
  }

  function onGalleryKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      step(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      step(-1);
    }
  }

  return (
    <Section tone={tone}>
      <Container size="wide">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-[65ch]">
            <p className="text-[14px] font-medium uppercase tracking-wide text-primary">{eyebrow}</p>
            <Heading level="h2" className="mt-2">
              {heading}
            </Heading>
            <p className="mt-4 text-[16px] text-muted-foreground sm:text-[18px]">{description}</p>
          </div>
        </div>

        <div
          ref={galleryRef}
          role="region"
          aria-label={heading}
          tabIndex={0}
          onKeyDown={onGalleryKeyDown}
          onPointerDown={onPointerDown}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className="
            relative mt-7 touch-pan-y select-none overflow-hidden sm:mt-10
            [--baw-radius:225px] [--baw-viewport-h:380px] [--baw-persp:1050px] [--baw-card-w:200px] [--baw-card-h:200px]
            sm:[--baw-radius:275px] sm:[--baw-viewport-h:400px] sm:[--baw-persp:1200px] sm:[--baw-card-w:250px] sm:[--baw-card-h:250px]
            lg:[--baw-radius:400px] lg:[--baw-viewport-h:480px] lg:[--baw-persp:1600px] lg:[--baw-card-w:360px] lg:[--baw-card-h:360px]
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
          "
          style={{
            height: "var(--baw-viewport-h)",
          }}
        >
          <div className="relative mx-auto h-full" style={{ perspective: "var(--baw-persp)", width: "1px" }}>
            <div
              ref={ringRef}
              data-gallery-ring="true"
              className="absolute left-1/2 top-1/2 [transform-style:preserve-3d]"
              style={{
                width: "var(--baw-card-w)",
                height: "var(--baw-card-h)",
                marginLeft: "calc(var(--baw-card-w) / -2)",
                marginTop: "calc(var(--baw-card-h) / -2)",
              }}
            >
              {gallery.map((item, index) => (
                <div
                  key={item.id}
                  ref={(el) => {
                    cardRefs.current[index] = el;
                  }}
                  aria-hidden={index !== activeIndex}
                  className="absolute inset-0 h-full w-full overflow-hidden rounded-2xl border border-border/70 bg-muted shadow-[0_24px_48px_-20px_#a83e6847]"
                >
                  {item.placeholder ? (
                    <div
                      role="img"
                      aria-label={placeholderLabel}
                      className="flex h-full w-full items-center justify-center border border-dashed border-border bg-muted p-3 text-center"
                    >
                      <span className="text-[13px] text-muted-foreground sm:text-[14px]">{placeholderLabel}</span>
                    </div>
                  ) : (
                    <Image
                      src={resolvedImages[index]}
                      alt={item.alt}
                      fill
                      sizes="(min-width: 1024px) 360px, (min-width: 640px) 250px, 170px"
                      draggable={false}
                      className="pointer-events-none object-contain"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-3">
          <NavButton direction="prev" label={prevLabel} onClick={() => step(-1)} />
          <NavButton direction="next" label={nextLabel} onClick={() => step(1)} />
        </div>
      </Container>
    </Section>
  );
}

function NavButton({
  direction,
  label,
  onClick,
}: {
  direction: "prev" | "next";
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="
        flex h-10 w-10 items-center justify-center rounded-full border border-border
        text-foreground transition-colors hover:bg-muted
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background
      "
    >
      <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="h-4 w-4">
        <path
          d={direction === "prev" ? "M12.5 5l-5 5 5 5" : "M7.5 5l5 5-5 5"}
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
