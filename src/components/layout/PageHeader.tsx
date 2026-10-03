import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
}

export function PageHeader({ eyebrow, title, description, children }: PageHeaderProps) {
  return (
    <div className="border-b border-border bg-muted">
      <Container className="py-14 sm:py-16 lg:py-20">
        <div className="max-w-[70ch]">
          {eyebrow && (
            <p className="text-[14px] font-medium uppercase tracking-wide text-primary">
              {eyebrow}
            </p>
          )}
          <Heading level="h1" className="mt-2">
            {title}
          </Heading>
          {description && (
            <p className="mt-4 text-[18px] text-muted-foreground">{description}</p>
          )}
          {children}
        </div>
      </Container>
    </div>
  );
}
