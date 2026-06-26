import L from "leaflet";
import { cn } from "@/lib";

/** Self-contained pulse icon — center anchor aligns with device pin tip at the same lat/lng. */
const SELECTION_PULSE_SIZE = 48;
const SELECTION_PULSE_ANCHOR = SELECTION_PULSE_SIZE / 2;

/**
 * Map center so `latlng` appears offset from viewport center (e.g. left of center when sidebar is on the right).
 * Positive offset.x moves map center east → marker appears left on screen.
 */
export function getMapCenterWithPixelOffset(
  map: L.Map,
  latlng: L.LatLng,
  zoom: number,
  offsetPx: [number, number],
): L.LatLng {
  const markerPoint = map.project(latlng, zoom);
  const centerPoint = markerPoint.add(L.point(offsetPx[0], offsetPx[1]));
  return map.unproject(centerPoint, zoom);
}

export function toMarkerLatLng(item: {
  lat: string | number;
  long: string | number;
}): L.LatLng {
  return L.latLng(parseFloat(String(item.lat)), parseFloat(String(item.long)));
}

export function createSelectionPulseIcon() {
  return L.divIcon({
    className: cn("sirat-map-selection-pulse"),
    html: `<div class="sirat-map-selection-pulse__stack"><span class="sirat-map-selection-pulse__ring"></span><span class="sirat-map-selection-pulse__ring sirat-map-selection-pulse__ring--delayed"></span><span class="sirat-map-selection-pulse__dot"></span></div>`,
    iconSize: [SELECTION_PULSE_SIZE, SELECTION_PULSE_SIZE],
    iconAnchor: [SELECTION_PULSE_ANCHOR, SELECTION_PULSE_ANCHOR],
  });
}
