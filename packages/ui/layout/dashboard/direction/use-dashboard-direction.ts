"use client";

import { useDashboardLayout } from "@dash/ui/layout/dashboard/context/layout-context";

export function useDashboardDirection() {
  const { isRtl } = useDashboardLayout();
  return { isRtl, dir: isRtl ? ("rtl" as const) : ("ltr" as const) };
}
