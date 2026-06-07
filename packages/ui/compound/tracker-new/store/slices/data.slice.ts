import type { StateCreator } from "zustand";
import type { Emphasize, Track } from "@/components/compound/tracker-new/types/input";
import type {
  NormalizedEvent,
  NormalizedTrackerData,
  TimeLine,
  TrackWithEvents,
  TrackerLoadStatus,
  TrackerError,
} from "@/components/compound/tracker-new/types/normalized";
import type { TrackerStore } from "@/components/compound/tracker-new/store/create-store";

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

export const createDataSlice: StateCreator<TrackerStore, [], [], DataSlice> = (set) => ({
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
  setStatus: (status) => set({ status }),
  setError: (error) => set({ error, status: error ? "error" : "idle" }),
  setRouteCoords: (routeCoords) => set({ routeCoords }),
  setRouteIsLoading: (routeIsLoading) => set({ routeIsLoading }),
  setEventOsrmIndices: (eventOsrmIndices) => set({ eventOsrmIndices }),
  setMinutes: (minutes) => set({ minutes }),
});
