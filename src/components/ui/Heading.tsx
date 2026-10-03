import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type HeadingLevel = "display" | "h1" | "h2" | "h3" | "h4";
type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

// display/h1/h2 are the only levels on `font-display` (Fraunces) — see the
// task's typography rules: major display titles only, never small UI text.
// h3/h4 stay unstyled here on purpose, inheriting `body`'s font-sans
// (Manrope). Line-height on the Fraunces levels is nudged up by ~0.05 vs.
// the previous sans-tuned values — a serif's ascenders/descenders (and
// Turkish diacritics like ç/ş/ğ) need a touch more room at the same font
// size; sizes themselves are unchanged.
const levelClasses: Record<HeadingLevel, string> = {
  display:
    "font-display text-[40px] leading-[1.15] font-bold sm:text-[48px] lg:text-[60px]",
  h1: "font-display text-[36px] leading-[1.2] font-bold sm:text-[44px] lg:text-[52px]",
  h2: "font-display text-[30px] leading-[1.2] font-bold sm:text-[34px] lg:text-[40px]",
  h3: "text-[26px] leading-[1.2] font-semibold lg:text-[28px]",
  h4: "text-[22px] leading-[1.25] font-semibold",
};

const defaultTag: Record<HeadingLevel, HeadingTag> = {
  display: "h1",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
};

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level: HeadingLevel;
  as?: HeadingTag;
}

export function Heading({ level, as, className, children, ...props }: HeadingProps) {
  const Tag = as ?? defaultTag[level];

  return (
    <Tag className={cn("text-foreground", levelClasses[level], className)} {...props}>
      {children}
    </Tag>
  );
}
