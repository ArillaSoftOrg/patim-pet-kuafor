export interface DailyHours {
  open: string; // HH:MM, 24-hour, business time zone
  close: string; // HH:MM, 24-hour, business time zone
}

// Index 0 = Sunday … 6 = Saturday (Date#getUTCDay order).
export type WeeklyHours = [
  DailyHours | null,
  DailyHours | null,
  DailyHours | null,
  DailyHours | null,
  DailyHours | null,
  DailyHours | null,
  DailyHours | null,
];

export interface AvailabilityConfig {
  // IANA zone every appointment date/time is expressed in.
  timeZone: string;
  // true until the business confirms real hours — lets later UI/admin
  // phases flag that the schedule is still a placeholder.
  provisional: boolean;
  weeklyHours: WeeklyHours;
  // Offered start times step by this much from opening time.
  slotIntervalMinutes: number;
  defaultDurationMinutes: number;
  // Per-service override, keyed by Service.slug.
  serviceDurationMinutes: Record<string, number>;
  // Minimum gap kept between appointments (travel time for a mobile
  // service), applied on both sides of an existing booking.
  bufferMinutes: number;
  // Earliest bookable start, measured from now.
  minLeadMinutes: number;
  // Last bookable date, counted in days from today (inclusive).
  maxDaysAhead: number;
  // YYYY-MM-DD dates with no availability (holidays, days off).
  blackoutDates: string[];
}

// The single place appointment availability is configured.
//
// PROVISIONAL: business.businessHours is still null (src/data/business.ts)
// — no real working hours have been confirmed. The weekly schedule and
// durations below are placeholders that make the booking flow usable
// during development; replace them with confirmed values before launch.
// Every requested appointment is also reviewed by an admin, so an offered
// slot is a request, not a guarantee.
export const appointmentAvailability: AvailabilityConfig = {
  timeZone: "Europe/Istanbul",
  provisional: true,
  weeklyHours: [
    null,
    { open: "09:00", close: "18:00" },
    { open: "09:00", close: "18:00" },
    { open: "09:00", close: "18:00" },
    { open: "09:00", close: "18:00" },
    { open: "09:00", close: "18:00" },
    { open: "09:00", close: "18:00" },
  ],
  slotIntervalMinutes: 30,
  defaultDurationMinutes: 90,
  serviceDurationMinutes: {},
  bufferMinutes: 30,
  minLeadMinutes: 12 * 60,
  maxDaysAhead: 30,
  blackoutDates: [],
};
