"use client";

import { useEffect } from "react";
import type { DependencyList } from "react";
import type L from "leaflet";
import { useLeafletMap } from "@/components/common/map/context";

/**
 * Run an effect when the map is ready. Cleans up on unmount or when deps change.
 */
export function useMapPlugin(
  effect: (map: L.Map) => void | (() => void),
  deps: DependencyList,
) {
  const map = useLeafletMap();

  useEffect(() => {
    if (!map) return;
    return effect(map);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- caller owns deps
  }, [map, ...deps]);
}
