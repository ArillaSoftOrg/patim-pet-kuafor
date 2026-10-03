"use client";

import { useEffect, useState } from "react";

// A native localStorage write in one tab fires a "storage" event in every
// OTHER same-origin tab/window (never the tab that wrote it) — no new
// dependency required. This hook uses that to let an already-open public
// tab pick up an admin edit made in another tab without a full reload.
//
// `fetcher` and `storageKeys` must both be stable references (a repository
// method such as `businessRepository.get`, and a module-level array
// constant) rather than fresh literals per render, so the effect only
// resubscribes when it actually needs to.
export function useLiveContent<T>(
  defaultValue: T,
  fetcher: () => Promise<T>,
  storageKeys: readonly string[],
): T {
  const [value, setValue] = useState<T>(defaultValue);

  useEffect(() => {
    let active = true;

    function load() {
      fetcher().then((next) => {
        if (active) setValue(next);
      });
    }

    load();

    function handleStorage(event: StorageEvent) {
      // event.key is null when a tab calls localStorage.clear() — treat
      // that as "something we care about may have changed" too.
      if (event.key !== null && !storageKeys.includes(event.key)) return;
      load();
    }

    window.addEventListener("storage", handleStorage);
    return () => {
      active = false;
      window.removeEventListener("storage", handleStorage);
    };
  }, [fetcher, storageKeys]);

  return value;
}
