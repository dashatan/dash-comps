import type { TrackerEventDto, VehicleDto } from "@dash/logistics-contracts";
import {
  EU_CORRIDORS,
  getHubById,
  type EuCorridor,
  type EuHub,
} from "./european-context";

const HOUR_MS = 3_600_000;
const MINUTE_MS = 60_000;

type CorridorWaypoint = {
  lat: number;
  lng: number;
  province: string;
  road: string;
};

function interpolateCoordinate(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

function buildCorridorWaypoints(
  corridor: EuCorridor,
  count: number,
): CorridorWaypoint[] {
  const origin = getHubById(corridor.originHubId);
  const destination = getHubById(corridor.destinationHubId);
  const waypoints: CorridorWaypoint[] = [];

  for (let i = 0; i < count; i += 1) {
    const t = count <= 1 ? 0 : i / (count - 1);
    const lat = interpolateCoordinate(origin.lat, destination.lat, t);
    const lng = interpolateCoordinate(origin.lng, destination.lng, t);
    const province =
      t < 0.5
        ? `${origin.city}, ${origin.countryCode}`
        : `${destination.city}, ${destination.countryCode}`;
    const road =
      i === 0 || i === count - 1 ? corridor.label : `E${40 + (i % 5)}`;

    waypoints.push({ lat, lng, province, road });
  }

  return waypoints;
}

function corridorForVehicle(vehicleId: number): EuCorridor {
  return EU_CORRIDORS[vehicleId % EU_CORRIDORS.length];
}

function positionAlongCorridor(
  corridor: EuCorridor,
  progress: number,
): { lat: number; lng: number; province: string; road: string } {
  const waypoints = buildCorridorWaypoints(corridor, 24);
  const clamped = Math.max(0, Math.min(1, progress));
  const index = clamped * (waypoints.length - 1);
  const lower = Math.floor(index);
  const upper = Math.min(waypoints.length - 1, lower + 1);
  const fraction = index - lower;
  const from = waypoints[lower];
  const to = waypoints[upper];

  return {
    lat: interpolateCoordinate(from.lat, to.lat, fraction),
    lng: interpolateCoordinate(from.lng, to.lng, fraction),
    province: from.province,
    road: from.road,
  };
}

function buildTrackerEvent(
  id: number,
  time: number,
  lat: number,
  lng: number,
  vehicle: VehicleDto,
  corridor: EuCorridor,
  waypointIndex: number,
  province: string,
  road: string,
): TrackerEventDto {
  return {
    id,
    time,
    latlng: [lat, lng],
    name: vehicle.plate,
    error: waypointIndex % 11 === 0,
    miss: waypointIndex % 17 === 0,
    speed: 68 + (vehicle.id % 6) * 4 + (waypointIndex % 3) * 2,
    province,
    deviceId: vehicle.id,
    road,
    roadId: `${corridor.id}-${waypointIndex}`,
    trafficId: vehicle.id * 100 + waypointIndex,
    crimes: waypointIndex % 13 === 0 ? ["Speeding"] : [],
  };
}

export function getLiveTrackerEvents(
  vehicles: VehicleDto[],
): TrackerEventDto[] {
  const activeVehicles = vehicles.filter((v) => v.status === "active");
  const now = Date.now();

  return activeVehicles.map((vehicle, index) => {
    const corridor = corridorForVehicle(vehicle.id);
    const progress = ((now / MINUTE_MS + vehicle.id) % 240) / 240;
    const position = positionAlongCorridor(corridor, progress);
    const waypointIndex = Math.floor(progress * 23);

    return buildTrackerEvent(
      index + 1,
      now,
      position.lat,
      position.lng,
      vehicle,
      corridor,
      waypointIndex,
      position.province,
      position.road,
    );
  });
}

export function getPlaybackTrackerEvents(
  vehicles: VehicleDto[],
  vehicleId: number,
  from?: number,
  to?: number,
): TrackerEventDto[] {
  const vehicle = vehicles.find((v) => v.id === vehicleId);
  if (!vehicle) return [];

  const corridor = corridorForVehicle(vehicle.id);
  const waypoints = buildCorridorWaypoints(corridor, 24);

  const startTime = from ?? Date.now() - 12 * HOUR_MS;
  const endTime = to ?? Date.now();
  const stepMs = Math.max(
    5 * MINUTE_MS,
    Math.floor((endTime - startTime) / Math.max(waypoints.length - 1, 1)),
  );

  const events: TrackerEventDto[] = waypoints.map((point, index) => {
    const time = startTime + index * stepMs;
    return buildTrackerEvent(
      index + 1,
      time,
      point.lat,
      point.lng,
      vehicle,
      corridor,
      index,
      point.province,
      point.road,
    );
  });

  if (from !== undefined || to !== undefined) {
    return events.filter((e) => e.time >= startTime && e.time <= endTime);
  }

  return events;
}

export function getHubCoordinates(hub: EuHub): [number, number] {
  return [hub.lat, hub.lng];
}

export function getCorridorEndpoints(corridor: EuCorridor): {
  origin: EuHub;
  destination: EuHub;
} {
  return {
    origin: getHubById(corridor.originHubId),
    destination: getHubById(corridor.destinationHubId),
  };
}

export { buildCorridorWaypoints, corridorForVehicle };
