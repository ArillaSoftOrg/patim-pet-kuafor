"use client";

import { useEffect, useState } from "react";
import { appointmentsRepository } from "@/lib/appointments/appointmentsRepository";
import type { TimeSlot } from "@/lib/appointments/types";

export type BookedSlotsState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; slots: TimeSlot[] };

// Loads slots held by existing appointments (no personal data) within
// [from, to]. A new `requestKey` triggers a fresh load — the wizard changes
// it on entering the date/time steps and on "Try again" — and null means
// nothing is needed right now. Status is derived from whether the latest
// result belongs to the current key, so no state is set synchronously in
// the effect.
export function useBookedSlots(requestKey: string | null, from?: string, to?: string): BookedSlotsState {
  const [result, setResult] = useState<{ key: string; slots: TimeSlot[] | null } | null>(null);

  useEffect(() => {
    if (requestKey === null) return;
    let active = true;
    appointmentsRepository.getBookedSlots({ from, to }).then(
      (slots) => {
        if (active) setResult({ key: requestKey, slots });
      },
      (err) => {
        console.error("Failed to load booked appointment slots:", err);
        if (active) setResult({ key: requestKey, slots: null });
      },
    );
    return () => {
      active = false;
    };
  }, [requestKey, from, to]);

  if (requestKey === null) return { status: "idle" };
  if (result?.key !== requestKey) return { status: "loading" };
  return result.slots ? { status: "ready", slots: result.slots } : { status: "error" };
}
