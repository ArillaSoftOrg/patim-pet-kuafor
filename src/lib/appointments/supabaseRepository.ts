import type { SupabaseClient } from "@supabase/supabase-js";
import { unwrapActionResult } from "@/lib/appointments/actionResult";
import type { AppointmentActionResult } from "@/lib/appointments/actionResult";
import { bookedSlotRowToSlot, rowToAppointment } from "@/lib/appointments/appointmentRow";
import type { AppointmentRow, BookedSlotRow } from "@/lib/appointments/appointmentRow";
import { AppointmentError } from "@/lib/appointments/repository";
import type { AppointmentsRepository } from "@/lib/appointments/repository";
import {
  createAppointmentAction,
  updateAppointmentAction,
  updateAppointmentStatusAction,
} from "@/lib/appointments/server/actions";
import { createClient } from "@/lib/supabase/client";

// Same-browser tabs hear about each other's writes instantly through this
// channel; other devices through Supabase Realtime.
const BROADCAST_CHANNEL = "kulapaws:appointments";

export interface SupabaseAppointmentsDependencies {
  getClient: () => SupabaseClient;
  createAppointment: (input: unknown, requestId: string) => Promise<AppointmentActionResult>;
  updateAppointment: (id: string, changes: unknown) => Promise<AppointmentActionResult>;
  updateAppointmentStatus: (id: string, status: unknown) => Promise<AppointmentActionResult>;
  generateId?: () => string;
}

const defaultDependencies: SupabaseAppointmentsDependencies = {
  getClient: createClient,
  createAppointment: createAppointmentAction,
  updateAppointment: updateAppointmentAction,
  updateAppointmentStatus: updateAppointmentStatusAction,
};

function readError(error: { code?: string; message: string }): AppointmentError {
  return new AppointmentError(error.code === "42501" ? "unauthorized" : "storage", error.message);
}

function notifyOtherTabs() {
  if (typeof BroadcastChannel === "undefined") return;
  const channel = new BroadcastChannel(BROADCAST_CHANNEL);
  channel.postMessage("changed");
  channel.close();
}

let subscriptionCount = 0;

// Production AppointmentsRepository, used from the browser:
//   - reads (admin list/detail) go straight to Supabase with the signed-in
//     user's session, so RLS decides what comes back (admins: everything;
//     anyone else: nothing);
//   - booked slots come from get_booked_slots(), which exposes no personal
//     data and is all the public booking flow can read;
//   - every write goes through a Server Action (server/actions.ts) that
//     re-validates it server-side — the browser never writes directly.
export function createSupabaseAppointmentsRepository(
  dependencies: SupabaseAppointmentsDependencies = defaultDependencies,
): AppointmentsRepository {
  const { getClient, generateId = () => crypto.randomUUID() } = dependencies;

  return {
    async list() {
      const { data, error } = await getClient()
        .from("appointments")
        .select("*")
        .order("slot_date", { ascending: true })
        .order("start_time", { ascending: true })
        .order("created_at", { ascending: true });
      if (error) throw readError(error);
      return ((data ?? []) as AppointmentRow[]).map(rowToAppointment);
    },

    async get(id) {
      const { data, error } = await getClient().from("appointments").select("*").eq("id", id).maybeSingle();
      if (error) throw readError(error);
      return data ? rowToAppointment(data as AppointmentRow) : null;
    },

    async getBookedSlots(range = {}) {
      const { data, error } = await getClient().rpc("get_booked_slots", {
        p_from: range.from ?? null,
        p_to: range.to ?? null,
      });
      if (error) throw readError(error);
      return ((data ?? []) as BookedSlotRow[]).map(bookedSlotRowToSlot);
    },

    async create(input, options = {}) {
      return unwrapActionResult(await dependencies.createAppointment(input, options.requestId ?? generateId()));
    },

    async update(id, changes) {
      const appointment = unwrapActionResult(await dependencies.updateAppointment(id, changes));
      notifyOtherTabs();
      return appointment;
    },

    async updateStatus(id, status) {
      const appointment = unwrapActionResult(await dependencies.updateAppointmentStatus(id, status));
      notifyOtherTabs();
      return appointment;
    },

    subscribe(onChange) {
      if (typeof window === "undefined") return () => {};

      // Several events can arrive for one change (Realtime + tab broadcast);
      // coalesce them into a single refresh. Events still in flight after
      // unsubscribing are ignored.
      let active = true;
      let timer: ReturnType<typeof setTimeout> | undefined;
      const refresh = () => {
        if (!active) return;
        clearTimeout(timer);
        timer = setTimeout(onChange, 150);
      };

      // Realtime applies the appointments RLS SELECT policy per subscriber,
      // so only admins receive these events.
      const supabase = getClient();
      const channel = supabase
        .channel(`appointments-changes-${++subscriptionCount}`)
        .on("postgres_changes", { event: "*", schema: "public", table: "appointments" }, refresh)
        .subscribe();

      const tabs = typeof BroadcastChannel === "undefined" ? null : new BroadcastChannel(BROADCAST_CHANNEL);
      tabs?.addEventListener("message", refresh);

      return () => {
        active = false;
        clearTimeout(timer);
        void supabase.removeChannel(channel);
        tabs?.close();
      };
    },
  };
}
