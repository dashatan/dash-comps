import L from "leaflet";

/** Avoid Leaflet _leaflet_events errors when icons are already torn down. */
export function safeRemoveLayer(
  map: L.Map | null | undefined,
  layer: L.Layer | null | undefined,
) {
  if (!map || !layer) return;

  try {
    if (map.hasLayer(layer)) {
      map.removeLayer(layer);
    }
  } catch {
    // Map or layer already destroyed during React unmount
  }
}

export function safeDestroyMap(map: L.Map | null | undefined) {
  if (!map) return;

  try {
    map.remove();
  } catch {
    // Child plugins may have partially torn down layers before map.destroy
  }
}

export function removeMarker(
  markerRef: React.MutableRefObject<L.Marker | undefined>,
  map: L.Map,
) {
  if (!markerRef.current) return;
  safeRemoveLayer(map, markerRef.current);
  markerRef.current = undefined;
}

export function removeLayer(
  layerRef: React.MutableRefObject<L.Layer | undefined>,
  map: L.Map,
) {
  if (!layerRef.current) return;
  safeRemoveLayer(map, layerRef.current);
  layerRef.current = undefined;
}

/** Extract outer ring as [lat, lng] points from polygon-like layers. */
export function extractPolygonPoints(layer: L.Layer): Point[] {
  if (!(layer instanceof L.Polygon) && !(layer instanceof L.Rectangle)) {
    return [];
  }

  const latlngs = layer.getLatLngs();
  const ring = firstLatLngRing(latlngs);
  return ring.map((ll) => [ll.lat, ll.lng]);
}

function firstLatLngRing(
  latlngs: L.LatLng[] | L.LatLng[][] | L.LatLng[][][],
): L.LatLng[] {
  if (!latlngs.length) return [];

  const first = latlngs[0];
  if (isLatLngPoint(first)) {
    return (latlngs as L.LatLng[]).filter(isLatLngPoint);
  }

  if (Array.isArray(first)) {
    return firstLatLngRing(first as L.LatLng[] | L.LatLng[][] | L.LatLng[][][]);
  }

  return [];
}

function isLatLngPoint(value: unknown): value is L.LatLng {
  return typeof value === "object" && value !== null && "lat" in value && "lng" in value;
}
