import { appointmentSteps } from "@/data/appointment";
import type { AppointmentStepId } from "@/data/appointment";
import { appointmentPricing } from "@/data/appointmentPricing";
import { getBreed } from "@/data/petBreeds";
import type { Service } from "@/data/services";
import { getAvailableSlots, getBookableDates } from "@/lib/appointments/availability";
import { getOfferedPetTypes, isServiceBookable, quotePrice } from "@/lib/appointments/pricing";
import type {
  Appointment,
  AppointmentAddress,
  AppointmentInput,
  PetSize,
  PetType,
  TimeSlot,
} from "@/lib/appointments/types";
import {
  isBookablePrice,
  normalizeAppointmentInput,
  validateAppointmentInput,
} from "@/lib/appointments/validation";
import type {
  AppointmentField,
  AppointmentFieldErrors,
  AppointmentValidationCode,
} from "@/lib/appointments/validation";

// Pure state + validation for the booking wizard — no React, no storage —
// so every transition and rule is testable on its own and the component
// stays a thin renderer over it.

export type WizardStepId = AppointmentStepId;

export const wizardSteps: WizardStepId[] = appointmentSteps;

// "date" is wizard-only: the flow picks a day before it picks a slot.
export type WizardField = AppointmentField | "date";
export type WizardErrors = Partial<Record<WizardField, AppointmentValidationCode>>;

// Which step owns each field — where an error on that field sends the
// customer. The review step owns the price, which has no input of its own.
export const stepFields: Record<WizardStepId, WizardField[]> = {
  service: ["serviceSlug", "serviceTitle"],
  pet: ["pet.name", "pet.type", "pet.breedId", "pet.size", "pet.notes"],
  address: ["address.serviceArea", "address.addressLine", "address.addressDetails"],
  date: ["date"],
  time: ["slot"],
  customer: ["customer.fullName", "customer.phone", "customer.email", "customer.notes"],
  review: ["price"],
};

// DOM id of the control (or radio fieldset) for a field, so validation can
// move focus to the first invalid one.
export function fieldId(field: WizardField): string {
  return `appointment-${field.replace(".", "-")}`;
}

export function stepIndexOf(step: WizardStepId): number {
  return wizardSteps.indexOf(step);
}

export const REVIEW_STEP_INDEX = stepIndexOf("review");

function stepIndexOfField(field: WizardField): number {
  return wizardSteps.findIndex((step) => stepFields[step].includes(field));
}

export interface PetDraft {
  name: string;
  type: PetType | null;
  breedId: string;
  size: PetSize | null;
  notes: string;
}

export interface CustomerDraft {
  fullName: string;
  phone: string;
  email: string;
  notes: string;
}

export type SubmissionFailureReason = "storage" | "rate-limited" | "unexpected";

export type SubmissionState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "failed"; reason: SubmissionFailureReason }
  | { status: "succeeded"; appointment: Appointment };

export interface WizardState {
  stepIndex: number;
  // Furthest step the customer may jump to from the step indicator or an
  // Edit link. Pulled back when an earlier change invalidates a later step
  // (e.g. a new service clears the chosen time).
  furthestStepIndex: number;
  // Set when the customer goes back to change something after reaching
  // the review step: "Continue" then re-checks every step and returns to
  // review, or stops at the first step that the change invalidated.
  returnToReview: boolean;
  serviceSlug: string;
  pet: PetDraft;
  address: AppointmentAddress;
  date: string;
  slot: TimeSlot | null;
  customer: CustomerDraft;
  // Optional, unchecked by default — only rendered at all when
  // messagingFeatureFlags.marketingConsentEnabled is true (see
  // CustomerStep.tsx). Never required to complete a booking; completely
  // separate from the appointment itself in storage (see
  // src/lib/marketing/types.ts).
  marketingConsent: boolean;
  errors: WizardErrors;
  // Increments on every failed "Continue"/submit so the UI can move focus
  // to the first invalid field once per attempt.
  attempt: number;
  submission: SubmissionState;
}

