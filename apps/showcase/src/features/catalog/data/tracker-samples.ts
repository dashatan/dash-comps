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

/** Europe/Paris — showcase mock tracker spans multiple countries. */
const dayStart = new Date("2024-06-03T00:00:00+02:00").getTime();

function interpolatePoints(
  start: [number, number],
  end: [number, number],
  count: number,
  startTime: number,
  stepMs: number,
  roadPrefix: string,
  province: string,
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
      province,
      hasEvent: i % 4 === 0,
    });
  }
  return points;
}

const fleetTrackA: Track = {
  plate: { p1: "12", p2: "ب", p3: "345", p4: "67" },
  points: interpolatePoints(
    [48.8566, 2.3522],
    [50.8503, 4.3517],
    28,
    dayStart + 8 * HOUR_MS,
    12 * 60_000,
    "A1 Paris–Brussels",
    "France / Belgium",
  ),
};

const fleetTrackB: Track = {
  plate: { p1: "45", p2: "ج", p3: "678", p4: "21" },
  points: interpolatePoints(
    [52.3676, 4.9041],
    [52.52, 13.405],
    32,
    dayStart + 14 * HOUR_MS,
    15 * 60_000,
    "A2 Amsterdam–Berlin",
    "Netherlands / Germany",
  ),
};

const fleetEmphasizes: Emphasize[] = [
  {
    title: "Border crossing",
    startTime: dayStart + 10 * HOUR_MS,
    endTime: dayStart + 10 * HOUR_MS + 45 * 60_000,
    latLng: [50.85, 4.35],
    type: "route",
  },
  {
    title: "Encounter zone",
    startTime: dayStart + 18 * HOUR_MS,
    endTime: dayStart + 18 * HOUR_MS + 50 * 60_000,
    latLng: [51.96, 7.63],
    type: "encounter",
  },
];

export const fleetTracksSample: TracksInput = {
  kind: "tracks",
  dates: [dayStart, dayStart + DAY_MS],
  tracks: [fleetTrackA, fleetTrackB],
  emphasizes: fleetEmphasizes,
};

type Waypoint = {
  latlng: [number, number];
  province: string;
  road: string;
};

function buildObserveEvents(): ObserveEvent[] {
  /** Paris → Belgium → Netherlands → Germany → Czechia */
  const waypoints: Waypoint[] = [
    { latlng: [48.8566, 2.3522], province: "Paris, France", road: "Boulevard Périphérique" },
    { latlng: [49.2583, 2.4833], province: "Picardy, France", road: "A1" },
    { latlng: [49.8942, 2.2958], province: "Somme, France", road: "A1" },
    { latlng: [50.291, 3.239], province: "Nord, France", road: "A1" },
    { latlng: [50.6292, 3.0573], province: "Lille, France", road: "A1" },
    { latlng: [50.8503, 4.3517], province: "Brussels, Belgium", road: "E40" },
    { latlng: [51.2194, 4.4025], province: "Antwerp, Belgium", road: "E19" },
    { latlng: [51.5719, 4.7683], province: "North Brabant, Netherlands", road: "A16" },
    { latlng: [51.9244, 4.4777], province: "Rotterdam, Netherlands", road: "A13" },
    { latlng: [52.0907, 5.1214], province: "Utrecht, Netherlands", road: "A2" },
    { latlng: [52.3676, 4.9041], province: "Amsterdam, Netherlands", road: "A10" },
    { latlng: [52.2215, 6.8937], province: "Overijssel, Netherlands", road: "A1" },
    { latlng: [52.0907, 6.8775], province: "Enschede, Netherlands", road: "A35" },
    { latlng: [51.9607, 7.6261], province: "Münster, Germany", road: "A1" },
    { latlng: [51.4556, 7.0116], province: "Essen, Germany", road: "A40" },
    { latlng: [50.9375, 6.9603], province: "Cologne, Germany", road: "A4" },
    { latlng: [50.5558, 9.6808], province: "Fulda, Germany", road: "A4" },
    { latlng: [50.1109, 8.6821], province: "Frankfurt, Germany", road: "A5" },
    { latlng: [51.0504, 11.5167], province: "Erfurt, Germany", road: "A4" },
    { latlng: [51.3397, 12.3731], province: "Leipzig, Germany", road: "A9" },
    { latlng: [52.131, 11.639], province: "Magdeburg, Germany", road: "A2" },
    { latlng: [52.52, 13.405], province: "Berlin, Germany", road: "A100" },
    { latlng: [51.0504, 13.7373], province: "Dresden, Germany", road: "A4" },
    { latlng: [50.0755, 14.4378], province: "Prague, Czechia", road: "D5" },
  ];

  return waypoints.map((point, index) => ({
    id: index + 1,
    time: dayStart + 6 * HOUR_MS + index * 45 * 60_000,
    latlng: point.latlng,
    name: `Device ${100 + index}`,
    error: index === 7,
    miss: index === 15,
    speed: 72 + (index % 5) * 8,
    province: point.province,
    deviceId: 1000 + index,
    road: point.road,
    roadId: 500 + index,
    trafficId: 900 + index,
    crimes: index === 9 ? ["Speeding"] : [],
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
      latLng: [52.37, 9.73],
      type: "route",
    },
  ],
  dates: [dayStart, dayStart + DAY_MS, dayStart + 2 * DAY_MS],
};
