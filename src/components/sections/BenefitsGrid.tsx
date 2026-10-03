import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Card } from "@/components/ui/Card";

export interface Benefit {
  title: string;
  description: string;
}

interface BenefitsGridProps {
  heading: string;
  description?: string;
  items: Benefit[];
  tone?: "background" | "surface" | "muted" | "secondary";
}

export function BenefitsGrid({ heading, description, items, tone = "muted" }: BenefitsGridProps) {
  return (
    <Section tone={tone}>
      <Container size="wide">
        <div className="max-w-[65ch]">
          <Heading level="h2">{heading}</Heading>
          {description && (
            <p className="mt-4 text-[16px] text-muted-foreground sm:text-[18px]">{description}</p>
          )}
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Card key={item.title}>
              <h3 className="text-[18px] font-semibold text-foreground">{item.title}</h3>
              <p className="mt-2 text-[15px] text-muted-foreground">{item.description}</p>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
