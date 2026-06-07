import { EmphasizesPanelProps } from "@/components/macro/tracker/comps/widgets/emphasizes";
import { playerSettings } from "@/components/macro/tracker/utils/constants";

export type TrackerProps = {
  dates?: number[];
  tracks?: Track[];
  emphasizes?: Emphasize[];
  emphasizesPanel?: EmphasizesPanelProps;
  settings?: {
    show?: boolean;
    autoPaneMap?: boolean;
    traceCount?: number;
    playSpeed?: number;
    maxPaneZoom?: number;
    eventBasedPlay?: boolean;
    filterIran?: boolean;
  };
};

export type Emphasize = {
  title?: string;
  startTime: number;
  endTime: number;
  latLng: number[];
  type?: "encounter" | "route";
};
export type TrackerEvent = TrackPoint & {
  plate: PlateInputValue;
  trackIndex: number;
};

export type TimeLine = {
  date: number;
  minutes: number[];
  events: TrackerEvent[];
};

export type TrackerState = {
  playerSettings: typeof playerSettings;
  showSettings?: boolean;
  emphasizes?: Emphasize[];
  timeline?: TimeLine[];
  events?: TrackerEvent[];
  tracks?: Track[];
  tracksWithEvents: TrackWithEvents[];
  dates?: number[];
  totalTimes?: number[];
  daysWithEvent?: number[];
};

export type TrackPoint = {
  latLng: Point;
  angle: number;
  time: number;
  road?: string;
  province?: string;
  image?: string;
  color?: string;
  assumed?: boolean;
  hasEvent?: boolean;
  emphasized?: boolean;
  stepSize?: number;
};

export type Track = {
  plate: PlateInputValue;
  points: TrackPoint[];
};

export type TrackWithEvents = {
  plate: PlateInputValue;
  events: TrackerEvent[];
};

export type BreakTimeKeys = "minutes" | "hours" | "days" | "weeks" | "months";

export type TrackerGeoType = {
  geometry: {
    geometries: {
      coordinates: number[] | number[][];
      type: "Point" | "LineString";
    }[];
    type: string;
  };
  properties: {
    color: string;
    id: string;
    isInterpolated: number;
    time: number;
  };
  type: string;
};

export type Event = {
  startTime?: number;
  endTime?: number;
  className?: string;
};

export type PlayerProps = {
  dates: number[];
  eventsGroup?: ((Event | undefined)[] | undefined)[];
  speed: number;
  onChange: (data: { timeIndex: number }) => void;
};

type PlateInputValue = {
  p1?: string;
  p2?: string;
  p3?: string;
  p4?: string;
  p5?: string;
  p6?: string;
  p7?: string;
  p8?: string;
  p9?: string;
};
