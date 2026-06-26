"use client";

import { useEffect, useMemo, useRef, type ReactNode } from "react";
import { resolveTrackerOptions } from "@dash/ui/compound/tracker/options/resolve-options";
import {
  createTrackerStore,
  type TrackerStoreApi,
} from "@dash/ui/compound/tracker/store/create-store";
import { TrackerStoreProvider } from "@dash/ui/compound/tracker/store/context";
import { useTrackerStore } from "@dash/ui/compound/tracker/store/hooks";
import {
  detectInputKind,
  adaptTracksInput,
  mergeTracksIntoNormalized,
  type TracksAdapterResult,
} from "@dash/ui/compound/tracker/adapters/from-tracks";
import { adaptEventsInput } from "@dash/ui/compound/tracker/adapters/from-events";
import { processTracksData } from "@dash/ui/compound/tracker/data/remap";
import type { RemapWorkerOutput } from "@dash/ui/compound/tracker/data/remap.worker";
import {
  resolveOsrmRouteCoords,
  resolveDirectRouteCoords,
} from "@dash/ui/compound/tracker/map/route/strategies";
import { mapEventsToOsrmIndices } from "@dash/ui/compound/tracker/utils/geo";
import { makeTimes } from "@dash/ui/compound/tracker/data/remap";
import { usePlaybackEngine } from "@dash/ui/compound/tracker/playback/use-playback-engine";
import Alert from "@dash/ui/common/alert";
import type {
  TrackerProviderProps,
  ResolvedTrackerOptions,
  TrackerOptions,
} from "@dash/ui/compound/tracker/types";

function useTrackerStoreApi(optionsKey: string) {
  const storeRef = useRef<{ key: string; store: TrackerStoreApi } | null>(null);

  if (!storeRef.current || storeRef.current.key !== optionsKey) {
    storeRef.current = {
      key: optionsKey,
      store: createTrackerStore(
        resolveTrackerOptions(JSON.parse(optionsKey) as TrackerOptions),
      ),
    };
  }

  return storeRef.current.store;
}

function PlaybackRunner() {
  usePlaybackEngine();
  return null;
}

function RouteSync({
  store,
  osrmUrl,
  osrmChunkSize,
}: {
  store: TrackerStoreApi;
  osrmUrl?: string;
  osrmChunkSize: number;
}) {
  useEffect(() => {
    let skipInitial = true;

    const unsubscribe = store.subscribe((state, prev) => {
      if (state.status !== "success") return;
      if (skipInitial) {
        skipInitial = false;
        return;
      }
      if (state.routeMode === prev.routeMode) return;

      const { events } = state;

      if (state.routeMode === "osrm" && events.length) {
        state.setRouteIsLoading(true);
        void resolveOsrmRouteCoords(events, {
          url: osrmUrl || undefined,
          chunkSize: osrmChunkSize,
        })
          .then((coords) => {
            const current = store.getState();
            if (current.routeMode !== "osrm") return;
            current.setRouteCoords(coords);
            current.setEventOsrmIndices(
              mapEventsToOsrmIndices(events, coords),
            );
            current.setRouteIsLoading(false);
          })
          .catch((err) => {
            store.getState().setError({
              message:
                err instanceof Error ? err.message : "Failed to load OSRM route",
              cause: err,
            });
            store.getState().setRouteIsLoading(false);
          });
        return;
      }

      if (state.routeMode === "direct") {
        state.setRouteCoords(resolveDirectRouteCoords(events));
        state.setEventOsrmIndices([]);
        state.setRouteIsLoading(false);
        return;
      }

      state.setRouteCoords([]);
      state.setEventOsrmIndices([]);
      state.setRouteIsLoading(false);
    });

    return unsubscribe;
  }, [store, osrmUrl, osrmChunkSize]);

  return null;
}

function applyResolvedSettings(
  store: TrackerStoreApi,
  resolvedOptions: ResolvedTrackerOptions,
) {
  const state = store.getState();
  state.setMode(resolvedOptions.playback.mode);
  state.setEventIntervalMs(resolvedOptions.playback.speed.eventIntervalMs);
  state.setTimeMultiplier(resolvedOptions.playback.speed.timeMultiplier);
  state.setTimeStepMultiplier(resolvedOptions.playback.speed.timeStepMultiplier);
  state.setEngineKey(resolvedOptions.map.engine);
  state.setLoop(resolvedOptions.playback.loop);
  if (state.initToFirstEvent !== resolvedOptions.playback.initToFirstEvent) {
    store.setState({
      initToFirstEvent: resolvedOptions.playback.initToFirstEvent,
    });
  }
}

