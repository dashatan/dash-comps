import type { ReactNode } from "react";
import type { CarPlateInputValue } from "@dash/ui/compound/license-plate/types";

export type PlateInputValue = CarPlateInputValue & {
  p5?: string;
  p6?: string;
  p7?: string;
  p8?: string;
  p9?: string;
};

export type TrackPoint = {
  latLng: [number, number];
  angle?: number;
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

export type Emphasize = {
  title?: string;
  startTime: number;
  endTime: number;
  latLng: [number, number];
  type?: "encounter" | "route";
};

export type ObserveEvent = {
  id: number;
  time: number;
  latlng: [number, number];
  name: string;
  error: boolean;
  miss: boolean;
  speed: number;
  province: string;
  deviceId: number | string;
  road: string;
  roadId: number | string;
  trafficId: number | string;
  crimes: string[];
};

export type TracksInput = {
  kind: "tracks";
  dates?: number[];
  tracks: Track[];
  emphasizes?: Emphasize[];
};

export type EventsInput = {
  kind: "events";
  events: ObserveEvent[];
  routeCoords?: [number, number][];
  dates?: number[];
};

export type TrackerInput = TracksInput | EventsInput;

export type EmphasizesPanelConfig = {
  icon?: ReactNode;
  title?: string;
  subtitle?: string;
  countTitle?: (count: number) => string;
  listTitle?: string;
};
