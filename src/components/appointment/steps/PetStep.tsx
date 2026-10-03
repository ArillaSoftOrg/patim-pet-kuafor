import { ChoiceGroup } from "@/components/ui/ChoiceGroup";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { fieldId } from "@/components/appointment/wizardState";
import type { StepProps } from "@/components/appointment/steps/stepProps";
import { getBreed, getBreedsForPetType } from "@/data/petBreeds";
import { formatPriceQuote } from "@/lib/appointments/format";
import { getOfferedPetTypes, quotePrice } from "@/lib/appointments/pricing";
import { petSizes } from "@/lib/appointments/types";
import type { PetSize, PetType } from "@/lib/appointments/types";

export function PetStep({ state, dispatch, errorFor, copy }: StepProps) {
  const { pet } = state;
  const offeredTypes = getOfferedPetTypes(state.serviceSlug);
  const breed = pet.type ? getBreed(pet.type, pet.breedId) : undefined;
  // Only dogs whose breed doesn't fix a size band need one chosen.
  const needsSize = pet.type === "dog" && breed !== undefined && breed.size === null;
  const quote =
    pet.type && breed && (!needsSize || pet.size)
      ? quotePrice({ serviceSlug: state.serviceSlug, petType: pet.type, breedId: pet.breedId, size: pet.size })
      : null;

  return (
    <div className="flex flex-col gap-6">
      <FormField id={fieldId("pet.name")} label={copy.fields.petName.label} error={errorFor("pet.name")}>
        {(control) => (
          <Input
            {...control}
            value={pet.name}
            onChange={(event) => dispatch({ type: "setPetText", field: "name", value: event.target.value })}
            autoComplete="off"
          />
        )}
      </FormField>

      <ChoiceGroup
        id={fieldId("pet.type")}
        name="appointment-pet-type"
        legend={copy.fields.petType.label}
        options={offeredTypes.map((type) => ({ value: type, label: copy.petTypes[type] }))}
        value={pet.type}
        onChange={(value) => dispatch({ type: "selectPetType", petType: value as PetType })}
        error={errorFor("pet.type")}
        className="grid-cols-2"
      />

      {pet.type && (
        <FormField id={fieldId("pet.breedId")} label={copy.fields.breed.label} error={errorFor("pet.breedId")}>
          {(control) => (
            <Select
              {...control}
              value={pet.breedId}
              onChange={(event) => dispatch({ type: "selectBreed", breedId: event.target.value })}
            >
              <option value="">{copy.fields.breed.placeholder}</option>
              {getBreedsForPetType(pet.type!).map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </Select>
          )}
        </FormField>
      )}

      {needsSize && (
        <ChoiceGroup
          id={fieldId("pet.size")}
          name="appointment-pet-size"
          legend={copy.fields.size.label}
          helper={copy.fields.size.helper}
          options={petSizes.map((size) => ({
            value: size,
            label: copy.sizes[size].label,
            description: copy.sizes[size].description,
          }))}
          value={pet.size}
          onChange={(value) => dispatch({ type: "selectSize", size: value as PetSize })}
          error={errorFor("pet.size")}
          className="sm:grid-cols-3"
        />
      )}

      <FormField
        id={fieldId("pet.notes")}
        label={copy.fields.petNotes.label}
        labelSuffix={copy.optional}
        helper={copy.fields.petNotes.helper}
        error={errorFor("pet.notes")}
      >
        {(control) => (
          <Textarea
            {...control}
            value={pet.notes}
            onChange={(event) => dispatch({ type: "setPetText", field: "notes", value: event.target.value })}
          />
        )}
      </FormField>

      <p aria-live="polite" className="text-[15px] text-foreground empty:hidden">
        {quote && (
          <span className="block rounded-md bg-muted px-4 py-3">
            <span className="font-medium">{copy.price.label}:</span> {formatPriceQuote(quote, copy)}
          </span>
        )}
      </p>
    </div>
  );
}
