import useDashboardSignals from "@dash/ui/layout/dashboard/context/useDashboardSignals";
import type { Breadcrumbs } from "@dash/ui/layout/dashboard/types";
import { useEffect } from "react";

export default function useBreadcrumbs(
  breadcrumbs: Breadcrumbs,
  dependencyList: unknown[] = [],
) {
  const { setBreadcrumbs } = useDashboardSignals();
  useEffect(() => {
    setBreadcrumbs(breadcrumbs);
    return () => {
      setBreadcrumbs(null);
    };
  }, dependencyList);
}
