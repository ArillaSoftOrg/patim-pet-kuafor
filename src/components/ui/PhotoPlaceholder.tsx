import Image from "next/image";
import { cn } from "@/lib/cn";

interface PhotoPlaceholderProps {
  src?: string | null;
  alt?: string;
  label?: string;
  aspect?: "square" | "video" | "portrait" | "portraitCompact";
  fit?: "cover" | "contain";
  className?: string;
  // Only for a true above-the-fold/LCP candidate (e.g. the homepage hero).
  // Next.js 16 deprecated `priority` in favor of this — inserts a
  // <link rel="preload"> in <head> for the image. Leave unset everywhere
  // else: multiple preloaded images compete for bandwidth and can delay
  // the one that actually is the LCP element.
  preload?: boolean;
  // next/image with `fill` defaults to assuming the image spans 100vw if
  // this isn't given, which over-fetches for anything narrower (a
  // two-column layout, a grid card). Callers whose layout differs from
  // DEFAULT_SIZES (tuned for the common half-width two-column case) should
  // pass their own.
  sizes?: string;
  // CSS object-position (e.g. "70% 55%") for when the default centered crop
  // cuts off the real subject — see MobileSalonShowcase's per-image focal
  // point map for why this needs to be per-photo rather than a fixed value.
  objectPosition?: string;
}

const aspectClasses: Record<NonNullable<PhotoPlaceholderProps["aspect"]>, string> = {
  square: "aspect-square",
  video: "aspect-video",
  portrait: "aspect-[3/4]",
  // Less tall than "portrait" — for filmstrip-style cards (e.g.
  // MobileSalonShowcase) where a full 3:4 reads as excessively tall/narrow
  // at small card widths.
  portraitCompact: "aspect-[4/5]",
};

const DEFAULT_SIZES = "(min-width: 1024px) 50vw, 100vw";

// Structural stand-in for real photography (README.md §16 / Imagery rules
// forbid stock/fake business imagery). Pass `src` once a real photo exists —
// the aspect ratio and rounding stay the same either way, so layouts don't
// shift when images are added.
export function PhotoPlaceholder({
  src,
  alt,
  label = "Photo coming soon",
  aspect = "video",
  fit = "cover",
  className,
  preload,
  sizes,
  objectPosition,
}: PhotoPlaceholderProps) {
  if (src) {
    return (
      <div className={cn("relative overflow-hidden rounded-xl", aspectClasses[aspect], className)}>
        <Image
          src={src}
          alt={alt ?? label}
          fill
          sizes={sizes ?? DEFAULT_SIZES}
          className={fit === "contain" ? "object-contain" : "object-cover"}
          style={objectPosition ? { objectPosition } : undefined}
          preload={preload}
          unoptimized={src.startsWith("blob:") || src.startsWith("data:")}
        />
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={label}
      className={cn(
        "flex items-center justify-center rounded-xl border border-dashed border-border bg-muted text-center",
        aspectClasses[aspect],
        className,
      )}
    >
      <span className="px-4 text-[14px] text-muted-foreground">{label}</span>
    </div>
  );
}
