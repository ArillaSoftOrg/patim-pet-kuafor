// Structured content for the three legal pages (/privacy, /kvkk, /cookies).
// Mirrors the data/<name>.ts + lib/i18n/content/<name>.tr.ts + *.ru.ts
// pattern used elsewhere (see appointment.ts) — this file is the English
// copy; legal.tr.ts carries the authoritative Turkish text (Turkish law
// governs these documents — see translationNotice below), legal.ru.ts a
// faithful Russian translation of the same facts.
//
// legalIdentity is the one place that still needs real business/legal
// facts (company name, MERSİS, tax office, registered address, a KVKK
// application contact). Every field is null until the business owner
// confirms it — never invent these. Fill them in here only; every legal
// page renders this single object via DataControllerBlock, so nothing
// else needs to change.
export interface LegalIdentity {
  tradeName: string;
  legalName: string | null;
  mersisNo: string | null;
  taxOffice: string | null;
  taxNumber: string | null;
  registeredAddress: string | null;
  kvkkContactEmail: string | null;
  kvkkContactAddress: string | null;
}

export const legalIdentity: LegalIdentity = {
  tradeName: "KulaPAWS",
  legalName: null,
  mersisNo: null,
  taxOffice: null,
  taxNumber: null,
  registeredAddress: null,
  kvkkContactEmail: null,
  kvkkContactAddress: null,
};

export interface LegalIdentityLabels {
  heading: string;
  tradeName: string;
  legalName: string;
  mersisNo: string;
  taxOffice: string;
  taxNumber: string;
  registeredAddress: string;
  contactNote: string;
  unknown: string;
}

export interface LegalBlock {
  type: "p" | "list";
  text?: string;
  items?: string[];
}

export interface LegalSection {
  id: string;
  heading: string;
  blocks: LegalBlock[];
}

export interface LegalDocument {
  title: string;
  updated: string;
  intro: string;
  // Whether this document renders the shared DataControllerBlock right
  // after its intro — true for kvkk and privacy, false for cookies (the
  // cookie policy never needs the controller identity block).
  showIdentity: boolean;
  sections: LegalSection[];
}

export interface RelatedDocumentsCopy {
  heading: string;
  privacy: string;
  kvkk: string;
  cookies: string;
}

export interface LegalCopy {
  lastUpdatedLabel: string;
  // Shown on en/ru only — Turkish is the authoritative legal version of
  // these documents; null on the Turkish copy itself.
  translationNotice: string | null;
  relatedDocuments: RelatedDocumentsCopy;
  identityLabels: LegalIdentityLabels;
  kvkk: LegalDocument;
  privacy: LegalDocument;
  cookies: LegalDocument;
}

const LAST_UPDATED = "2 October 2026";

