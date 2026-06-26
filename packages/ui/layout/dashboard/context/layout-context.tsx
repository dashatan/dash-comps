"use client";

import { createContext, useContext, type ReactNode } from "react";
import type {
  DashboardBranding,
  DashboardMenuSettings,
  MenuItem,
} from "@dash/ui/layout/dashboard/types";

const defaultBranding: DashboardBranding = {
  appName: "Logistics Admin",
  logoSrc: "/logo.svg",
};

type DashboardLayoutContextValue = {
  menuItems: MenuItem[];
  footer: ReactNode;
  menuSettings: DashboardMenuSettings;
  branding: DashboardBranding;
  isRtl: boolean;
};

const defaultMenuSettings: DashboardMenuSettings = {
  visibleMenus: [],
  defaultExpanded: true,
  showClock: true,
};

const DashboardLayoutContext =
  createContext<DashboardLayoutContextValue | null>(null);

export function DashboardLayoutProvider({
  menuItems,
  footer,
  menuSettings,
  branding,
  isRtl,
  children,
}: {
  menuItems: MenuItem[];
  footer: ReactNode;
  menuSettings?: DashboardMenuSettings;
  branding?: DashboardBranding;
  isRtl: boolean;
  children: ReactNode;
}) {
  return (
    <DashboardLayoutContext.Provider
      value={{
        menuItems,
        footer,
        menuSettings: { ...defaultMenuSettings, ...menuSettings },
        branding: { ...defaultBranding, ...branding },
        isRtl,
      }}
    >
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
