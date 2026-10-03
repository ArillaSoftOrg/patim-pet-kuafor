import { OTHER_BREED_ID } from "@/lib/appointments/types";
import type { PetSize, PetType } from "@/lib/appointments/types";

export interface Breed {
  id: string;
  petType: PetType;
  label: string;
  // The size band this breed prices as. null means the customer chooses
  // (mixed/other dogs) or the pet type has no size bands (cats).
  size: PetSize | null;
}

// Common breeds offered as quick picks in the booking flow, plus an
// "other" entry per pet type. General breed facts only — nothing here is a
// claim about which breeds Kulapaws does or doesn't groom; that's decided
// solely by src/data/appointmentPricing.ts. Breed-specific pricing is an
// optional override there keyed by these ids, so renaming an id here
// requires updating any rule that references it.
export const breeds: Breed[] = [
  { id: "maltese", petType: "dog", label: "Maltese", size: "small" },
  { id: "pomeranian", petType: "dog", label: "Pomeranian", size: "small" },
  { id: "yorkshire-terrier", petType: "dog", label: "Yorkshire Terrier", size: "small" },
  { id: "chihuahua", petType: "dog", label: "Chihuahua", size: "small" },
  { id: "shih-tzu", petType: "dog", label: "Shih Tzu", size: "small" },
  { id: "toy-poodle", petType: "dog", label: "Toy / Miniature Poodle", size: "small" },
  { id: "pug", petType: "dog", label: "Pug", size: "small" },
  { id: "beagle", petType: "dog", label: "Beagle", size: "medium" },
  { id: "cocker-spaniel", petType: "dog", label: "Cocker Spaniel", size: "medium" },
  { id: "border-collie", petType: "dog", label: "Border Collie", size: "medium" },
  { id: "standard-poodle", petType: "dog", label: "Standard Poodle", size: "large" },
  { id: "labrador-retriever", petType: "dog", label: "Labrador Retriever", size: "large" },
  { id: "golden-retriever", petType: "dog", label: "Golden Retriever", size: "large" },
  { id: "german-shepherd", petType: "dog", label: "German Shepherd", size: "large" },
  { id: "siberian-husky", petType: "dog", label: "Siberian Husky", size: "large" },
  { id: OTHER_BREED_ID, petType: "dog", label: "Mixed breed / Other", size: null },

  { id: "domestic-shorthair", petType: "cat", label: "Domestic Shorthair", size: null },
  { id: "domestic-longhair", petType: "cat", label: "Domestic Longhair", size: null },
  { id: "british-shorthair", petType: "cat", label: "British Shorthair", size: null },
  { id: "scottish-fold", petType: "cat", label: "Scottish Fold", size: null },
  { id: "persian", petType: "cat", label: "Persian", size: null },
  { id: "maine-coon", petType: "cat", label: "Maine Coon", size: null },
  { id: "siamese", petType: "cat", label: "Siamese", size: null },
  { id: "turkish-van", petType: "cat", label: "Turkish Van", size: null },
  { id: "turkish-angora", petType: "cat", label: "Turkish Angora", size: null },
  { id: OTHER_BREED_ID, petType: "cat", label: "Mixed breed / Other", size: null },
];

export function getBreedsForPetType(petType: PetType): Breed[] {
  return breeds.filter((breed) => breed.petType === petType);
}

// Breed ids are only unique within a pet type ("other" exists for both).
export function getBreed(petType: PetType, breedId: string): Breed | undefined {
  return breeds.find((breed) => breed.petType === petType && breed.id === breedId);
}