export const legalCopy: LegalCopy = {
  lastUpdatedLabel: "Last updated",
  translationNotice:
    "This is an informational English translation. The Turkish-language version of this document is the legally authoritative text; in the event of any discrepancy, the Turkish text prevails.",
  relatedDocuments: {
    heading: "Related documents",
    privacy: "Privacy Policy",
    kvkk: "KVKK Disclosure Notice",
    cookies: "Cookie Policy",
  },
  identityLabels: {
    heading: "Data Controller",
    tradeName: "Trade name",
    legalName: "Registered company name",
    mersisNo: "MERSİS number",
    taxOffice: "Tax office",
    taxNumber: "Tax number",
    registeredAddress: "Registered address",
    contactNote: "KVKK requests / data protection contact",
    unknown: "[To be completed by the business]",
  },
  kvkk: {
    title: "KVKK Disclosure Notice",
    updated: LAST_UPDATED,
    showIdentity: true,
    intro:
      "This Disclosure Notice is prepared under Article 10 of Turkish Law No. 6698 on the Protection of Personal Data (\"KVKK\") to inform individuals who submit an appointment request through the KulaPAWS website about how their personal data is processed, in KulaPAWS's capacity as data controller.",
    sections: [
      {
        id: "data-collected",
        heading: "Categories of Personal Data Processed and How They Are Collected",
        blocks: [
          {
            type: "p",
            text: "When you submit an appointment request on this website, the following personal data is collected directly from you, electronically, through the booking form, so that we can plan and carry out the visit:",
          },
          {
            type: "list",
            items: [
              "Identity and contact data: full name, phone number, and (if provided) email address.",
              "Location data: the service area, street address, and any additional address details (building, floor, apartment) where the visit is to take place.",
              "Appointment data: the service, date and time selected, the price quoted, and any notes you add.",
              "Pet-related information: your pet's name, species, breed, size and care notes. On its own, this does not identify a natural person and is not \"personal data\" under KVKK, but it is listed here for transparency.",
            ],
          },
          {
            type: "p",
            text: "Visitors who do not submit an appointment request are not asked for any personal data beyond a language-preference cookie — see the Cookie Policy.",
          },
        ],
      },
      {
        id: "purposes",
        heading: "Purposes of Processing",
        blocks: [
          {
            type: "p",
            text: "Your personal data is processed to evaluate, plan and confirm your appointment request, to carry out the mobile grooming visit, to contact you about it, to prevent duplicate bookings and abuse of the booking system (for example, an unusually high number of requests from the same phone number in a short period), and to meet applicable legal record-keeping obligations.",
          },
          {
            type: "p",
            text: "Your data is not processed for marketing, advertising or profiling purposes. Because no such processing takes place, no separate marketing consent is requested through the booking form. If KulaPAWS begins sending campaign, discount or promotional messages in the future, this will rely solely on a separate, optional, never pre-checked, explicitly given consent — never required to submit an appointment request, and withdrawable at any time.",
          },
        ],
      },
      {
        id: "legal-basis",
        heading: "Legal Basis for Processing",
        blocks: [
          {
            type: "p",
            text: "Your personal data is processed on the following legal bases under Article 5(2) of KVKK:",
          },
          {
            type: "list",
            items: [
              "processing is directly related to the establishment or performance of a contract (planning and carrying out the grooming visit you requested);",
              "processing is necessary for KulaPAWS to comply with its legal obligations (for example, record-keeping obligations under applicable legislation);",
              "processing is necessary for KulaPAWS's legitimate interests, provided this does not harm your fundamental rights and freedoms (preventing duplicate bookings and abuse of the booking system).",
            ],
          },
          {
            type: "p",
            text: "Because these legal bases are sufficient on their own, the booking form does not separately request your explicit consent (açık rıza).",
          },
        ],
      },
      {
        id: "transfers",
        heading: "Transfer of Personal Data",
        blocks: [
          {
            type: "p",
            text: "Your personal data is shared only to the extent necessary to provide the service, with the following recipients:",
          },
          {
            type: "list",
            items: [
              "Service providers that operate the website's technical infrastructure (database, authentication and file storage), currently Supabase, acting as data processor; the specific hosting/infrastructure provider is noted under \"Infrastructure\" in the Privacy Policy.",
              "WhatsApp, only if and when you choose to send your appointment details through the pre-filled WhatsApp link on the confirmation screen — that message is then handled by WhatsApp under its own terms, outside KulaPAWS's control.",
              "Public authorities, only where a legal request or obligation requires it.",
            ],
          },
          {
            type: "p",
            text: "Your personal data is never shared with third parties for marketing purposes and is never sold.",
          },
        ],
      },
      {
        id: "retention",
        heading: "Retention",
        blocks: [
          {
            type: "p",
            text: "Your personal data is retained for as long as necessary for the purposes described above, and for any longer minimum period required by applicable legislation; it is then deleted, destroyed or anonymized. A specific retention schedule has not yet been finalized by the business; this section will be updated once it is. [TODO: retention period to be confirmed by the business]",
          },
        ],
      },
      {
        id: "rights",
        heading: "Your Rights Under Article 11 of KVKK",
        blocks: [
          { type: "p", text: "As a data subject, you have the right to:" },
          {
            type: "list",
            items: [
              "learn whether your personal data is being processed;",
              "request information about it if it has been processed;",
              "learn the purpose of processing and whether your data is used in accordance with that purpose;",
              "know the third parties, in Turkey or abroad, to whom your data is transferred;",
              "request correction of incomplete or inaccurate data;",
              "request deletion or destruction of your data within the conditions set out in Article 7 of KVKK;",
              "request that any correction, deletion or destruction be notified to the third parties to whom your data was transferred;",
              "object to a result that is to your detriment arising solely from automated analysis of your data;",
              "claim compensation for damage arising from unlawful processing of your data.",
            ],
          },
        ],
      },
      {
        id: "application",
        heading: "How to Exercise These Rights",
        blocks: [
          {
            type: "p",
            text: "You may submit a request to exercise the rights above, together with information that verifies your identity, using the methods set out in the Communiqué on the Procedures and Principles of Application to the Data Controller. The current application contact is shown under \"Data Controller\" above. Your request will be concluded free of charge, as soon as possible and within thirty days at the latest, depending on its nature.",
          },
        ],
      },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    updated: LAST_UPDATED,
    showIdentity: true,
    intro:
      "This Privacy Policy explains what information the KulaPAWS website collects, how it is used and protected, and which outside services are involved. For the formal statutory disclosure of personal-data processing, see the KVKK Disclosure Notice.",
    sections: [
      {
        id: "scope",
        heading: "Scope",
        blocks: [
          {
            type: "p",
            text: "This policy covers the public KulaPAWS website and the appointment-request flow. It does not cover the admin panel's internal use by authorized staff, which is governed separately as part of their working arrangement with the business.",
          },
        ],
      },
      {
        id: "data-we-collect",
        heading: "Information We Collect",
        blocks: [
          {
            type: "p",
            text: "If you submit an appointment request, we collect your name, phone number, optional email address, the service address and area, your pet's details, and the appointment specifics you choose — exactly as described in the KVKK Disclosure Notice.",
          },
          {
            type: "p",
            text: "If you only browse the site, the only thing stored about you is a language-preference cookie. The contact form on the Contact page is currently not connected and does not transmit or store anything you type into it. The site does not use analytics, advertising trackers, or any online payment processor — none of these are currently part of this website.",
          },
        ],
      },
      {
        id: "how-we-use-it",
        heading: "How We Use It",
        blocks: [
          {
            type: "p",
            text: "Appointment data is used solely to evaluate, confirm and carry out your requested visit and to contact you about it, as set out in the KVKK Disclosure Notice. It is not used for advertising or profiling.",
          },
        ],
      },
      {
        id: "service-vs-marketing",
        heading: "Service Communications vs. Marketing Communications",
        blocks: [
          {
            type: "p",
            text: "Communications from KulaPAWS fall into two separate categories. Notifications that your appointment request has been received, confirmed, is coming up, has been rescheduled, or has been cancelled are service communications — they are part of your appointment and never require marketing consent. Marketing communications — campaigns, discounts or promotional content — are an entirely separate category, sent only on the basis of a separate, optional, explicitly given consent that is never required to book an appointment.",
          },
          {
            type: "p",
            text: "As of the date on this page, KulaPAWS does not send marketing messages and does not collect marketing consent. If this is enabled in the future, consent will be requested completely independently of the booking process, through an option that is never pre-checked, and may be withdrawn at any time.",
          },
        ],
      },
      {
        id: "infrastructure",
        heading: "Infrastructure and Security",
        blocks: [
          {
            type: "p",
            text: "The website's database, authentication and file storage are provided by Supabase. Appointment data is protected by database-level access rules (Row Level Security): anonymous visitors have no access to appointment records at all — the only thing the booking flow can read publicly is which time slots are already taken, with no personal data attached. Appointment records can only be viewed or updated by authenticated, individually authorized administrator accounts. Booking submissions are revalidated on the server and rate-limited (at most three requests per hour from the same phone number) to resist abuse. [TODO: confirm the hosting/CDN provider for the website itself]",
          },
        ],
      },
      {
        id: "cookies",
        heading: "Cookies and Local Storage",
        blocks: [
          {
            type: "p",
            text: "The website uses a small number of strictly necessary cookies and a local-storage cache of public content. See the Cookie Policy for the full list and their purposes.",
          },
        ],
      },
      {
        id: "third-parties",
        heading: "Third-Party Services",
        blocks: [
          {
            type: "list",
            items: [
              "Supabase — database, authentication and file-storage infrastructure (data processor).",
              "WhatsApp — only used if you choose to open the pre-filled WhatsApp link; governed by WhatsApp's own terms.",
              "Instagram — a social-media link to KulaPAWS's public profile; visiting it is governed by Instagram's own terms.",
            ],
          },
          {
            type: "p",
            text: "No advertising network, analytics provider, or marketing platform is used on this website beyond what is listed above.",
          },
        ],
      },
      {
        id: "children",
        heading: "Children's Privacy",
        blocks: [
          {
            type: "p",
            text: "This website is directed at adult pet owners booking a grooming visit and is not intended for use by children.",
          },
        ],
      },
      {
        id: "your-rights",
        heading: "Your Rights",
        blocks: [
          {
            type: "p",
            text: "Your rights regarding your personal data, and how to exercise them, are set out in full in the KVKK Disclosure Notice.",
          },
        ],
      },
      {
        id: "changes",
        heading: "Changes to This Policy",
        blocks: [
          {
            type: "p",
            text: "This policy may be updated as the website or business practices change. The date at the top of this page reflects the version currently in effect.",
          },
        ],
      },
    ],
  },
  cookies: {
    title: "Cookie Policy",
    updated: LAST_UPDATED,
    showIdentity: false,
    intro:
      "This Cookie Policy explains which cookies and similar browser-storage technologies (localStorage) the KulaPAWS website uses, and why.",
    sections: [
      {
        id: "what-we-use",
        heading: "Cookies and Storage We Use",
        blocks: [
          {
            type: "list",
            items: [
              "kulapaws_locale — strictly necessary/functional cookie. Remembers your chosen display language (English/Turkish/Russian). Set by KulaPAWS. Duration: 1 year.",
              "Supabase session cookies (sb-*) — strictly necessary cookie. Created only when an authorized staff member signs in to the admin panel at /admin. Ordinary visitors never receive this cookie.",
              "localStorage (browser local storage) — strictly necessary/functional. Caches public, non-personal content (services, products, FAQs, business contact details) for fast, flicker-free display. It does not identify or track visitors.",
            ],
          },
        ],
      },
      {
        id: "what-we-dont-use",
        heading: "What We Don't Use",
        blocks: [
          {
            type: "p",
            text: "This website does not currently use analytics cookies, advertising or retargeting cookies, or social-media tracking pixels. If any such technology is introduced in the future, a consent mechanism compliant with KVKK's cookie guidance will be put in place before it runs, and this policy will be updated first.",
          },
        ],
      },
      {
        id: "consent",
        heading: "Why There Is No Cookie Banner",
        blocks: [
          {
            type: "p",
            text: "Under the Turkish Data Protection Authority's (KVKK) guidance on cookies, strictly necessary cookies do not require prior consent. Because every cookie and storage item used on this website falls into that category, no cookie-consent banner is shown. Non-essential cookies, if ever added, would require your prior, informed, opt-in consent and a way to change your choice later — neither of which applies today because no such cookies exist.",
          },
        ],
      },
      {
        id: "browser-controls",
        heading: "Browser Controls",
        blocks: [
          {
            type: "p",
            text: "You can delete or block cookies at any time through your browser settings. Blocking the language-preference cookie only means the site will show its default language on your next visit; it does not affect any other site functionality.",
          },
        ],
      },
    ],
  },
};
