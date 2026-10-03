import type {
  AppointmentStatus,
  PetSize,
  PetType,
  PriceUnavailableReason,
} from "@/lib/appointments/types";
import type { AppointmentValidationCode } from "@/lib/appointments/validation";
import type { MarketingConsentChannel } from "@/lib/marketing/types";

export type AppointmentStepId = "service" | "pet" | "address" | "date" | "time" | "customer" | "review";

export const appointmentSteps: AppointmentStepId[] = [
  "service",
  "pet",
  "address",
  "date",
  "time",
  "customer",
  "review",
];

interface FieldCopy {
  label: string;
  helper?: string;
  // Only for <select>'s empty first option — never a replacement for label.
  placeholder?: string;
}

export interface AppointmentCopy {
  // BCP 47 locale used to format dates and prices shown in the flow.
  locale: string;
  page: {
    title: string;
    description: string;
  };
  loading: string;
  progressLabel: string;
  stepProgress: (current: number, total: number) => string;
  steps: Record<AppointmentStepId, { title: string; description: string }>;
  actions: {
    back: string;
    next: string;
    edit: string;
    submit: string;
    submitting: string;
    startOver: string;
    retry: string;
    changeDate: string;
  };
  fields: {
    service: FieldCopy;
    date: FieldCopy;
    time: FieldCopy;
    petName: FieldCopy;
    petType: FieldCopy;
    breed: FieldCopy;
    size: FieldCopy;
    petNotes: FieldCopy;
    serviceArea: FieldCopy;
    addressLine: FieldCopy;
    addressDetails: FieldCopy;
    fullName: FieldCopy;
    phone: FieldCopy;
    email: FieldCopy;
    customerNotes: FieldCopy;
  };
  optional: string;
  petTypes: Record<PetType, string>;
  sizes: Record<PetSize, { label: string; description: string }>;
  price: {
    label: string;
    onRequest: string;
    unavailable: Record<PriceUnavailableReason, string>;
  };
  service: {
    none: string;
  };
  availability: {
    loading: string;
    loadError: string;
  };
  date: {
    fullyBooked: string;
    none: string;
  };
  time: {
    noSlots: string;
    provisionalNotice: string;
  };
  // Section titles for the review step and success summary.
  summary: {
    service: string;
    pet: string;
    address: string;
    date: string;
    time: string;
    customer: string;
    price: string;
    reference: string;
    // Accessible name for a section's Edit button, e.g. "Edit pet".
    editSection: (section: string) => string;
  };
  validation: Record<AppointmentValidationCode, string>;
  statuses: Record<AppointmentStatus, string>;
  result: {
    successTitle: string;
    successDescription: string;
    whatsappCta: string;
    whatsappHelper: string;
    contactFallback: string;
    call: string;
    whatsapp: string;
    // Screen-reader-only suffix for links that open a new tab.
    newTab: string;
    errorTitle: string;
    errorDescription: string;
    rateLimited: string;
  };
  // Pre-filled WhatsApp message offered on the success screen.
  whatsappMessage: {
    greeting: (businessName: string) => string;
    labels: {
      reference: string;
      service: string;
      pet: string;
      date: string;
      time: string;
      area: string;
      address: string;
      name: string;
      phone: string;
    };
  };
  // What the booking flow collects and why — shown on the details step and
  // on /privacy. Deliberately limited to facts about the form itself.
  privacy: {
    formNote: string;
    policyLink: string;
    kvkkLink: string;
    reviewNotice: string;
    sectionTitle: string;
    intro: string;
    collected: string[];
    purpose: string;
    whatsapp: string;
  };
  // Only rendered when messagingFeatureFlags.marketingConsentEnabled is
  // true (see CustomerStep.tsx) — an entirely separate, optional opt-in,
  // never shown or required while the feature is off.
  marketing: {
    checkboxLabel: string;
    helper: string;
  };
  admin: {
    loadError: string;
    empty: { title: string; description: string };
    noMatches: { title: string; description: string };
    filters: {
      legend: string;
      status: string;
      allStatuses: string;
      from: string;
      to: string;
      order: string;
      soonestFirst: string;
      latestFirst: string;
      clear: string;
      invalidRange: string;
    };
    resultCount: (shown: number, total: number) => string;
    view: string;
    viewLabel: (petName: string, when: string) => string;
    backToList: string;
    status: string;
    created: string;
    updated: string;
    changeStatus: string;
    noStatusActions: string;
    // Button label for moving *to* each status.
    statusActions: Record<AppointmentStatus, string>;
    confirmCancel: string;
    statusChanged: (status: string) => string;
    edit: string;
    editTitle: string;
    editSections: { pet: string; address: string; schedule: string; customer: string };
    currentOption: (label: string) => string;
    noTimesForDate: string;
    slotSelectPlaceholder: string;
    save: string;
    saving: string;
    cancelEdit: string;
    saved: string;
    noChanges: string;
    changedElsewhere: string;
    // Read-only — see AppointmentDetail.tsx. Only rendered when
    // messagingFeatureFlags.marketingConsentEnabled is true.
    marketingConsent: {
      heading: string;
      loading: string;
      none: string;
      grantedTemplate: (channels: string, when: string) => string;
      revokedTemplate: (when: string) => string;
      channelLabels: Record<MarketingConsentChannel, string>;
    };
    errors: {
      validation: string;
      notFound: string;
      invalidTransition: string;
      conflict: string;
      unauthorized: string;
      storage: string;
      unexpected: string;
    };
  };
}

