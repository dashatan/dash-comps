import type { StateCreator } from "zustand";
import type mapLibreGl from "maplibre-gl";
import type L from "leaflet";
import type { TrackerStore } from "@dash/ui/compound/tracker/store/create-store";

export type MapEngineHandle = {
  id: "leaflet" | "maplibre";
  leaflet?: L.Map;
  maplibre?: mapLibreGl.Map;
  destroy: () => void;
};

export type MapSlice = {
  mapHandle: MapEngineHandle | null;
  mapReady: boolean;
  rtlSet: boolean;
  mapTiles: { light: string; dark: string };
  engineKey: string;
  setMapHandle: (handle: MapEngineHandle | null) => void;
  setMapReady: (ready: boolean) => void;
  setRtlSet: (rtlSet: boolean) => void;
  setMapTiles: (tiles: { light: string; dark: string }) => void;
  setEngineKey: (key: string) => void;
};

export const createMapSlice: StateCreator<TrackerStore, [], [], MapSlice> = (
  set,
) => ({
  mapHandle: null,
  mapReady: false,
  rtlSet: false,
  mapTiles: { light: "", dark: "" },
  engineKey: "maplibre",
  setMapHandle: (mapHandle) => set({ mapHandle }),
  setMapReady: (mapReady) => set({ mapReady }),
  setRtlSet: (rtlSet) => set({ rtlSet }),
  setMapTiles: (mapTiles) => set({ mapTiles }),
  setEngineKey: (engineKey) => set({ engineKey }),
});
