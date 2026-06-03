"use client";

import { useMemo } from "react";
import useResources from "@/features/resources/utils/useResources";
import {
  buildNameLookup,
  enrichDevices,
} from "@/components/compound/location-picker/lib/enrich-devices";
import { LocationResources } from "@/components/compound/location-picker/lib/types";
import { Device } from "@/features/resources/types";

export type LocationResourcesState = LocationResources & {
  enrichedDevices?: Device[];
};

export function useLocationResources(): LocationResourcesState {
  const { provinces, devices, roads, sources } = useResources();

  const lookup = useMemo(
    () => buildNameLookup({ provinces, roads, sources }),
    [provinces, roads, sources],
  );

  const enrichedDevices = useMemo(
    () => enrichDevices(devices, lookup),
    [devices, lookup],
  );

  return useMemo(
    () => ({
      sources,
      provinces,
      roads,
      devices,
      enrichedDevices,
    }),
    [sources, provinces, roads, devices, enrichedDevices],
  );
}
