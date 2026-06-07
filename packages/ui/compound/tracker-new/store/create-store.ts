import { createStore } from "zustand/vanilla";
import type { ResolvedTrackerOptions } from "@dash/ui/compound/tracker-new/types";
import {
  createDataSlice,
  type DataSlice,
} from "@dash/ui/compound/tracker-new/store/slices/data.slice";
import {
  createPlaybackSlice,
  type PlaybackSlice,
} from "@dash/ui/compound/tracker-new/store/slices/playback.slice";
import {
  createSettingsSlice,
  type SettingsSlice,
} from "@dash/ui/compound/tracker-new/store/slices/settings.slice";
import {
  createMapSlice,
  type MapSlice,
} from "@dash/ui/compound/tracker-new/store/slices/map.slice";
import {
  createUiSlice,
  type UiSlice,
} from "@dash/ui/compound/tracker-new/store/slices/ui.slice";

export type TrackerStore = DataSlice &
  PlaybackSlice &
  SettingsSlice &
  MapSlice &
  UiSlice;

export type TrackerStoreApi = ReturnType<typeof createTrackerStore>;

export function createTrackerStore(options: ResolvedTrackerOptions) {
  return createStore<TrackerStore>((set, get, api) => ({
    ...createDataSlice(set, get, api),
    ...createPlaybackSlice(set, get, api),
    ...createSettingsSlice(options)(set, get, api),
    ...createMapSlice(set, get, api),
    ...createUiSlice(set, get, api),
  }));
}
