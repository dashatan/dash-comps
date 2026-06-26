import { useCallback, useState } from "react";
import { getStoreEnv } from "@/lib";
import type { Device } from "@/features/resources/types";

const DEFAULT_OSRM_URL = "https://router.project-osrm.org";

type RoutingLeg = {
  distance: number;
  duration: number;
  summary?: string;
};

type RoutingAlternative = {
  geometry: [number, number][];
  legs: RoutingLeg[];
  devices: number[];
};

export type RoutingResponse = {
  alternatives: RoutingAlternative[];
};

type OsrmRoute = {
  geometry: { coordinates: [number, number][] };
  legs: Array<{ distance: number; duration: number; summary?: string }>;
};

type OsrmResponse = {
  code: string;
  routes?: OsrmRoute[];
  message?: string;
};

function getOsrmBaseUrl() {
  const { OSRM_URL } = getStoreEnv();
  return (OSRM_URL ?? DEFAULT_OSRM_URL).replace(/\/$/, "");
}

function haversineMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
) {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const earthRadius = 6_371_000;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * earthRadius * Math.asin(Math.sqrt(a));
}

function matchDevicesAlongRoute(
  devices: Device[],
  coordinates: [number, number][],
  maxDistanceMeters = 800,
): number[] {
  if (!coordinates.length) return [];

  return devices
    .filter((device) => {
      const lat = parseFloat(device.lat);
      const lng = parseFloat(device.long);
      if (Number.isNaN(lat) || Number.isNaN(lng)) return false;

      return coordinates.some(([routeLng, routeLat]) => {
        return (
          haversineMeters(lat, lng, routeLat, routeLng) <= maxDistanceMeters
        );
      });
    })
    .map((device) => device.id);
}

async function fetchOsrmRoute(params: {
  lat1: number;
  lng1: number;
  lat2: number;
  lng2: number;
  devices?: Device[];
}): Promise<RoutingResponse> {
  const { lat1, lng1, lat2, lng2, devices = [] } = params;
  const coordPath = `${lng1},${lat1};${lng2},${lat2}`;
  const url = `${getOsrmBaseUrl()}/route/v1/driving/${coordPath}?overview=full&geometries=geojson&alternatives=true&steps=false`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`OSRM request failed (${response.status})`);
  }

  const data = (await response.json()) as OsrmResponse;
  if (data.code !== "Ok" || !data.routes?.length) {
    throw new Error(data.message ?? "OSRM returned no routes");
  }

  return {
    alternatives: data.routes.map((route) => ({
      geometry: route.geometry.coordinates,
      legs: route.legs.map((leg) => ({
        distance: leg.distance,
        duration: leg.duration,
        summary: leg.summary,
      })),
      devices: matchDevicesAlongRoute(devices, route.geometry.coordinates),
    })),
  };
}

type RoutingRequestParams = {
  lat1: number;
  lng1: number;
  lat2: number;
  lng2: number;
  devices?: Device[];
};

type LazyRoutingTrigger = (
  params: RoutingRequestParams,
  preferCacheValue?: boolean,
) => {
  unwrap: () => Promise<RoutingResponse>;
};

export function useLazyGetRoutingQuery() {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const trigger = useCallback<LazyRoutingTrigger>((params) => {
    setIsLoading(true);
    setIsFetching(true);

    return {
      unwrap: () =>
        fetchOsrmRoute(params).finally(() => {
          setIsLoading(false);
          setIsFetching(false);
        }),
    };
  }, []);

  return [trigger, { isLoading, isFetching }] as const;
}
