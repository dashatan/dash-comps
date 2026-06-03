"use client";

import { useEffect } from "react";
import type L from "leaflet";
import "@geoman-io/leaflet-geoman-free";
import type { GeomanShape } from "@/components/common/map/types";
import { useLeafletMap } from "@/components/common/map/context";

type UseGeomanDrawOptions = {
  pathOptions?: L.PathOptions;
  tooltips?: boolean;
};

/**
 * Imperatively enable/disable a Geoman draw mode (no toolbar).
 * Useful for custom control UIs (e.g. locating feature sidebar).
 */
export function useGeomanDraw(
  shape: GeomanShape | undefined,
  options?: UseGeomanDrawOptions,
) {
  const map = useLeafletMap();

  useEffect(() => {
    if (!map || !shape) return;

    map.pm.enableDraw(shape, {
      pathOptions: options?.pathOptions,
      tooltips: options?.tooltips ?? false,
    });

    return () => {
      map.pm.disableDraw(shape);
    };
  }, [map, shape, options?.pathOptions?.color, options?.tooltips]);
}
