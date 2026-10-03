// Generic singleton content repository (e.g. business info). Methods are
// async even though the local implementation resolves immediately, so a
// future remote-backed implementation (e.g. Supabase) can replace it
// without changing any caller.
export interface ContentRepository<T> {
  get(): Promise<T>;
  set(value: T): Promise<void>;
  reset(): Promise<void>;
}
