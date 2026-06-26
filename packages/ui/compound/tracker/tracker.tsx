"use client";

import { cn } from "@/lib";
import MapHost from "@dash/ui/compound/tracker/map/map-host";
import EventsPanel from "@dash/ui/compound/tracker/panels/events-panel";
import EmphasizesPanel from "@dash/ui/compound/tracker/panels/emphasizes-panel";
import SettingsPanel from "@dash/ui/compound/tracker/panels/settings-panel";
import ControlsBar from "@dash/ui/compound/tracker/panels/controls-bar";
import TotalTimeline from "@dash/ui/compound/tracker/timeline/total-timeline";
import DayTimeline from "@dash/ui/compound/tracker/timeline/day-timeline";
import PlateLegend from "@dash/ui/compound/tracker/timeline/plate-legend";
import { TrackerProvider } from "@dash/ui/compound/tracker/provider";
import { useResolvedOptions } from "@dash/ui/compound/tracker/store/hooks";
import type { TrackerProps } from "@dash/ui/compound/tracker/types";

function TrackerContent({
  className,
  slots,
}: Pick<TrackerProps, "className" | "slots">) {
  const options = useResolvedOptions();
  const sidebarWidth = options.panels.sidebarWidth;
  const showTotal =
    options.timeline.total === true ||
    (typeof options.timeline.total === "object" && options.timeline.total);
  const showDay =
    options.timeline.day === true ||
    (typeof options.timeline.day === "object" && options.timeline.day);
  const showPlateLegend =
    options.timeline.plateLegend && options.panels.events !== false;
  const showEmphasizes =
    options.panels.emphasizes &&
    options.geo.emphasize.enabled !== false &&
    options.geo.emphasize.panel !== false;
  const showSettings = options.panels.settings !== false;

  return (
    <div
      className={cn("relative h-full min-h-[480px] w-full dir-ltr", className)}
    >
      <MapHost />
      <div
        className="absolute top-4 left-4 z-50 flex flex-col gap-3"
        style={{ width: sidebarWidth }}
      >
        {options.panels.events && <EventsPanel slots={slots} />}
        {showEmphasizes && (
          <EmphasizesPanel
            config={
              typeof options.panels.emphasizes === "object"
                ? options.panels.emphasizes
                : true
            }
          />
        )}
        {showSettings && <SettingsPanel />}
      </div>
      <div className="absolute bottom-4 left-4 z-40 flex w-[calc(100%-2rem)] flex-col gap-3 rounded-lg border bg-background/95 pt-3 backdrop-blur">
        <ControlsBar />
        {showTotal && <TotalTimeline />}
        <div className="flex w-full">
          {showPlateLegend && <PlateLegend />}
          {showDay && <DayTimeline />}
        </div>
      </div>
    </div>
  );
}

export default function Tracker({
  input,
  options,
  initialState,
  className,
  slots,
  onEventSelect,
  onTimeChange,
  onSettingsChange,
  onError,
}: TrackerProps) {
  return (
    <TrackerProvider
      input={input}
      options={options}
      initialState={initialState}
      onEventSelect={onEventSelect}
      onTimeChange={onTimeChange}
      onSettingsChange={onSettingsChange}
      onError={onError}
    >
      <TrackerContent className={className} slots={slots} />
    </TrackerProvider>
  );
}
