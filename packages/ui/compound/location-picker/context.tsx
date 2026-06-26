"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { FilteredLocationData } from "@/components/compound/location-picker/lib/types";
import { useLocationResources } from "@/components/compound/location-picker/hooks/use-location-resources";
import { useLocationFilteredData } from "@/components/compound/location-picker/hooks/use-location-filtered-data";
import {
  LocationPickerCommitPayload,
  LocationPickerFilters,
  LocationPickerRoutingState,
} from "@/components/compound/location-picker/types";

const EMPTY_ROUTING: LocationPickerRoutingState = {};

export type LocationPickerStoreValue = {
  draft: LocationPickerFilters;
  routing: LocationPickerRoutingState;
  filteredData: FilteredLocationData;
  setDraftField: <K extends keyof LocationPickerFilters>(
    key: K,
    value: LocationPickerFilters[K],
  ) => void;
  setRouting: (
    patch:
      | Partial<LocationPickerRoutingState>
      | ((prev: LocationPickerRoutingState) => LocationPickerRoutingState),
  ) => void;
  commit: () => LocationPickerCommitPayload;
};

const LocationPickerStoreContext =
  createContext<LocationPickerStoreValue | null>(null);

type LocationPickerStoreProviderProps = {
  initialFilters: LocationPickerFilters;
  initialRouting?: LocationPickerRoutingState;
  children: ReactNode;
};

export function LocationPickerStoreProvider({
  initialFilters,
  initialRouting,
  children,
}: LocationPickerStoreProviderProps) {
  const resources = useLocationResources();
  const [draft, setDraft] = useState<LocationPickerFilters>(initialFilters);
  const [routing, setRoutingState] = useState<LocationPickerRoutingState>(
    initialRouting ?? EMPTY_ROUTING,
  );

  const filteredData = useLocationFilteredData(resources, draft);

  const setDraftField = useCallback(
    <K extends keyof LocationPickerFilters>(
      key: K,
      value: LocationPickerFilters[K],
    ) => {
      setDraft((prev) => ({
        ...prev,
        [key]: value?.length ? value : undefined,
      }));
    },
    [],
  );

  const setRouting = useCallback(
    (
      patch:
        | Partial<LocationPickerRoutingState>
        | ((prev: LocationPickerRoutingState) => LocationPickerRoutingState),
    ) => {
      setRoutingState((prev) =>
        typeof patch === "function" ? patch(prev) : { ...prev, ...patch },
      );
    },
    [],
  );

  const commit = useCallback((): LocationPickerCommitPayload => {
    const { isLoading: _isLoading, ...routingToCommit } = routing;
    return {
      filters: draft,
      routing: { ...routingToCommit, isLoading: false },
    };
  }, [draft, routing]);

  const value = useMemo(
    () => ({
      draft,
      routing,
      filteredData,
      setDraftField,
      setRouting,
      commit,
    }),
    [draft, routing, filteredData, setDraftField, setRouting, commit],
  );

  return (
    <LocationPickerStoreContext.Provider value={value}>
      {children}
    </LocationPickerStoreContext.Provider>
  );
}

export function useLocationPickerStore(): LocationPickerStoreValue {
  const context = useContext(LocationPickerStoreContext);
  if (!context) {
    throw new Error(
      "useLocationPickerStore must be used within LocationPickerStoreProvider",
    );
  }
  return context;
}
