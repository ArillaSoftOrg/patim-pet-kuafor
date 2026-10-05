import Image from "next/image";
import { cn } from "@/lib/cn";

interface HeroMediaProps {
  images: string[];
  alt: string;
}

const DEFAULT_SIZES = "(min-width: 1280px) 540px, (min-width: 1024px) 460px, 100vw";

// Keeps every layer's fade-in/out perfectly round-robin regardless of count
// — see the shared hero-media-cycle keyframes in globals.css, which assume
// a fixed 15.9s loop split evenly across layers (5.3s/image: 4.5s held at
// full opacity + a 0.8s crossfade), with each layer's fade-out window
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
// overlap. Mobile (HeroMediaCarousel.tsx) mirrors the same 5.3s slot /
// 0.8s crossfade so both variants feel identical in pacing.
const CYCLE_SECONDS = 15.9;
const OVERLAP_SECONDS = 0.8;
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
//
// aspect-[4/5] matches the real gallery photos' native portrait ratio
// (every current /hero/*.jpg is 1440x1800 = 4:5) exactly, so object-cover
// below is a no-op crop — the full subject (head to feet) always shows,
// unlike the previous aspect-video (16:9) box, which kept only ~45% of a
// 4:5 photo's height and cut off heads/paws depending on framing. Sized
// by width (w-full up to a max-width cap), not a fixed height — the lg:
// 60%-of-container media column has real room (~700px+ on a 1360px-wide
// Container), and a fixed ~384px-wide box left most of that column empty.
// Letting width fill the column (capped so it doesn't overwhelm the row)
// and deriving height from aspect-ratio makes the panel the dominant,
// premium visual it's meant to be instead of looking small and lost.
export function HeroMedia({ images, alt }: HeroMediaProps) {
  const isAnimated = images.length > 1;

  return (
    <div
      {...(isAnimated ? { role: "img", "aria-label": alt } : {})}
      className="relative mx-auto aspect-[4/5] w-full max-w-[460px] overflow-hidden rounded-xl border border-border/70 shadow-[0_24px_48px_-20px_#a83e6847] xl:max-w-[540px]"
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
