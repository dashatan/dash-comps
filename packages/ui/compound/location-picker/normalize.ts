"use client";

import { useMemo } from "react";
import useResources from "@/features/resources/utils/useResources";
import { normalizeLocation as normalizeLocationPure } from "@/components/compound/location-picker/lib/normalize-location";
import { LocationPickerFilters } from "@/components/compound/location-picker/types";

export default function useNormalizeLocation(selection: LocationPickerFilters) {
  const { provinces, devices, roads, sources } = useResources();

  return useMemo(
    () =>
      normalizeLocationPure({ provinces, devices, roads, sources }, selection),
    [
      provinces,
      devices,
      roads,
      sources,
      selection.deviceTypes,
      selection.provinces,
      selection.roads,
      selection.sources,
      selection.devices,
    ],
  );
}

export { normalizeLocationPure as normalizeLocation };
