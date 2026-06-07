import mapLibreGl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { MapEngine, MapEngineHandle } from "@/components/compound/tracker-new/map/types";
import { getHexColor } from "@dash/core/utils";
import { calculateBearing, interpolate } from "@/components/compound/tracker-new/utils/bearing";

const ROUTE_SOURCE = "tracker-new-route";
const ROUTE_LAYER = "tracker-new-route-layer";
const PASSED_SOURCE = "tracker-new-passed-route";
const PASSED_LAYER = "tracker-new-passed-route-layer";

export function createMapLibreEngine(): MapEngine {
  let map: mapLibreGl.Map | null = null;
  let headMarker: mapLibreGl.Marker | null = null;
  let eventMarkers: mapLibreGl.Marker[] = [];
  let animFrame: number | null = null;

  const removeEventMarkers = () => {
    eventMarkers.forEach((m) => m.remove());
    eventMarkers = [];
  };

  const removeRouteLayers = () => {
    if (!map) return;
    if (map.getLayer(PASSED_LAYER)) map.removeLayer(PASSED_LAYER);
    if (map.getSource(PASSED_SOURCE)) map.removeSource(PASSED_SOURCE);
    if (map.getLayer(ROUTE_LAYER)) map.removeLayer(ROUTE_LAYER);
    if (map.getSource(ROUTE_SOURCE)) map.removeSource(ROUTE_SOURCE);
  };

  const toLngLat = (coords: [number, number][]) =>
    coords.map(([lat, lng]) => [lng, lat] as [number, number]);

  const addLine = (id: string, layerId: string, coords: [number, number][], colorVar: string) => {
    if (!map || coords.length < 2) return;
    const color = getHexColor(colorVar);
    map.addSource(id, {
      type: "geojson",
      data: {
        type: "Feature",
        geometry: { type: "LineString", coordinates: toLngLat(coords) },
        properties: {},
      },
    });
    map.addLayer({
      id: layerId,
      type: "line",
      source: id,
      paint: { "line-color": color, "line-width": 4 },
    });
  };

  return {
    id: "maplibre",
    async mount(container, config) {
      map = new mapLibreGl.Map({
        container,
        style: config.tileUrl,
        center: [config.center[1], config.center[0]],
        zoom: config.zoom,
        attributionControl: false,
      });
      await new Promise<void>((resolve) => {
        map!.once("load", () => resolve());
      });

      if (config.controls?.zoom) {
        map.addControl(new mapLibreGl.NavigationControl({ showCompass: config.controls.compass }), "top-right");
      }

      const handle: MapEngineHandle = {
        id: "maplibre",
        destroy: () => {
          if (animFrame) cancelAnimationFrame(animFrame);
          removeEventMarkers();
          headMarker?.remove();
          map?.remove();
          map = null;
        },
        invalidateSize: () => map?.resize(),
      };
      return handle;
    },
    drawRoute(ctx) {
      if (!map) return;
      removeRouteLayers();
      removeEventMarkers();
      headMarker?.remove();
      headMarker = null;
      if (ctx.routeMode === "none") return;

      const coords =
        ctx.perTrack && ctx.tracksWithEvents.length
          ? ctx.tracksWithEvents.flatMap((track) => {
              const current = ctx.events[ctx.activeEventIndex]?.time;
              const visible = track.events
                .filter((e) => !current || e.time <= current)
                .slice(-ctx.traceLength);
              return visible.map((e) => e.latlng);
            })
          : ctx.routeCoords;

      if (coords.length > 1) {
        addLine(ROUTE_SOURCE, ROUTE_LAYER, coords, "--color-primary");
      }
      if (ctx.passedCoords && ctx.passedCoords.length > 1) {
        addLine(PASSED_SOURCE, PASSED_LAYER, ctx.passedCoords, "--color-foreground");
      }
    },
    drawMarkers(ctx) {
      if (!map || !ctx.perEventMarkers) return;
      removeEventMarkers();
      ctx.events.forEach((event, index) => {
        const el = document.createElement("div");
        el.className = `rounded-full border-2 cursor-pointer ${index === ctx.activeEventIndex ? "bg-primary border-foreground size-4" : "bg-blue-400 border-white size-3"}`;
        el.onclick = () => ctx.onEventClick?.(index);
        const marker = new mapLibreGl.Marker({ element: el })
          .setLngLat([event.latlng[1], event.latlng[0]])
          .addTo(map!);
        eventMarkers.push(marker);
      });

      const active = ctx.events[ctx.activeEventIndex];
      if (active && ctx.headPosition) {
        const el = document.createElement("div");
        el.innerHTML = `<div style="transform:rotate(${ctx.headAngle}deg)" class="text-primary text-2xl">➤</div>`;
        headMarker = new mapLibreGl.Marker({ element: el, anchor: "center" })
          .setLngLat([ctx.headPosition[1], ctx.headPosition[0]])
          .addTo(map);
      } else if (active) {
        const el = document.createElement("div");
        el.innerHTML = `<div style="transform:rotate(${ctx.headAngle}deg)" class="text-primary text-2xl">➤</div>`;
        headMarker = new mapLibreGl.Marker({ element: el, anchor: "center" })
          .setLngLat([active.latlng[1], active.latlng[0]])
          .addTo(map);
      }
    },
    drawEmphasizes(ctx) {
      if (!map) return;
      ctx.emphasizes.forEach((x) => {
        if (x.type !== "encounter") return;
        const id = `emphasize-${x.startTime}`;
        if (map!.getSource(id)) return;
        map!.addSource(id, {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: { type: "Point", coordinates: [x.latLng[1], x.latLng[0]] },
            properties: {},
          },
        });
        map!.addLayer({
          id: `${id}-layer`,
          type: "circle",
          source: id,
          paint: {
            "circle-radius": ctx.circleRadius,
            "circle-color": "#ef4444",
            "circle-opacity": 0.25,
            "circle-stroke-color": "#ef4444",
            "circle-stroke-width": 1,
          },
        });
      });
    },
    animateHead(ctx) {
      if (!map || !headMarker) return;
      const start = performance.now();
      const from = ctx.from;
      const to = ctx.to;
      const animate = (time: number) => {
        const t = Math.min((time - start) / ctx.duration, 1);
        const lat = interpolate(from[0], to[0], t);
        const lng = interpolate(from[1], to[1], t);
        headMarker!.setLngLat([lng, lat]);
        if (t < 1) animFrame = requestAnimationFrame(animate);
      };
      if (animFrame) cancelAnimationFrame(animFrame);
      animFrame = requestAnimationFrame(animate);
    },
    fitToBounds(points, options) {
      if (!map || !points.length) return;
      const bounds = new mapLibreGl.LngLatBounds();
      points.forEach(([lat, lng]) => bounds.extend([lng, lat]));
      map.fitBounds(bounds, {
        padding: {
          left: options?.padding?.left ?? 300,
          top: options?.padding?.top ?? 40,
          right: options?.padding?.right ?? 40,
          bottom: options?.padding?.bottom ?? 40,
        },
        maxZoom: options?.maxZoom ?? 18,
        animate: options?.animate ?? true,
      });
    },
    clear() {
      removeRouteLayers();
      removeEventMarkers();
      headMarker?.remove();
      headMarker = null;
    },
  };
}

export { calculateBearing };
