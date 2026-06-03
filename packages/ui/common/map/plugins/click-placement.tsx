"use client";

import { useRef } from "react";
import L from "leaflet";
import { useMapPlugin } from "@/components/common/map/hooks/use-map-plugin";
import { removeMarker } from "@/components/common/map/utils/layers";
import type { MapClickPlacementProps } from "@/components/common/map/types";

/**
 * Floating marker on mousemove + static draggable marker on click.
 * Used for origin/destination picking (location-picker routing tab).
 */
export function MapClickPlacement({
  active,
  icon,
  draggable = true,
  onPlace,
}: MapClickPlacementProps) {
  const floatingRef = useRef<L.Marker | undefined>(undefined);
  const staticRef = useRef<L.Marker | undefined>(undefined);
  const onPlaceRef = useRef(onPlace);
  onPlaceRef.current = onPlace;

  useMapPlugin((map) => {
    if (!active) {
      removeMarker(floatingRef, map);
      return;
    }

    removeMarker(floatingRef, map);
    removeMarker(staticRef, map);

    const handleMouseMove = (e: L.LeafletMouseEvent) => {
      if (!floatingRef.current) {
        floatingRef.current = L.marker(e.latlng, { icon }).addTo(map);
      } else {
        floatingRef.current.setLatLng(e.latlng);
      }
    };

    const applyPosition = (position: Point) => {
      onPlaceRef.current(position);
    };

    const handleClick = (e: L.LeafletMouseEvent) => {
      const position: Point = [e.latlng.lat, e.latlng.lng];
      const marker = L.marker(e.latlng, { icon, draggable }).addTo(map);

      if (draggable) {
        marker.on("dragend", (event: L.LeafletEvent) => {
          const target = event.target as L.Marker;
          const ll = target.getLatLng();
          applyPosition([ll.lat, ll.lng]);
        });
      }

      applyPosition(position);
      removeMarker(floatingRef, map);
      staticRef.current = marker;
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
  }, [active, icon, draggable, onPlace]);

  return null;
}
