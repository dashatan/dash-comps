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
} from "@dash/ui/compound/tracker/types";

function PlaybackRunner() {
  usePlaybackEngine();
  return null;
}

function RouteSync({
  store,
  resolvedOptions,
}: {
  store: TrackerStoreApi;
  resolvedOptions: ResolvedTrackerOptions;
}) {
  const routeMode = useTrackerStore((s) => s.routeMode);
  const status = useTrackerStore((s) => s.status);
  const skipInitial = useRef(true);

  useEffect(() => {
    if (status !== "success") return;
    if (skipInitial.current) {
      skipInitial.current = false;
      return;
    }

    let cancelled = false;

    async function reloadRoute() {
      const s = store.getState();
      const { events } = s;

      if (routeMode === "osrm" && events.length) {
        s.setRouteIsLoading(true);
        try {
          const coords = await resolveOsrmRouteCoords(events, {
            url: resolvedOptions.route.osrm.url || undefined,
            chunkSize: resolvedOptions.route.osrm.chunkSize,
          });
          if (cancelled) return;
          s.setRouteCoords(coords);
          s.setEventOsrmIndices(mapEventsToOsrmIndices(events, coords));
        } catch (err) {
          if (cancelled) return;
          s.setError({
            message:
              err instanceof Error ? err.message : "Failed to load OSRM route",
            cause: err,
          });
        } finally {
          if (!cancelled) s.setRouteIsLoading(false);
        }
      } else if (routeMode === "direct") {
        s.setRouteCoords(resolveDirectRouteCoords(events));
        s.setEventOsrmIndices([]);
        s.setRouteIsLoading(false);
      } else {
        s.setRouteCoords([]);
        s.setEventOsrmIndices([]);
        s.setRouteIsLoading(false);
      }
    }

    reloadRoute();
    return () => {
      cancelled = true;
    };
  }, [
    routeMode,
    status,
    store,
    resolvedOptions.route.osrm.url,
    resolvedOptions.route.osrm.chunkSize,
  ]);

  return null;
}

function TrackerBootstrap({
  store,
  input,
  resolvedOptions,
  onError,
}: {
  store: TrackerStoreApi;
  input: TrackerProviderProps["input"];
  resolvedOptions: ResolvedTrackerOptions;
  onError?: TrackerProviderProps["onError"];
}) {
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    const s = store.getState();
    s.setMode(resolvedOptions.playback.mode);
    s.setEventIntervalMs(resolvedOptions.playback.speed.eventIntervalMs);
    s.setTimeMultiplier(resolvedOptions.playback.speed.timeMultiplier);
    s.setTimeStepMultiplier(resolvedOptions.playback.speed.timeStepMultiplier);
    s.setEngineKey(resolvedOptions.map.engine);
    s.setLoop(resolvedOptions.playback.loop);
    store.setState({
      initToFirstEvent: resolvedOptions.playback.initToFirstEvent,
    });
  }, [store, resolvedOptions]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      store.getState().setStatus("loading");
      store.getState().setError(null);

      try {
        const kind =
          resolvedOptions.data.inputKind === "auto"
            ? detectInputKind(
                input as { kind?: string; tracks?: unknown; events?: unknown },
              )
            : resolvedOptions.data.inputKind === "tracks"
              ? "tracks"
              : "events";

        if (kind === "tracks" && input.kind === "tracks") {
          const adapted = adaptTracksInput(
            input,
            resolvedOptions.data.extendDateRangeToEvents,
          );
          let result: RemapWorkerOutput;

          if (resolvedOptions.data.useWorker && typeof Worker !== "undefined") {
            workerRef.current?.terminate();
            workerRef.current = new Worker(
              new URL(
                "@dash/ui/compound/tracker/data/remap.worker.ts",
                import.meta.url,
              ),
              { type: "module" },
            );
            result = await new Promise<RemapWorkerOutput>((resolve, reject) => {
              const worker = workerRef.current!;
              worker.onmessage = (e) => resolve(e.data as RemapWorkerOutput);
              worker.onerror = () => reject(new Error("Worker failed"));
              worker.postMessage(adapted.workerInput);
            });
          } else {
            result = processTracksData(adapted.workerInput);
          }

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
        } else if (input.kind === "events") {
          if (cancelled) return;
          store.getState().hydrate(adaptEventsInput(input));
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
        onError?.(error);
      }
    }

    load();
    return () => {
      cancelled = true;
      workerRef.current?.terminate();
    };
  }, [store, input, resolvedOptions, onError]);

  return (
    <>
      <PlaybackRunner />
      <RouteSync store={store} resolvedOptions={resolvedOptions} />
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
  const optionsKey = useMemo(() => JSON.stringify(options ?? {}), [options]);
  const resolvedOptions = useMemo(
    () => resolveTrackerOptions(options),
    [optionsKey, options],
  );
  const store = useMemo(
    () => createTrackerStore(resolvedOptions),
    [optionsKey, resolvedOptions],
  );

  useEffect(() => {
    const unsub = store.subscribe((state, prev) => {
      if (state.activeEventIndex !== prev.activeEventIndex) {
        const event = state.events[state.activeEventIndex];
        if (event) onEventSelect?.(event, state.activeEventIndex);
      }
      const time = state.minutes[state.timeIndex];
      const prevTime = prev.minutes[prev.timeIndex];
      if (time != null && time !== prevTime) {
        onTimeChange?.(time, {
          activeEventIndex: state.activeEventIndex,
          totalTimeIndex: state.totalTimeIndex,
          timeIndex: state.timeIndex,
        });
      }
    });
    return unsub;
  }, [store, onEventSelect, onTimeChange]);

  return (
    <TrackerStoreProvider store={store}>
      <TrackerBootstrap
        store={store}
        input={input}
        resolvedOptions={resolvedOptions}
        onError={onError}
      />
      <TrackerStatusGate>{children}</TrackerStatusGate>
    </TrackerStoreProvider>
  );
}
