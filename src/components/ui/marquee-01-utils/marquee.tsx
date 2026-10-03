"use client";

import { useEffect, useRef } from "react";
import type { PointerEvent as ReactPointerEvent, ReactNode, WheelEvent as ReactWheelEvent } from "react";
import { cn } from "@/lib/cn";

interface MarqueeProps {
  className?: string;
  // Plays the same loop backwards (right-to-left becomes left-to-right).
  reverse?: boolean;
  children: ReactNode;
  // How many adjacent copies of `children` to render. 2 is enough for a
  // seamless loop (by the time the first copy has scrolled its own full
  // width + gap off-screen, the second — running the identical animation,
  // offset only by normal flex layout — is sitting exactly where the
  // first one started), and is what every consumer here uses; exposed in
  // case a future, much wider marquee ever needs more.
  repeat?: number;
}

// How long after the visitor's last drag/wheel input before autoplay
// resumes.
const RESUME_DELAY_MS = 2000;

// Minimum horizontal movement (px) before a touch/pen gesture is treated
// as "drag this row" rather than "scroll the page" — see onPointerMove.
// Mouse skips this (a click-drag is always deliberate).
const DRAG_THRESHOLD_PX = 8;

// The interaction/layout concept behind the shadcn/21st.dev "marquee-01"
// component: duplicated content in a row, animated with a single looping
// CSS transform, optionally reversed — plus a manual horizontal offset
// layered on top (own translateX, own element, see trackRef below), so a
// visitor can drag/swipe/scroll the row themselves without it fighting the
// autoplay loop. Not a copy of the reference's styling — every visual
// detail is left to the caller's children and className.
//
// There is deliberately no CSS `:hover`-driven pause here (an earlier
// version had one, via a `group-hover:[animation-play-state:paused]`
// class). That's a genuine bug magnet, not just a style choice: an inline
// style always wins over a stylesheet rule, but only once one has actually
// been set — the CSS `:hover` pause was fully unopposed from mount until
// the first drag/wheel interaction, AND on touch devices `:hover` commonly
// gets "stuck" after a tap (there's no touch equivalent of a mouse leaving
// the element to clear it), so a single light tap could pause the
// animation with nothing left to ever resume it. Autoplay pause/resume
// has exactly one authority now: the time-based scheduleResume() below,
// which never inspects pointer/hover position, so it always fires
// regardless of where the pointer ends up.
//
// Gesture ownership for touch is decided by CSS (touch-action: pan-y on
// the container): vertical native panning stays fully native, so a
// vertical page swipe that happens to start on a card scrolls the page
// exactly as it would anywhere else — nothing here calls preventDefault
// or captures the pointer for touch, and nothing reads or writes
// scrollTop/scrollLeft. Horizontal recognition (DRAG_THRESHOLD_PX,
// dx-vs-dy) is a separate, purely-JS concern for deciding when *this*
// component starts following the gesture; it never blocks the browser's
// own vertical handling.
export function Marquee({ className, reverse = false, children, repeat = 2 }: MarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // The manual offset lives on its own element (trackRef), separate from
  // the CSS-animated repeat copies inside it (animatedRefs) — two
  // different elements each owning their own `transform`, so a drag and
  // the ongoing loop can never fight over the same value. Autoplay is
  // paused/resumed by toggling each animated copy's animation-play-state
  // in place, which is how a CSS animation resumes from exactly where it
  // was without any position bookkeeping.
  const trackRef = useRef<HTMLDivElement>(null);
  const animatedRefs = useRef<(HTMLDivElement | null)[]>([]);
  const offsetRef = useRef(0);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    startOffset: number;
    recognized: boolean;
  } | null>(null);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (resumeTimerRef.current !== null) clearTimeout(resumeTimerRef.current);
    },
    [],
  );

  function setPlaying(playing: boolean) {
    for (const el of animatedRefs.current) {
      if (el) el.style.animationPlayState = playing ? "running" : "paused";
    }
  }

  function pauseAutoplay() {
    if (resumeTimerRef.current !== null) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
    setPlaying(false);
  }

  function scheduleResume() {
    if (resumeTimerRef.current !== null) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      resumeTimerRef.current = null;
      setPlaying(true);
    }, RESUME_DELAY_MS);
  }

  function applyOffset(px: number) {
    offsetRef.current = px;
    if (trackRef.current) trackRef.current.style.transform = `translateX(${px}px)`;
  }

  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startOffset: offsetRef.current,
      recognized: false,
    };
  }

  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    const isMouse = event.pointerType === "mouse";

    if (!drag.recognized) {
      // Touch/pen: wait for movement that's both past the threshold and
      // clearly more horizontal than vertical, so a vertical page swipe
      // that merely started on this row is left completely alone (it's
      // already handled natively via touch-action: pan-y regardless —
      // this check is what keeps *this* component from reacting to it).
      if (!isMouse && (Math.abs(dx) < DRAG_THRESHOLD_PX || Math.abs(dx) <= Math.abs(dy))) return;
      drag.recognized = true;
      // Pointer capture only for mouse — never for touch, so a touch
      // gesture is never captured away from the browser's own handling.
      if (isMouse) containerRef.current?.setPointerCapture(event.pointerId);
      pauseAutoplay();
    }

    applyOffset(drag.startOffset + dx);
  }

  function endDrag(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    if (!drag.recognized) return;
    if (event.pointerType === "mouse") containerRef.current?.releasePointerCapture(event.pointerId);
    scheduleResume();
  }

  // Desktop wheel/trackpad: only reacts to genuinely horizontal input
  // (deltaX, e.g. a two-finger trackpad swipe) and only preventDefaults in
  // that case — a plain vertical mouse wheel over this row falls straight
  // through and scrolls the page exactly as normal.
  function onWheel(event: ReactWheelEvent<HTMLDivElement>) {
    if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
    event.preventDefault();
    pauseAutoplay();
    applyOffset(offsetRef.current - event.deltaX);
    scheduleResume();
  }

  return (
    <div
      ref={containerRef}
      className={cn("w-full touch-pan-y overflow-hidden", className)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onWheel={onWheel}
    >
      <div ref={trackRef} className="flex w-fit">
        {Array.from({ length: repeat }, (_, index) => (
          <div
            key={index}
            ref={(el) => {
              animatedRefs.current[index] = el;
            }}
            // Only the first copy needs to be announced — the rest are
            // the same content, repeated purely for the visual loop.
            aria-hidden={index > 0}
            className={cn(
              "flex shrink-0 animate-marquee items-stretch gap-4 pr-4",
              reverse && "[animation-direction:reverse]",
            )}
          >
            {children}
          </div>
        ))}
      </div>
    </div>
  );
}
