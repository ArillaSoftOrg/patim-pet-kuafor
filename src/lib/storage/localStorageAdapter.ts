import type { StorageAdapter } from "@/lib/storage/types";

// SSR-safe: returns null/no-ops on the server so importing this in a
// Server Component context never throws — callers naturally fall back
// to defaults there. Used for content that should persist across browser
// sessions (business info, services), unlike the auth session storage.
export const localStorageAdapter: StorageAdapter = {
  getItem(key) {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(key);
  },
  setItem(key, value) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(key, value);
  },
  removeItem(key) {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(key);
  },
};
