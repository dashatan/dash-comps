import L from "leaflet";
import { createDeviceIcon as createCommonDeviceIcon } from "@/components/common/map/utils/markers";
import { cn } from "@/lib";
import { Device } from "@/features/resources/types";
import { words } from "@/utils/words";

export const createDeviceIcon = createCommonDeviceIcon;

export const createSearchIcon = () => {
  // Create a Google Maps-style location pin icon using SVG
  const locationPinSvg = `
    <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 0C7.163 0 0 7.163 0 16c0 12 16 24 16 24s16-12 16-24c0-8.837-7.163-16-16-16z" fill="#EA4335"/>
      <circle cx="16" cy="16" r="6" fill="white"/>
      <circle cx="16" cy="16" r="3" fill="#EA4335"/>
    </svg>
  `;

  return L.divIcon({
    html: locationPinSvg,
    className: cn("!flex !justify-center !items-center"),
    iconSize: [32, 40],
    iconAnchor: [16, 40], // Anchor at the bottom point of the pin
  });
};

export const createOriginIcon = () => L.divIcon({ html: `<div class='origin-icon'></div>` });

export const createDestinationIcon = () => L.divIcon({ html: `<div class='destination-icon'></div>` });

// Common cluster icon function
export const createClusterIcon = (cluster: L.MarkerCluster) =>
  L.divIcon({
    html: `<div><span>${cluster.getChildCount()}</span></div>`,
    className: "cluster-icon !w-12 !h-12 !flex !justify-center !items-center",
  });

// Common marker cluster group configuration
export const createMarkerClusterGroup = () =>
  L.markerClusterGroup({
    iconCreateFunction: createClusterIcon,
    showCoverageOnHover: false,
    maxClusterRadius: 40,
  });

// Common tooltip configuration
export const tooltipConfig = {
  permanent: false,
  direction: "right" as const,
  offset: [180, 0] as [number, number],
  className: "custom-tooltip",
  opacity: 1,
};

export function deviceTooltipContent(device?: Partial<Device>, className?: string) {
  if (!device) return "";
  return `
    <div class="p-2 font-main flex flex-col gap-1 min-w-40 w-40 whitespace-pre-wrap ${className}">
      <div class="font-semibold text-xs">${device.name}</div>
      ${device.province ? `<div class="text-xs text-gray-600">${words.PROVINCE}: ${device.provinceName}</div>` : ""}
      ${device.road ? `<div class="text-xs text-gray-600">${words.ROAD}: ${device.roadName}</div>` : ""}
      ${device.source ? `<div class="text-xs text-gray-600">${words.SOURCE}: ${device.sourceName || words.UNKNOWN}</div>` : ""}
    </div>
  `;
}

export const devicePopupContent = (device?: Partial<Device>) => {
  return `
    <span>${words.NAME}: ${device?.name || words.UNKNOWN}</span>
    <span>${words.PROVINCE}: ${device?.provinceName || words.UNKNOWN}</span>
    <span>${words.ROAD}: ${device?.roadName || words.UNKNOWN}</span>
    <span>${words.SOURCE}: ${device?.sourceName || words.UNKNOWN}</span>
  `;
};

export const devicePopupConfig = {
  keepInView: true,
  autoPan: true,
  closeButton: false,
  className: "leaflet-popup",
  interactive: true,
  offset: [-6, -14] as [number, number],
};

// Function to create device markers
export const createDeviceMarkers = (devices: Device[], icon: L.Icon) => {
  const markers = createMarkerClusterGroup();

  devices.forEach((device) => {
    const marker = L.marker([parseFloat(device.lat), parseFloat(device.long)], { icon });
    marker.bindTooltip(deviceTooltipContent(device), tooltipConfig);
    markers.addLayer(marker);
  });

  return markers;
};

// Function to remove marker from map
export const removeMarker = (markerRef: React.MutableRefObject<L.Marker | undefined>, map: L.Map) => {
  if (markerRef.current) {
    map.removeLayer(markerRef.current);
    markerRef.current = undefined;
  }
};

// Function to remove layer from map
export const removeLayer = (layerRef: React.MutableRefObject<L.Layer | undefined>, map: L.Map) => {
  if (layerRef.current) {
    map.removeLayer(layerRef.current);
    layerRef.current = undefined;
  }
};
