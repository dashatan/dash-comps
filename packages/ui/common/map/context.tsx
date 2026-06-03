"use client";

import { createContext, useContext } from "react";
import type L from "leaflet";

type LeafletMapContextValue = {
  map: L.Map | null;
  isReady: boolean;
};

const LeafletMapContext = createContext<LeafletMapContextValue>({
  map: null,
  isReady: false,
});

export function LeafletMapProvider({
  map,
  isReady,
  children,
}: {
  map: L.Map | null;
  isReady: boolean;
  children: React.ReactNode;
}) {
  return (
    <LeafletMapContext.Provider value={{ map, isReady }}>
      {children}
    </LeafletMapContext.Provider>
  );
}

/** Access the map instance from plugins or sibling UI (e.g. custom zoom controls). */
export function useLeafletMap(): L.Map | null {
  return useContext(LeafletMapContext).map;
}

export function useLeafletMapReady(): boolean {
  return useContext(LeafletMapContext).isReady;
}
