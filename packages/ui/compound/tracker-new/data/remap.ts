import type { Track, TrackPoint } from "@/components/compound/tracker-new/types/input";
import type {
  NormalizedEvent,
  TimeLine,
  TrackWithEvents,
} from "@/components/compound/tracker-new/types/normalized";
import {
  breakTimes,
  timeHourClear,
  timeSecondClear,
} from "@/components/compound/tracker-new/data/time";
import { calcAngle } from "@/components/compound/tracker-new/utils/bearing";

export function makeEvents(tracks?: Track[]): NormalizedEvent[] {
  let events: NormalizedEvent[] = [];
  tracks?.forEach((track, i) => {
    track.points.forEach((point, pointIndex) => {
      events.push(normalizeTrackPoint(point, track, i, pointIndex));
    });
  });
  if (events.length) {
    events = events.sort((a, b) => (a.time < b.time ? -1 : 1));
  }
  return events;
}

function normalizeTrackPoint(
  point: TrackPoint,
  track: Track,
  trackIndex: number,
  pointIndex: number,
): NormalizedEvent {
  return {
    id: `${trackIndex}-${pointIndex}-${point.time}`,
    latlng: point.latLng,
    time: timeSecondClear(point.time).getTime(),
    angle: point.angle,
    plate: track.plate,
    trackIndex,
    province: point.province,
    road: point.road,
    assumed: point.assumed,
    emphasized: point.emphasized,
  };
}

export function makeTracksWithEvents(tracks: Track[]): TrackWithEvents[] {
  return tracks.map((track, trackIndex) => {
    const events: NormalizedEvent[] = [];
    track.points.forEach((point, i, a) => {
      if (!point) return;
      let prevPoint = i > 0 ? a[i - 1] : a[0];
      const sameLatlng = prevPoint.latLng.join(",") === point.latLng.join(",");
      if (sameLatlng && i > 1) prevPoint = a[i - 2];
      if (sameLatlng && i > 2) prevPoint = a[i - 3];
      const angle = calcAngle(prevPoint.latLng, point.latLng);
      events.push({
        ...normalizeTrackPoint(point, track, trackIndex, i),
        angle,
      });
    });
    return { plate: track.plate, events };
  });
}

export function makeTimes(dates?: number[]) {
  return breakTimes({ dates: dates ?? [], into: "minutes" });
}

export function makeTotalTimes(dates?: number[]) {
  const d = dates?.map((x) => timeHourClear(x).getTime());
  return breakTimes({ dates: d ?? [], into: "days", clearHour: true });
}

export function makeTotalTimesIncludingEvents(
  dates?: number[],
  events?: NormalizedEvent[],
) {
  if (!events?.length) return makeTotalTimes(dates);
  const firstEventDay = timeHourClear(events[0].time).getTime();
  const lastEventDay = timeHourClear(events[events.length - 1].time).getTime();
  const d = dates?.map((x) => timeHourClear(x).getTime());
  const startDay = d?.[0] != null ? Math.min(d[0], firstEventDay) : firstEventDay;
  const endDay = d?.[1] != null ? Math.max(d[1], lastEventDay) : lastEventDay;
  return makeTotalTimes([startDay, endDay]);
}

export function createTimeline(totalTimes: number[], events: NormalizedEvent[]): TimeLine[] {
  return totalTimes.flatMap((t, i, a) => {
    const currentTime = t;
    const nextTime = a[i + 1];
    if (!currentTime || !nextTime) return [];
    const minutes = makeTimes([currentTime, nextTime]);
    const dayEvents = events.filter((x) => {
      const day = timeHourClear(x.time).getTime();
      return day >= currentTime && day <= nextTime;
    });
    return [{ date: currentTime, minutes, events: dayEvents }];
  });
}

export function totalTimeLineDaysWithEventIndexes(
  totalTimes: number[],
  events?: NormalizedEvent[],
): number[] {
  const indexes: number[] = [];
  totalTimes.forEach((time, i) => {
    const hasEvent = events?.some(
      (x) => timeHourClear(x.time).getTime() === timeHourClear(time).getTime(),
    );
    if (hasEvent) indexes.push(i);
  });
  return indexes;
}

export type RemapWorkerInput = {
  tracks?: Track[];
  dates?: number[];
  extendDateRangeToEvents?: boolean;
};

export type RemapWorkerOutput = {
  events: NormalizedEvent[];
  tracksWithEvents: TrackWithEvents[];
  totalTimes: number[];
  daysWithEvent: number[];
  timeline: TimeLine[];
};

export function processTracksData(input: RemapWorkerInput): RemapWorkerOutput {
  const events = makeEvents(input.tracks);
  const tracksWithEvents = makeTracksWithEvents(input.tracks ?? []);
  const totalTimes = input.extendDateRangeToEvents
    ? makeTotalTimesIncludingEvents(input.dates, events)
    : makeTotalTimes(input.dates);
  const daysWithEvent = totalTimeLineDaysWithEventIndexes(totalTimes, events);
  const timeline = createTimeline(totalTimes, events);
  return { events, tracksWithEvents, totalTimes, daysWithEvent, timeline };
}
