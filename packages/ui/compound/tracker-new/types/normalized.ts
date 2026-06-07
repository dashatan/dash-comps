import type {
  Emphasize,
  PlateInputValue,
  Track,
} from "@dash/ui/compound/tracker-new/types/input";

export type NormalizedEvent = {
  id: string | number;
  time: number;
  latlng: [number, number];
  angle?: number;
  bearing?: number;
  plate?: PlateInputValue;
  trackIndex?: number;
  province?: string;
  road?: string;
  assumed?: boolean;
  emphasized?: boolean;
  name?: string;
  deviceId?: number | string;
  speed?: number;
  error?: boolean;
  miss?: boolean;
  crimes?: string[];
  trafficId?: number | string;
  roadId?: number | string;
};

export type TrackWithEvents = {
  plate: PlateInputValue;
  events: NormalizedEvent[];
};

export type TimeLine = {
  date: number;
  minutes: number[];
  events: NormalizedEvent[];
};

export type NormalizedTrackerData = {
  events: NormalizedEvent[];
  tracks: Track[];
  tracksWithEvents: TrackWithEvents[];
  emphasizes: Emphasize[];
  totalTimes: number[];
  daysWithEvent: number[];
  timeline: TimeLine[];
  routeCoords: [number, number][];
  minutes: number[];
};

export type PlaybackIndices = {
  activeEventIndex: number;
  totalTimeIndex: number;
  timeIndex: number;
};

export type TrackerLoadStatus = "idle" | "loading" | "success" | "error";

export type TrackerError = {
  message: string;
  cause?: unknown;
};
