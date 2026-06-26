"use client";

import TimelineSlider from "@dash/ui/compound/tracker/timeline/timeline-slider";
import { PERSIAN_LOCALE, TEHRAN_TZ, cn } from "@/lib";
import {
  useResolvedOptions,
  useTimelineState,
  useTracksWithEventsFiltered,
} from "@dash/ui/compound/tracker/store/hooks";
import { calculateEvenlySpacedItems } from "@dash/ui/compound/tracker/data/time";
import { colors, getColor } from "@dash/ui/common/badge/color";
import { isWithinIran } from "@dash/ui/compound/tracker/utils/geo";
import { useElementWidth } from "@dash/ui/compound/tracker/utils/use-element-width";
import { useMemo } from "react";

export default function DayTimeline() {
  const options = useResolvedOptions();
  const { minutes, timeIndex, emphasizes, filterIran, setTimeIndex } =
    useTimelineState();
  const tracksWithEvents = useTracksWithEventsFiltered();
  const showPerTrackRows =
    typeof options.timeline.day === "object"
      ? options.timeline.day.showPerTrackRows !== false
      : !!options.timeline.day;
  const showEmphasizeBands = options.geo.emphasize.timelineBands;
  const { ref: containerRef, width } = useElementWidth();
  const tickWidth = minutes.length ? (width - 16) / minutes.length : 0;
  const evenlySpaced = useMemo(
    () => calculateEvenlySpacedItems(minutes, width, 70),
    [minutes, width],
  );

  if (!minutes.length) return null;

  const maxIndex = Math.max(minutes.length - 1, 0);
  const safeTimeIndex = Math.min(Math.max(timeIndex, 0), maxIndex);

  return (
    <div
      ref={containerRef}
      className="relative flex w-full flex-1 flex-col overflow-hidden px-4"
    >
      <TimelineSlider
        className="h-10"
        min={0}
        max={maxIndex}
        value={safeTimeIndex}
        onValueChange={(next) => {
          if (next !== safeTimeIndex) setTimeIndex(next);
        }}
      />
      <div className="pointer-events-none flex h-10 justify-between text-[10px]">
        {evenlySpaced.map((t, i) => (
          <span key={i}>
            {Intl.DateTimeFormat(PERSIAN_LOCALE, {
              timeZone: TEHRAN_TZ,
              hour: "2-digit",
              minute: "2-digit",
            }).format(t)}
          </span>
        ))}
      </div>
      {showPerTrackRows &&
        tracksWithEvents.map((track, trackIndex) => (
          <div key={trackIndex} className="relative mt-1 flex h-8 w-full">
            {minutes.map((time, j) => {
              const event = track.events.find((x) => x.time === time);
              const emphasize = emphasizes?.find(
                (x) => x.startTime <= time && x.endTime > time,
              );
              const outside =
                !filterIran &&
                event &&
                !isWithinIran(event.latlng[0], event.latlng[1]);
              const color = getColor(colors[trackIndex]);
              return (
                <div
                  key={j}
                  className="relative flex items-center justify-center"
                  style={{ width: tickWidth }}
                >
                  <div
                    className={cn("h-1 w-full", {
                      "bg-primary": !!event && !outside,
                      "bg-red-500": !!event && outside,
                      "bg-blue-500": !!event && !outside && color === "blue",
                    })}
                  />
                  {showEmphasizeBands && emphasize && (
                    <div className="absolute inset-y-0 w-1 bg-primary/20" />
                  )}
                </div>
              );
            })}
          </div>
        ))}
    </div>
  );
}
