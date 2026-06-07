import type { NormalizedEvent } from "@/components/compound/tracker-new/types/normalized";
import { chunkArray, makeOsrmCoordString } from "@/components/compound/tracker-new/utils/geo";
import { getStoreEnv } from "@/lib";

const DEFAULT_OSRM_URL = "https://router.project-osrm.org";

type OsrmResponse = {
  code: string;
  routes?: Array<{ geometry: { coordinates: [number, number][] } }>;
  message?: string;
};

function getOsrmBaseUrl(override?: string) {
  if (override) return override.replace(/\/$/, "");
  const { OSRM_URL } = getStoreEnv();
  return (OSRM_URL ?? DEFAULT_OSRM_URL).replace(/\/$/, "");
}

async function fetchOsrmSegment(
  coordString: string,
  baseUrl: string,
): Promise<[number, number][]> {
  const url = `${baseUrl}/route/v1/driving/${coordString}?overview=full&geometries=geojson&steps=false`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`OSRM request failed (${response.status})`);
  const data = (await response.json()) as OsrmResponse;
  if (data.code !== "Ok" || !data.routes?.[0]) {
    throw new Error(data.message ?? "OSRM returned no routes");
  }
  return data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
}

export async function resolveOsrmRouteCoords(
  events: NormalizedEvent[],
  options?: { url?: string; chunkSize?: number },
): Promise<[number, number][]> {
  const baseUrl = getOsrmBaseUrl(options?.url);
  const chunkSize = options?.chunkSize ?? 100;
  const coordString = makeOsrmCoordString(events);
  if (!coordString) {
    return events.map((e) => e.latlng);
  }
  const chunks = chunkArray(coordString.split(";"), chunkSize);
  const allCoords: [number, number][] = [];
  for (const chunk of chunks) {
    if (chunk.length < 2) continue;
    const segment = await fetchOsrmSegment(chunk.join(";"), baseUrl);
    if (allCoords.length && segment.length) {
      allCoords.push(...segment.slice(1));
    } else {
      allCoords.push(...segment);
    }
  }
  return allCoords.length ? allCoords : events.map((e) => e.latlng);
}

export function resolveDirectRouteCoords(
  events: NormalizedEvent[],
): [number, number][] {
  return events.map((e) => e.latlng);
}

export function resolveDirectRouteCoordsPerTrack(
  tracksWithEvents: { events: NormalizedEvent[] }[],
): [number, number][][] {
  return tracksWithEvents.map((t) => t.events.map((e) => e.latlng));
}
