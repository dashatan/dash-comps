import L from "leaflet";
import "leaflet.markercluster";
import { createDevicePinIcon } from "@/components/common/map/utils/device-marker-icon";
import { formatMapOverlayHtml } from "@/components/common/map/utils/overlay-content";
import type { Translation } from "@/lib";

export {
  DEVICE_MARKER_ICON_ANCHOR,
  DEVICE_MARKER_ICON_SIZE,
  createDevicePinIcon,
} from "@/components/common/map/utils/device-marker-icon";

/** Served from app `public/map-markers/` (showcase) or equivalent in consuming apps. */
const MARKER_BASE = "/map-markers";

const ROUTE_ENDPOINT_ICON_SIZE: [number, number] = [32, 40];
const ROUTE_ENDPOINT_ICON_ANCHOR: [number, number] = [16, 40];

export const createDeviceIcon = () =>
  createDevicePinIcon(`${MARKER_BASE}/device-marker-black.png`);

export const createActiveDeviceIcon = () =>
  createDevicePinIcon(`${MARKER_BASE}/active-marker.png`);

export const createInactiveDeviceIcon = () =>
  createDevicePinIcon(`${MARKER_BASE}/inactive-marker.png`);

export const createSearchIcon = () =>
  L.icon({
    iconUrl: `${MARKER_BASE}/search-marker.png`,
    iconSize: ROUTE_ENDPOINT_ICON_SIZE,
    iconAnchor: ROUTE_ENDPOINT_ICON_ANCHOR,
  });

export const createOriginIcon = () =>
  L.icon({
    iconUrl: `${MARKER_BASE}/origin-marker.png`,
    iconSize: ROUTE_ENDPOINT_ICON_SIZE,
    iconAnchor: ROUTE_ENDPOINT_ICON_ANCHOR,
  });

export const createDestinationIcon = () =>
  L.icon({
    iconUrl: `${MARKER_BASE}/destination-marker.png`,
    iconSize: ROUTE_ENDPOINT_ICON_SIZE,
    iconAnchor: ROUTE_ENDPOINT_ICON_ANCHOR,
  });

export const createClusterIcon = (cluster: L.MarkerCluster) =>
  L.divIcon({
    html: `<div><span>${cluster.getChildCount()}</span></div>`,
    className:
      "sirat-map-endpoint-icon cluster-icon !flex !h-12 !w-12 !items-center !justify-center",
    iconSize: [48, 48],
    iconAnchor: [24, 24],
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

export function deviceTooltipContent(
  device: MapDeviceInfo | undefined,
  t: Translation,
  className?: string,
) {
  if (!device) return "";
  return `
    <div class="p-2 font-main flex flex-col gap-1 min-w-40 w-40 whitespace-pre-wrap ${className ?? ""}">
      <div class="font-semibold text-xs">${device.name ?? ""}</div>
      ${device.province ? `<div class="text-xs opacity-70">${t("common.province")}: ${device.provinceName ?? ""}</div>` : ""}
      ${device.road ? `<${"div"} class="text-xs opacity-70">${t("common.road")}: ${device.roadName ?? ""}</${"div"}>` : ""}
      ${device.source ? `<div class="text-xs opacity-70">${t("common.source")}: ${device.sourceName || t("common.unknown")}</div>` : ""}
    </div>
  `;
}

export function devicePopupContent(device: MapDeviceInfo | undefined, t: Translation) {
  if (!device) return "";
  return formatMapOverlayHtml(device.name, [
    { name: t("common.province"), value: device.provinceName || t("common.unknown") },
    { name: t("common.road"), value: device.roadName || t("common.unknown") },
    { name: t("common.source"), value: device.sourceName || t("common.unknown") },
    { name: t("common.company"), value: device.companyName || t("common.unknown") },
    {
      name: t("common.policeCode"),
      value: device.police_code != null ? String(device.police_code) : t("common.unknown"),
    },
  ]);
}

export function createDeviceMarkers(
  devices: Array<{ id: number; lat: string; long: string; name?: string } & Record<string, unknown>>,
  icon: L.Icon | L.DivIcon,
  t: Translation,
) {
  const markers = createMarkerClusterGroup();

  devices.forEach((device) => {
    const marker = L.marker([parseFloat(device.lat), parseFloat(device.long)], { icon });
    marker.bindTooltip(deviceTooltipContent(device, t), tooltipConfig);
    markers.addLayer(marker);
  });

  return markers;
}
