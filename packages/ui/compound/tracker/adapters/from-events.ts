import type {
  EventsInput,
  ObserveEvent,
} from "@/components/compound/tracker/types/input";
import type {
  NormalizedEvent,
  NormalizedTrackerData,
} from "@/components/compound/tracker/types/normalized";
import { makeTotalTimesIncludingEvents } from "@/components/compound/tracker/data/remap";
import { createTimeline } from "@/components/compound/tracker/data/remap";
import { totalTimeLineDaysWithEventIndexes } from "@/components/compound/tracker/data/remap";

export function normalizeObserveEvent(
  event: ObserveEvent,
  index: number,
): NormalizedEvent {
  return {
    id: event.id ?? index,
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
  };
}

export function adaptEventsInput(input: EventsInput): NormalizedTrackerData {
  const events = [...input.events]
    .sort((a, b) => a.time - b.time)
    .map(normalizeObserveEvent);
  const totalTimes = makeTotalTimesIncludingEvents(input.dates, events);
  const daysWithEvent = totalTimeLineDaysWithEventIndexes(totalTimes, events);
  const timeline = createTimeline(totalTimes, events);
  return {
    events,
    tracks: [],
    tracksWithEvents: [{ plate: {}, events }],
    emphasizes: [],
    totalTimes,
    daysWithEvent,
    timeline,
    routeCoords: input.routeCoords ?? [],
    minutes: timeline[0]?.minutes ?? [],
  };
}
