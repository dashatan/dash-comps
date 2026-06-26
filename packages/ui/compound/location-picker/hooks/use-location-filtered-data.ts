"use client";

import { useMemo } from "react";
import { buildFilterParams } from "@/components/compound/location-picker/lib/build-filter-params";
import { filterLocationData } from "@/components/compound/location-picker/lib/filter-location-data";
import { FilteredLocationData } from "@/components/compound/location-picker/lib/types";
import { LocationPickerFilters } from "@/components/compound/location-picker/types";
import { LocationResourcesState } from "@/components/compound/location-picker/hooks/use-location-resources";

export function useLocationFilteredData(
  resources: LocationResourcesState,
  selection: LocationPickerFilters | undefined,
): FilteredLocationData {
  const filters = selection ?? {};

  return useMemo(() => {
    const params = buildFilterParams(
      resources,
      resources.enrichedDevices,
      filters,
    );
    return filterLocationData(params);
  }, [
    resources.sources,
    resources.provinces,
    resources.roads,
    resources.enrichedDevices,
    filters.deviceTypes,
    filters.provinces,
    filters.roads,
    filters.sources,
    filters.devices,
  ]);
}