// Single source for every user-facing string in the appointment flow and
// admin appointments section — same pattern as src/data/homepage.ts and
// contactPage.ts, so components never hardcode copy and a future site-wide
// localization pass has exactly one module to port.
export const appointmentCopy: AppointmentCopy = {
  locale: "en-GB",
  page: {
    title: "Request an appointment",
    description: "Tell us about your pet and pick a time — we'll confirm your mobile grooming visit.",
  },
  loading: "Loading…",
  progressLabel: "Appointment steps",
  stepProgress: (current, total) => `Step ${current} of ${total}`,
  steps: {
    service: { title: "Choose a service", description: "What would you like us to do?" },
    pet: { title: "Your pet", description: "A few details help us prepare for the visit." },
    address: { title: "Address", description: "Where should we come? We travel within our service areas." },
    date: { title: "Date", description: "Pick a day that works for you." },
    time: { title: "Time", description: "Choose an available start time." },
    customer: { title: "Your details", description: "How can we reach you about this appointment?" },
    review: { title: "Review", description: "Check everything before sending your request." },
  },
  actions: {
    back: "Back",
    next: "Continue",
    edit: "Edit",
    submit: "Request appointment",
    submitting: "Sending…",
    startOver: "Start over",
    retry: "Try again",
    changeDate: "Choose another date",
  },
  fields: {
    service: { label: "Service" },
    date: { label: "Date" },
    time: { label: "Start time" },
    petName: { label: "Pet's name" },
    petType: { label: "Pet type" },
    breed: { label: "Breed", placeholder: "Select a breed" },
    size: { label: "Size", helper: "Choose the closest match for your dog." },
    petNotes: {
      label: "Anything we should know?",
      helper: "Temperament, health notes, coat condition, etc.",
    },
    serviceArea: { label: "Service area", placeholder: "Select an area" },
    addressLine: { label: "Street address" },
    addressDetails: { label: "Building, floor, apartment", helper: "Any detail that helps us find you." },
    fullName: { label: "Full name" },
    phone: { label: "Phone number", helper: "We'll use this to confirm your appointment." },
    email: { label: "Email" },
    customerNotes: { label: "Notes" },
  },
  optional: "(optional)",
  petTypes: {
    dog: "Dog",
    cat: "Cat",
  },
  sizes: {
    small: { label: "Small", description: "Up to about 10 kg" },
    medium: { label: "Medium", description: "About 10–25 kg" },
    large: { label: "Large", description: "Over about 25 kg" },
  },
  price: {
    label: "Price",
    onRequest: "Price confirmed when we confirm your appointment",
    unavailable: {
      "unknown-service": "This service can't be booked online yet. Please contact us instead.",
      "pet-not-offered": "This service isn't available for this pet.",
      "size-required": "Choose your pet's size to see pricing.",
    },
  },
  service: {
    none: "Online booking isn't available right now. Please contact us to book.",
  },
  availability: {
    loading: "Checking availability…",
    loadError: "We couldn't load availability. Please try again.",
  },
  date: {
    fullyBooked: "Fully booked",
    none: "No dates are available right now. Please contact us to book.",
  },
  time: {
    noSlots: "No times are available on this day. Please choose another date.",
    provisionalNotice: "Times are requests — we'll confirm your appointment with you directly.",
  },
  summary: {
    service: "Service",
    pet: "Pet",
    address: "Address",
    date: "Date",
    time: "Time",
    customer: "Contact details",
    price: "Price",
    reference: "Reference",
    editSection: (section) => `Edit ${section.toLowerCase()}`,
  },
  validation: {
    required: "This field is required.",
    tooLong: "This is too long.",
    invalidOption: "Please choose one of the options.",
    invalidPhone: "Enter a valid phone number.",
    invalidEmail: "Enter a valid email address.",
    invalidServiceArea: "Please choose one of our service areas.",
    dateUnavailable: "That day isn't available. Please choose another.",
    serviceUnavailable: "This service isn't available for this pet.",
    priceChanged: "The price for this appointment has changed. Please review it again.",
    slotUnavailable: "That time isn't available. Please choose another.",
    slotTaken: "That time was just taken. Please choose another.",
  },
  statuses: {
    pending: "Pending",
    confirmed: "Confirmed",
    completed: "Completed",
    cancelled: "Cancelled",
  },
  result: {
    successTitle: "Request received",
    successDescription: "Thanks! We'll be in touch shortly to confirm your appointment.",
    whatsappCta: "Send details on WhatsApp",
    whatsappHelper: "Opens WhatsApp with your appointment details filled in — just press send.",
    contactFallback: "You can also reach us directly:",
    call: "Call",
    whatsapp: "WhatsApp",
    newTab: "(opens in a new tab)",
    errorTitle: "Something went wrong",
    errorDescription: "Your request couldn't be sent. Please try again, or contact us directly.",
    rateLimited:
      "We've received several requests from this phone number in the last hour. Please try again later, or contact us directly.",
  },
  whatsappMessage: {
    greeting: (businessName) => `Hello ${businessName}! I've just requested an appointment on your website.`,
    labels: {
      reference: "Reference",
      service: "Service",
      pet: "Pet",
      date: "Date",
      time: "Time",
      area: "Area",
      address: "Address",
      name: "Name",
      phone: "Phone",
    },
  },
  privacy: {
    formNote: "We use these details only to arrange and confirm your appointment.",
    policyLink: "Privacy policy",
    kvkkLink: "KVKK Disclosure Notice",
    reviewNotice: "Sending this request does not confirm your appointment — we'll follow up to confirm it with you. For how we handle your details, see:",
    sectionTitle: "Appointment requests",
    intro: "When you request an appointment on this website, we ask for:",
    collected: [
      "your name and phone number, and optionally your email address",
      "the address where the visit should take place, and its service area",
      "your pet's name, type, breed, size, and any notes you add",
      "the service, date and time you choose, and any notes for us",
    ],
    purpose:
      "We use these details only to arrange, confirm and carry out your grooming visit, and to contact you about it.",
    whatsapp:
      "If you choose to send your appointment details to us on WhatsApp, that message is handled by WhatsApp under its own terms.",
  },
  marketing: {
    checkboxLabel: "I'd also like to receive occasional offers and promotions by SMS, WhatsApp or email.",
    helper: "Optional — separate from your appointment. Leaving this unchecked won't affect your booking.",
  },
  admin: {
    loadError: "Appointments couldn't be loaded.",
    empty: {
      title: "No appointments yet",
      description: "Appointment requests made on the website will appear here.",
    },
    noMatches: {
      title: "No matching appointments",
      description: "Try a different status or date range, or clear the filters.",
    },
    filters: {
      legend: "Filter appointments",
      status: "Status",
      allStatuses: "All statuses",
      from: "From",
      to: "To",
      order: "Order",
      soonestFirst: "Soonest first",
      latestFirst: "Latest first",
      clear: "Clear filters",
      invalidRange: "The end date is before the start date.",
    },
    resultCount: (shown, total) => `Showing ${shown} of ${total} appointment${total === 1 ? "" : "s"}`,
    view: "View",
    viewLabel: (petName, when) => `View appointment for ${petName}, ${when}`,
    backToList: "← All appointments",
    status: "Status",
    created: "Requested",
    updated: "Last updated",
    changeStatus: "Change status",
    noStatusActions: "No further status changes are available.",
    statusActions: {
      pending: "Set back to pending",
      confirmed: "Confirm",
      completed: "Mark as completed",
      cancelled: "Cancel appointment",
    },
    confirmCancel: "Cancel this appointment? Its time slot will become available to other customers.",
    statusChanged: (status) => `Status changed to ${status}.`,
    edit: "Edit details",
    editTitle: "Edit appointment",
    editSections: { pet: "Pet", address: "Address", schedule: "Date & time", customer: "Customer" },
    currentOption: (label) => `${label} (current)`,
    noTimesForDate: "No times are available on this date.",
    slotSelectPlaceholder: "Select a time",
    save: "Save changes",
    saving: "Saving…",
    cancelEdit: "Cancel",
    saved: "Changes saved.",
    noChanges: "Nothing has changed.",
    changedElsewhere:
      "This appointment was updated elsewhere while you were editing. Only the sections you change here will be saved.",
    marketingConsent: {
      heading: "Marketing Consent",
      loading: "Loading…",
      none: "No marketing consent on record for this appointment.",
      grantedTemplate: (channels, when) => `Granted for ${channels} on ${when}.`,
      revokedTemplate: (when) => `Revoked on ${when}.`,
      channelLabels: { sms: "SMS", whatsapp: "WhatsApp", email: "Email" },
    },
    errors: {
      validation: "Some details need attention — see the highlighted fields.",
      notFound: "This appointment no longer exists.",
      invalidTransition: "That status change isn't allowed for this appointment.",
      conflict:
        "This appointment was changed elsewhere at the same moment, so nothing was saved. It has been reloaded — please check and try again.",
      unauthorized: "Your admin session has expired. Please sign in again.",
      storage: "Changes couldn't be saved. Nothing was changed — please try again.",
      unexpected: "Something went wrong. Nothing was changed — please try again.",
    },
  },
};
