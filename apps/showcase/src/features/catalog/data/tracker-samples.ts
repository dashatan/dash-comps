import type {
  Emphasize,
  EventsInput,
  ObserveEvent,
  Track,
  TrackPoint,
  TracksInput,
} from "@/components/compound/tracker-new/types/input";

const DAY_MS = 86_400_000;
const HOUR_MS = 3_600_000;

export const TRACKER_MAP_ENV = {
  MAP_TILE_LIGHT: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  MAP_TILE_DARK: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  OSRM_URL: "https://router.project-osrm.org",
} as const;

const dayStart = new Date("2024-06-03T00:00:00+03:30").getTime();

function interpolatePoints(
  start: [number, number],
  end: [number, number],
  count: number,
  startTime: number,
  stepMs: number,
  roadPrefix: string,
): TrackPoint[] {
  const points: TrackPoint[] = [];
  for (let i = 0; i < count; i += 1) {
    const t = count <= 1 ? 0 : i / (count - 1);
    const lat = start[0] + (end[0] - start[0]) * t;
    const lng = start[1] + (end[1] - start[1]) * t;
    points.push({
      latLng: [lat, lng],
      time: startTime + i * stepMs,
      road: `${roadPrefix} ${i + 1}`,
      province: "Tehran",
      hasEvent: i % 4 === 0,
    });
  }
  return points;
}

const fleetTrackA: Track = {
  plate: { p1: "12", p2: "ب", p3: "345", p4: "67" },
  points: interpolatePoints(
    [35.6892, 51.389],
    [35.7219, 51.4247],
    18,
    dayStart + 8 * HOUR_MS,
    8 * 60_000,
    "Azadi–Enghelab",
  ),
};

const fleetTrackB: Track = {
  plate: { p1: "45", p2: "ج", p3: "678", p4: "21" },
  points: interpolatePoints(
    [35.701, 51.338],
    [35.744, 51.375],
    16,
    dayStart + 9 * HOUR_MS,
    10 * 60_000,
    "Vanak–Tajrish",
  ),
};

const fleetEmphasizes: Emphasize[] = [
  {
    title: "Rest stop",
    startTime: dayStart + 8 * HOUR_MS + 40 * 60_000,
    endTime: dayStart + 8 * HOUR_MS + 55 * 60_000,
    latLng: [35.705, 51.405],
    type: "route",
  },
  {
    title: "Encounter zone",
    startTime: dayStart + 9 * HOUR_MS + 30 * 60_000,
    endTime: dayStart + 9 * HOUR_MS + 50 * 60_000,
    latLng: [35.718, 51.362],
    type: "encounter",
  },
];

export const fleetTracksSample: TracksInput = {
  kind: "tracks",
  dates: [dayStart, dayStart + DAY_MS],
  tracks: [fleetTrackA, fleetTrackB],
  emphasizes: fleetEmphasizes,
};

function buildObserveEvents(): ObserveEvent[] {
  const coords: [number, number][] = [
    [35.6892, 51.389],
    [35.6965, 51.401],
    [35.7038, 51.412],
    [35.711, 51.418],
    [35.7185, 51.425],
    [35.726, 51.431],
    [35.733, 51.428],
    [35.739, 51.42],
    [35.744, 51.412],
    [35.748, 51.402],
  ];

  return coords.map((latlng, index) => ({
    id: index + 1,
    time: dayStart + 10 * HOUR_MS + index * 12 * 60_000,
    latlng,
    name: `Device ${100 + index}`,
    error: index === 3,
    miss: index === 6,
    speed: 42 + index * 3,
    province: "Tehran",
    deviceId: 1000 + index,
    road: `Observed segment ${index + 1}`,
    roadId: 500 + index,
    trafficId: 900 + index,
    crimes: index === 5 ? ["Speeding"] : [],
  }));
}

export const observeEventsSample: EventsInput = {
  kind: "events",
  events: buildObserveEvents(),
  dates: [dayStart, dayStart + DAY_MS],
};

export const fullTracksSample: TracksInput = {
  ...fleetTracksSample,
  emphasizes: [
    ...fleetEmphasizes,
    {
      title: "Night corridor",
      startTime: dayStart + DAY_MS + 6 * HOUR_MS,
      endTime: dayStart + DAY_MS + 8 * HOUR_MS,
      latLng: [35.73, 51.39],
      type: "route",
    },
  ],
  dates: [dayStart, dayStart + DAY_MS, dayStart + 2 * DAY_MS],
};
