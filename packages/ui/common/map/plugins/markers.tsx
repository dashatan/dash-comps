"use client";

import { useRef } from "react";
import L from "leaflet";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import { useMapPlugin } from "@/components/common/map/hooks/use-map-plugin";
import { formatMapOverlayHtml } from "@/components/common/map/utils/overlay-content";
import {
  createDeviceIcon,
  createMarkerClusterGroup,
  popupConfig,
  tooltipConfig,
} from "@/components/common/map/utils/markers";
import {
  createSelectionPulseIcon,
  getMapCenterWithPixelOffset,
} from "@/components/common/map/utils/selection";
import type { MapMarkersProps } from "@/components/common/map/types";

function toLatLng(item: { lat: string | number; long: string | number }): Point {
  return [parseFloat(String(item.lat)), parseFloat(String(item.long))];
}

const DEFAULT_SELECTION_MIN_ZOOM = 12;
const DEFAULT_SELECTION_PAN_OFFSET: [number, number] = [140, 0];

export function MapMarkers<T extends { lat: string | number; long: string | number }>({
  data,
  icon = createDeviceIcon(),
  cluster = true,
  selectedKey = null,
  getItemKey,
  selectionMinZoom = DEFAULT_SELECTION_MIN_ZOOM,
  selectionPanOffsetPx = DEFAULT_SELECTION_PAN_OFFSET,
  tooltip,
  tooltipItems,
  tooltipTitle,
  popup,
  popupItems,
  popupTitle,
  popupOptions = popupConfig,
  onMarkerClick,
}: MapMarkersProps<T>) {
  const layerRef = useRef<L.LayerGroup | L.MarkerClusterGroup | null>(null);
  const markerByKeyRef = useRef<Map<string | number, L.Marker>>(new Map());
  const highlightRef = useRef<L.Marker | null>(null);
  const iconRef = useRef(icon);
  const tooltipRef = useRef(tooltip);
  const tooltipItemsRef = useRef(tooltipItems);
  const tooltipTitleRef = useRef(tooltipTitle);
  const popupRef = useRef(popup);
  const popupItemsRef = useRef(popupItems);
  const popupTitleRef = useRef(popupTitle);
  const onMarkerClickRef = useRef(onMarkerClick);
  iconRef.current = icon;
  tooltipRef.current = tooltip;
  tooltipItemsRef.current = tooltipItems;
  tooltipTitleRef.current = tooltipTitle;
  popupRef.current = popup;
  popupItemsRef.current = popupItems;
  popupTitleRef.current = popupTitle;
  onMarkerClickRef.current = onMarkerClick;

  useMapPlugin((map) => {
    if (layerRef.current) {
      map.removeLayer(layerRef.current);
    }

    markerByKeyRef.current.clear();
    const layer = cluster ? createMarkerClusterGroup() : L.layerGroup();

    data.forEach((item) => {
      const currentIcon = iconRef.current;
      const markerIcon =
        typeof currentIcon === "function"
          ? currentIcon(item)
          : (currentIcon ?? createDeviceIcon());
      const marker = L.marker(toLatLng(item), { icon: markerIcon });

      const itemKey = getItemKey?.(item);
      if (itemKey != null) {
        markerByKeyRef.current.set(itemKey, marker);
      }

      if (tooltipItemsRef.current) {
        marker.bindTooltip(
          formatMapOverlayHtml(
            tooltipTitleRef.current?.(item),
            tooltipItemsRef.current(item),
          ),
          tooltipConfig,
        );
      } else if (tooltipRef.current) {
        marker.bindTooltip(tooltipRef.current(item), tooltipConfig);
      }

      if (popupItemsRef.current) {
        marker.bindPopup(
          formatMapOverlayHtml(popupTitleRef.current?.(item), popupItemsRef.current(item)),
          popupOptions,
        );
      } else if (popupRef.current) {
        marker.bindPopup(popupRef.current(item), popupOptions);
      }

      if (onMarkerClickRef.current) {
        marker.on("click", (event: L.LeafletMouseEvent) => {
          L.DomEvent.stopPropagation(event);
          onMarkerClickRef.current?.(item, marker.getLatLng());
        });
      }

      layer.addLayer(marker);
    });

    if (cluster && onMarkerClickRef.current) {
      const clusterLayer = layer as L.MarkerClusterGroup;

      clusterLayer.on("click", (event: L.LeafletMouseEvent) => {
        const latlng = event.latlng;
        const clicked = data.find((item) => {
          const lat = parseFloat(String(item.lat));
          const lng = parseFloat(String(item.long));
          return (
            Number.isFinite(lat) &&
            Number.isFinite(lng) &&
            Math.abs(lat - latlng.lat) < 1e-4 &&
            Math.abs(lng - latlng.lng) < 1e-4
          );
        });

        if (clicked) {
          onMarkerClickRef.current?.(clicked, latlng);
        }
      });

      clusterLayer.on("clusterclick", (event) => {
        const cluster = event.layer as L.MarkerCluster;
        const childMarkers = cluster.getAllChildMarkers();
        if (childMarkers.length !== 1) return;

        const latlng = childMarkers[0]?.getLatLng();
        if (!latlng) return;

        const clicked = data.find((item) => {
          const lat = parseFloat(String(item.lat));
          const lng = parseFloat(String(item.long));
          return (
            Number.isFinite(lat) &&
            Number.isFinite(lng) &&
            Math.abs(lat - latlng.lat) < 1e-4 &&
            Math.abs(lng - latlng.lng) < 1e-4
          );
        });

        if (clicked) {
          L.DomEvent.stopPropagation(event);
          onMarkerClickRef.current?.(clicked, latlng);
        }
      });
    }

    map.addLayer(layer);
    layerRef.current = layer;

    return () => {
      map.removeLayer(layer);
      layerRef.current = null;
      markerByKeyRef.current.clear();
    };
  }, [data, cluster, popupOptions, getItemKey]);

  useMapPlugin((map) => {
    if (highlightRef.current) {
      map.removeLayer(highlightRef.current);
      highlightRef.current = null;
    }

    if (selectedKey == null || !getItemKey) return;

    const targetMarker = markerByKeyRef.current.get(selectedKey);
    const item = data.find((entry) => getItemKey(entry) === selectedKey);
    if (!item || !targetMarker) return;

    const latlng = targetMarker.getLatLng();
    const highlight = L.marker(latlng, {
      icon: createSelectionPulseIcon(),
      zIndexOffset: 1000,
      interactive: false,
    });
    map.addLayer(highlight);
    highlightRef.current = highlight;

    const focusAt = (target: L.LatLng) => {
      const zoom = Math.max(map.getZoom(), selectionMinZoom);
      const center = getMapCenterWithPixelOffset(map, target, zoom, selectionPanOffsetPx);
      map.flyTo(center, zoom, { duration: 0.45 });
    };

    const clusterLayer = layerRef.current;
    if (cluster && clusterLayer && "zoomToShowLayer" in clusterLayer) {
      const clusterGroup = clusterLayer as L.MarkerClusterGroup;
      const visibleParent = clusterGroup.getVisibleParent(targetMarker);

      if (visibleParent && visibleParent !== targetMarker) {
        clusterGroup.zoomToShowLayer(targetMarker, () => {
          focusAt(latlng);
        });
      } else {
        focusAt(latlng);
      }
    } else {
      focusAt(latlng);
    }

    return () => {
      if (highlightRef.current) {
        map.removeLayer(highlightRef.current);
        highlightRef.current = null;
      }
    };
  }, [selectedKey, data, cluster, getItemKey, selectionMinZoom, selectionPanOffsetPx]);

  return null;
}
