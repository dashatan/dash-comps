"use client";

import { createContext, type ReactNode } from "react";
import type { TrackerStoreApi } from "@dash/ui/compound/tracker-new/store/create-store";

export const TrackerStoreContext = createContext<TrackerStoreApi | null>(null);

export function TrackerStoreProvider({
  store,
  children,
}: {
  store: TrackerStoreApi;
  children: ReactNode;
}) {
  return (
    <TrackerStoreContext.Provider value={store}>
      {children}
    </TrackerStoreContext.Provider>
  );
}

export { TrackerStoreContext as default };
