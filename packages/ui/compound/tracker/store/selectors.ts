import type { TrackerStore } from "@dash/ui/compound/tracker/store/create-store";
import type { Emphasize } from "@dash/ui/compound/tracker/types/input";
import { isWithinIran } from "@dash/ui/compound/tracker/utils/geo";
import { timeHourClear } from "@dash/ui/compound/tracker/data/time";

export function selectActiveEvent(state: TrackerStore) {
  return state.events[state.activeEventIndex];
}

export function selectCurrentTime(state: TrackerStore): number | undefined {
  return state.minutes[state.timeIndex];
}

export function selectPanelEvents(state: TrackerStore) {
  if (!state.filterIran) return state.events;
  return state.events.filter((e) => isWithinIran(e.latlng[0], e.latlng[1]));
}

export function selectTracksWithEventsFiltered(state: TrackerStore) {
  if (!state.filterIran) return state.tracksWithEvents;
  return state.tracksWithEvents.map((t) => ({
    ...t,
    events: t.events.filter((e) => isWithinIran(e.latlng[0], e.latlng[1])),
  }));
}

export function selectActiveEmphasizes(state: TrackerStore): Emphasize[] {
  const currentTime = selectCurrentTime(state);
  if (currentTime == null) return [];
  return state.emphasizes.filter(
    (x) => x.startTime <= currentTime && x.endTime >= currentTime,
  );
}

export function selectVisibleTrailPoints(
  state: TrackerStore,
  trackIndex: number,
) {
  const currentTime = selectCurrentTime(state);
  if (currentTime == null) return [];
  const track = state.tracksWithEvents[trackIndex];
  if (!track) return [];
  return track.events
    .filter((e) => e.time <= currentTime)
    .slice(-state.traceLength);
}

export function selectDaySegments(state: TrackerStore) {
  return state.totalTimes.map((time, index) => ({
    index,
    hasEvent: state.daysWithEvent.includes(index),
    time,
  }));
}

export function selectIsOutsideIran(
  _state: TrackerStore,
  lat: number,
  lng: number,
) {
  return !isWithinIran(lat, lng);
}

export function findTotalTimeIndex(
  totalTimes: number[],
  time: number,
): number | undefined {
  if (!totalTimes.length) return undefined;
  const eventDay = timeHourClear(time).getTime();
  const index = totalTimes.findIndex(
    (x) => timeHourClear(x).getTime() === eventDay,
  );
  if (index >= 0) return index;
  const lastDay = timeHourClear(totalTimes[totalTimes.length - 1]).getTime();
  if (eventDay >= lastDay) return totalTimes.length - 1;
  const firstDay = timeHourClear(totalTimes[0]).getTime();
  if (eventDay <= firstDay) return 0;
  return undefined;
}
