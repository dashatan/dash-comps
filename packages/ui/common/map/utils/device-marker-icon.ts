import L from "leaflet";

/** Native PNG dimensions — all device marker variants share the same canvas (51×59). */
export const DEVICE_MARKER_ICON_SIZE: [number, number] = [51, 59];

/** Pin-tip pixel from the PNG top-left; places lat/lng on the exact point of the pin. */
export const DEVICE_MARKER_ICON_ANCHOR: [number, number] = [26, 50];

export function createDevicePinIcon(iconUrl: string): L.Icon {
  return L.icon({
    iconUrl,
    iconSize: DEVICE_MARKER_ICON_SIZE,
    iconAnchor: DEVICE_MARKER_ICON_ANCHOR,
  });
}
