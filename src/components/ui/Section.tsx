import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type SectionTone = "background" | "surface" | "muted" | "secondary" | "primary";

const toneClasses: Record<SectionTone, string> = {
  background: "bg-background",
  surface: "bg-surface",
  muted: "bg-muted",
  secondary: "bg-secondary",
  primary: "bg-primary",
};

type SectionPadding = "default" | "hero";

// "default" is the shared vertical rhythm for every section on the public
// site. "hero" is a tighter, top-heavier variant for Hero.tsx only — the
// sticky mobile header already occupies the top of the viewport, so the
// hero needs less padding above it than a mid-page section does to get
// useful content above the fold; see Hero.tsx for the one place this is
// used.
const paddingClasses: Record<SectionPadding, string> = {
  default: "py-10 sm:py-14 lg:py-16",
  hero: "pt-6 pb-10 sm:pt-8 sm:pb-12 lg:pt-10 lg:pb-16",
};

interface SectionProps extends HTMLAttributes<HTMLElement> {
  tone?: SectionTone;
  as?: "section" | "div";
  padding?: SectionPadding;
}

export function Section({
  tone = "background",
  as: Tag = "section",
  padding = "default",
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <Tag
      className={cn(paddingClasses[padding], toneClasses[tone], className)}
      {...props}
    >
      {children}
    </Tag>
  );
}
