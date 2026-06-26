"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { MenuItem } from "@/components/layout/dashboard/types";

type DashboardLayoutContextValue = {
  menuItems: MenuItem[];
  footer: ReactNode;
};

const DashboardLayoutContext = createContext<DashboardLayoutContextValue | null>(
  null,
);

export function DashboardLayoutProvider({
  menuItems,
  footer,
  children,
}: DashboardLayoutContextValue & { children: ReactNode }) {
  return (
    <DashboardLayoutContext.Provider value={{ menuItems, footer }}>
      {children}
    </DashboardLayoutContext.Provider>
  );
}

export function useDashboardLayout(): DashboardLayoutContextValue {
  const ctx = useContext(DashboardLayoutContext);
  if (!ctx) {
    throw new Error(
      "useDashboardLayout must be used within DashboardLayoutProvider",
    );
  }
  return ctx;
}