export const initialWizardState: WizardState = {
  stepIndex: 0,
  furthestStepIndex: 0,
  returnToReview: false,
  serviceSlug: "",
  pet: { name: "", type: null, breedId: "", size: null, notes: "" },
  address: { serviceArea: "", addressLine: "", addressDetails: "" },
  date: "",
  slot: null,
  customer: { fullName: "", phone: "", email: "", notes: "" },
  marketingConsent: false,
  errors: {},
  attempt: 0,
  submission: { status: "idle" },
};

export type WizardAction =
  | { type: "selectService"; slug: string }
  | { type: "selectPetType"; petType: PetType }
  | { type: "selectBreed"; breedId: string }
  | { type: "selectSize"; size: PetSize }
  | { type: "setPetText"; field: "name" | "notes"; value: string }
  | { type: "setAddress"; field: keyof AppointmentAddress; value: string }
  | { type: "selectDate"; date: string }
  | { type: "selectSlot"; slot: TimeSlot }
  | { type: "setCustomer"; field: keyof CustomerDraft; value: string }
  | { type: "setMarketingConsent"; value: boolean }
  | { type: "submitStep"; errors: WizardErrors }
  | { type: "back" }
  | { type: "goTo"; stepIndex: number }
  | { type: "submitStarted" }
  | { type: "submitSucceeded"; appointment: Appointment }
  // The repository rejected the appointment's content (e.g. slot taken).
  | { type: "submitRejected"; fieldErrors: AppointmentFieldErrors }
  | { type: "submitFailed"; reason: SubmissionFailureReason }
  | { type: "reset" };

function capFurthest(state: WizardState, step: WizardStepId): number {
  return Math.max(state.stepIndex, Math.min(state.furthestStepIndex, stepIndexOf(step)));
}

// Any edit clears the edited fields' errors and any failed submission
// (the next attempt is a new one).
function edit(state: WizardState, patch: Partial<WizardState>, clearedFields: WizardField[]): WizardState {
  const errors = { ...state.errors };
  for (const field of clearedFields) delete errors[field];
  return { ...state, ...patch, errors, submission: { status: "idle" } };
}

function applyService(state: WizardState, slug: string): WizardState {
  if (slug === state.serviceSlug) return state;
  const offered = getOfferedPetTypes(slug);
  const keepPetType = state.pet.type !== null && offered.includes(state.pet.type);
  const pet = keepPetType
    ? state.pet
    : { ...state.pet, type: offered.length === 1 ? offered[0] : null, breedId: "", size: null };
  return edit(
    state,
    {
      serviceSlug: slug,
      pet,
      // Durations are per service, so a previously chosen slot may not fit.
      slot: null,
      furthestStepIndex: capFurthest(state, keepPetType ? "time" : "pet"),
    },
    ["serviceSlug", "pet.type", "pet.breedId", "pet.size", "slot"],
  );
}

function applyBreed(state: WizardState, breedId: string): WizardState {
  const { type } = state.pet;
  const breed = type ? getBreed(type, breedId) : undefined;
  const previous = type ? getBreed(type, state.pet.breedId) : undefined;
  // A breed with a fixed size band sets it; switching between breeds that
  // both leave size to the customer keeps their earlier choice.
  const size = breed?.size ?? (type === "dog" && previous?.size === null ? state.pet.size : null);
  return edit(state, { pet: { ...state.pet, breedId, size } }, ["pet.breedId", "pet.size"]);
}

// Sends the customer to the step that owns the earliest error. An error on
// a step *after* the current one (only possible when re-checking on the way
// back to review) means that step needs answering again, not fixing — so
// it's opened fresh, without error messages.
function routeErrors(state: WizardState, errors: WizardErrors): WizardState {
  const fields = Object.keys(errors) as WizardField[];
  const target = Math.min(...fields.map(stepIndexOfField).filter((index) => index >= 0));
  // Defensive: an error no step owns stays on the current step.
  if (!Number.isFinite(target)) return { ...state, errors, attempt: state.attempt + 1 };
  if (target > state.stepIndex) {
    return { ...state, stepIndex: target, furthestStepIndex: Math.max(state.furthestStepIndex, target), errors: {} };
  }
  return { ...state, stepIndex: target, errors, attempt: state.attempt + 1 };
}

