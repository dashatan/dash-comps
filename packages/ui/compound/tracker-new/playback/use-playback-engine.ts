"use client";

import { useEffect, useRef } from "react";
import { useTrackerStore } from "@/components/compound/tracker-new/store/hooks";

export function usePlaybackEngine() {
  const play = useTrackerStore((s) => s.play);
  const mode = useTrackerStore((s) => s.mode);
  const eventIntervalMs = useTrackerStore((s) => s.eventIntervalMs);
  const advanceEvent = useTrackerStore((s) => s.advanceEvent);
  const advanceTime = useTrackerStore((s) => s.advanceTime);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (!play) return;

    if (mode === "event") {
      intervalRef.current = setInterval(() => advanceEvent(), eventIntervalMs);
    } else {
      intervalRef.current = setInterval(() => advanceTime(), 16);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [play, mode, eventIntervalMs, advanceEvent, advanceTime]);
}
