import type {
  Emphasize,
  EventsInput,
  ObserveEvent,
  Track,
  TrackPoint,
  TracksInput,
} from "@/components/compound/tracker/types/input";

const DAY_MS = 86_400_000;
const HOUR_MS = 3_600_000;

export const TRACKER_MAP_ENV = {
  MAP_TILE_LIGHT: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  MAP_TILE_DARK: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  OSRM_URL: "https://router.project-osrm.org",
} as const;

/** Paris (Europe/Paris) — used for showcase mock tracker data. */
const dayStart = new Date("2024-06-03T00:00:00+02:00").getTime();

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
      province: "Paris",
      hasEvent: i % 4 === 0,
    });
  }
  return points;
}

const fleetTrackA: Track = {
  plate: { p1: "12", p2: "ب", p3: "345", p4: "67" },
  points: interpolatePoints(
    [48.8566, 2.3522],
    [48.8738, 2.295],
    18,
    dayStart + 8 * HOUR_MS,
    8 * 60_000,
    "Seine–Louvre",
  ),
};

const fleetTrackB: Track = {
  plate: { p1: "45", p2: "ج", p3: "678", p4: "21" },
  points: interpolatePoints(
    [48.8462, 2.3372],
    [48.8867, 2.3431],
    16,
    dayStart + 9 * HOUR_MS,
    10 * 60_000,
    "Montmartre–Opéra",
  ),
};

const fleetEmphasizes: Emphasize[] = [
  {
    title: "Rest stop",
    startTime: dayStart + 8 * HOUR_MS + 40 * 60_000,
    endTime: dayStart + 8 * HOUR_MS + 55 * 60_000,
    latLng: [48.8606, 2.3376],
    type: "route",
  },
  {
    title: "Encounter zone",
    startTime: dayStart + 9 * HOUR_MS + 30 * 60_000,
    endTime: dayStart + 9 * HOUR_MS + 50 * 60_000,
    latLng: [48.8656, 2.3212],
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
    [48.8566, 2.3522],
    [48.8606, 2.3376],
    [48.8656, 2.3212],
    [48.8738, 2.295],
    [48.8799, 2.3553],
    [48.8867, 2.3431],
    [48.8818, 2.3182],
    [48.875, 2.31],
    [48.8661, 2.3296],
    [48.8584, 2.3445],
  ];

  return coords.map((latlng, index) => ({
    id: index + 1,
    time: dayStart + 10 * HOUR_MS + index * 12 * 60_000,
    latlng,
    name: `Device ${100 + index}`,
    error: index === 3,
    miss: index === 6,
    speed: 42 + index * 3,
    province: "Paris",
    deviceId: 1000 + index,
    road: `Boulevard segment ${index + 1}`,
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
      latLng: [48.87, 2.33],
      type: "route",
    },
  ],
  dates: [dayStart, dayStart + DAY_MS, dayStart + 2 * DAY_MS],
};
