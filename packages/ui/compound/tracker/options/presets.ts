import type { TrackerOptions } from "@/components/compound/tracker/types";

export const TRACKER_PRESETS: Record<
  Exclude<TrackerOptions["preset"], "custom" | undefined>,
  TrackerOptions
> = {
  fleet: {
    preset: "fleet",
    map: { engine: "maplibre", autoPan: true, autoPanMaxZoom: 8 },
    route: { mode: "direct", direct: { perTrack: true, traceLength: 15 } },
    playback: { mode: "time", initToFirstEvent: true },
    timeline: { total: true, day: { showPerTrackRows: true }, plateLegend: true },
    panels: { events: "fleet", emphasizes: true, settings: true },
    geo: { filterIran: true, emphasize: { enabled: true, mapCircles: true } },
    markers: { headStyle: "car", headRotation: "angle", perEventMarkers: false },
    data: { useWorker: false, extendDateRangeToEvents: true },
  },
  observe: {
    preset: "observe",
    map: { engine: "maplibre", autoPan: true },
    route: {
      mode: "osrm",
      osrm: { animatePassedSegment: true, animateMovingMarker: true },
    },
    playback: { mode: "event", speed: { eventIntervalMs: 1000 }, initToFirstEvent: true },
    timeline: { total: false, day: false, plateLegend: false },
    panels: { events: "observe", settings: true },
    geo: { filterIran: false },
    markers: {
      headStyle: "arrow",
      headRotation: "bearing",
      perEventMarkers: true,
      tooltipContent: "device-group",
    },
    data: { useWorker: false },
  },
  full: {
    preset: "full",
    map: { engine: "maplibre", autoPan: true, autoPanMaxZoom: 8 },
    route: {
      mode: "osrm",
      osrm: { animatePassedSegment: true, animateMovingMarker: true },
      direct: { perTrack: true, traceLength: 15 },
    },
    playback: { mode: "event", initToFirstEvent: true },
    timeline: { total: true, day: true, plateLegend: true },
    panels: { events: "unified", emphasizes: true, settings: true },
    geo: { filterIran: true, emphasize: { enabled: true, mapCircles: true, timelineBands: true } },
    markers: { headStyle: "arrow", perEventMarkers: true, tooltipContent: "device-group" },
    data: { useWorker: true, extendDateRangeToEvents: true },
  },
  minimal: {
    preset: "minimal",
    map: { engine: "maplibre", controls: { zoom: false, compass: false, fullscreen: false } },
    route: { mode: "direct", direct: { traceLength: 10 } },
    playback: { mode: "event" },
    timeline: { total: false, day: false, plateLegend: false },
    panels: { events: "unified", emphasizes: false, settings: false },
    geo: { filterIran: false, emphasize: { enabled: false } },
    markers: { perEventMarkers: true },
  },
};

export const DEFAULT_PLAY_SPEED_PRESETS = [
  { label: "1x", value: 1000 },
  { label: "2x", value: 500 },
  { label: "3x", value: 300 },
  { label: "4x", value: 200 },
  { label: "5x", value: 100 },
] as const;

export const SIDEBAR_WIDTH = 384;

export const DEFAULT_CENTER: [number, number] = [35.691143, 51.428421];
