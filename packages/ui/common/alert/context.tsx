"use client";

import { createContext, useContext } from "react";
import type {
  AlertAnimation,
  AlertAppearance,
  AlertLayout,
  AlertSeverity,
  AlertSize,
} from "@/components/common/alert/types";

export type AlertContextValue = {
  size: AlertSize;
  severity: AlertSeverity;
  appearance: AlertAppearance;
  layout: AlertLayout;
  animation: AlertAnimation;
};

const AlertContext = createContext<AlertContextValue | null>(null);

export function AlertProvider({
  value,
  children,
}: {
  value: AlertContextValue;
  children: React.ReactNode;
}) {
  return (
    <AlertContext.Provider value={value}>{children}</AlertContext.Provider>
  );
}

export function useAlertContext(): AlertContextValue {
  return (
    useContext(AlertContext) ?? {
      size: "md",
      severity: "muted",
      appearance: "ghost",
      layout: "center",
      animation: "none",
    }
  );
}
