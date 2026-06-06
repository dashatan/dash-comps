import { useMemo } from "react";
import {
  showcaseDevices,
  showcaseProvinces,
  showcaseRoads,
  showcaseSources,
  showcaseSourcesNested,
} from "@/features/resources/data/showcase-locations";

export default function useResources() {
  return useMemo(
    () => ({
      sources: showcaseSources,
      provinces: showcaseProvinces,
      roads: showcaseRoads,
      devices: showcaseDevices,
      sourcesNested: showcaseSourcesNested,
    }),
    [],
  );
}
