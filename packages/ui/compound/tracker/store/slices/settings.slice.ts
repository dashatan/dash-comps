import type { StateCreator } from "zustand";
import type { ResolvedTrackerOptions } from "@dash/ui/compound/tracker/types";
import type { TrackerStore } from "@dash/ui/compound/tracker/store/create-store";

export type SettingsSlice = {
  options: ResolvedTrackerOptions;
  showSettingsPanel: boolean;
  filterIran: boolean;
  autoPan: boolean;
  autoPanMaxZoom: number;
  traceLength: number;
  routeMode: ResolvedTrackerOptions["route"]["mode"];
  mapEngine: ResolvedTrackerOptions["map"]["engine"];
  emphasizeRadius: number;
  patchSettings: (patch: Partial<SettingsSlice>) => void;
  toggleSettingsPanel: () => void;
};

export function settingsFromOptions(
  options: ResolvedTrackerOptions,
): Omit<SettingsSlice, "patchSettings" | "toggleSettingsPanel" | "options"> {
  return {
    showSettingsPanel:
      typeof options.panels.settings === "object"
        ? (options.panels.settings.defaultOpen ?? false)
        : options.panels.settings === true,
    filterIran: options.geo.filterIran,
    autoPan: options.map.autoPan,
    autoPanMaxZoom: options.map.autoPanMaxZoom,
    traceLength: options.route.direct.traceLength,
    routeMode: options.route.mode,
    mapEngine: options.map.engine,
    emphasizeRadius: options.geo.emphasize.circleRadius,
  };
}

export const createSettingsSlice = (
  options: ResolvedTrackerOptions,
): StateCreator<TrackerStore, [], [], SettingsSlice> => {
  const initial = settingsFromOptions(options);
  return (set) => ({
    options,
    ...initial,
    patchSettings: (patch) => set((state) => ({ ...state, ...patch })),
    toggleSettingsPanel: () =>
      set((state) => ({ showSettingsPanel: !state.showSettingsPanel })),
  });
};
