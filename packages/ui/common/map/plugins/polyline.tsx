"use client";

import { useRef } from "react";
import L from "leaflet";
import { useMapPlugin } from "@/components/common/map/hooks/use-map-plugin";
import type { MapPolylineProps } from "@/components/common/map/types";

export function MapPolyline({
  points,
  pathOptions,
  className,
  fitBounds = false,
  fitBoundsPadding = [50, 50],
}: MapPolylineProps) {
  const lineRef = useRef<L.Polyline | null>(null);

  useMapPlugin((map) => {
    if (lineRef.current) {
      map.removeLayer(lineRef.current);
      lineRef.current = null;
    }

    if (points.length < 2) return;

    lineRef.current = L.polyline(points, {
      weight: 6,
      ...pathOptions,
      className: className ?? pathOptions?.className,
    }).addTo(map);

    if (fitBounds) {
      map.fitBounds(L.latLngBounds(points), { padding: fitBoundsPadding });
    }

    return () => {
      if (lineRef.current) {
        map.removeLayer(lineRef.current);
        lineRef.current = null;
      }
    };
  }, [points, pathOptions, className, fitBounds, fitBoundsPadding]);

  return null;
}
