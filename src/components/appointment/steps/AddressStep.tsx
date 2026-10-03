import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { fieldId } from "@/components/appointment/wizardState";
import type { StepProps } from "@/components/appointment/steps/stepProps";

interface AddressStepProps extends StepProps {
  // Live business.serviceAreas.
  serviceAreas: readonly string[];
}

export function AddressStep({ state, dispatch, errorFor, copy, serviceAreas }: AddressStepProps) {
  const { address } = state;

  return (
    <div className="flex flex-col gap-6">
      <FormField
        id={fieldId("address.serviceArea")}
        label={copy.fields.serviceArea.label}
        error={errorFor("address.serviceArea")}
      >
        {(control) => (
          <Select
            {...control}
            value={address.serviceArea}
            onChange={(event) => dispatch({ type: "setAddress", field: "serviceArea", value: event.target.value })}
          >
            <option value="">{copy.fields.serviceArea.placeholder}</option>
            {serviceAreas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </Select>
        )}
      </FormField>

      <FormField
        id={fieldId("address.addressLine")}
        label={copy.fields.addressLine.label}
        error={errorFor("address.addressLine")}
      >
        {(control) => (
          <Input
            {...control}
            value={address.addressLine}
            onChange={(event) => dispatch({ type: "setAddress", field: "addressLine", value: event.target.value })}
            autoComplete="street-address"
          />
        )}
      </FormField>

      <FormField
        id={fieldId("address.addressDetails")}
        label={copy.fields.addressDetails.label}
        labelSuffix={copy.optional}
        helper={copy.fields.addressDetails.helper}
        error={errorFor("address.addressDetails")}
      >
        {(control) => (
          <Input
            {...control}
            value={address.addressDetails}
            onChange={(event) => dispatch({ type: "setAddress", field: "addressDetails", value: event.target.value })}
            autoComplete="address-line2"
          />
        )}
      </FormField>
    </div>
  );
}
