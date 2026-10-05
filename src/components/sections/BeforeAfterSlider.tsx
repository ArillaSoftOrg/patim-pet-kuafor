"use client";

import { useCallback, useRef, useState, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from "react";
import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";

interface BeforeAfterSliderProps {
  eyebrow: string;
  heading: string;
  description: string;
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
  // Short labels shown in the corner chips (e.g. "Before"/"After" or their
  // localized equivalents) and used to build the slider's aria-label.
  beforeLabel: string;
  afterLabel: string;
  tone?: "background" | "surface" | "muted" | "secondary";
}

const STEP_PERCENT = 5;

// A real two-image drag-to-reveal comparison slider — distinct from
// BeforeAfterShowcase.tsx (a 3D ring carousel for pre-composited single
// comparison graphics, which this does not replace or reuse; that
// component is kept for any future case with ready-made before/after
// composites, but this is what a genuine before+after *pair* needs).
// The "before" image sits on top, clipped to the left `position`% via
// clip-path; the "after" image underneath is always full-bleed, so at
// rest (position=50) the LEFT half shows "before" and the RIGHT half
// shows "after" through where the top layer is clipped away — dragging
// the handle right reveals more "before" (left grows), dragging left
// reveals more "after" (right grows). The only moving piece is one
// clip-path write per drag frame.
//
// Pointer movement during an active drag bypasses React state entirely —
// it writes clip-path/left directly to the DOM via refs (updatePositionDOM)
// instead of calling setPosition, which would otherwise force a full
// component re-render (and a VDOM diff of both <Image>s) on every single
// pointermove event, the usual cause of a drag feeling laggy/rubber-banded
// in React. `position` state still exists and is the source of truth for
// the initial render and for keyboard stepping (both low-frequency, where
// a normal re-render is free) — a drag only writes it back once, on
// pointerup, to resync state with wherever the direct DOM writes landed.
// The container's bounding rect is measured once per drag (on pointerdown,
// cached in a ref) rather than on every pointermove — a drag doesn't
// change the container's own layout, so re-measuring per frame was a
// wasted read, not a free one.
export function BeforeAfterSlider({
  eyebrow,
  heading,
  description,
  beforeSrc,
  afterSrc,
  beforeAlt,
  afterAlt,
  beforeLabel,
  afterLabel,
  tone = "surface",
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const beforeClipRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const positionRef = useRef(50);
  const dragRectRef = useRef<{ left: number; width: number } | null>(null);

  const updatePositionDOM = useCallback((pct: number) => {
    positionRef.current = pct;
    if (beforeClipRef.current) beforeClipRef.current.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
    if (dividerRef.current) dividerRef.current.style.left = `${pct}%`;
    if (handleRef.current) {
      handleRef.current.style.left = `${pct}%`;
      handleRef.current.setAttribute("aria-valuenow", String(Math.round(pct)));
    }
  }, []);

  const updateFromClientX = useCallback(
    (clientX: number) => {
      const rect = dragRectRef.current;
      if (!rect) return;
      const pct = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
      updatePositionDOM(pct);
    },
    [updatePositionDOM],
  );

  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    dragRectRef.current = { left: rect.left, width: rect.width };
    draggingRef.current = true;
    (event.target as Element).setPointerCapture?.(event.pointerId);
    updateFromClientX(event.clientX);
  }

  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!draggingRef.current) return;
    updateFromClientX(event.clientX);
  }

  function endDrag() {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    dragRectRef.current = null;
    // One React state write per drag (not per move) — syncs `position` so
    // a later re-render (e.g. from a keyboard nudge right after) starts
    // from the correct value instead of snapping back to the last
    // state-driven position.
    setPosition(positionRef.current);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setPosition((p) => {
        const next = Math.max(0, p - STEP_PERCENT);
        updatePositionDOM(next);
        return next;
      });
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      setPosition((p) => {
        const next = Math.min(100, p + STEP_PERCENT);
        updatePositionDOM(next);
        return next;
      });
    } else if (event.key === "Home") {
      event.preventDefault();
      setPosition(0);
      updatePositionDOM(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setPosition(100);
      updatePositionDOM(100);
    }
  }

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

        <div
          ref={containerRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className="relative mx-auto mt-7 aspect-[4/5] w-full max-w-[480px] touch-none select-none overflow-hidden rounded-2xl border border-border/70 shadow-[0_24px_48px_-20px_#3c170433] sm:mt-10"
        >
          {/* After: always full-bleed underneath, revealed on the right
              wherever the "before" layer above is clipped away. */}
          <Image src={afterSrc} alt={afterAlt} fill sizes="(min-width: 640px) 480px, 100vw" className="object-cover" draggable={false} priority />

          {/* Before: clipped to the revealed (left) region on top, so at
              rest the left half is "before" and the right half is "after"
              — see the component-level comment for the full reveal-math
              rationale. inset() is written directly (not via a wrapping
              div's width) so there's exactly one style mutation per drag
              frame — and during an active drag, that mutation goes
              straight to this ref (see updatePositionDOM), bypassing React
              entirely. will-change hints the compositor that this layer's
              clip region changes often, so it doesn't have to discover
              that mid-drag. */}
          <div
            ref={beforeClipRef}
            className="pointer-events-none absolute inset-0 [will-change:clip-path]"
            style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
          >
            <Image src={beforeSrc} alt={beforeAlt} fill sizes="(min-width: 640px) 480px, 100vw" className="object-cover" draggable={false} />
          </div>

          {/* Corner chips — always-visible context for which side is which,
              independent of divider position. */}
          <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/55 px-3 py-1 text-[12px] font-medium uppercase tracking-wide text-white">
            {beforeLabel}
          </span>
          <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-black/55 px-3 py-1 text-[12px] font-medium uppercase tracking-wide text-white">
            {afterLabel}
          </span>

          {/* Divider line + drag handle. role="slider" so the exact reveal
              point is both draggable and keyboard-operable (Arrow keys,
              Home/End) per the WAI-ARIA slider pattern — the handle itself
              is the focusable, labelled control. */}
          <div ref={dividerRef} className="pointer-events-none absolute inset-y-0 w-0.5 bg-white/90" style={{ left: `${position}%` }} />
          <div
            ref={handleRef}
            role="slider"
            tabIndex={0}
            aria-label={`${beforeLabel} / ${afterLabel}`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(position)}
            onKeyDown={onKeyDown}
            className="absolute top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full border-2 border-white bg-primary text-primary-foreground shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            style={{ left: `${position}%` }}
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5">
              <path d="M8 7l-5 5 5 5M16 7l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </Container>
    </Section>
  );
}
