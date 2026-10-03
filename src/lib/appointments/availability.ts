import { appointmentAvailability } from "@/data/appointmentAvailability";
import type { AvailabilityConfig } from "@/data/appointmentAvailability";
import type { TimeSlot } from "@/lib/appointments/types";
import {
  addDays,
  getWeekday,
  getZonedNow,
  isValidDate,
  isValidTime,
  minutesToTime,
  timeToMinutes,
  toAbsoluteMinutes,
  toDayNumber,
} from "@/lib/appointments/time";

export interface AvailabilityOptions {
  config?: AvailabilityConfig;
  // Injectable for tests; defaults to the real current time.
  now?: Date;
}

export function getServiceDurationMinutes(
  serviceSlug: string,
  config: AvailabilityConfig = appointmentAvailability,
): number {
  return config.serviceDurationMinutes[serviceSlug] ?? config.defaultDurationMinutes;
}

function isOpenDate(date: string, todayDayNumber: number, config: AvailabilityConfig): boolean {
  const offset = toDayNumber(date) - todayDayNumber;
  return (
    offset >= 0 &&
    offset <= config.maxDaysAhead &&
    !config.blackoutDates.includes(date) &&
    config.weeklyHours[getWeekday(date)] !== null
  );
}

// Dates inside the booking window that have working hours at all. A date
// listed here can still turn out fully booked — getAvailableSlots is the
// authority on actual free times.
export function getBookableDates({ config = appointmentAvailability, now }: AvailabilityOptions = {}): string[] {
  const today = getZonedNow(config.timeZone, now).date;
  const todayDayNumber = toDayNumber(today);
  const dates: string[] = [];
  for (let offset = 0; offset <= config.maxDaysAhead; offset++) {
    const date = addDays(today, offset);
    if (isOpenDate(date, todayDayNumber, config)) dates.push(date);
  }
  return dates;
}

export interface AvailableSlotsInput {
  date: string;
  serviceSlug: string;
  // Slots already taken (appointments in a slot-blocking status). Only
  // those on `date` matter; others are ignored.
  bookedSlots: TimeSlot[];
}

// Free start times for one service on one date, in chronological order.
// A candidate slot is offered only if it fits inside working hours,
// respects the minimum lead time, and keeps `bufferMinutes` clear on both
// sides of every existing booking.
export function getAvailableSlots(
  { date, serviceSlug, bookedSlots }: AvailableSlotsInput,
  { config = appointmentAvailability, now }: AvailabilityOptions = {},
): TimeSlot[] {
  if (!isValidDate(date)) return [];

  const zonedNow = getZonedNow(config.timeZone, now);
  if (!isOpenDate(date, toDayNumber(zonedNow.date), config)) return [];

  const hours = config.weeklyHours[getWeekday(date)];
  if (!hours) return [];

  const open = timeToMinutes(hours.open);
  const close = timeToMinutes(hours.close);
  const duration = getServiceDurationMinutes(serviceSlug, config);
  const earliestStart = toAbsoluteMinutes(zonedNow.date, zonedNow.minutes) + config.minLeadMinutes;

  const busy = bookedSlots
    .filter((slot) => slot.date === date && isValidTime(slot.start) && isValidTime(slot.end))
    .map((slot) => ({ start: timeToMinutes(slot.start), end: timeToMinutes(slot.end) }));

  const slots: TimeSlot[] = [];
  for (let start = open; start + duration <= close; start += config.slotIntervalMinutes) {
    const end = start + duration;
    if (toAbsoluteMinutes(date, start) < earliestStart) continue;
    const conflicts = busy.some(
      (booked) => start < booked.end + config.bufferMinutes && booked.start < end + config.bufferMinutes,
    );
    if (!conflicts) {
      slots.push({ date, start: minutesToTime(start), end: minutesToTime(end) });
    }
  }
  return slots;
}

// Re-check a previously offered slot right before creating an appointment
// — availability can change between picking a time and submitting.
export function isSlotAvailable(
  slot: TimeSlot,
  serviceSlug: string,
  bookedSlots: TimeSlot[],
  options: AvailabilityOptions = {},
): boolean {
  return getAvailableSlots({ date: slot.date, serviceSlug, bookedSlots }, options).some(
    (candidate) => candidate.start === slot.start && candidate.end === slot.end,
  );
}
