import type {
  Appointment,
  AppointmentInput,
  AppointmentStatus,
  PetSize,
  PetType,
  TimeSlot,
} from "@/lib/appointments/types";

// The one place a public.appointments row (supabase/migrations/
// 20260928120000_appointments.sql) meets the app's Appointment shape.
// Internal columns (request_id, version, buffer_minutes, generated
// columns) never leave the server-side code that needs them.
export interface AppointmentRow {
  id: string;
  request_id: string;
  status: AppointmentStatus;
  service_slug: string;
  service_title: string;
  pet_name: string;
  pet_type: PetType;
  pet_breed_id: string;
  pet_size: PetSize | null;
  pet_notes: string;
  service_area: string;
  address_line: string;
  address_details: string;
  slot_date: string;
  start_time: string; // "HH:MM:SS" from Postgres
  end_time: string;
  buffer_minutes: number;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  customer_notes: string;
  price_kind: "priced" | "on-request";
  price_amount: number | string | null;
  price_currency: "TRY";
  version: number;
  created_at: string;
  updated_at: string;
}

export interface BookedSlotRow {
  slot_date: string;
  start_time: string;
  end_time: string;
}

const toHourMinute = (time: string) => time.slice(0, 5);

export function rowToAppointment(row: AppointmentRow): Appointment {
  return {
    id: row.id,
    status: row.status,
    serviceSlug: row.service_slug,
    serviceTitle: row.service_title,
    pet: {
      name: row.pet_name,
      type: row.pet_type,
      breedId: row.pet_breed_id,
      size: row.pet_size,
      notes: row.pet_notes,
    },
    address: {
      serviceArea: row.service_area,
      addressLine: row.address_line,
      addressDetails: row.address_details,
    },
    slot: { date: row.slot_date, start: toHourMinute(row.start_time), end: toHourMinute(row.end_time) },
    customer: {
      fullName: row.customer_name,
      phone: row.customer_phone,
      email: row.customer_email,
      notes: row.customer_notes,
    },
    price:
      row.price_kind === "priced"
        ? { kind: "priced", amount: Number(row.price_amount), currency: row.price_currency }
        : { kind: "on-request", currency: row.price_currency },
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function bookedSlotRowToSlot(row: BookedSlotRow): TimeSlot {
  return { date: row.slot_date, start: toHourMinute(row.start_time), end: toHourMinute(row.end_time) };
}

// Columns an admin may change (matches the column-level UPDATE grant).
export function editableRowValues(input: AppointmentInput) {
  return {
    pet_name: input.pet.name,
    pet_type: input.pet.type,
    pet_breed_id: input.pet.breedId,
    pet_size: input.pet.size,
    pet_notes: input.pet.notes,
    service_area: input.address.serviceArea,
    address_line: input.address.addressLine,
    address_details: input.address.addressDetails,
    slot_date: input.slot.date,
    start_time: input.slot.start,
    end_time: input.slot.end,
    customer_name: input.customer.fullName,
    customer_phone: input.customer.phone,
    customer_email: input.customer.email,
    customer_notes: input.customer.notes,
    price_kind: input.price.kind,
    price_amount: input.price.kind === "priced" ? input.price.amount : null,
    price_currency: input.price.currency,
  };
}

// Everything create_appointment() inserts.
export function newRowValues(input: AppointmentInput, bufferMinutes: number) {
  return {
    ...editableRowValues(input),
    service_slug: input.serviceSlug,
    service_title: input.serviceTitle,
    buffer_minutes: bufferMinutes,
  };
}
