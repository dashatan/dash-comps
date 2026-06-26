"use client";

import { useRef } from "react";
import L from "leaflet";
import { useMapPlugin } from "@/components/common/map/hooks/use-map-plugin";
import { removeMarker } from "@/components/common/map/utils/layers";
import type { MapClickPlacementProps } from "@/components/common/map/types";

/**
 * Floating marker on mousemove + click to place.
 * Persistent pins are owned by the parent (e.g. RouteEndpointMarker).
 */
export function MapClickPlacement({
  active,
  icon,
  onPlace,
}: MapClickPlacementProps) {
  const floatingRef = useRef<L.Marker | undefined>(undefined);
  const onPlaceRef = useRef(onPlace);
  onPlaceRef.current = onPlace;

  useMapPlugin(
    (map) => {
      if (!active) {
        removeMarker(floatingRef, map);
        return;
      }

      removeMarker(floatingRef, map);

      const handleMouseMove = (e: L.LeafletMouseEvent) => {
        if (!floatingRef.current) {
          floatingRef.current = L.marker(e.latlng, { icon }).addTo(map);
        } else {
          floatingRef.current.setLatLng(e.latlng);
        }
      };

      const handleClick = (e: L.LeafletMouseEvent) => {
        onPlaceRef.current([e.latlng.lat, e.latlng.lng]);
        removeMarker(floatingRef, map);
        map.off("mousemove", handleMouseMove);
        map.off("click", handleClick);
      };

      map.on("mousemove", handleMouseMove);
      map.on("click", handleClick);

      return () => {
        map.off("mousemove", handleMouseMove);
        map.off("click", handleClick);
        removeMarker(floatingRef, map);
      };
    },
    [active, icon, onPlace],
  );

  return null;
}
