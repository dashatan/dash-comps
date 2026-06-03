export const SIDEBAR_WIDTH = 384;

export type Event = {
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

export const playSpeedOptions = [
  { value: 1000, label: "1x" },
  { value: 500, label: "2x" },
  { value: 300, label: "3x" },
  { value: 200, label: "4x" },
  { value: 100, label: "5x" },
] as const;
