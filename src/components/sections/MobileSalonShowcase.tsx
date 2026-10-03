"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { cn } from "@/lib/cn";

// How long a single glide to the next card takes.
const GLIDE_MS = 550;
// How long the filmstrip rests once a card has arrived before gliding to
// the next one — this is what makes it read as "glide, then pause, then
// glide again" rather than Before/After's continuous drift (see that
// component: the two are intentionally different motion styles). ~3s per
// card, matching the desktop Expanding Cards autoplay interval below.
const PAUSE_MS = 3000;
// Short quiet period after the user stops manually scrolling before
// autoplay picks back up.
const RESUME_DELAY_MS = 1500;

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

export interface MobileSalonGalleryItem {
  // Matches a real file in public/mobile-salon/{id}.jpg — see that
  // directory's source note for where the photos came from.
  id: string;
  alt: string;
  caption: string;
}

interface MobileSalonShowcaseProps {
  eyebrow: string;
  heading: string;
  description: string;
  gallery: MobileSalonGalleryItem[];
  tone?: "background" | "surface" | "muted" | "secondary";
}

// Real photos only (README §16 / DESIGN.md Imagery rules) — a curated set
// pulled from actual Kulapaws van and grooming-session footage, not stock
// imagery. Below md, a snap-scrolling filmstrip auto-plays as a distinct
// glide → pause → glide rhythm (see the autoplay loop below) — one card at
// a time, with the next peeking in — while still accepting native manual
// swipe/scroll at any point (the autoplay loop below still runs at md+, but
// harmlessly: the track is `display:none` there, so its scrollLeft tween is
// a no-op). md+ renders ExpandingCardsGallery instead — see that component.
// `portraitCompact` (4:5, vs. PhotoPlaceholder's default 3:4 "portrait")
// keeps a single card from reading as excessively tall at filmstrip width.
export function MobileSalonShowcase({
  eyebrow,
  heading,
  description,
  gallery,
  tone = "surface",
}: MobileSalonShowcaseProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const glideFrameRef = useRef<number | null>(null);
  const isAnimatingRef = useRef(false);
  const autoplayTimerRef = useRef<number | null>(null);
  const resumeTimerRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const reducedMotion = usePrefersReducedMotion();
  const count = gallery.length;

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const mostVisible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!mostVisible) return;
        const index = cardRefs.current.findIndex((card) => card === mostVisible.target);
        if (index !== -1) setActiveIndex(index);
      },
      { root: track, threshold: [0.6] },
    );

    cardRefs.current.forEach((card) => card && observer.observe(card));
    return () => observer.disconnect();
  }, [count]);

  const clearAutoplayTimer = useCallback(() => {
    if (autoplayTimerRef.current !== null) {
      window.clearTimeout(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }
  }, []);

  const clearResumeTimer = useCallback(() => {
    if (resumeTimerRef.current !== null) {
      window.clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
  }, []);

  // Glides the track's own horizontal scroll position to line the target
  // card up with the left edge — deliberately NOT scrollIntoView/scrollTo
  // (see BeforeAfterShowcase.tsx: those walk up the ancestor chain and can
  // move the *page's* vertical scroll too). Touching only `track.scrollLeft`
  // makes a document-level jump structurally impossible here.
  //
  // `scroll-snap-type` is suspended for the tween's duration for the same
  // reason as BeforeAfterShowcase: Chrome otherwise treats each direct
  // `scrollLeft` write as its own already-settled scroll and snaps straight
  // to the nearest snap point after the first frame, turning the glide into
  // an instant teleport. Re-enabling snap only once the tween lands exactly
  // on the target snap point avoids that. `onComplete` is how the autoplay
  // loop below chains "glide, then pause, then glide again" without ever
  // depending on IntersectionObserver's activeIndex update (which can land
  // mid-glide and would otherwise restart the pause window early).
  const scrollToIndex = useCallback(
    (index: number, onComplete?: () => void) => {
      const track = trackRef.current;
      const card = cardRefs.current[index];
      if (!track || !card) return;

      const delta = card.getBoundingClientRect().left - track.getBoundingClientRect().left;
      const target = track.scrollLeft + delta;

      if (glideFrameRef.current !== null) {
        cancelAnimationFrame(glideFrameRef.current);
        glideFrameRef.current = null;
      }

      if (reducedMotion) {
        track.scrollLeft = target;
        onComplete?.();
        return;
      }

      const start = track.scrollLeft;
      const change = target - start;
      if (change === 0) {
        onComplete?.();
        return;
      }
      const startTime = performance.now();

      isAnimatingRef.current = true;
      track.style.scrollSnapType = "none";
      const step = (now: number) => {
        const t = Math.min((now - startTime) / GLIDE_MS, 1);
        const eased = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2; // easeInOutQuad
        track.scrollLeft = start + change * eased;
        if (t < 1) {
          glideFrameRef.current = requestAnimationFrame(step);
        } else {
          glideFrameRef.current = null;
          track.style.scrollSnapType = "";
          isAnimatingRef.current = false;
          onComplete?.();
        }
      };
      glideFrameRef.current = requestAnimationFrame(step);
    },
    [reducedMotion],
  );

  // The autoplay loop itself: glide to the next card, wait PAUSE_MS once
  // it's arrived, then glide again — a self-chaining sequence (each step
  // schedules the next) rather than a single repeating interval, so it
  // can only ever be "gliding" or "resting", never both at once.
  // `scheduleNextRef` (kept in sync just below) is how the recursive call
  // inside the setTimeout reaches the latest version of this function
  // without referencing the `const` it's still being assigned to.
  const scheduleNextRef = useRef<(delay: number) => void>(() => {});

  const scheduleNext = useCallback(
    (delay: number) => {
      clearAutoplayTimer();
      if (reducedMotion || count <= 1) return;
      autoplayTimerRef.current = window.setTimeout(() => {
        autoplayTimerRef.current = null;
        const next = (activeIndexRef.current + 1) % count;
        scrollToIndex(next, () => scheduleNextRef.current(PAUSE_MS));
      }, delay);
    },
    [clearAutoplayTimer, reducedMotion, count, scrollToIndex],
  );

  useEffect(() => {
    scheduleNextRef.current = scheduleNext;
  }, [scheduleNext]);

  useEffect(() => {
    scheduleNext(PAUSE_MS);
    return () => {
      clearAutoplayTimer();
      clearResumeTimer();
      if (glideFrameRef.current !== null) cancelAnimationFrame(glideFrameRef.current);
    };
  }, [scheduleNext, clearAutoplayTimer, clearResumeTimer]);

  // Manual interaction handling: a touch/pointer down hands control to the
  // user immediately (cancelling any in-flight glide and the autoplay
  // timer); once native scrolling settles, autoplay resumes from wherever
  // IntersectionObserver says the user landed. `isAnimatingRef` lets the
  // scroll listener tell our own programmatic glide's scroll events (fired
  // every frame while `track.scrollLeft` is being written above) apart from
  // a real manual scroll — only the latter should pause/reschedule anything.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    function pauseForInteraction() {
      if (glideFrameRef.current !== null) {
        cancelAnimationFrame(glideFrameRef.current);
        glideFrameRef.current = null;
        track!.style.scrollSnapType = "";
        isAnimatingRef.current = false;
      }
      clearAutoplayTimer();
      clearResumeTimer();
    }

    function scheduleResume() {
      clearResumeTimer();
      if (reducedMotion || count <= 1) return;
      resumeTimerRef.current = window.setTimeout(() => {
        resumeTimerRef.current = null;
        scheduleNext(PAUSE_MS);
      }, RESUME_DELAY_MS);
    }

    function onPointerDown() {
      pauseForInteraction();
    }

    function onScroll() {
      if (isAnimatingRef.current) return;
      pauseForInteraction();
      scheduleResume();
    }

    track.addEventListener("pointerdown", onPointerDown, { passive: true });
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("pointerdown", onPointerDown);
      track.removeEventListener("scroll", onScroll);
    };
  }, [reducedMotion, count, clearAutoplayTimer, clearResumeTimer, scheduleNext]);

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

        {/* Phones/small tablets: the swipeable, autoplaying filmstrip driven
            by all the state/refs above. md+ renders the Expanding Cards
            gallery instead (see ExpandingCardsGallery below) — both stay
            mounted (same pattern as ServiceShowcase's lg breakpoint split)
            so this component doesn't need to know which one is visible. */}
        <div
          ref={trackRef}
          className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 md:hidden"
        >
          {gallery.map((item, index) => (
            <figure
              key={item.id}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              className="w-[74%] flex-none snap-center"
            >
              <PhotoPlaceholder
                src={imageSrcFor(item.id)}
                alt={item.alt}
                aspect="portraitCompact"
                sizes="74vw"
                objectPosition={IMAGE_FOCAL_POINTS[item.id]}
              />
              <figcaption className="mt-3 text-[14px] font-medium leading-snug text-foreground">
                {item.caption}
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="hidden md:block">
          <ExpandingCardsGallery gallery={gallery} />
        </div>
      </Container>
    </Section>
  );
}

// The first two gallery items (van-exterior-front/side) point at the same
// bright, enhanced vehicle photography already used in the Hero instead of
// the older, duller shots in public/mobile-salon/ — see the Hero's own
// gallery (src/data/homepage.ts hero.gallery) for the same two files. Every
// other id still resolves to its real public/mobile-salon/{id}.jpg photo.
const IMAGE_SRC_OVERRIDES: Record<string, string> = {
  "van-exterior-front": "/hero/hero-van-front.jpg",
  "van-exterior-side": "/hero/hero-van-side.jpg",
};

function imageSrcFor(id: string): string {
  return IMAGE_SRC_OVERRIDES[id] ?? `/mobile-salon/${id}.jpg`;
}

// Hand-picked per-image object-position so each card's active (wide) and
// compressed (narrow) crop keeps the van/dog/cat/face in frame instead of
// drifting to a default center crop. Keyed by MobileSalonGalleryItem.id;
// falls back to "center" for any id not listed here. The front/side values
// are tuned for the wide 16:9 Hero photos above (not the old portrait-ish
// mobile-salon originals) — both are landscape shots with the van's
// colorful body/logo sitting right-of-center, so the crop is biased there
// rather than into the sky/gravel at the frame's edges.
const IMAGE_FOCAL_POINTS: Record<string, string> = {
  "van-exterior-front": "68% 56%",
  "van-exterior-side": "70% 60%",
  "mobile-groom-dog": "38% 28%",
  "mobile-groom-pomeranian": "48% 46%",
  "pomeranian-after-groom": "55% 32%",
  "groomers-at-work": "66% 24%",
  "cat-after-groom": "34% 38%",
  "cat-clipper-groom": "28% 55%",
};

// How wide the active card grows relative to each compressed one, in flex-
// grow units (with flex-basis pinned to 0 on every card, the row always
// exactly fills the container — see below). 8 cards means 7 stay
// compressed at any time, so this needs to be generous enough that the
// active card still reads as clearly dominant.
const ACTIVE_GROW = 6;
const INACTIVE_GROW = 1;
const EXPAND_TWEEN_MS = 600;
// How often autoplay advances to the next card.
const AUTOPLAY_INTERVAL_MS = 3000;

// Desktop/tablet (md+) presentation — inspired by the "expanding cards"
// interaction (multiple narrow cards, one active card grows to reveal its
// caption), adapted to KulaPAWS' 8 real photos and current section width.
// Pure CSS: each card's flex-grow is the only thing that changes, so the
// width tween is a single `transition: flex-grow` — no layout library, no
// JS-driven animation loop for the expand/collapse itself (unlike the
// mobile filmstrip's rAF glide, which needs one because it's tweening a
// scroll position, not a CSS property). Autoplay itself IS a small JS timer
// (a CSS-only loop can't advance a piece of React state) — see
// startAutoplay below.
function ExpandingCardsGallery({ gallery }: { gallery: MobileSalonGalleryItem[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const reducedMotion = usePrefersReducedMotion();
  const count = gallery.length;
  const autoplayTimerRef = useRef<number | null>(null);

  const clearAutoplayTimer = useCallback(() => {
    if (autoplayTimerRef.current !== null) {
      window.clearInterval(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }
  }, []);

  // (Re)starts the autoplay interval from now. Called both on mount and on
  // every manual activation, so a manual hover/click/focus doesn't pause
  // autoplay forever — it just pushes the next automatic advance out to
  // AUTOPLAY_INTERVAL_MS from that interaction, after which autoplay keeps
  // going on its own. A no-op under reduced motion (no interval is ever
  // created), and a no-op with 0-1 cards (nothing to cycle to).
  const startAutoplay = useCallback(() => {
    clearAutoplayTimer();
    if (reducedMotion || count <= 1) return;
    autoplayTimerRef.current = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % count);
    }, AUTOPLAY_INTERVAL_MS);
  }, [clearAutoplayTimer, reducedMotion, count]);

  useEffect(() => {
    startAutoplay();
    return clearAutoplayTimer;
  }, [startAutoplay, clearAutoplayTimer]);

  // Every manual activation path (hover, click, keyboard focus) goes
  // through this so all three consistently reset the 3s timer instead of
  // only some of them.
  const activate = useCallback(
    (index: number) => {
      setActiveIndex(index);
      startAutoplay();
    },
    [startAutoplay],
  );

  return (
    <div className="mt-10 flex h-[340px] gap-3 overflow-hidden md:h-[380px] lg:h-[440px] lg:gap-4">
      {gallery.map((item, index) => {
        const active = index === activeIndex;
        return (
          <button
            key={item.id}
            type="button"
            onMouseEnter={() => activate(index)}
            onFocus={() => activate(index)}
            onClick={() => activate(index)}
            aria-pressed={active}
            aria-label={item.caption}
            className="relative min-w-0 overflow-hidden rounded-2xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            style={{
              flexGrow: active ? ACTIVE_GROW : INACTIVE_GROW,
              flexShrink: 1,
              flexBasis: 0,
              transition: reducedMotion ? undefined : `flex-grow ${EXPAND_TWEEN_MS}ms cubic-bezier(0.65, 0, 0.35, 1)`,
            }}
          >
            <Image
              src={imageSrcFor(item.id)}
              alt={item.alt}
              fill
              sizes="(min-width: 1024px) 55vw, 70vw"
              className="object-cover"
              style={{ objectPosition: IMAGE_FOCAL_POINTS[item.id] ?? "center" }}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />
            <p
              className={cn(
                "absolute inset-x-0 bottom-0 p-4 text-[14px] font-medium leading-snug text-white transition-[opacity,transform] duration-300",
                active ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-2",
              )}
            >
              {item.caption}
            </p>
          </button>
        );
      })}
    </div>
  );
}
