"use client";

import { useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import { useLazyGetRoutingQuery } from "@/features/traffic/services/traffic";
import "./styles.css";
import { useLocationPickerStore } from "@/components/compound/location-picker/context";
import { CENTER_COORD } from "@/components/macro/tracker/utils/constants";
import useResources from "@/features/resources/utils/useResources";
import { Device } from "@/features/resources/types";
import {
  buildNameLookup,
  enrichDevices,
} from "@/components/compound/location-picker/lib/enrich-devices";
import {
  createOriginIcon,
  createDestinationIcon,
  createDeviceIcon,
  createDeviceMarkers,
  removeMarker as removeMarkerUtil,
} from "./utils";
import { getMapTileUrl, getStoreEnv, useLanguage } from "@/lib";
import { toast } from "sonner";
import { useTheme } from "next-themes";

export default function RoutingMap() {
  const { t } = useLanguage();
  const mapRef = useRef<L.Map>(undefined);
  const polylineRef = useRef<L.Polyline>(undefined);
  const markersRef = useRef<L.MarkerClusterGroup>(undefined);
  const originMarkerRef = useRef<L.Marker>(undefined);
  const destinationMarkerRef = useRef<L.Marker>(undefined);
  const floatingOriginRef = useRef<L.Marker>(undefined);
  const floatingDestinationRef = useRef<L.Marker>(undefined);

  const { routing, setRouting, setDraftField } = useLocationPickerStore();
  const [getRoutingRequest, { isLoading, isFetching }] = useLazyGetRoutingQuery();
  const originLatLng = routing.originLatLng;
  const destinationLatLng = routing.destinationLatLng;
  const addingOrigin = routing.addingOrigin;
  const addingDestination = routing.addingDestination;

  const { resolvedTheme } = useTheme();
  const tileUrl = getMapTileUrl(resolvedTheme);

  const { devices, provinces, roads, sources } = useResources();
  const enrichedDevices = useMemo(() => {
    const lookup = buildNameLookup({ provinces, roads, sources });
    return enrichDevices(devices, lookup);
  }, [devices, provinces, roads, sources]);

  const icons = useMemo(
    () => ({
      origin: createOriginIcon(),
      destination: createDestinationIcon(),
      device: createDeviceIcon(),
    }),
    [],
  );
  useEffect(() => {
    setRouting({ isLoading: isLoading || isFetching });
  }, [isLoading, isFetching, setRouting]);

  useEffect(() => {
    if (typeof window === "undefined" || mapRef.current) return;

    const map = L.map("routing-map").setView(CENTER_COORD, 7);
    L.tileLayer(tileUrl, { maxZoom: 19 }).addTo(map);
    mapRef.current = map;

    if (originLatLng) {
      addStaticMarker(originLatLng, originMarkerRef, icons.origin);
    }

    if (destinationLatLng) {
      addStaticMarker(destinationLatLng, destinationMarkerRef, icons.destination);
    }

    adjustMapView();
  }, [originLatLng, destinationLatLng, tileUrl, icons.origin, icons.destination]);

  useEffect(() => {
    if (!mapRef.current || !originLatLng || !destinationLatLng) return;
    const [lat1, lng1] = originLatLng;
    const [lat2, lng2] = destinationLatLng;

    getRouting({ lat1, lng1, lat2, lng2 });
    adjustMapView();
  }, [originLatLng, destinationLatLng]);

  useEffect(() => {
    if (!mapRef.current) return;

    if (addingOrigin) setupMarker("origin");
    if (addingDestination) setupMarker("destination");

    return function cleanup() {
      if (mapRef.current) {
        removeMarkerUtil(floatingOriginRef, mapRef.current);
        removeMarkerUtil(floatingDestinationRef, mapRef.current);
      }
    };
  }, [addingOrigin, addingDestination]);

  function setupMarker(type: "origin" | "destination") {
    const map = mapRef.current;
    if (!map) return;

    const markerRef = type === "origin" ? originMarkerRef : destinationMarkerRef;
    const floatingMarkerRef =
      type === "origin" ? floatingOriginRef : floatingDestinationRef;
    const icon = icons[type];
    const applyPosition = (position: [number, number]) => {
      if (type === "origin") {
        setRouting({ originLatLng: position, addingOrigin: false });
      } else {
        setRouting({ destinationLatLng: position, addingDestination: false });
      }
    };

    removeMarkerUtil(markerRef, map);
    removeMarkerUtil(floatingMarkerRef, map);

    map.on("mousemove", function moveFloatingMarker(e) {
      if (!floatingMarkerRef.current) {
        floatingMarkerRef.current = L.marker(e.latlng, { icon }).addTo(map);
      } else {
        floatingMarkerRef.current.setLatLng(e.latlng);
      }
    });

    map.on("click", function placeStaticMarker(e) {
      const position: [number, number] = [e.latlng.lat, e.latlng.lng];
      const marker = L.marker(e.latlng, { icon, draggable: true }).addTo(map);

      marker.on("dragend", function (event) {
        const newPosition = event.target.getLatLng();
        applyPosition([newPosition.lat, newPosition.lng]);
      });

      applyPosition(position);
      removeMarkerUtil(floatingMarkerRef, map);
      markerRef.current = marker;
      map.off("mousemove");
      map.off("click");
    });
  }

  function addStaticMarker(
    latlng: [number, number],
    markerRef: React.MutableRefObject<L.Marker | undefined>,
    icon: L.DivIcon,
  ) {
    if (!mapRef.current) return;

    const marker = L.marker(latlng, { icon, draggable: true }).addTo(mapRef.current);
    marker.on("dragend", function (event) {
      const newPosition = event.target.getLatLng();
      const position: [number, number] = [newPosition.lat, newPosition.lng];
      if (markerRef === originMarkerRef) {
        setRouting({ originLatLng: position });
      } else {
        setRouting({ destinationLatLng: position });
      }
    });
    markerRef.current = marker;
  }

  function adjustMapView() {
    if (!mapRef.current || !originLatLng || !destinationLatLng) return;

    const bounds = L.latLngBounds([originLatLng, destinationLatLng]);
    mapRef.current.fitBounds(bounds, { padding: [50, 50] });
  }

  function getRouting(params: {
    lat1: number;
    lng1: number;
    lat2: number;
    lng2: number;
  }) {
    getRoutingRequest(params, true)
      .unwrap()
      .then((res) => {
        const points = res.geojson.geometry.map(
          ([lng, lat]: [number, number]) => [lat, lng] as Point,
        );
        const routeDevices = enrichedDevices?.filter(
          (x) => res.devices && res.devices.includes(x.id),
        );
        drawPolyline(points);
        addMarkers(routeDevices || []);
        const { destinationName, originName } = getRouteName(routeDevices || [], params);
        setRouting({
          routes: res.geojson.legs.map((x, i) => ({
            index: i,
            distance: x.distance,
            duration: x.duration,
            title: t("locationPicker.routeTitle", { index: String(i + 1) }),
            devices: res.devices || [],
            destinationName,
            originName,
            summary: x.summary,
          })),
        });
        setDraftField("devices", res.devices);
      })
      .catch((error) => {
        console.log(error);
        toast.error(t("locationPicker.routeFetchError"));
      });
  }

  function getRouteName(
    routeDevices: Device[],
    latlngs: { lat1: number; lng1: number; lat2: number; lng2: number },
  ) {
    const originDevice = routeDevices[0];
    const destinationDevice = routeDevices[routeDevices.length - 1];
    const originName =
      originDevice?.name ||
      t("locationPicker.coordinates", {
        coords: `${latlngs.lat1.toFixed(2)},${latlngs.lng1.toFixed(2)}`,
      });
    const destinationName =
      destinationDevice?.name ||
      t("locationPicker.coordinates", {
        coords: `${latlngs.lat2.toFixed(2)},${latlngs.lng2.toFixed(2)}`,
      });
    return { originName, destinationName };
  }

  function drawPolyline(points: [number, number][]) {
    if (!mapRef.current) return;

    if (polylineRef.current) mapRef.current.removeLayer(polylineRef.current);
    polylineRef.current = L.polyline(points, {
      weight: 6,
      className: "stroke-primary",
    }).addTo(mapRef.current);
  }

  function addMarkers(devices: Device[]) {
    if (!mapRef.current) return;
    if (markersRef.current) markersRef.current.clearLayers();

    const markers = createDeviceMarkers(devices, icons.device);
    mapRef.current.addLayer(markers);
    markersRef.current = markers;
  }

  return <div id="routing-map" className="z-2 flex h-full w-full p-4"></div>;
}
