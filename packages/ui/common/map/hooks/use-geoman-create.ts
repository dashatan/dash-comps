"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "@geoman-io/leaflet-geoman-free";
import { extractPolygonPoints } from "@/components/common/map/utils/layers";
import type { GeomanCreateEvent, GeomanShape } from "@/components/common/map/types";
import { useLeafletMap } from "@/components/common/map/context";

/**
 * Listen for Geoman `pm:create` without enabling the toolbar.
 * Pair with `useGeomanDraw` for custom draw UIs (locating sidebar).
 */
export function useGeomanCreate(onCreate: (event: GeomanCreateEvent) => void) {
  const map = useLeafletMap();
  const onCreateRef = useRef(onCreate);
  onCreateRef.current = onCreate;

  useEffect(() => {
    if (!map) return;

    const handler = (e: { shape: string; layer: L.Layer }) => {
      const shape = e.shape as GeomanShape;
      const polygon =
        shape === "Polygon" || shape === "Rectangle"
          ? extractPolygonPoints(e.layer)
          : [];

      onCreateRef.current({
        shape,
        layer: e.layer,
        polygon,
      });
    };

    map.on("pm:create", handler);
    return () => {
      map.off("pm:create", handler);
    };
  }, [map]);
}
