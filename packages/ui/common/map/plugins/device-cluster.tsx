"use client";

import { useRef } from "react";
import L from "leaflet";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import { useMapPlugin } from "@/components/common/map/hooks/use-map-plugin";
import {
  createMarkerClusterGroup,
  deviceTooltipContent,
  tooltipConfig,
} from "@/components/common/map/utils/markers";
import type { MapDeviceClusterProps } from "@/components/common/map/types";

export function MapDeviceCluster({ devices, icon, onMarkerClick }: MapDeviceClusterProps) {
  const clusterRef = useRef<L.MarkerClusterGroup | null>(null);
  const onMarkerClickRef = useRef(onMarkerClick);
  onMarkerClickRef.current = onMarkerClick;

  useMapPlugin((map) => {
    if (clusterRef.current) {
      map.removeLayer(clusterRef.current);
    }

    const cluster = createMarkerClusterGroup();

    devices.forEach((device) => {
      const marker = L.marker([parseFloat(device.lat), parseFloat(device.long)], { icon });
      marker.bindTooltip(deviceTooltipContent(device), tooltipConfig);

      if (onMarkerClickRef.current) {
        marker.on("click", () => {
          onMarkerClickRef.current?.(device.id, marker.getLatLng());
        });
      }

      cluster.addLayer(marker);
    });

    map.addLayer(cluster);
    clusterRef.current = cluster;

    return () => {
      map.removeLayer(cluster);
      clusterRef.current = null;
    };
  }, [devices, icon, onMarkerClick]);

  return null;
}