function TrackerBootstrap({
  store,
  input,
  optionsKey,
  onError,
}: {
  store: TrackerStoreApi;
  input: TrackerProviderProps["input"];
  optionsKey: string;
  onError?: TrackerProviderProps["onError"];
}) {
  const workerRef = useRef<Worker | null>(null);
  const onErrorRef = useRef(onError);
  const inputRef = useRef(input);
  onErrorRef.current = onError;
  inputRef.current = input;

  const routeOptions = useMemo(() => {
    const resolved = resolveTrackerOptions(
      JSON.parse(optionsKey) as TrackerOptions,
    );
    return {
      osrmUrl: resolved.route.osrm.url,
      osrmChunkSize: resolved.route.osrm.chunkSize,
    };
  }, [optionsKey]);

  useEffect(() => {
    const resolvedOptions = resolveTrackerOptions(
      JSON.parse(optionsKey) as TrackerOptions,
    );
    const currentInput = inputRef.current;
    let cancelled = false;

    async function processTracks(
      workerInput: TracksAdapterResult["workerInput"],
    ): Promise<RemapWorkerOutput> {
      if (!resolvedOptions.data.useWorker || typeof Worker === "undefined") {
        return processTracksData(workerInput);
      }

      try {
        workerRef.current?.terminate();
        const worker = new Worker(
          new URL("./data/remap.worker.ts", import.meta.url),
          { type: "module" },
        );
        workerRef.current = worker;

        return await Promise.race([
          new Promise<RemapWorkerOutput>((resolve, reject) => {
            worker.onmessage = (event) =>
              resolve(event.data as RemapWorkerOutput);
            worker.onerror = () => reject(new Error("Worker failed"));
            worker.postMessage(workerInput);
          }),
          new Promise<RemapWorkerOutput>((_, reject) => {
            window.setTimeout(() => reject(new Error("Worker timeout")), 5000);
          }),
        ]);
      } catch {
        return processTracksData(workerInput);
      } finally {
        workerRef.current?.terminate();
        workerRef.current = null;
      }
    }

    async function load() {
      applyResolvedSettings(store, resolvedOptions);
      store.getState().setStatus("loading");
      store.getState().setError(null);

      try {
        const kind =
          resolvedOptions.data.inputKind === "auto"
            ? detectInputKind(
                currentInput as {
                  kind?: string;
                  tracks?: unknown;
                  events?: unknown;
                },
              )
            : resolvedOptions.data.inputKind === "tracks"
              ? "tracks"
              : "events";

        if (kind === "tracks" && currentInput.kind === "tracks") {
          const adapted = adaptTracksInput(
            currentInput,
            resolvedOptions.data.extendDateRangeToEvents,
          );
          const result = await processTracks(adapted.workerInput);

          if (cancelled) return;
          store
            .getState()
            .hydrate(
              mergeTracksIntoNormalized(
                result,
                adapted.emphasizes,
                adapted.tracks,
              ),
            );
        } else if (currentInput.kind === "events") {
          if (cancelled) return;
          store.getState().hydrate(adaptEventsInput(currentInput));
        }

        const { events, totalTimes, totalTimeIndex, routeMode } =
          store.getState();

        if (routeMode === "osrm") {
          store.getState().setRouteIsLoading(true);
          const coords = await resolveOsrmRouteCoords(events, {
            url: resolvedOptions.route.osrm.url || undefined,
            chunkSize: resolvedOptions.route.osrm.chunkSize,
          });
          if (cancelled) return;
          store.getState().setRouteCoords(coords);
          store
            .getState()
            .setEventOsrmIndices(mapEventsToOsrmIndices(events, coords));
          store.getState().setRouteIsLoading(false);
        } else if (routeMode === "direct") {
          store.getState().setRouteCoords(resolveDirectRouteCoords(events));
        }

        if (totalTimes.length) {
          const dayEnd =
            totalTimes[totalTimeIndex + 1] ??
            totalTimes[totalTimeIndex] + 86400000;
          store
            .getState()
            .setMinutes(makeTimes([totalTimes[totalTimeIndex], dayEnd]));
        }
        store.getState().initPlaybackToFirstEvent();
      } catch (err) {
        if (cancelled) return;
        const error = {
          message:
            err instanceof Error ? err.message : "Failed to load tracker data",
          cause: err,
        };
        store.getState().setError(error);
        onErrorRef.current?.(error);
      }
    }

    void load();
    return () => {
      cancelled = true;
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, [store, optionsKey]);

  return (
    <>
      <PlaybackRunner />
      <RouteSync
        store={store}
        osrmUrl={routeOptions.osrmUrl}
        osrmChunkSize={routeOptions.osrmChunkSize}
      />
    </>
  );
}

function TrackerStatusGate({ children }: { children: ReactNode }) {
  const status = useTrackerStore((s) => s.status);
  const error = useTrackerStore((s) => s.error);

  if (status === "loading") {
    return <Alert.Loading message="Processing tracks..." />;
  }
  if (error) {
    return <Alert.Error message={error.message} />;
  }
  return children;
}

export function TrackerProvider({
  input,
  options,
  onEventSelect,
  onTimeChange,
  onError,
  children,
}: TrackerProviderProps) {
  const optionsKey = JSON.stringify(options ?? {});
  const store = useTrackerStoreApi(optionsKey);

  const onEventSelectRef = useRef(onEventSelect);
  const onTimeChangeRef = useRef(onTimeChange);
  onEventSelectRef.current = onEventSelect;
  onTimeChangeRef.current = onTimeChange;

  useEffect(() => {
    const unsub = store.subscribe((state, prev) => {
      if (state.activeEventIndex !== prev.activeEventIndex) {
        const event = state.events[state.activeEventIndex];
        if (event) onEventSelectRef.current?.(event, state.activeEventIndex);
      }
      const time = state.minutes[state.timeIndex];
      const prevTime = prev.minutes[prev.timeIndex];
      if (time != null && time !== prevTime) {
        onTimeChangeRef.current?.(time, {
          activeEventIndex: state.activeEventIndex,
          totalTimeIndex: state.totalTimeIndex,
          timeIndex: state.timeIndex,
        });
      }
    });
    return unsub;
  }, [store]);

  return (
    <TrackerStoreProvider store={store}>
      <TrackerBootstrap
        store={store}
        input={input}
        optionsKey={optionsKey}
        onError={onError}
      />
      <TrackerStatusGate>{children}</TrackerStatusGate>
    </TrackerStoreProvider>
  );
}
