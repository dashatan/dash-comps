"use client";

import { PERSIAN_LOCALE, TEHRAN_TZ } from "@/lib";
import { Pause, Play, Settings } from "lucide-react";
import TimelineSlider from "@dash/ui/compound/tracker/timeline/timeline-slider";
import { Select } from "@/components/common/inputs/select";
import {
  useCurrentTime,
  usePlaybackControls,
  useTrackerStore,
} from "@/components/compound/tracker/store/hooks";
import { cn } from "@/lib";

export default function ControlsBar() {
  const currentTime = useCurrentTime();
  const {
    play,
    mode,
    togglePlay,
    eventIntervalMs,
    timeMultiplier,
    setEventIntervalMs,
    setTimeMultiplier,
  } = usePlaybackControls();
  const toggleSettingsPanel = useTrackerStore((s) => s.toggleSettingsPanel);
  const speedPresets = useTrackerStore((s) => s.options.playback.speed.presets);

  return (
    <section className="flex w-full items-center gap-2 px-4 select-none">
      <button
        type="button"
        className="flex size-10 items-center justify-center rounded-md border border-border bg-card hover:bg-muted"
        onClick={togglePlay}
      >
        {play ? <Pause className="size-4" /> : <Play className="size-4" />}
      </button>
      <div className="min-w-32 rounded-md border border-border bg-card px-2 py-2 text-xs">
        {currentTime
          ? Intl.DateTimeFormat(PERSIAN_LOCALE, {
              timeZone: TEHRAN_TZ,
              year: "numeric",
              month: "numeric",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }).format(currentTime)
          : "—"}
      </div>
      {mode === "time" ? (
        <div className="flex min-w-48 items-center gap-2 px-2 text-xs">
          <span>1x</span>
          <TimelineSlider
            min={0.1}
            max={3}
            step={0.3}
            value={timeMultiplier}
            onValueChange={(next) => {
              if (next !== timeMultiplier) setTimeMultiplier(next);
            }}
            className="w-full"
          />
          <span>3x</span>
        </div>
      ) : (
        <Select.Single
          value={eventIntervalMs}
          onChange={(value) => setEventIntervalMs(value as number)}
          labelElement={(value) => {
            const label =
              speedPresets.find((p) => p.value === value)?.label ??
              `${value}ms`;
            return (
              <div className="rounded-md border border-border bg-card px-3 py-2 text-xs">
                {label}
              </div>
            );
          }}
          options={speedPresets.map((p) => ({
            label: p.label,
            value: p.value,
          }))}
        />
      )}
      <button
        type="button"
        className={cn(
          "ms-auto flex size-10 items-center justify-center rounded-md border border-border bg-card hover:bg-muted",
        )}
        onClick={toggleSettingsPanel}
      >
        <Settings className="size-5" />
      </button>
    </section>
  );
}
