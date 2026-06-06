"use client";

import { useRef } from "react";
import L from "leaflet";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import { useMapPlugin } from "@/components/common/map/hooks/use-map-plugin";
import { safeRemoveLayer } from "@/components/common/map/utils/layers";
import { useLanguage } from "@/lib";
import {
  createMarkerClusterGroup,
  deviceTooltipContent,
  tooltipConfig,
} from "@/components/common/map/utils/markers";
import type { MapDeviceClusterProps } from "@/components/common/map/types";

export function MapDeviceCluster({ devices, icon, onMarkerClick }: MapDeviceClusterProps) {
  const { t } = useLanguage();
  const clusterRef = useRef<L.MarkerClusterGroup | null>(null);
  const onMarkerClickRef = useRef(onMarkerClick);
  onMarkerClickRef.current = onMarkerClick;

  useMapPlugin((map) => {
    if (clusterRef.current) {
      safeRemoveLayer(map, clusterRef.current);
      clusterRef.current = null;
    }

    const cluster = createMarkerClusterGroup();

    devices.forEach((device) => {
      const marker = L.marker([parseFloat(device.lat), parseFloat(device.long)], { icon });
      marker.bindTooltip(deviceTooltipContent(device, t), tooltipConfig);

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
      safeRemoveLayer(map, cluster);
      clusterRef.current = null;
    };
  }, [devices, icon, onMarkerClick, t]);

  return null;
}
