"use client";

import { useContext } from "react";
import { useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { TrackerStoreContext } from "@dash/ui/compound/tracker/store/context";
import type { TrackerStore } from "@dash/ui/compound/tracker/store/create-store";
import {
  selectActiveEvent,
  selectActiveEmphasizes,
  selectCurrentTime,
  selectPanelEvents,
  selectTracksWithEventsFiltered,
} from "@dash/ui/compound/tracker/store/selectors";

export function useTrackerStore<T>(selector: (state: TrackerStore) => T): T {
  const store = useContext(TrackerStoreContext);
  if (!store) {
    throw new Error("useTrackerStore must be used within TrackerProvider");
  }

  return useStore(store, selector);
}

export function useTrackerSelector<T>(selector: (state: TrackerStore) => T): T {
  return useTrackerStore(selector);
}

const playbackSelector = (s: TrackerStore) => ({
  play: s.play,
  mode: s.mode,
  togglePlay: s.togglePlay,
  setPlay: s.setPlay,
  eventIntervalMs: s.eventIntervalMs,
  timeMultiplier: s.timeMultiplier,
  setEventIntervalMs: s.setEventIntervalMs,
  setTimeMultiplier: s.setTimeMultiplier,
});

const mapRouteSelector = (s: TrackerStore) => ({
  routeCoords: s.routeCoords,
  routeMode: s.routeMode,
  traceLength: s.traceLength,
  activeEventIndex: s.activeEventIndex,
  eventOsrmIndices: s.eventOsrmIndices,
  autoPan: s.autoPan,
  autoPanMaxZoom: s.autoPanMaxZoom,
  events: s.events,
  mapEngine: s.mapEngine,
  routeIsLoading: s.routeIsLoading,
});

const timelineSelector = (s: TrackerStore) => ({
  totalTimes: s.totalTimes,
  minutes: s.minutes,
  totalTimeIndex: s.totalTimeIndex,
  timeIndex: s.timeIndex,
  daysWithEvent: s.daysWithEvent,
  tracksWithEvents: s.tracksWithEvents,
  emphasizes: s.emphasizes,
  filterIran: s.filterIran,
  setTotalTimeIndex: s.setTotalTimeIndex,
  setTimeIndex: s.setTimeIndex,
  setMinutes: s.setMinutes,
});

const settingsSelector = (s: TrackerStore) => ({
  showSettingsPanel: s.showSettingsPanel,
  filterIran: s.filterIran,
  autoPan: s.autoPan,
  autoPanMaxZoom: s.autoPanMaxZoom,
  traceLength: s.traceLength,
  routeMode: s.routeMode,
  mapEngine: s.mapEngine,
  mode: s.mode,
  emphasizeRadius: s.emphasizeRadius,
  patchSettings: s.patchSettings,
  toggleSettingsPanel: s.toggleSettingsPanel,
  setMode: s.setMode,
});

export function useActiveEventIndex() {
  return useTrackerStore((s) => s.activeEventIndex);
}

export function useActiveEvent() {
  return useTrackerStore(selectActiveEvent);
}

export function useCurrentTime() {
  return useTrackerStore(selectCurrentTime);
}

export function usePlaybackControls() {
  return useTrackerStore(useShallow(playbackSelector));
}

export function useMapRouteContext() {
  return useTrackerStore(useShallow(mapRouteSelector));
}

export function useTimelineState() {
  return useTrackerStore(useShallow(timelineSelector));
}

export function useSettingsSlice() {
  return useTrackerStore(useShallow(settingsSelector));
}

const panelEventsShallow = (s: TrackerStore) => selectPanelEvents(s);
const activeEmphasizesShallow = (s: TrackerStore) => selectActiveEmphasizes(s);
const tracksFilteredShallow = (s: TrackerStore) =>
  selectTracksWithEventsFiltered(s);

export function usePanelEvents() {
  return useTrackerStore(useShallow(panelEventsShallow));
}

export function useActiveEmphasizes() {
  return useTrackerStore(useShallow(activeEmphasizesShallow));
}

export function useTracksWithEventsFiltered() {
  return useTrackerStore(useShallow(tracksFilteredShallow));
}

export function useResolvedOptions() {
  return useTrackerStore((s) => s.options);
}
