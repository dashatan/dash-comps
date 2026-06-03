"use client";

import { useMemo } from "react";
import { resolveDisplayValue } from "@/components/compound/location-picker/lib/resolve-display-value";
import { LocationResources } from "@/components/compound/location-picker/lib/types";
import { LocationPickerFilters } from "@/components/compound/location-picker/types";

export function useLocationDisplayValue(
  resources: LocationResources,
  selection: LocationPickerFilters | undefined,
) {
  const filters = selection ?? {};

  return useMemo(
    () => resolveDisplayValue(resources, filters),
    [
      resources.sources,
      resources.provinces,
      resources.roads,
      resources.devices,
      filters.deviceTypes,
      filters.provinces,
      filters.roads,
      filters.sources,
      filters.devices,
    ],
  );
}
