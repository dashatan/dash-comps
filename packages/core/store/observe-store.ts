import { create } from "zustand";
import type { ObserveSearchParams } from "./types";

type ObserveStoreState = {
  searchParams: ObserveSearchParams | null;
  setSearchParams: (params: ObserveSearchParams) => void;
  clearSearchParams: () => void;
};

export const useObserveStore = create<ObserveStoreState>((set) => ({
  searchParams: null,
  setSearchParams: (searchParams) => set({ searchParams }),
  clearSearchParams: () => set({ searchParams: null }),
}));

export function setObservesSearchParams(params: ObserveSearchParams) {
  useObserveStore.getState().setSearchParams(params);
}
