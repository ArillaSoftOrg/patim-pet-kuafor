import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { buttonVariants } from "@/components/ui/Button";
import { HeroMedia } from "@/components/sections/HeroMedia";
import { HeroMediaCarousel } from "@/components/sections/HeroMediaCarousel";
import { HeroVisual } from "@/components/sections/HeroVisual";
import type { NavItem } from "@/data/navigation";

interface HeroProps {
  heading: string;
  description: string;
  primaryCta: NavItem;
  secondaryCta?: NavItem;
  // Admin-uploaded custom hero photo, if set — takes priority over
  // `gallery` and renders as a single static image (see HeroMedia).
  image?: string | null;
  // Curated real-photo set shown (with a slow crossfade) when there's no
  // `image` override. Falls back to the decorative HeroVisual when both
  // are empty.
  gallery?: string[];
  imageAlt?: string;
}

export function Hero({
  heading,
  description,
  primaryCta,
  secondaryCta,
  image,
  gallery = [],
  imageAlt = "KulaPAWS mobile grooming",
}: HeroProps) {
  const media = image ? [image] : gallery;

  return (
    <Section tone="background" padding="hero">
      {/* .hero-grid (globals.css) owns the mobile-first stack order
          (heading → media → CTAs) and reassembles it into the two-column
          desktop layout — see the grid-template-areas there. */}
      <Container size="wide" className="hero-grid grid items-center gap-y-6 lg:gap-x-16 lg:gap-y-8">
        <div className="[grid-area:heading]">
          <Heading level="display">{heading}</Heading>
          <p className="mt-5 max-w-[55ch] text-[18px] text-muted-foreground sm:text-[20px]">
            {description}
          </p>
        </div>

        <div className="[grid-area:media]">
          {media.length > 0 ? (
            <>
              {/* Desktop keeps the existing crossfade untouched; mobile/
                  tablet (below lg) gets the swipeable auto-advancing
                  carousel instead — see HeroMediaCarousel.tsx. */}
              <div className="hidden lg:block">
                <HeroMedia images={media} alt={imageAlt} />
              </div>
              <div className="lg:hidden">
                <HeroMediaCarousel images={media} alt={imageAlt} />
              </div>
            </>
          ) : (
            <HeroVisual />
          )}
        </div>

        <div className="[grid-area:ctas] flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <Link
            href={primaryCta.href}
            className={buttonVariants({ variant: "primary", size: "lg", className: "w-full sm:w-auto" })}
          >
            {primaryCta.label}
          </Link>
          {secondaryCta && (
            <Link
              href={secondaryCta.href}
              className={buttonVariants({ variant: "secondary", size: "lg", className: "w-full sm:w-auto" })}
            >
              {secondaryCta.label}
            </Link>
          )}
        </div>
      </Container>
    </Section>
  );
}