// Repository field errors → wizard fields. serviceTitle has no input of its
// own; it can only fail if the service itself is gone.
function toWizardErrors(fieldErrors: AppointmentFieldErrors): WizardErrors {
  const { serviceTitle, ...rest } = fieldErrors;
  const errors: WizardErrors = { ...rest };
  if (serviceTitle && !errors.serviceSlug) errors.serviceSlug = "serviceUnavailable";
  return errors;
}

export function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  // A completed request is final: only "Start over" leaves it, so nothing
  // can edit or resubmit it. While a submission is in flight, only its
  // outcome is accepted.
  if (state.submission.status === "succeeded" && action.type !== "reset") return state;
  if (
    state.submission.status === "submitting" &&
    action.type !== "submitSucceeded" &&
    action.type !== "submitRejected" &&
    action.type !== "submitFailed"
  ) {
    return state;
  }

  switch (action.type) {
    case "selectService":
      return applyService(state, action.slug);

    case "selectPetType":
      if (action.petType === state.pet.type) return state;
      return edit(
        state,
        {
          pet: { ...state.pet, type: action.petType, breedId: "", size: null },
          furthestStepIndex: capFurthest(state, "pet"),
        },
        ["pet.type", "pet.breedId", "pet.size"],
      );

    case "selectBreed":
      return applyBreed(state, action.breedId);

    case "selectSize":
      return edit(state, { pet: { ...state.pet, size: action.size } }, ["pet.size"]);

    case "setPetText":
      return edit(state, { pet: { ...state.pet, [action.field]: action.value } }, [`pet.${action.field}`]);

    case "setAddress":
      return edit(state, { address: { ...state.address, [action.field]: action.value } }, [
        `address.${action.field}`,
      ]);

    case "selectDate":
      if (action.date === state.date) return state;
      return edit(
        state,
        { date: action.date, slot: null, furthestStepIndex: capFurthest(state, "time") },
        ["date", "slot"],
      );

    case "selectSlot":
      return edit(state, { slot: action.slot }, ["slot"]);

    case "setCustomer":
      return edit(state, { customer: { ...state.customer, [action.field]: action.value } }, [
        `customer.${action.field}`,
      ]);

    case "setMarketingConsent":
      return edit(state, { marketingConsent: action.value }, []);

    case "submitStep": {
      if (Object.keys(action.errors).length > 0) return routeErrors(state, action.errors);
      const next = state.returnToReview ? REVIEW_STEP_INDEX : Math.min(state.stepIndex + 1, REVIEW_STEP_INDEX);
      return {
        ...state,
        errors: {},
        stepIndex: next,
        furthestStepIndex: Math.max(state.furthestStepIndex, next),
        returnToReview: next === REVIEW_STEP_INDEX ? false : state.returnToReview,
      };
    }

    case "back":
      if (state.stepIndex === 0) return state;
      return { ...state, stepIndex: state.stepIndex - 1, errors: {}, submission: { status: "idle" } };

    case "goTo":
      if (action.stepIndex < 0 || action.stepIndex > state.furthestStepIndex) return state;
      return {
        ...state,
        stepIndex: action.stepIndex,
        errors: {},
        submission: { status: "idle" },
        // Leaving review (Edit link or step indicator) to change an answer.
        returnToReview:
          state.returnToReview ||
          (state.furthestStepIndex === REVIEW_STEP_INDEX && action.stepIndex < REVIEW_STEP_INDEX),
      };

    case "submitStarted":
      if (state.stepIndex !== REVIEW_STEP_INDEX) return state;
      return { ...state, errors: {}, submission: { status: "submitting" } };

    case "submitSucceeded":
      return { ...state, submission: { status: "succeeded", appointment: action.appointment } };

    case "submitRejected": {
      const routed = routeErrors({ ...state, submission: { status: "idle" } }, toWizardErrors(action.fieldErrors));
      // Once fixed, "Continue" re-checks everything and comes back here.
      return { ...routed, returnToReview: routed.stepIndex < REVIEW_STEP_INDEX };
    }

    case "submitFailed":
      return { ...state, submission: { status: "failed", reason: action.reason } };

    case "reset":
      return initialWizardState;
  }
}

