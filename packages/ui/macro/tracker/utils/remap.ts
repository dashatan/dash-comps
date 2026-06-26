import { breakTimes, calcAngle } from "@/components/macro/tracker/utils";
import {
  TimeLine,
  Track,
  TrackerEvent,
  TrackWithEvents,
} from "@/components/macro/tracker/utils/types";
import {
  PERSIAN_LOCALE,
  timeHourClear,
  timeSecondClear,
} from "@/components/micro/inputs/date/utils/dateFormatPersian";

export const df = Intl.DateTimeFormat(PERSIAN_LOCALE, {
  dateStyle: "short",
  timeStyle: "short",
});

export function makeEvents(tracks?: Track[]) {
  let events: TrackerEvent[] = [];
  tracks?.forEach((track, i) => {
    track.points.forEach((point) => {
      events.push({
        ...point,
        plate: track.plate,
        trackIndex: i,
        time: timeSecondClear(point.time).getTime(),
      });
    });
  });

  if (events.length) {
    events = events.sort((a, b) => (a.time < b.time ? -1 : 1));
  }
  return events;
}
export function makeTracksWithEvents(tracks: Track[]) {
  return tracks.map((track, trackIndex) => {
    let events: TrackerEvent[] = [];
    track.points.forEach((point, i, a) => {
      if (!point) return;
      let prevPoint = i > 0 ? a[i - 1] : a[0];
      const sameLatlng = prevPoint.latLng.join(",") === point.latLng.join(",");
      if (sameLatlng && i > 1) prevPoint = a[i - 2];
      if (sameLatlng && i > 2) prevPoint = a[i - 3];

      const angle = calcAngle(prevPoint.latLng, point.latLng);

      events.push({
        ...point,
        plate: track.plate,
        trackIndex,
        time: timeSecondClear(point.time).getTime(),
        angle,
      });
    });
    return { plate: track.plate, events } as TrackWithEvents;
  });
}

export function makeTimes(dates?: number[]) {
  const times = breakTimes({ dates: dates || [], into: "minutes" });
  return times;
}

export function makeTotalTimes(dates?: number[]) {
  const d = dates?.map((x) => timeHourClear(x).getTime());
  const times = breakTimes({ dates: d || [], into: "days", clearHour: true });
  return times;
}

/** Build totalTimes so the range includes both given dates and all event days. */
export function makeTotalTimesIncludingEvents(
  dates?: number[],
  events?: TrackerEvent[],
) {
  if (!events?.length) return makeTotalTimes(dates);
  const firstEventDay = timeHourClear(events[0].time).getTime();
  const lastEventDay = timeHourClear(events[events.length - 1].time).getTime();
  const d = dates?.map((x) => timeHourClear(x).getTime());
  const startDay =
    d?.[0] != null ? Math.min(d[0], firstEventDay) : firstEventDay;
  const endDay = d?.[1] != null ? Math.max(d[1], lastEventDay) : lastEventDay;
  return makeTotalTimes([startDay, endDay]);
}

export function createTimeline(totalTimes: number[], events: TrackerEvent[]) {
  return totalTimes.flatMap((t, i, a) => {
    const currentTime = t;
    const nextTime = a[i + 1];
    if (!currentTime || !nextTime) return [];
    const dateRange = [currentTime, nextTime];
    const minutes = makeTimes(dateRange);
    const e = events.filter((x) => {
      const t = timeHourClear(x.time).getTime();
      return t >= currentTime && t <= nextTime;
    });
    return {
      date: currentTime,
      minutes,
      events: e,
    } as TimeLine;
  });
}

export function totalTimeLineDaysWithEventIndexes(
  totalTimes: number[],
  events?: TrackerEvent[],
) {
  const indexes: number[] = [];
  totalTimes.forEach((time, i) => {
    const eventIndex = events?.findIndex(
      (x) => timeHourClear(x.time).getTime() === timeHourClear(time).getTime(),
    );
    if (eventIndex !== undefined && eventIndex >= 0) indexes.push(i);
  });
  return indexes;
}
