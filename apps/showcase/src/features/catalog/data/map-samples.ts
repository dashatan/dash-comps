export const MAP_TILE_LIGHT =
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" as const;

export const MAP_TILE_DARK =
  "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" as const;

export const NOMINATIM_URL =
  "https://nominatim.openstreetmap.org/search" as const;

export type CountryPresetId =
  | "iran"
  | "usa"
  | "uk"
  | "japan"
  | "uae"
  | "germany"
  | "france"
  | "australia";

export type CountryPreset = {
  id: CountryPresetId;
  center: Point;
  zoom: number;
};

export const COUNTRY_PRESETS: CountryPreset[] = [
  { id: "iran", center: [35.6892, 51.389], zoom: 11 },
  { id: "usa", center: [40.7128, -74.006], zoom: 11 },
  { id: "uk", center: [51.5074, -0.1278], zoom: 11 },
  { id: "japan", center: [35.6762, 139.6503], zoom: 11 },
  { id: "uae", center: [25.2048, 55.2708], zoom: 11 },
  { id: "germany", center: [52.52, 13.405], zoom: 11 },
  { id: "france", center: [48.8566, 2.3522], zoom: 11 },
  { id: "australia", center: [-33.8688, 151.2093], zoom: 11 },
];

export type ShowcaseCityMarker = {
  id: string;
  name: string;
  country: string;
  population: number;
  lat: string;
  long: string;
};

export const GLOBAL_CITY_MARKERS: ShowcaseCityMarker[] = [
  {
    id: "tehran",
    name: "Tehran",
    country: "Iran",
    population: 9_500_000,
    lat: "35.6892",
    long: "51.389",
  },
  {
    id: "nyc",
    name: "New York",
    country: "United States",
    population: 8_300_000,
    lat: "40.7128",
    long: "-74.006",
  },
  {
    id: "london",
    name: "London",
    country: "United Kingdom",
    population: 9_000_000,
    lat: "51.5074",
    long: "-0.1278",
  },
  {
    id: "tokyo",
    name: "Tokyo",
    country: "Japan",
    population: 13_960_000,
    lat: "35.6762",
    long: "139.6503",
  },
  {
    id: "dubai",
    name: "Dubai",
    country: "UAE",
    population: 3_500_000,
    lat: "25.2048",
    long: "55.2708",
  },
  {
    id: "berlin",
    name: "Berlin",
    country: "Germany",
    population: 3_700_000,
    lat: "52.52",
    long: "13.405",
  },
  {
    id: "paris",
    name: "Paris",
    country: "France",
    population: 2_100_000,
    lat: "48.8566",
    long: "2.3522",
  },
  {
    id: "sydney",
    name: "Sydney",
    country: "Australia",
    population: 5_300_000,
    lat: "-33.8688",
    long: "151.2093",
  },
];

export const TEHRAN_DEVICES = [
  {
    id: 1001,
    name: "Hemmat — westbound lane 2",
    lat: "35.7442",
    long: "51.3754",
    province: 8,
    provinceName: "Tehran",
    road: 101,
    roadName: "Hemmat Expressway",
    source: 1,
    sourceName: "Traffic cameras",
  },
  {
    id: 1002,
    name: "Azadi tower approach",
    lat: "35.6997",
    long: "51.3381",
    province: 8,
    provinceName: "Tehran",
    road: 102,
    roadName: "Azadi Square",
    source: 1,
    sourceName: "Traffic cameras",
  },
  {
    id: 1003,
    name: "Vanak square north",
    lat: "35.7578",
    long: "51.4103",
    province: 8,
    provinceName: "Tehran",
    road: 103,
    roadName: "Valiasr St",
    source: 2,
    sourceName: "Mobile units",
  },
  {
    id: 1004,
    name: "Enghelab — eastbound",
    lat: "35.7008",
    long: "51.3912",
    province: 8,
    provinceName: "Tehran",
    road: 104,
    roadName: "Enghelab St",
    source: 1,
    sourceName: "Traffic cameras",
  },
  {
    id: 1005,
    name: "Tajrish interchange",
    lat: "35.8044",
    long: "51.4256",
    province: 8,
    provinceName: "Tehran",
    road: 105,
    roadName: "Velenjak",
    source: 2,
    sourceName: "Mobile units",
  },
  {
    id: 1006,
    name: "Resalat tunnel exit",
    lat: "35.7312",
    long: "51.4821",
    province: 8,
    provinceName: "Tehran",
    road: 106,
    roadName: "Resalat Hwy",
    source: 1,
    sourceName: "Traffic cameras",
  },
] as const;

export const ROUTE_ORIGIN: Point = [35.7442, 51.3754];
export const ROUTE_DESTINATION: Point = [35.6997, 51.3381];

export const ROUTE_POLYLINE: Point[] = [
  ROUTE_ORIGIN,
  [35.7381, 51.3682],
  [35.7294, 51.3598],
  [35.7186, 51.3512],
  [35.7089, 51.3445],
  ROUTE_DESTINATION,
];
