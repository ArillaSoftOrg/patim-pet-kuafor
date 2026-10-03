// Shared guards for reading admin-edited content back out of localStorage.
// A user can end up with truly arbitrary bytes under these keys (manual
// devtools edits, a stale shape from a previous app version, browser
// extensions writing to the same origin), so every repository must treat
// stored JSON as untrusted input and fall back to shipped defaults rather
// than crash or silently corrupt state.

export function parseStoredRecord<T>(raw: string): Partial<T> | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return null;
    return parsed as Partial<T>;
  } catch {
    return null;
  }
}

export function parseStoredArray<T>(raw: string): T[] | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : null;
  } catch {
    return null;
  }
}
