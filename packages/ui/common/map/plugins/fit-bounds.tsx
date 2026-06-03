"use client";

import L from "leaflet";
import { useMapPlugin } from "@/components/common/map/hooks/use-map-plugin";
import type { MapFitBoundsProps } from "@/components/common/map/types";

export function MapFitBounds({
  bounds,
  padding = [50, 50],
  enabled = true,
}: MapFitBoundsProps) {
  useMapPlugin((map) => {
    if (!enabled) return;

    const latLngBounds = Array.isArray(bounds)
      ? L.latLngBounds(bounds)
      : bounds;

    if (!latLngBounds.isValid()) return;

    map.fitBounds(latLngBounds, { padding });
  }, [bounds, padding, enabled]);

  return null;
}
