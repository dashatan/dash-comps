import type { TrackerEventDto } from "@dash/logistics-contracts";
import type { Event } from "@/components/compound/tracker-legacy";

export function toLegacyEvents(events: TrackerEventDto[]): Event[] {
  return events.map((event) => ({
    id: event.id,
    time: event.time,
    latlng: event.latlng,
    name: event.name,
    error: event.error,
    miss: event.miss,
    speed: event.speed,
    province: event.province,
    deviceId: event.deviceId,
    road: event.road,
    roadId: event.roadId,
    trafficId: event.trafficId,
    crimes: event.crimes,
  }));
}
