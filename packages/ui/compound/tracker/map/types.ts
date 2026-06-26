import type { NormalizedEvent } from "@/components/compound/tracker/types/normalized";
import type { Emphasize } from "@/components/compound/tracker/types/input";

export type Coordinate = [number, number];

export type MapPadding = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

export type FitBoundsOptions = {
  padding?: Partial<MapPadding>;
  maxZoom?: number;
  animate?: boolean;
};

export type MapEngineConfig = {
  center: Coordinate;
  zoom: number;
  tileUrl: string;
  theme: "light" | "dark";
  rtlSupport?: boolean;
  controls?: {
    zoom?: boolean;
    compass?: boolean;
    fullscreen?: boolean;
  };
};

export type RouteDrawContext = {
  routeCoords: Coordinate[];
  perTrackRoutes?: Coordinate[][];
  routeMode: "none" | "direct" | "osrm";
  traceLength: number;
  perTrack: boolean;
  lineWeight: number;
  showIntermediatePoints: boolean;
  passedCoords?: Coordinate[];
  activeEventIndex: number;
  events: NormalizedEvent[];
  tracksWithEvents: { events: NormalizedEvent[]; trackIndex?: number }[];
  colors: string[];
};

export type MarkerDrawContext = {
  events: NormalizedEvent[];
  activeEventIndex: number;
  perEventMarkers: boolean;
  headStyle: string;
  headAngle: number;
  headPosition?: Coordinate;
  onEventClick?: (index: number) => void;
};

export type EmphasizeDrawContext = {
  emphasizes: Emphasize[];
  circleRadius: number;
};

export type HeadAnimationContext = {
  from: Coordinate;
  to: Coordinate;
  angle: number;
  duration: number;
};

export type MapEngineHandle = {
  id: "leaflet" | "maplibre";
  destroy: () => void;
  invalidateSize?: () => void;
};

export interface MapEngine {
  id: "leaflet" | "maplibre";
  mount: (container: HTMLElement, config: MapEngineConfig) => Promise<MapEngineHandle>;
  drawRoute: (ctx: RouteDrawContext) => void;
  drawMarkers: (ctx: MarkerDrawContext) => void;
  drawEmphasizes: (ctx: EmphasizeDrawContext) => void;
  animateHead: (ctx: HeadAnimationContext) => void;
  fitToBounds: (points: Coordinate[], options?: FitBoundsOptions) => void;
  clear: () => void;
}
