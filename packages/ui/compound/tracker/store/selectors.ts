import type { TrackerStore } from "@dash/ui/compound/tracker/store/create-store";
import type { Emphasize } from "@dash/ui/compound/tracker/types/input";
import type { TrackWithEvents } from "@dash/ui/compound/tracker/types/normalized";
import { isWithinIran } from "@dash/ui/compound/tracker/utils/geo";
import { timeHourClear } from "@dash/ui/compound/tracker/data/time";

let tracksFilteredCache: {
  source: TrackWithEvents[];
  filterIran: boolean;
  result: TrackWithEvents[];
} | null = null;

let panelEventsCache: {
  source: TrackerStore["events"];
  filterIran: boolean;
  result: TrackerStore["events"];
} | null = null;

let activeEmphasizesCache: {
  emphasizes: Emphasize[];
  timeIndex: number;
  time: number | undefined;
  result: Emphasize[];
} | null = null;

export function selectActiveEvent(state: TrackerStore) {
  return state.events[state.activeEventIndex];
}

export function selectCurrentTime(state: TrackerStore): number | undefined {
  return state.minutes[state.timeIndex];
}

export function selectPanelEvents(state: TrackerStore) {
  if (!state.filterIran) return state.events;
  if (
    panelEventsCache &&
    panelEventsCache.source === state.events &&
    panelEventsCache.filterIran === state.filterIran
  ) {
    return panelEventsCache.result;
  }
  const result = state.events.filter((e) =>
    isWithinIran(e.latlng[0], e.latlng[1]),
  );
  panelEventsCache = {
    source: state.events,
    filterIran: state.filterIran,
    result,
  };
  return result;
}

export function selectTracksWithEventsFiltered(state: TrackerStore) {
  if (!state.filterIran) return state.tracksWithEvents;
  if (
    tracksFilteredCache &&
    tracksFilteredCache.source === state.tracksWithEvents &&
    tracksFilteredCache.filterIran === state.filterIran
  ) {
    return tracksFilteredCache.result;
  }
  const result = state.tracksWithEvents.map((t) => {
    const events = t.events.filter((e) =>
      isWithinIran(e.latlng[0], e.latlng[1]),
    );
    if (events.length === t.events.length) return t;
    return { ...t, events };
  });
  tracksFilteredCache = {
    source: state.tracksWithEvents,
    filterIran: state.filterIran,
    result,
  };
  return result;
}

export function selectActiveEmphasizes(state: TrackerStore): Emphasize[] {
  const currentTime = selectCurrentTime(state);
  if (currentTime == null) return [];
  if (
    activeEmphasizesCache &&
    activeEmphasizesCache.emphasizes === state.emphasizes &&
    activeEmphasizesCache.timeIndex === state.timeIndex &&
    activeEmphasizesCache.time === currentTime
  ) {
    return activeEmphasizesCache.result;
  }
  const result = state.emphasizes.filter(
    (x) => x.startTime <= currentTime && x.endTime >= currentTime,
  );
  activeEmphasizesCache = {
    emphasizes: state.emphasizes,
    timeIndex: state.timeIndex,
    time: currentTime,
    result,
  };
  return result;
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
