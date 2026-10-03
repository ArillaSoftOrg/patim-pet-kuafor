"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { businessRepository, BUSINESS_SYNC_PING_KEY } from "@/lib/content/businessRepository";
import { useLiveContent } from "@/lib/content/useLiveContent";
import { resolveImageSrc } from "@/lib/images/resolveImageSrc";
import type { Business } from "@/data/business";

const STORAGE_KEYS = [BUSINESS_SYNC_PING_KEY];

interface LiveLogoProps {
  defaultBusiness: Business;
  size: number;
  className?: string;
}

// Renders the server-provided default logo/name immediately (matching SSR
// output), then swaps in a locally saved admin override once the
// repository read resolves. Only plain, serializable props cross the
// Server → Client boundary here — no functions.
//
// No preload here: at 48px/40px this is never the largest element on any
// page (the homepage hero, or a page's own H1 text block, always is), so
// it isn't a genuine LCP candidate — it's already in the initial viewport
// either way, so default lazy loading has no visible cost.
//
// Uses `fill` inside a fixed-size wrapper rather than width/height props:
// Tailwind's preflight (`img { height: auto }`) overrides a plain
// next/image width/height box for any non-square source, shrinking the
// slot itself instead of just letterboxing the image inside it. `fill`
// sizes via Next's own inline styles, which preflight can't touch, so the
// slot always stays exactly `size`×`size` and `object-contain` shows the
// whole logo without cropping or distortion.
export function LiveLogo({ defaultBusiness, size, className }: LiveLogoProps) {
  const business = useLiveContent(defaultBusiness, businessRepository.get, STORAGE_KEYS);
  const [src, setSrc] = useState(defaultBusiness.logoSrc);

  useEffect(() => {
    let active = true;
    resolveImageSrc(business.logoSrc).then((resolved) => {
      if (active) setSrc(resolved ?? business.logoSrc);
    });
    return () => {
      active = false;
    };
  }, [business.logoSrc]);

  return (
    <span className="relative inline-block flex-shrink-0" style={{ width: size, height: size }}>
      <Image
        src={src}
        alt={business.name}
        fill
        sizes={`${size}px`}
        className={className ?? "rounded-full object-contain"}
        unoptimized={src.startsWith("blob:") || src.startsWith("data:")}
      />
    </span>
  );
}