// `?service=<slug>` support: a valid, bookable slug is preselected and the
// wizard opens on the pet step. Anything else starts from step 1.
export function createInitialWizardState(
  preselectedSlug: string | null,
  bookableSlugs: readonly string[],
): WizardState {
  if (!preselectedSlug || !bookableSlugs.includes(preselectedSlug)) return initialWizardState;
  const petStep = stepIndexOf("pet");
  return { ...applyService(initialWizardState, preselectedSlug), stepIndex: petStep, furthestStepIndex: petStep };
}

export interface WizardContext {
  // Live services already filtered to bookable ones.
  services: readonly Service[];
  // Live business.serviceAreas.
  serviceAreas: readonly string[];
  bookedSlots: readonly TimeSlot[];
  now?: Date;
}

// Placeholders stand in for unanswered later steps; only the checked
// steps' fields are ever read back out of the validation result.
function draftToInput(state: WizardState, services: readonly Service[]): AppointmentInput {
  const { pet } = state;
  const quote = pet.type
    ? quotePrice({ serviceSlug: state.serviceSlug, petType: pet.type, breedId: pet.breedId, size: pet.size })
    : null;
  return normalizeAppointmentInput({
    serviceSlug: state.serviceSlug,
    serviceTitle: services.find((service) => service.slug === state.serviceSlug)?.title ?? "",
    pet: { ...pet, type: pet.type ?? "dog" },
    address: state.address,
    slot: state.slot ?? { date: state.date, start: "", end: "" },
    customer: state.customer,
    price: quote && isBookablePrice(quote) ? quote : { kind: "on-request", currency: appointmentPricing.currency },
  });
}

function pick(errors: WizardErrors, fields: WizardField[]): WizardErrors {
  const picked: WizardErrors = {};
  for (const field of fields) {
    if (errors[field]) picked[field] = errors[field];
  }
  return picked;
}

export function validateStep(step: WizardStepId, state: WizardState, context: WizardContext): WizardErrors {
  const availability = { now: context.now };

  if (step === "service") {
    if (state.serviceSlug === "") return { serviceSlug: "required" };
    const offered =
      context.services.some((service) => service.slug === state.serviceSlug) && isServiceBookable(state.serviceSlug);
    return offered ? {} : { serviceSlug: "serviceUnavailable" };
  }

  if (step === "date") {
    if (state.date === "") return { date: "required" };
    const open =
      getBookableDates(availability).includes(state.date) &&
      getAvailableSlots(
        { date: state.date, serviceSlug: state.serviceSlug, bookedSlots: [...context.bookedSlots] },
        availability,
      ).length > 0;
    return open ? {} : { date: "dateUnavailable" };
  }

  if (step === "time" && state.slot === null) return { slot: "required" };

  const errors = pick(
    validateAppointmentInput(draftToInput(state, context.services), {
      serviceAreas: context.serviceAreas,
      bookedSlots: context.bookedSlots,
      availability,
    }),
    stepFields[step],
  );

  if (step === "pet" && state.pet.type === null) {
    // Breed/size errors are meaningless until a pet type is chosen.
    delete errors["pet.breedId"];
    delete errors["pet.size"];
    errors["pet.type"] = "required";
  }
  return errors;
}

// Validates steps 0..lastStepIndex and returns the first failing step's
// errors — later edits can invalidate earlier answers.
export function validateThrough(state: WizardState, lastStepIndex: number, context: WizardContext): WizardErrors {
  for (let index = 0; index <= lastStepIndex; index++) {
    const errors = validateStep(wizardSteps[index], state, context);
    if (Object.keys(errors).length > 0) return errors;
  }
  return {};
}

// What "Continue" must re-check: up to the current step normally, or every
// step when heading back to review after an edit.
export function validateForContinue(state: WizardState, context: WizardContext): WizardErrors {
  return validateThrough(state, state.returnToReview ? REVIEW_STEP_INDEX - 1 : state.stepIndex, context);
}

// The submission payload built from the wizard's answers; null while a
// required choice (pet type, time) is still missing.
export function buildAppointmentInput(state: WizardState, services: readonly Service[]): AppointmentInput | null {
  if (state.pet.type === null || state.slot === null) return null;
  return draftToInput(state, services);
}
