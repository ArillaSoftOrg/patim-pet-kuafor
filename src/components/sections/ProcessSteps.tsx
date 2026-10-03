import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";

export interface ProcessStep {
  title: string;
  description: string;
}

interface ProcessStepsProps {
  heading: string;
  description?: string;
  steps: ProcessStep[];
  tone?: "background" | "surface" | "muted" | "secondary";
}

export function ProcessSteps({ heading, description, steps, tone = "background" }: ProcessStepsProps) {
  return (
    <Section tone={tone}>
      <Container size="content">
        <div className="max-w-[65ch]">
          <Heading level="h2">{heading}</Heading>
          {description && (
            <p className="mt-4 text-[16px] text-muted-foreground sm:text-[18px]">{description}</p>
          )}
        </div>
        <ol className="mt-10 grid gap-6 sm:grid-cols-3">
          {steps.map((step, index) => (
            <li key={step.title} className="flex flex-col gap-2">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-[15px] font-semibold text-secondary-foreground"
                aria-hidden="true"
              >
                {index + 1}
              </span>
              <h3 className="text-[17px] font-semibold text-foreground">{step.title}</h3>
              <p className="text-[15px] text-muted-foreground">{step.description}</p>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
