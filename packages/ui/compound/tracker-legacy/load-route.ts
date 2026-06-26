import { getStoreEnv } from "@/lib";
import type { Event } from "@/components/compound/tracker-legacy/types";
import { chunkArray, makeOsrmCoordString } from "@/components/compound/tracker-legacy/utils";

const DEFAULT_OSRM_URL = "https://router.project-osrm.org";

type OsrmResponse = {
  code: string;
  routes?: Array<{ geometry: { coordinates: [number, number][] } }>;
  message?: string;
};

function getOsrmBaseUrl() {
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

export async function loadLegacyOsrmRouteCoords(
  events: Event[],
): Promise<[number, number][]> {
  const coordString = makeOsrmCoordString(events);
  if (!coordString) return events.map((event) => event.latlng);

  const baseUrl = getOsrmBaseUrl();
  const chunks = chunkArray(coordString.split(";"), 100);
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

  return allCoords.length ? allCoords : events.map((event) => event.latlng);
}
