import type { StateCreator } from "zustand";
import type { TrackerStore } from "@dash/ui/compound/tracker-new/store/create-store";

export type UiSlice = {
  eventsPanelOpen: boolean;
  emphasizesPanelOpen: boolean;
  openCardIndex: number | null;
  containerHeight: number;
  setEventsPanelOpen: (open: boolean) => void;
  setEmphasizesPanelOpen: (open: boolean) => void;
  setOpenCardIndex: (index: number | null) => void;
  setContainerHeight: (height: number) => void;
};

export const createUiSlice: StateCreator<TrackerStore, [], [], UiSlice> = (
  set,
) => ({
  eventsPanelOpen: true,
  emphasizesPanelOpen: false,
  openCardIndex: null,
  containerHeight: 600,
  setEventsPanelOpen: (eventsPanelOpen) => set({ eventsPanelOpen }),
  setEmphasizesPanelOpen: (emphasizesPanelOpen) => set({ emphasizesPanelOpen }),
  setOpenCardIndex: (openCardIndex) => set({ openCardIndex }),
  setContainerHeight: (containerHeight) => set({ containerHeight }),
});
