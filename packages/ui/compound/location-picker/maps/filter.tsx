"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet-geosearch/dist/geosearch.css";
import inPolygon from "robust-point-in-polygon";
import { useLocationPickerStore } from "@/components/compound/location-picker/context";
import "./styles.css";
import { Device } from "@/features/resources/types";
import { CENTER_COORD } from "@/components/macro/tracker/utils/constants";
import { isWithinIran } from "@/utils/geographic";
import { createDeviceIcon, createDeviceMarkers, createSearchIcon } from "./utils";
import { getMapTileUrl, getStoreEnv, useLanguage } from "@/lib";
import { useTheme } from "next-themes";

export type FilterMapProps = {
  devices?: Device[];
  color?: string;
  onSelect?: (selected: number[] | undefined) => void;
  center?: Point;
};

export default function FilterMap({
  devices: devicesProp,
  color,
  onSelect,
  center: c,
}: FilterMapProps) {
  const { t } = useLanguage();
  const mapRef = useRef<L.Map>(undefined);
  const markersRef = useRef<L.MarkerClusterGroup>(undefined);
  const center = useRef<Point>(c || CENTER_COORD);
  const { filteredData, setDraftField } = useLocationPickerStore();
  const d = devicesProp ?? filteredData.devices;
  const { NOMINATIM_URL } = getStoreEnv();
  const { resolvedTheme } = useTheme();
  const tileUrl = getMapTileUrl(resolvedTheme);

  const devices = d?.filter((x) => {
    if (x.lat && x.long) return isWithinIran(x.lat, x.long);
    return true;
  });

  const deviceIcon = createDeviceIcon();

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (mapRef.current && markersRef.current) {
      updateMarkers();
    } else {
      initialize();
    }
  }, [devices?.length, color, t]);

  function updateMarkers() {
    if (!mapRef.current || !markersRef.current) return;

    const markers = createDeviceMarkers(devices || [], deviceIcon);
    markersRef.current.clearLayers();
    mapRef.current.addLayer(markers);
    markersRef.current = markers;

    if (color) {
      mapRef.current.pm.enableDraw("Polygon", { pathOptions: { color } });
      mapRef.current.pm.enableDraw("Rectangle", { pathOptions: { color } });
    }
  }

  function initialize() {
    const map = L.map("filter-map", { pmIgnore: false }).setView(center.current, 5);
    L.tileLayer(tileUrl, { minZoom: 3, maxZoom: 21 }).addTo(map);

    // Add PM controls
    map.pm.addControls({
      position: "topleft",
      drawMarker: false,
      drawPolyline: false,
      drawText: false,
      rotateMode: false,
      drawCircleMarker: false,
      drawCircle: false,
      cutPolygon: false,
    });

    if (color) {
      map.pm.enableDraw("Polygon", { pathOptions: { color } });
      map.pm.enableDraw("Rectangle", { pathOptions: { color } });
    }

    // Create markers
    const markers = createDeviceMarkers(devices || [], deviceIcon);
    map.addLayer(markers);

    // Event handlers
    map.on("dragend", () => {
      const c = map.getCenter();
      center.current = [c.lat, c.lng];
    });

    map.on("pm:create", (e) => {
      if (["Polygon", "Rectangle"].includes(e.shape)) {
        if (color && e.layer instanceof L.Polyline) {
          e.layer.setStyle({ color });
        }
        const coords = (e.layer as any)._latlngs as { lat: number; lng: number }[][];
        const polygon: Point[] = coords[0].map((y) => [y.lat, y.lng]);
        const selected = devices?.flatMap((x) =>
          inPolygon(polygon, [parseFloat(x.lat), parseFloat(x.long)]) <= 0 ? x.id : [],
        );
        if (onSelect) onSelect(selected);
        else setDraftField("devices", selected);
      }
    });

    // Add search control
    const provider = new OpenStreetMapProvider({
      searchUrl: NOMINATIM_URL,
      params: {
        "accept-language": "fa,fa-IR",
      },
    });
    // @ts-ignore
    const searchControl = new GeoSearchControl({
      provider,
      style: "bar",
      searchLabel: t("locationPicker.mapSearchPlaceholder"),
      marker: { icon: createSearchIcon() },
    });
    map.addControl(searchControl);

    // Save references
    mapRef.current = map;
    markersRef.current = markers;
  }

  return <div id="filter-map" className="z-2 flex h-full w-full p-4"></div>;
}
