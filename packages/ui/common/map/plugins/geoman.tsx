"use client";

import { useRef } from "react";
import L from "leaflet";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import { useMapPlugin } from "@/components/common/map/hooks/use-map-plugin";
import { extractPolygonPoints } from "@/components/common/map/utils/layers";
import type { GeomanCreateEvent, GeomanShape, MapGeomanProps } from "@/components/common/map/types";

const DEFAULT_TOOLBAR = {
  drawMarker: false,
  drawPolyline: false,
  drawText: false,
  rotateMode: false,
  drawCircleMarker: false,
  drawCircle: false,
  cutPolygon: false,
} as const;

export function MapGeoman({
  showToolbar = true,
  toolbarPosition = "topleft",
  toolbarOptions,
  enabledShapes,
  drawPathOptions,
  onCreate,
}: MapGeomanProps) {
  const onCreateRef = useRef(onCreate);
  onCreateRef.current = onCreate;

  useMapPlugin((map) => {
    if (showToolbar) {
      map.pm.addControls({
        position: toolbarPosition,
        ...DEFAULT_TOOLBAR,
        ...toolbarOptions,
      });
    }

    enabledShapes?.forEach((shape) => {
      map.pm.enableDraw(shape, drawPathOptions ? { pathOptions: drawPathOptions } : undefined);
    });

    const handleCreate = (e: { shape: string; layer: L.Layer }) => {
      const shape = e.shape as GeomanShape;
      const polygon =
        shape === "Polygon" || shape === "Rectangle"
          ? extractPolygonPoints(e.layer)
          : [];

      if (drawPathOptions?.color && e.layer instanceof L.Polyline) {
        e.layer.setStyle({ color: drawPathOptions.color });
      }

      const payload: GeomanCreateEvent = {
        shape,
        layer: e.layer,
        polygon,
      };
      onCreateRef.current?.(payload);
    };

    map.on("pm:create", handleCreate);

    return () => {
      map.off("pm:create", handleCreate);
      enabledShapes?.forEach((shape) => {
        map.pm.disableDraw(shape);
      });
      if (showToolbar) {
        map.pm.removeControls();
      }
    };
  }, [
    showToolbar,
    toolbarPosition,
    toolbarOptions,
    enabledShapes,
    drawPathOptions,
    onCreate,
  ]);

  return null;
}
