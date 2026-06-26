import React, { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-simple-map-screenshoter";
import { useFormContext } from "react-hook-form";
import { carMarkerSvg } from "../icons/car";
import {
  carIconClassName,
  pointClassName,
  polylineClassName,
} from "../../utils/classes";
import {
  Track,
  TrackerState,
  TrackPoint,
  TrackWithEvents,
} from "@/components/macro/tracker/utils/types";
import { CENTER_COORD } from "@/components/macro/tracker/utils/constants";
import { df } from "@/components/macro/tracker/utils/remap";
import { colors, ColorType, getColor } from "@/components/micro/badge/color";
import { classNames } from "@/utils";
import {
  autoPaneMap,
  emphasizeRadius,
  eventIndex,
  filterIran,
  minutes,
  timeIndex,
  traceCount,
} from "@/components/macro/tracker";
import { useSignals } from "@preact/signals-react/runtime";
import { isWithinIran } from "@/utils/geographic";
import { getMapTileUrl } from "@/lib";
import { useTheme } from "next-themes";

export default function TrackerMap() {
  useSignals();
  const { resolvedTheme } = useTheme();
  const tileUrl = getMapTileUrl(resolvedTheme);
  const { getValues } = useFormContext<TrackerState>();
  const ts = getValues("tracksWithEvents");
  const events = getValues("events");
  const emphasizes = getValues("emphasizes") || [];
  const times = minutes.value;
  const currentTime = times[timeIndex.value];
  const mapInitialized = useRef(false);
  const [map, setMap] = useState<L.Map>();
  const mapContainer = useRef(null);

  const tracksWithEvents = useMemo(() => {
    return ts.map((t) => ({
      ...t,
      events: filterIran.value
        ? t.events.filter((e) => isWithinIran(e.latLng[0], e.latLng[1]))
        : t.events,
    }));
  }, [ts, filterIran.value]);

  const center: Point = CENTER_COORD;
  useEffect(() => {
    if (!center) return;
    !mapInitialized.current && mapInitialize();
  }, [center]);

  useEffect(() => {
    if (!map || !events?.length) return;
    drawLine({ map, tracksWithEvents, time: currentTime });
    return () => {
      map.eachLayer((layer: any) => {
        if (!layer) return;
        if (layer._url) return;
        map.removeLayer(layer);
      });
    };
  }, [tracksWithEvents, map, eventIndex.value, currentTime]);

  useEffect(() => {
    if (!map) return;

    const activeTime = times[timeIndex.value];
    const activeEmphasizes = emphasizes.filter((x) => {
      return x.startTime <= activeTime && x.endTime >= activeTime;
    });

    activeEmphasizes.forEach((x) => {
      const centerPoint = new L.LatLng(x.latLng[0], x.latLng[1]);

      if (x.type === "encounter") {
        L.circleMarker(centerPoint, {
          radius: emphasizeRadius.value,
          weight: 1,
          className: classNames("stroke-red-500 opacity-70 fill-red-500"),
        }).addTo(map);
      }
    });
  }, [timeIndex.value, map, eventIndex.value, currentTime]);

  function mapInitialize() {
    let initialMap = L.map("tracker-map", {
      center,
      zoom: 7,
      zoomControl: false,
    });
    L.tileLayer(tileUrl).addTo(initialMap);

    setMap(initialMap);
    mapInitialized.current = true;
  }

  function adjustMapView({ map, points }: { map: L.Map; points?: Point[] }) {
    if (!map || !points?.length) return;
    const bounds = L.latLngBounds(points);
    map.fitBounds(bounds, {
      paddingTopLeft: [400, 100],
      paddingBottomRight: [100, 400],
    });
  }

  function drawLine({
    map,
    tracksWithEvents,
    time,
  }: {
    map: L.Map;
    tracks?: Track[];
    tracksWithEvents?: TrackWithEvents[];
    time: number;
  }) {
    let panePoints = [] as Point[];
    tracksWithEvents?.forEach((e, trackIndex) => {
      if (!e.events?.length) return;

      const events = e.events
        .filter((x) => x.time <= time)
        .slice(-traceCount.value);
      if (!events.length) return;

      const color = getColor(colors[trackIndex]);
      const coords = events.map((x) => x.latLng);
      var polyline = L.polyline(coords, {
        weight: 4,
        className: polylineClassName(color),
      }).addTo(map);

      events.forEach(function (event, i) {
        if (i < events.length - 1) {
          const marker = L.circleMarker(event.latLng, {
            radius: 1,
            weight: 10,
            className: pointClassName(color),
          }).addTo(map);
          marker.bindTooltip(() => makeTooltip(event));
        }
      });

      const endPoint = coords[coords.length - 1];
      const point = events[events.length - 1];

      const angle = point.angle;

      if (endPoint) {
        const arrowIcon = createCarIcon(angle, point, getColor(color));
        const carMarker = L.marker(endPoint, { icon: arrowIcon }).addTo(map);
        carMarker.bindTooltip(() => makeTooltip(point));
      }
      panePoints.push(...coords);
    });

    panePoints = panePoints.filter(
      (point) => point && point[0] !== undefined && point[1] !== undefined,
    );

    if (autoPaneMap.value) adjustMapView({ map, points: panePoints });
  }

  function createCarIcon(angle: number, point?: TrackPoint, color?: ColorType) {
    return L.divIcon({
      className: "",
      iconSize: [16, 16],
      html: `<div class="${carIconClassName(color)} ${point?.assumed && ""}" style="transform: rotate(${angle}deg)">${carMarkerSvg}</div>`,
    });
  }

  return (
    <div
      ref={mapContainer}
      id="tracker-map"
      className="z-2 h-full w-full"
    ></div>
  );
}

function makeTooltip(point: TrackPoint) {
  return `<div class="flex flex-col font-main dir-rtl gap-2 p-2">
            <div class="flex gap-2">
              <span class="text-sm text-gray-700 font-semibold">استان: </span>
              <span>${point.province}</span>
            </div>
            <div class="flex gap-2">
              <span class="text-sm text-gray-700 font-semibold">محور: </span>
              <span>${point.road}</span>
            </div>
            <div class="flex gap-2">
              <span class="text-sm text-gray-700 font-semibold">زمان تردد: </span>
              <span class="dir-ltr">${df.format(point.time)}</span>
            </div>
          </div>`;
}
