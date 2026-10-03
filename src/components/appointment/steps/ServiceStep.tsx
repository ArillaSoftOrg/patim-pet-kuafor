import { ChoiceGroup } from "@/components/ui/ChoiceGroup";
import { EmptyState } from "@/components/ui/EmptyState";
import { fieldId } from "@/components/appointment/wizardState";
import type { StepProps } from "@/components/appointment/steps/stepProps";
import type { Service } from "@/data/services";

interface ServiceStepProps extends StepProps {
  // Live services, already filtered to bookable ones.
  services: readonly Service[];
}

export function ServiceStep({ state, dispatch, errorFor, copy, services }: ServiceStepProps) {
  if (services.length === 0) {
    return <EmptyState title={copy.service.none} />;
  }

  return (
    <ChoiceGroup
      id={fieldId("serviceSlug")}
      name="appointment-service"
      legend={copy.fields.service.label}
      hideLegend
      options={services.map((service) => ({
        value: service.slug,
        label: service.title,
        description: service.shortDescription,
      }))}
      value={state.serviceSlug || null}
      onChange={(slug) => dispatch({ type: "selectService", slug })}
      error={errorFor("serviceSlug")}
    />
  );
}
