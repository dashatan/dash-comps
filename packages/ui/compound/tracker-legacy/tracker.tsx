"use client";

import {
  useLayoutEffect,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";

import { getMapTileUrl } from "@/lib";

import ObservesTrackerMap from "@/components/compound/tracker-legacy/map/map";

import EventsPanel from "@/components/compound/tracker-legacy/events";

import { loadLegacyOsrmRouteCoords } from "@/components/compound/tracker-legacy/load-route";

import { useTrackerStore } from "@/components/compound/tracker-legacy/store";

import {
  TrackerMapLayer,
  TrackerOverlayPanel,
  TrackerShell,
} from "@/components/compound/tracker-legacy/overlay-layout";

import {
  EMPTY_MAP_OVERLAY_INSETS,
  SIDEBAR_WIDTH,
  type Event,
} from "@/components/compound/tracker-legacy/types";

export type MapTilesConfig = {
  light: string;

  dark: string;
};

export type LegacyTrackerProps = {
  events: Event[];

  routeCoords?: [number, number][];

  loadOsrmRoute?: boolean;

  mapTiles?: MapTilesConfig;

  className?: string;
};

function resolveMapTiles(mapTiles?: MapTilesConfig): MapTilesConfig {
  return {
    light: mapTiles?.light || getMapTileUrl("light"),

    dark: mapTiles?.dark || getMapTileUrl("dark"),
  };
}

function resetTrackerStore() {
  const state = useTrackerStore.getState();

  state.setPlay(false);

  state.setActiveEventIndex(0);

  state.setEvents([]);

  state.setRouteCoords([]);

  state.setRouteIsLoading(false);

  state.setMapTiles({ light: "", dark: "" });

  state.setMapOverlayInsets(EMPTY_MAP_OVERLAY_INSETS);
}

export default function Tracker({
  events,

  routeCoords,

  loadOsrmRoute = true,

  mapTiles,

  className,
}: LegacyTrackerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [containerHeight, setContainerHeight] = useState(0);

  const [isLoading, setIsLoading] = useState(true);

  const [noData, setNoData] = useState(false);

  const tilesReady = useTrackerStore((state) =>
    Boolean(state.mapTiles.light || state.mapTiles.dark),
  );

  const handleShellResize = useCallback(
    ({ height }: { width: number; height: number }) => {
      setContainerHeight(height);
    },
    [],
  );

  useLayoutEffect(() => {
    const tiles = resolveMapTiles(mapTiles);

    const store = useTrackerStore.getState();

    store.setMapTiles(tiles);

    if (!events.length) {
      store.setEvents([]);

      setNoData(true);

      setIsLoading(false);

      return;
    }

    setNoData(false);

    store.setEvents(events);

    store.setActiveEventIndex(0);

    store.setPlay(false);
  }, [events, mapTiles]);

  useEffect(() => {
    let cancelled = false;

    async function loadRoute() {
      if (!events.length) return;

      setIsLoading(true);

      const store = useTrackerStore.getState();

      let coords = routeCoords;

      if (!coords?.length && loadOsrmRoute) {
        store.setRouteIsLoading(true);

        try {
          coords = await loadLegacyOsrmRouteCoords(events);
        } catch {
          coords = events.map((event) => event.latlng);
        } finally {
          if (!cancelled) store.setRouteIsLoading(false);
        }
      }

      if (cancelled) return;

      store.setRouteCoords(coords ?? events.map((event) => event.latlng));

      setIsLoading(false);
    }

    void loadRoute();

    return () => {
      cancelled = true;
    };
  }, [events, routeCoords, loadOsrmRoute]);

  useEffect(() => () => resetTrackerStore(), []);

  return (
    <TrackerShell
      className={className}
      containerRef={containerRef}
      onResize={handleShellResize}
    >
      <TrackerMapLayer>
        {tilesReady ? <ObservesTrackerMap /> : null}
      </TrackerMapLayer>

      <TrackerOverlayPanel side="start" style={{ width: SIDEBAR_WIDTH }}>
        <EventsPanel
          isLoading={isLoading}
          noData={noData}
          containerHeight={containerHeight}
        />
      </TrackerOverlayPanel>
    </TrackerShell>
  );
}
