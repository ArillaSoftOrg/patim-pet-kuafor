// Calendar-date and wall-clock helpers for appointment scheduling.
//
// Appointment dates ("YYYY-MM-DD") and times ("HH:MM") are plain
// wall-clock values in the business time zone. All arithmetic below works
// on those values directly (via UTC-based day numbers, which have no DST
// or offset of their own), so the result never depends on the time zone
// of the browser or server running it. The only real-time conversion is
// getZonedNow, which asks Intl for "now" in the business zone.

const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;
const MS_PER_DAY = 86_400_000;
export const MINUTES_PER_DAY = 1440;

export function isValidDate(value: string): boolean {
  const match = DATE_PATTERN.exec(value);
  if (!match) return false;
  const [, year, month, day] = match.map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

export function isValidTime(value: string): boolean {
  return TIME_PATTERN.test(value);
}

// Days since 1970-01-01. Callers must pass a valid date.
export function toDayNumber(date: string): number {
  const [year, month, day] = date.split("-").map(Number);
  return Date.UTC(year, month - 1, day) / MS_PER_DAY;
}

export function fromDayNumber(dayNumber: number): string {
  return new Date(dayNumber * MS_PER_DAY).toISOString().slice(0, 10);
}

export function addDays(date: string, days: number): string {
  return fromDayNumber(toDayNumber(date) + days);
}

// 0 = Sunday … 6 = Saturday.
export function getWeekday(date: string): number {
  return new Date(toDayNumber(date) * MS_PER_DAY).getUTCDay();
}

export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function minutesToTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export interface ZonedDateTime {
  date: string; // YYYY-MM-DD
  minutes: number; // minutes since local midnight
}

// Current wall-clock date/time in `timeZone`. `now` is injectable for tests.
export function getZonedNow(timeZone: string, now: Date = new Date()): ZonedDateTime {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? "00";
  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  };
}

// A single comparable number for a wall-clock date + time.
export function toAbsoluteMinutes(date: string, minutes: number): number {
  return toDayNumber(date) * MINUTES_PER_DAY + minutes;
}
