"use client";

import TimelineSlider from "@dash/ui/compound/tracker/timeline/timeline-slider";
import { PERSIAN_LOCALE, TEHRAN_TZ } from "@/lib";
import {
  useTimelineState,
  useTrackerStore,
} from "@dash/ui/compound/tracker/store/hooks";
import { calculateEvenlySpacedItems } from "@dash/ui/compound/tracker/data/time";
import { makeTimes } from "@dash/ui/compound/tracker/data/remap";
import { useElementWidth } from "@dash/ui/compound/tracker/utils/use-element-width";
import { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function TotalTimeline() {
  const {
    totalTimes,
    totalTimeIndex,
    daysWithEvent,
    setTotalTimeIndex,
    setMinutes,
  } = useTimelineState();
  const setTimeIndex = useTrackerStore((s) => s.setTimeIndex);
  const { ref: containerRef, width } = useElementWidth();

  const evenlySpaced = useMemo(
    () => calculateEvenlySpacedItems(totalTimes, width, 70),
    [totalTimes, width],
  );

  if (!totalTimes.length) return null;

  const maxIndex = Math.max(totalTimes.length - 1, 0);
  const safeTotalTimeIndex = Math.min(Math.max(totalTimeIndex, 0), maxIndex);

  function handleDayChange(index: number) {
    setTotalTimeIndex(index);
    const dayEnd = totalTimes[index + 1] ?? totalTimes[index] + 86400000;
    const minutes = makeTimes([totalTimes[index], dayEnd]);
    setMinutes(minutes);
    setTimeIndex(0);
  }

  return (
    <div className="flex flex-1 items-center gap-2 px-2">
      <button
        type="button"
        className="rounded-md border border-border p-2"
        onClick={() => handleDayChange(Math.max(0, totalTimeIndex - 1))}
      >
        <ChevronLeft className="size-4" />
      </button>
      <div
        ref={containerRef}
        className="relative h-10 flex-1 overflow-hidden rounded-md border px-4"
      >
        <div className="pointer-events-none absolute inset-0 flex">
          {totalTimes.map((_, i) => (
            <div
              key={i}
              className={
                daysWithEvent.includes(i) ? "flex-1 bg-primary/20" : "flex-1"
              }
            />
          ))}
        </div>
        <TimelineSlider
          className="relative z-10 h-10"
          min={0}
          max={maxIndex}
          value={safeTotalTimeIndex}
          onValueChange={(next) => {
            if (next !== safeTotalTimeIndex) handleDayChange(next);
          }}
        />
        <div className="pointer-events-none absolute inset-x-4 bottom-0 flex justify-between text-[10px]">
          {evenlySpaced.map((t, i) => (
            <span key={i}>
              {Intl.DateTimeFormat(PERSIAN_LOCALE, {
                timeZone: TEHRAN_TZ,
                year: "2-digit",
                month: "2-digit",
                day: "2-digit",
              }).format(t)}
            </span>
          ))}
        </div>
      </div>
      <button
        type="button"
        className="rounded-md border border-border p-2"
        onClick={() =>
          handleDayChange(Math.min(totalTimes.length - 1, totalTimeIndex + 1))
        }
      >
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
}
