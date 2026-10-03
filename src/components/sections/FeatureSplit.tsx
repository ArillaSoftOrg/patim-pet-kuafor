import type { ReactNode } from "react";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { buttonVariants } from "@/components/ui/Button";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import type { NavItem } from "@/data/navigation";
import { cn } from "@/lib/cn";

interface FeatureSplitProps {
  eyebrow?: string;
  heading: string;
  description: string;
  bullets?: string[];
  cta?: NavItem;
  image?: string | null;
  imageLabel?: string;
  // Alt text for when `image` is real — distinct from imageLabel (the
  // "photo coming soon" placeholder text), which would otherwise leak
  // through as the alt once a real photo exists and become inaccurate.
  imageAlt?: string;
  imageSide?: "left" | "right";
  tone?: "background" | "surface" | "muted" | "secondary";
  children?: ReactNode;
}

export function FeatureSplit({
  eyebrow,
  heading,
  description,
  bullets,
  cta,
  image,
  imageLabel = "Photo coming soon",
  imageAlt,
  imageSide = "right",
  tone = "surface",
  children,
}: FeatureSplitProps) {
  return (
    <Section tone={tone}>
      <Container size="wide" className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className={cn(imageSide === "left" && "lg:order-2")}>
          {eyebrow && (
            <p className="text-[14px] font-medium uppercase tracking-wide text-primary">
              {eyebrow}
            </p>
          )}
          <Heading level="h2" className="mt-2">
            {heading}
          </Heading>
          <p className="mt-4 max-w-[55ch] text-[16px] text-muted-foreground sm:text-[18px]">
            {description}
          </p>
          {bullets && bullets.length > 0 && (
            <ul className="mt-6 flex flex-col gap-3">
              {bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-3 text-[15px] text-foreground">
                  <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-primary" aria-hidden="true" />
                  {bullet}
                </li>
              ))}
            </ul>
          )}
          {children}
          {cta && (
            <div className="mt-7">
              <Link href={cta.href} className={buttonVariants({ variant: "primary" })}>
                {cta.label}
              </Link>
            </div>
          )}
        </div>
        <PhotoPlaceholder
          src={image}
          alt={imageAlt}
          label={imageLabel}
          aspect="video"
          className={cn(imageSide === "left" && "lg:order-1")}
        />
      </Container>
    </Section>
  );
}
