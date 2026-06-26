import type { ReactNode } from "react";
import type { TrackerStore } from "@dash/ui/compound/tracker-new/store/create-store";
import type {
  EmphasizesPanelConfig,
  TrackerInput,
} from "@/components/compound/tracker-new/types/input";
import type {
  NormalizedEvent,
  NormalizedTrackerData,
  PlaybackIndices,
  TrackerError,
} from "@/components/compound/tracker-new/types/normalized";

export type TrackerPreset = "fleet" | "observe" | "full" | "minimal" | "custom";

export type MapEngineOption = "leaflet" | "maplibre";

export type RouteMode = "none" | "direct" | "osrm";

export type PlaybackMode = "event" | "time";

export type EventsPanelVariant = false | "fleet" | "observe" | "unified";

export type MarkerHeadStyle = "car" | "arrow" | "circle" | "cctv";

export type MarkerRotationMode = "bearing" | "angle" | "none";

export type TooltipContentMode = "simple" | "device-group" | "custom";

export type MapPadding = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

export type TrackerOptions = {
  preset?: TrackerPreset;
  map?: {
    engine?: MapEngineOption;
    rtlSupport?: boolean;
    tiles?: { light: string; dark: string };
    controls?: {
      zoom?: boolean;
      compass?: boolean;
      fullscreen?: boolean;
    };
    autoPan?: boolean;
    autoPanMaxZoom?: number;
    autoPanPadding?: Partial<MapPadding>;
    center?: [number, number];
    defaultZoom?: number;
  };
  route?: {
    mode?: RouteMode;
    direct?: {
      perTrack?: boolean;
      traceLength?: number;
      showIntermediatePoints?: boolean;
      lineWeight?: number;
    };
    osrm?: {
      url?: string;
      animatePassedSegment?: boolean;
      animateMovingMarker?: boolean;
      chunkSize?: number;
    };
    colors?: {
      base?: string;
      passed?: string;
    };
  };
  playback?: {
    mode?: PlaybackMode;
    autoPlay?: boolean;
    loop?: boolean;
    initToFirstEvent?: boolean;
    speed?: {
      eventIntervalMs?: number;
      timeMultiplier?: number;
      timeStepMultiplier?: number;
      presets?: { label: string; value: number }[];
    };
  };
  timeline?: {
    total?:
      | boolean
      | {
          showDayLabels?: boolean;
          highlightDaysWithEvents?: boolean;
          navigationButtons?: boolean;
        };
    day?:
      | boolean
      | {
          showTimeLabels?: boolean;
          showPerTrackRows?: boolean;
          showEmphasizeBands?: boolean;
          thumbStyle?: "arrow" | "line";
        };
    plateLegend?: boolean;
  };
  panels?: {
    events?: EventsPanelVariant;
    emphasizes?: boolean | EmphasizesPanelConfig;
    settings?: boolean | { defaultOpen?: boolean };
    sidebarWidth?: number;
    playerHeight?: number | "auto";
    eventNavigation?: {
      prevNext?: boolean;
      firstLast?: boolean;
      scrollSync?: boolean;
    };
  };
  geo?: {
    filterIran?: boolean;
    showOutsideIranBadge?: boolean;
    emphasize?: {
      enabled?: boolean;
      mapCircles?: boolean;
      circleRadius?: number;
      timelineBands?: boolean;
      panel?: boolean;
    };
  };
  markers?: {
    headStyle?: MarkerHeadStyle;
    headRotation?: MarkerRotationMode;
    showHeadTooltip?: boolean;
    tooltipContent?: TooltipContentMode;
    perEventMarkers?: boolean;
    activeEventHighlight?: boolean;
  };
  data?: {
    useWorker?: boolean;
    inputKind?: "tracks" | "events" | "auto";
    normalizeTimes?: boolean;
    extendDateRangeToEvents?: boolean;
  };
  performance?: {
    lazyMapEngine?: boolean;
    scrubDebounceMs?: number;
    mapUpdateStrategy?: "full" | "incremental";
  };
};

export type ResolvedTrackerOptions = Required<{
  preset: TrackerPreset;
  map: Required<NonNullable<TrackerOptions["map"]>>;
  route: Required<{
    mode: RouteMode;
    direct: Required<
      NonNullable<NonNullable<TrackerOptions["route"]>["direct"]>
    >;
    osrm: Required<NonNullable<NonNullable<TrackerOptions["route"]>["osrm"]>>;
    colors: Required<
      NonNullable<NonNullable<TrackerOptions["route"]>["colors"]>
    >;
  }>;
  playback: Required<{
    mode: PlaybackMode;
    autoPlay: boolean;
    loop: boolean;
    initToFirstEvent: boolean;
    speed: Required<
      NonNullable<NonNullable<TrackerOptions["playback"]>["speed"]>
    >;
  }>;
  timeline: Required<{
    total:
      | boolean
      | NonNullable<NonNullable<TrackerOptions["timeline"]>["total"]>;
    day: boolean | NonNullable<NonNullable<TrackerOptions["timeline"]>["day"]>;
    plateLegend: boolean;
  }>;
  panels: Required<{
    events: EventsPanelVariant;
    emphasizes: boolean | EmphasizesPanelConfig;
    settings: boolean | { defaultOpen?: boolean };
    sidebarWidth: number;
    playerHeight: number | "auto";
    eventNavigation: Required<
      NonNullable<NonNullable<TrackerOptions["panels"]>["eventNavigation"]>
    >;
  }>;
  geo: Required<{
    filterIran: boolean;
    showOutsideIranBadge: boolean;
    emphasize: Required<
      NonNullable<NonNullable<TrackerOptions["geo"]>["emphasize"]>
    >;
  }>;
  markers: Required<NonNullable<TrackerOptions["markers"]>>;
  data: Required<NonNullable<TrackerOptions["data"]>>;
  performance: Required<NonNullable<TrackerOptions["performance"]>>;
}>;

export type TrackerSlots = {
  eventImage?: (props: { index: number; event: NormalizedEvent }) => ReactNode;
};

export type TrackerProviderProps = {
  input: TrackerInput;
  options?: TrackerOptions;
  initialState?: Partial<NormalizedTrackerData>;
  slots?: TrackerSlots;
  onEventSelect?: (event: NormalizedEvent, index: number) => void;
  onTimeChange?: (time: number, indices: PlaybackIndices) => void;
  onSettingsChange?: (settings: ResolvedTrackerOptions) => void;
  onError?: (error: TrackerError) => void;
  children: ReactNode;
};

export type TrackerProps = {
  className?: string;
  slots?: TrackerSlots;
};

export type {
  TrackerInput,
  EmphasizesPanelConfig,
} from "@/components/compound/tracker-new/types/input";
export type {
  NormalizedEvent,
  NormalizedTrackerData,
  PlaybackIndices,
  TrackerError,
  TrackWithEvents,
  TimeLine,
} from "@/components/compound/tracker-new/types/normalized";
export type { TrackerStore };
