import {
  createTimeline,
  makeEvents,
  makeTotalTimesIncludingEvents,
  makeTracksWithEvents,
  totalTimeLineDaysWithEventIndexes,
} from "@/components/macro/tracker/utils/remap";
import {
  TimeLine,
  Track,
  TrackerEvent,
  TrackWithEvents,
} from "@/components/macro/tracker/utils/types";

export type remapWorkerDataType = {
  tracks?: Track[];
  dates?: number[];
  isTimeline?: boolean;
  totalTimes?: number[];
  events?: TrackerEvent[];
};

export type remapWorkerReturnType = {
  timeline: TimeLine[];
  events: TrackerEvent[];
  tracksWithEvents: TrackWithEvents[];
  totalTimes?: number[];
  daysWithEvent: number[];
};

self.onmessage = (e) => {
  if (!e.data) return;
  const data = e.data as remapWorkerDataType;

  if (!data.isTimeline) {
    const events = makeEvents(data.tracks);
    const tracksWithEvents = makeTracksWithEvents(data.tracks || []);
    const totalTimes = makeTotalTimesIncludingEvents(data.dates, events);
    const daysWithEvent = totalTimeLineDaysWithEventIndexes(totalTimes, events);
    self.postMessage({ totalTimes, events, tracksWithEvents, daysWithEvent });
  } else {
    const timeline = createTimeline(data.totalTimes || [], data.events || []);
    self.postMessage({ timeline });
  }
};
