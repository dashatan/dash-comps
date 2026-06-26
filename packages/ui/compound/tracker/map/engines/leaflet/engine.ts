import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type {
  MapEngine,
  MapEngineHandle,
} from "@/components/compound/tracker/map/types";
import { calcAngle } from "@/components/compound/tracker/utils/bearing";
import {
  colors,
  getColor,
  type ColorType,
} from "@/components/common/badge/color";

const TRACK_COLORS = colors;

function colorClass(color: ColorType | undefined) {
  const map: Record<string, string> = {
    blue: "stroke-blue-500",
    green: "stroke-green-500",
    red: "stroke-red-500",
    yellow: "stroke-yellow-500",
    orange: "stroke-orange-500",
    teal: "stroke-teal-500",
    indigo: "stroke-indigo-500",
    lime: "stroke-lime-500",
    pink: "stroke-pink-500",
    gray: "stroke-gray-500",
    black: "stroke-gray-800",
    white: "stroke-gray-300",
  };
  return map[color ?? "blue"] ?? "stroke-blue-500";
}

function fillClass(color: ColorType | undefined) {
  const map: Record<string, string> = {
    blue: "fill-blue-500",
    green: "fill-green-500",
    red: "fill-red-500",
    yellow: "fill-yellow-500",
    orange: "fill-orange-500",
    teal: "fill-teal-500",
    indigo: "fill-indigo-500",
    lime: "fill-lime-500",
    pink: "fill-pink-500",
    gray: "fill-gray-500",
    black: "fill-gray-800",
    white: "fill-gray-300",
  };
  return map[color ?? "blue"] ?? "fill-blue-500";
}

export function createLeafletEngine(): MapEngine {
  let map: L.Map | null = null;
  let layerGroup: L.LayerGroup | null = null;
  let headMarker: L.Marker | null = null;

  const clearLayers = () => {
    layerGroup?.clearLayers();
    if (headMarker && map) {
      map.removeLayer(headMarker);
      headMarker = null;
    }
  };

  return {
    id: "leaflet",
    async mount(container, config) {
      map = L.map(container, {
        center: config.center,
        zoom: config.zoom,
        zoomControl: config.controls?.zoom ?? false,
      });
      L.tileLayer(config.tileUrl).addTo(map);
      layerGroup = L.layerGroup().addTo(map);
      const handle: MapEngineHandle = {
        id: "leaflet",
        destroy: () => {
          clearLayers();
          map?.remove();
          map = null;
          layerGroup = null;
        },
        invalidateSize: () => map?.invalidateSize(),
      };
      return handle;
    },
    drawRoute(ctx) {
      if (!map || !layerGroup) return;
      clearLayers();
      if (ctx.routeMode === "none") return;

      const drawTrack = (
        coords: [number, number][],
        trackIndex: number,
        events: typeof ctx.events,
      ) => {
        const color = getColor(TRACK_COLORS[trackIndex % TRACK_COLORS.length]);
        if (coords.length > 1) {
          L.polyline(coords, {
            weight: ctx.lineWeight,
            className: colorClass(color),
          }).addTo(layerGroup!);
        }
        if (ctx.showIntermediatePoints) {
          events.slice(0, -1).forEach((event) => {
            L.circleMarker(event.latlng, {
              radius: 3,
              weight: 2,
              className: `${fillClass(color)} ${colorClass(color)}`,
            })
              .bindTooltip(
                () =>
                  `<div class="dir-rtl text-xs p-1"><div>${event.province ?? ""}</div><div>${event.road ?? ""}</div></div>`,
              )
              .addTo(layerGroup!);
          });
        }
        const last = events[events.length - 1];
        if (last) {
          const angle =
            last.angle ??
            calcAngle(
              coords[coords.length - 2] ?? coords[0],
              coords[coords.length - 1],
            );
          const icon = L.divIcon({
            className: "",
            iconSize: [16, 16],
            html: `<div style="transform:rotate(${angle}deg)" class="text-red-600 font-bold">▲</div>`,
          });
          headMarker = L.marker(last.latlng, { icon }).addTo(map!);
        }
      };

      if (ctx.perTrack && ctx.tracksWithEvents.length) {
        ctx.tracksWithEvents.forEach((track, i) => {
          const currentTime = ctx.events[ctx.activeEventIndex]?.time;
          const visible = track.events
            .filter((e) => !currentTime || e.time <= currentTime)
            .slice(-ctx.traceLength);
          if (!visible.length) return;
          drawTrack(
            visible.map((e) => e.latlng),
            i,
            visible,
          );
        });
      } else if (ctx.routeCoords.length) {
        drawTrack(
          ctx.routeCoords,
          0,
          ctx.events.slice(0, ctx.activeEventIndex + 1),
        );
      }
    },
    drawMarkers(ctx) {
      if (!map || !layerGroup || !ctx.perEventMarkers) return;
      ctx.events.forEach((event, index) => {
        const isActive = index === ctx.activeEventIndex;
        L.circleMarker(event.latlng, {
          radius: isActive ? 8 : 5,
          weight: 2,
          className: isActive
            ? "fill-primary stroke-primary"
            : "fill-blue-400 stroke-blue-600",
        })
          .on("click", () => ctx.onEventClick?.(index))
          .addTo(layerGroup!);
      });
    },
    drawEmphasizes(ctx) {
      if (!map || !layerGroup) return;
      ctx.emphasizes.forEach((x) => {
        if (x.type === "encounter") {
          L.circleMarker([x.latLng[0], x.latLng[1]], {
            radius: ctx.circleRadius,
            weight: 1,
            className: "stroke-red-500 fill-red-500 opacity-40",
          }).addTo(layerGroup!);
        }
      });
    },
    animateHead(ctx) {
      if (!map || !headMarker) return;
      headMarker.setLatLng(ctx.to);
    },
    fitToBounds(points, options) {
      if (!map || !points.length) return;
      const bounds = L.latLngBounds(points.map(([lat, lng]) => [lat, lng]));
      map.fitBounds(bounds, {
        paddingTopLeft: [
          options?.padding?.left ?? 300,
          options?.padding?.top ?? 40,
        ],
        paddingBottomRight: [
          options?.padding?.right ?? 40,
          options?.padding?.bottom ?? 40,
        ],
        maxZoom: options?.maxZoom ?? 18,
        animate: options?.animate ?? true,
      });
    },
    clear: clearLayers,
  };
}
