import {
  processTracksData,
  type RemapWorkerInput,
  type RemapWorkerOutput,
} from "@/components/compound/tracker-new/data/remap";

self.onmessage = (e: MessageEvent<RemapWorkerInput>) => {
  if (!e.data) return;
  const result = processTracksData(e.data);
  self.postMessage(result satisfies RemapWorkerOutput);
};

export type { RemapWorkerInput, RemapWorkerOutput };
