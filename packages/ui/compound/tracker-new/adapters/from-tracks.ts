import type { TracksInput } from "@/components/compound/tracker-new/types/input";
import type { NormalizedTrackerData } from "@/components/compound/tracker-new/types/normalized";
import type { RemapWorkerOutput } from "@/components/compound/tracker-new/data/remap";

export function detectInputKind(input: { kind?: string; tracks?: unknown; events?: unknown }) {
  if (input.kind === "tracks" || input.kind === "events") return input.kind;
  if ("tracks" in input && Array.isArray((input as TracksInput).tracks)) return "tracks";
  if ("events" in input && Array.isArray((input as { events: unknown[] }).events)) return "events";
  return "events";
}

export type TracksAdapterResult = {
  workerInput: {
    tracks: TracksInput["tracks"];
    dates?: number[];
    extendDateRangeToEvents?: boolean;
  };
  emphasizes: TracksInput["emphasizes"];
  tracks: TracksInput["tracks"];
};

export function adaptTracksInput(input: TracksInput, extendDateRangeToEvents: boolean): TracksAdapterResult {
  return {
    workerInput: {
      tracks: input.tracks,
      dates: input.dates,
      extendDateRangeToEvents,
    },
    emphasizes: input.emphasizes ?? [],
    tracks: input.tracks,
  };
}

export function mergeTracksIntoNormalized(
  data: RemapWorkerOutput,
  emphasizes: TracksInput["emphasizes"],
  tracks: TracksInput["tracks"],
): NormalizedTrackerData {
  return {
    ...data,
    emphasizes: emphasizes ?? [],
    tracks: tracks ?? [],
    routeCoords: [],
    minutes: data.timeline[0]?.minutes ?? [],
  };
}
