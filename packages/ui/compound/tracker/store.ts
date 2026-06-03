import { create } from "zustand";
import type mapLibreGl from "maplibre-gl";
import { playSpeedOptions, type Event } from "./types";

type TrackerStoreState = {
  map: mapLibreGl.Map | null;
  events: Event[];
  activeEventIndex: number;
  showSettings: boolean;
  traceCount: number;
  playSpeed: number;
  play: boolean;
  autoPaneMap: boolean;
  maxPaneZoom: number;
  eventBasedPlay: boolean;
  routeCoords: [number, number][];
  routeIsLoading: boolean;
  rtlSet: boolean;
  mapTiles: { light: string; dark: string };
  setMap: (map: mapLibreGl.Map | null) => void;
  setEvents: (events: Event[]) => void;
  setActiveEventIndex: (index: number) => void;
  setShowSettings: (show: boolean) => void;
  setTraceCount: (count: number) => void;
  setPlaySpeed: (speed: number) => void;
  setPlay: (play: boolean) => void;
  togglePlay: () => void;
  setAutoPaneMap: (auto: boolean) => void;
  setMaxPaneZoom: (zoom: number) => void;
  setEventBasedPlay: (enabled: boolean) => void;
  setRouteCoords: (coords: [number, number][]) => void;
  setRouteIsLoading: (loading: boolean) => void;
  setRtlSet: (set: boolean) => void;
  setMapTiles: (tiles: { light: string; dark: string }) => void;
  incrementActiveEventIndex: () => void;
  decrementActiveEventIndex: () => void;
};

export const useTrackerStore = create<TrackerStoreState>((set, get) => ({
  map: null,
  events: [],
  activeEventIndex: 0,
  showSettings: false,
  traceCount: 15,
  playSpeed: playSpeedOptions[0].value,
  play: false,
  autoPaneMap: true,
  maxPaneZoom: 8,
  eventBasedPlay: true,
  routeCoords: [],
  routeIsLoading: false,
  rtlSet: false,
  mapTiles: { light: "", dark: "" },
  setMap: (map) => set({ map }),
  setEvents: (events) => set({ events }),
  setActiveEventIndex: (activeEventIndex) => set({ activeEventIndex }),
  setShowSettings: (showSettings) => set({ showSettings }),
  setTraceCount: (traceCount) => set({ traceCount }),
  setPlaySpeed: (playSpeed) => set({ playSpeed }),
  setPlay: (play) => set({ play }),
  togglePlay: () => set({ play: !get().play }),
  setAutoPaneMap: (autoPaneMap) => set({ autoPaneMap }),
  setMaxPaneZoom: (maxPaneZoom) => set({ maxPaneZoom }),
  setEventBasedPlay: (eventBasedPlay) => set({ eventBasedPlay }),
  setRouteCoords: (routeCoords) => set({ routeCoords }),
  setRouteIsLoading: (routeIsLoading) => set({ routeIsLoading }),
  setRtlSet: (rtlSet) => set({ rtlSet }),
  setMapTiles: (mapTiles) => set({ mapTiles }),
  incrementActiveEventIndex: () =>
    set((state) => ({
      activeEventIndex: Math.min(state.activeEventIndex + 1, state.events.length - 1),
    })),
  decrementActiveEventIndex: () =>
    set((state) => ({
      activeEventIndex: Math.max(state.activeEventIndex - 1, 0),
    })),
}));

export const trackerStore = useTrackerStore;
