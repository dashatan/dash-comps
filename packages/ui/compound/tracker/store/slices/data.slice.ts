import type { StateCreator } from "zustand";
import type {
  Emphasize,
  Track,
} from "@/components/compound/tracker/types/input";
import type {
  NormalizedEvent,
  NormalizedTrackerData,
  TimeLine,
  TrackWithEvents,
  TrackerLoadStatus,
  TrackerError,
} from "@/components/compound/tracker/types/normalized";
import type { TrackerStore } from "@/components/compound/tracker/store/create-store";

export type DataSlice = {
  status: TrackerLoadStatus;
  error: TrackerError | null;
  events: NormalizedEvent[];
  tracks: Track[];
  tracksWithEvents: TrackWithEvents[];
  emphasizes: Emphasize[];
  totalTimes: number[];
  daysWithEvent: number[];
  timeline: TimeLine[];
  routeCoords: [number, number][];
  minutes: number[];
  routeIsLoading: boolean;
  eventOsrmIndices: number[];
  hydrate: (data: Partial<NormalizedTrackerData>) => void;
  setStatus: (status: TrackerLoadStatus) => void;
  setError: (error: TrackerError | null) => void;
  setRouteCoords: (coords: [number, number][]) => void;
  setRouteIsLoading: (loading: boolean) => void;
  setEventOsrmIndices: (indices: number[]) => void;
  setMinutes: (minutes: number[]) => void;
};

export const createDataSlice: StateCreator<TrackerStore, [], [], DataSlice> = (
  set,
) => ({
  status: "idle",
  error: null,
  events: [],
  tracks: [],
  tracksWithEvents: [],
  emphasizes: [],
  totalTimes: [],
  daysWithEvent: [],
  timeline: [],
  routeCoords: [],
  minutes: [],
  routeIsLoading: false,
  eventOsrmIndices: [],
  hydrate: (data) =>
    set((state) => ({
      events: data.events ?? state.events,
      tracks: data.tracks ?? state.tracks,
      tracksWithEvents: data.tracksWithEvents ?? state.tracksWithEvents,
      emphasizes: data.emphasizes ?? state.emphasizes,
      totalTimes: data.totalTimes ?? state.totalTimes,
      daysWithEvent: data.daysWithEvent ?? state.daysWithEvent,
      timeline: data.timeline ?? state.timeline,
      routeCoords: data.routeCoords ?? state.routeCoords,
      minutes: data.minutes ?? state.minutes,
      status: "success" as const,
      error: null,
    })),
  setStatus: (status) =>
    set((state) => (state.status === status ? state : { status })),
  setError: (error) =>
    set((state) => {
      if (error) {
        return state.error === error && state.status === "error"
          ? state
          : { error, status: "error" as const };
      }
      return state.error === null ? state : { error: null };
    }),
  setRouteCoords: (routeCoords) =>
    set((state) =>
      state.routeCoords.length === routeCoords.length &&
      state.routeCoords.every((coord, index) => {
        const next = routeCoords[index];
        return coord[0] === next[0] && coord[1] === next[1];
      })
        ? state
        : { routeCoords },
    ),
  setRouteIsLoading: (routeIsLoading) =>
    set((state) =>
      state.routeIsLoading === routeIsLoading ? state : { routeIsLoading },
    ),
  setEventOsrmIndices: (eventOsrmIndices) =>
    set((state) =>
      state.eventOsrmIndices.length === eventOsrmIndices.length &&
      state.eventOsrmIndices.every(
        (index, position) => index === eventOsrmIndices[position],
      )
        ? state
        : { eventOsrmIndices },
    ),
  setMinutes: (minutes) =>
    set((state) =>
      state.minutes.length === minutes.length &&
      state.minutes.every((minute, index) => minute === minutes[index])
        ? state
        : { minutes },
    ),
});
