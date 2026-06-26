import { Tracker } from "@/components/compound/tracker-legacy";
import { LEGACY_MAP_TILES } from "@/core/env";
import { toLegacyEvents } from "@/infrastructure/mappers/to-legacy-tracker-events";
import type { Event } from "@/components/compound/tracker-legacy";

type TrackerShellProps = {
  events: Event[];
  loadOsrmRoute?: boolean;
};

export function TrackerMapShell({
  events,
  loadOsrmRoute = true,
}: TrackerShellProps) {
  return (
    <div className="min-h-[calc(100vh-12rem)] flex-1 overflow-hidden rounded-xl border border-border bg-muted/10">
      <Tracker
        events={events}
        mapTiles={LEGACY_MAP_TILES}
        loadOsrmRoute={loadOsrmRoute}
        className="h-full min-h-[480px]"
      />
    </div>
  );
}

export { toLegacyEvents };
