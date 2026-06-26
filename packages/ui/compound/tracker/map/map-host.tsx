"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { useTheme } from "next-themes";
import { getMapTileUrl } from "@/lib";
import { registerMapEngine, loadMapEngine, mountMapEngine } from "@/components/compound/tracker/map/registry";
import { createLeafletEngine } from "@/components/compound/tracker/map/engines/leaflet/engine";
import { createMapLibreEngine } from "@/components/compound/tracker/map/engines/maplibre/engine";
import type { MapEngine } from "@/components/compound/tracker/map/types";
import {
  useActiveEmphasizes,
  useMapRouteContext,
  useResolvedOptions,
  useTrackerStore,
  useTracksWithEventsFiltered,
} from "@/components/compound/tracker/store/hooks";
import { colors, getColor } from "@/components/common/badge/color";
import { calculateBearing } from "@/components/compound/tracker/utils/bearing";

registerMapEngine("leaflet", async () => createLeafletEngine());
registerMapEngine("maplibre", async () => createMapLibreEngine());

export default function MapHost() {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<MapEngine | null>(null);
  const handleRef = useRef<{ destroy: () => void } | null>(null);
  const prevEventIndex = useRef(0);
  const [mapReadyVersion, setMapReadyVersion] = useState(0);
  const { resolvedTheme } = useTheme();
  const options = useResolvedOptions();
  const ctx = useMapRouteContext();
  const eventIntervalMs = useTrackerStore((s) => s.eventIntervalMs);
  const emphasizes = useActiveEmphasizes();
  const setActiveEventIndex = useTrackerStore((s) => s.setActiveEventIndex);
  const tracksWithEvents = useTracksWithEventsFiltered();
  const emphasizeRadius = useTrackerStore((s) => s.emphasizeRadius);
  const perEventMarkers = useTrackerStore((s) => s.options.markers.perEventMarkers);
  const headStyle = useTrackerStore((s) => s.options.markers.headStyle);

  useEffect(() => {
    let cancelled = false;
    async function init() {
      if (!containerRef.current) return;
      handleRef.current?.destroy();
      handleRef.current = null;
      engineRef.current = null;

      const engine = await loadMapEngine(ctx.mapEngine);
      if (cancelled || !containerRef.current) return;

      const tileUrl = getMapTileUrl(resolvedTheme === "dark" ? "dark" : "light");
      const handle = await mountMapEngine(engine, containerRef.current, {
        center: options.map.center,
        zoom: options.map.defaultZoom,
        tileUrl,
        theme: resolvedTheme === "dark" ? "dark" : "light",
        rtlSupport: options.map.rtlSupport,
        controls: options.map.controls,
      });
      if (cancelled) return;

      engineRef.current = engine;
      handleRef.current = handle;
      setMapReadyVersion((version) => version + 1);
    }
    void init();
    return () => {
      cancelled = true;
      handleRef.current?.destroy();
      handleRef.current = null;
      engineRef.current = null;
    };
  }, [ctx.mapEngine, resolvedTheme, options.map.center, options.map.defaultZoom, options.map.rtlSupport, options.map.controls]);

  useEffect(() => {
    const engine = engineRef.current;
    if (!engine || !ctx.events.length) return;

    const trackColors = tracksWithEvents.map((_, i) => getColor(colors[i]) ?? "blue");

    let passedCoords: [number, number][] | undefined;
    if (ctx.routeMode === "osrm" && ctx.routeCoords.length && ctx.eventOsrmIndices.length) {
      const fromIdx = ctx.eventOsrmIndices[prevEventIndex.current] ?? 0;
      const toIdx = ctx.eventOsrmIndices[ctx.activeEventIndex] ?? fromIdx;
      passedCoords = ctx.routeCoords.slice(0, fromIdx + 1);
      if (toIdx > fromIdx && ctx.routeCoords[toIdx]) {
        passedCoords = [...passedCoords, ctx.routeCoords[toIdx]];
      }
    }

    engine.drawRoute({
      routeCoords: ctx.routeCoords,
      routeMode: ctx.routeMode,
      traceLength: ctx.traceLength,
      perTrack: options.route.direct.perTrack,
      lineWeight: options.route.direct.lineWeight,
      showIntermediatePoints: options.route.direct.showIntermediatePoints,
      passedCoords,
      activeEventIndex: ctx.activeEventIndex,
      events: ctx.events,
      tracksWithEvents,
      colors: trackColors,
    });

    const active = ctx.events[ctx.activeEventIndex];
    const next = ctx.events[ctx.activeEventIndex + 1];
    let headAngle = 0;
    let headPosition: [number, number] | undefined = active?.latlng;
    if (active && next) {
      headAngle = calculateBearing(active.latlng, next.latlng);
    } else if (active?.angle != null) {
      headAngle = active.angle;
    }

    engine.drawMarkers({
      events: ctx.events,
      activeEventIndex: ctx.activeEventIndex,
      perEventMarkers,
      headStyle,
      headAngle,
      headPosition,
      onEventClick: setActiveEventIndex,
    });

    if (options.geo.emphasize.mapCircles) {
      engine.drawEmphasizes({ emphasizes, circleRadius: emphasizeRadius });
    }

    if (ctx.autoPan) {
      const points =
        ctx.routeMode === "osrm" && ctx.routeCoords.length
          ? ctx.routeCoords
          : ctx.events.slice(0, ctx.activeEventIndex + 1).map((e) => e.latlng);
      if (points.length) {
        engine.fitToBounds(points, {
          padding: options.map.autoPanPadding,
          maxZoom: ctx.autoPanMaxZoom,
        });
      }
    }

    if (
      options.route.osrm.animateMovingMarker &&
      ctx.routeMode === "osrm" &&
      active &&
      next &&
      ctx.routeCoords.length &&
      ctx.eventOsrmIndices.length
    ) {
      const fromIdx = ctx.eventOsrmIndices[prevEventIndex.current] ?? 0;
      const toIdx = ctx.eventOsrmIndices[ctx.activeEventIndex] ?? fromIdx;
      const from = ctx.routeCoords[fromIdx];
      const to = ctx.routeCoords[toIdx];
      if (from && to && fromIdx !== toIdx) {
        engine.animateHead({
          from,
          to,
          angle: calculateBearing(from, to),
          duration: eventIntervalMs,
        });
      }
    }

    prevEventIndex.current = ctx.activeEventIndex;
  }, [
    ctx.mapEngine,
    ctx.routeCoords,
    ctx.routeMode,
    ctx.traceLength,
    ctx.activeEventIndex,
    ctx.eventOsrmIndices,
    ctx.autoPan,
    ctx.autoPanMaxZoom,
    ctx.events,
    ctx.routeIsLoading,
    emphasizes,
    tracksWithEvents,
    emphasizeRadius,
    perEventMarkers,
    headStyle,
    options.route.direct.perTrack,
    options.route.direct.lineWeight,
    options.route.direct.showIntermediatePoints,
    options.route.osrm.animateMovingMarker,
    options.geo.emphasize.mapCircles,
    options.map.autoPanPadding,
    options.map.autoPanMaxZoom,
    setActiveEventIndex,
    eventIntervalMs,
    mapReadyVersion,
  ]);

  return (
    <div ref={containerRef} className="relative h-full w-full">
      {ctx.routeIsLoading && (
        <div className="bg-background/70 absolute inset-0 z-10 flex items-center justify-center gap-2">
          <Loader2 className="animate-spin" />
          <span>Loading route...</span>
        </div>
      )}
    </div>
  );
}
