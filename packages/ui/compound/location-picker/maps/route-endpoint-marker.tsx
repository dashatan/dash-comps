"use client";

import { useRef } from "react";
import L from "leaflet";
import { useMapPlugin } from "@/components/common/map";
import { safeRemoveLayer } from "@/components/common/map/utils/layers";

type RouteEndpointMarkerProps = {
  position?: Point;
  icon: L.Icon | L.DivIcon;
  onMove: (position: Point) => void;
};

/** Draggable origin/destination pin when not in click-placement mode. */
export function RouteEndpointMarker({ position, icon, onMove }: RouteEndpointMarkerProps) {
  const onMoveRef = useRef(onMove);
  onMoveRef.current = onMove;

  useMapPlugin((map) => {
    if (!position) return;

    const marker = L.marker(position, { icon, draggable: true }).addTo(map);
    marker.on("dragend", (event: L.LeafletEvent) => {
      const target = event.target as L.Marker;
      const latLng = target.getLatLng();
      onMoveRef.current([latLng.lat, latLng.lng]);
    });

    return () => {
      safeRemoveLayer(map, marker);
    };
  }, [position, icon]);

  return null;
}
