"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { cn } from "@/lib";
import { LeafletMapProvider } from "@/components/common/map/context";
import type { LeafletMapProps, Point } from "@/components/common/map/types";
import { safeDestroyMap } from "@/components/common/map/utils/layers";
import "@/components/common/map/styles.css";

const DEFAULT_CENTER: Point = [35.691143, 51.428421];
const DEFAULT_ZOOM = 7;

export function LeafletMap({
  tileUrl,
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM,
  minZoom = 3,
  maxZoom = 21,
  zoomControl = true,
  pmIgnore = false,
  className,
  mapOptions,
  whenReady,
  onCenterChange,
  children,
}: LeafletMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const whenReadyRef = useRef(whenReady);
  const onCenterChangeRef = useRef(onCenterChange);
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
  const [isReady, setIsReady] = useState(false);

  whenReadyRef.current = whenReady;
  onCenterChangeRef.current = onCenterChange;

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !containerRef.current ||
      mapRef.current
    ) {
      return;
    }

    const map = L.map(containerRef.current, {
      ...mapOptions,
      pmIgnore,
      zoomControl: false,
    }).setView(center, zoom);

    if (zoomControl) {
      L.control.zoom({ position: "topleft" }).addTo(map);
    }

    tileLayerRef.current = L.tileLayer(tileUrl, { minZoom, maxZoom }).addTo(
      map,
    );

    const handleDragEnd = () => {
      const c = map.getCenter();
      onCenterChangeRef.current?.([c.lat, c.lng]);
    };
    map.on("dragend", handleDragEnd);

    mapRef.current = map;
    setMapInstance(map);
    setIsReady(true);
    whenReadyRef.current?.(map);

    return () => {
      map.off("dragend", handleDragEnd);
      safeDestroyMap(map);
      mapRef.current = null;
      tileLayerRef.current = null;
      setMapInstance(null);
      setIsReady(false);
    };
    // Init once per mount; center/zoom updates handled below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.setView(center, map.getZoom());
  }, [center[0], center[1], zoom]);

  useEffect(() => {
    const layer = tileLayerRef.current;
    if (!layer || !tileUrl) return;
    layer.setUrl(tileUrl);
  }, [tileUrl]);

  return (
    <LeafletMapProvider map={mapInstance} isReady={isReady}>
      <div
        className={cn("sirat-leaflet-map relative h-full w-full", className)}
      >
        <div ref={containerRef} className="h-full w-full" />
        {children}
      </div>
    </LeafletMapProvider>
  );
}
