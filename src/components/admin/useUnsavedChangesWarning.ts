"use client";

import { useEffect } from "react";

// Warns before an unsaved admin form is lost to a tab close or reload.
// Browsers ignore any custom message and show their own generic prompt, so
// the string passed to returnValue is intentionally unused by callers.
export function useUnsavedChangesWarning(isDirty: boolean) {
  useEffect(() => {
    if (!isDirty) return;

    function handleBeforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault();
      event.returnValue = "";
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);
}
