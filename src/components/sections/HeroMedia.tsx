import Image from "next/image";
import { cn } from "@/lib/cn";

interface HeroMediaProps {
  images: string[];
  alt: string;
}

const DEFAULT_SIZES = "(min-width: 1024px) 50vw, 100vw";

// Keeps every layer's fade-in/out perfectly round-robin regardless of count
// — see the shared hero-media-cycle keyframes in globals.css, which assume
// a fixed 11.34s loop split evenly across layers (3.78s/image: ~2.88s held
// at full opacity + a 0.9s crossfade), with each layer's fade-out window
// deliberately overlapping the next layer's fade-in window (see
// OVERLAP_SECONDS) so the two visibly cross-dissolve — a soft, video-like
// overlap rather than a hard cut — and the crossfade never dips toward
// "everything near zero opacity" at once either. The extra phase shift puts
// the first layer mid-hold at t=0 instead of mid-fade-in, so the LCP photo
// is fully visible on first paint rather than fading in from blank.
//
// CYCLE_SECONDS must stay in sync with the keyframe percentages in
// globals.css (they're OVERLAP_SECONDS/CYCLE_SECONDS and
// (slot+OVERLAP_SECONDS)/CYCLE_SECONDS baked in as static numbers) —
// changing one without the other breaks the "always one image visible"
// overlap. Mobile (HeroMediaCarousel.tsx) mirrors the same 3.78s slot /
// 0.9s crossfade so both variants feel identical in pacing.
const CYCLE_SECONDS = 11.34;
const OVERLAP_SECONDS = 0.9;
const PHASE_SHIFT_SECONDS = 1;

function layerDelay(index: number, count: number): string {
  const slot = CYCLE_SECONDS / count;
  return `${index * slot - OVERLAP_SECONDS - PHASE_SHIFT_SECONDS}s`;
}

// The Hero's media panel. A hairline neutral border plus a soft,
// brand-tinted shadow for depth — no offset colored backing card, no
// gradient/glow/blob (DESIGN.md's Forbidden Patterns) — so the real
// vehicle photos stay the visual focus. With 2+ images it slowly
// crossfades between them with a gentle Ken Burns zoom/pan; with exactly
// one (an admin-uploaded custom hero photo) it's simply static. See
// .hero-media-layer in globals.css for the motion and its
// prefers-reduced-motion override (shows the first image statically).
export function HeroMedia({ images, alt }: HeroMediaProps) {
  const isAnimated = images.length > 1;

  return (
    <div
      {...(isAnimated ? { role: "img", "aria-label": alt } : {})}
      className="relative mx-auto aspect-video w-full max-w-[560px] overflow-hidden rounded-xl border border-border/70 shadow-[0_24px_48px_-20px_#a83e6847] lg:max-w-none"
    >
      {images.map((src, index) => (
        <Image
          key={src}
          src={src}
          alt={isAnimated ? "" : alt}
          fill
          sizes={DEFAULT_SIZES}
          preload={index === 0}
          className={cn("object-cover", isAnimated && "hero-media-layer opacity-0")}
          style={isAnimated ? { animationDelay: layerDelay(index, images.length) } : undefined}
        />
      ))}
    </div>
  );
}
