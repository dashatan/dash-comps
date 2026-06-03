import L from "leaflet";
import activeMarker from "@/assets/images/active-marker.png";
import deviceMarker from "@/assets/images/device-marker-black.png";
import inactiveMarker from "@/assets/images/inactive-marker.png";
import { createDevicePinIcon } from "@/components/common/map/utils/device-marker-icon";
import { formatMapOverlayHtml } from "@/components/common/map/utils/overlay-content";
import { cn } from "@/lib";
import { words } from "@/utils/words";

export {
  DEVICE_MARKER_ICON_ANCHOR,
  DEVICE_MARKER_ICON_SIZE,
  createDevicePinIcon,
} from "@/components/common/map/utils/device-marker-icon";

export const createDeviceIcon = () => createDevicePinIcon(deviceMarker.src);

export const createActiveDeviceIcon = () => createDevicePinIcon(activeMarker.src);

export const createInactiveDeviceIcon = () => createDevicePinIcon(inactiveMarker.src);

export const createSearchIcon = () => {
  const locationPinSvg = `
    <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 0C7.163 0 0 7.163 0 16c0 12 16 24 16 24s16-12 16-24c0-8.837-7.163-16-16-16z" fill="var(--color-error, #EA4335)"/>
      <circle cx="16" cy="16" r="6" fill="var(--color-card, white)"/>
      <circle cx="16" cy="16" r="3" fill="var(--color-error, #EA4335)"/>
    </svg>
  `;

  return L.divIcon({
    html: locationPinSvg,
    className: cn("sirat-map-search-pin !flex !justify-center !items-center"),
    iconSize: [32, 40],
    iconAnchor: [16, 40],
  });
};

export const createOriginIcon = () =>
  L.divIcon({ html: `<${"div"} class='origin-icon'></${"div"}>` });

export const createDestinationIcon = () =>
  L.divIcon({ html: "<div class='destination-icon'></div>" });

export const createClusterIcon = (cluster: L.MarkerCluster) =>
  L.divIcon({
    html: `<div><span>${cluster.getChildCount()}</span></div>`,
    className: "cluster-icon !w-12 !h-12 !flex !justify-center !items-center",
  });

export const createMarkerClusterGroup = () =>
  L.markerClusterGroup({
    iconCreateFunction: createClusterIcon,
    showCoverageOnHover: false,
    maxClusterRadius: 40,
  });

export const tooltipConfig: L.TooltipOptions = {
  permanent: false,
  direction: "right",
  offset: [180, 0],
  className: "sirat-map-tooltip",
  opacity: 1,
};

export const popupConfig: L.PopupOptions = {
  keepInView: true,
  autoPan: true,
  closeButton: false,
  className: "sirat-map-popup",
  interactive: true,
  offset: [-6, -14],
};

export type MapDeviceInfo = {
  name?: string;
  province?: string | number;
  provinceName?: string;
  road?: string | number;
  roadName?: string;
  source?: string | number;
  sourceName?: string;
  company?: string | number;
  companyName?: string;
  police_code?: string | number;
};

export function deviceTooltipContent(device?: MapDeviceInfo, className?: string) {
  if (!device) return "";
  return `
    <div class="p-2 font-main flex flex-col gap-1 min-w-40 w-40 whitespace-pre-wrap ${className ?? ""}">
      <div class="font-semibold text-xs">${device.name ?? ""}</div>
      ${device.province ? `<div class="text-xs opacity-70">${words.PROVINCE}: ${device.provinceName ?? ""}</div>` : ""}
      ${device.road ? `<${"div"} class="text-xs opacity-70">${words.ROAD}: ${device.roadName ?? ""}</${"div"}>` : ""}
      ${device.source ? `<div class="text-xs opacity-70">${words.SOURCE}: ${device.sourceName || words.UNKNOWN}</div>` : ""}
    </div>
  `;
}

export function devicePopupContent(device?: MapDeviceInfo) {
  if (!device) return "";
  return formatMapOverlayHtml(device.name, [
    { name: words.PROVINCE, value: device.provinceName || words.UNKNOWN },
    { name: words.ROAD, value: device.roadName || words.UNKNOWN },
    { name: words.SOURCE, value: device.sourceName || words.UNKNOWN },
    { name: words.COMPANY, value: device.companyName || words.UNKNOWN },
    {
      name: words.POLICE_CODE,
      value: device.police_code != null ? String(device.police_code) : words.UNKNOWN,
    },
  ]);
}

export function createDeviceMarkers(
  devices: Array<{ id: number; lat: string; long: string; name?: string } & Record<string, unknown>>,
  icon: L.Icon | L.DivIcon,
) {
  const markers = createMarkerClusterGroup();

  devices.forEach((device) => {
    const marker = L.marker([parseFloat(device.lat), parseFloat(device.long)], { icon });
    marker.bindTooltip(deviceTooltipContent(device), tooltipConfig);
    markers.addLayer(marker);
  });

  return markers;
}
