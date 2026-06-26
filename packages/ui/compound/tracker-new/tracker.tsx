"use client";

import { cn } from "@/lib";
import MapHost from "@dash/ui/compound/tracker-new/map/map-host";
import EventsPanel from "@dash/ui/compound/tracker-new/panels/events-panel";
import EmphasizesPanel from "@dash/ui/compound/tracker-new/panels/emphasizes-panel";
import SettingsPanel from "@dash/ui/compound/tracker-new/panels/settings-panel";
import ControlsBar from "@dash/ui/compound/tracker-new/panels/controls-bar";
import TotalTimeline from "@dash/ui/compound/tracker-new/timeline/total-timeline";
import DayTimeline from "@dash/ui/compound/tracker-new/timeline/day-timeline";
import PlateLegend from "@dash/ui/compound/tracker-new/timeline/plate-legend";
import { useResolvedOptions } from "@dash/ui/compound/tracker-new/store/hooks";
import type { TrackerProps } from "@dash/ui/compound/tracker-new/types";

export default function Tracker({ className, slots }: TrackerProps) {
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
