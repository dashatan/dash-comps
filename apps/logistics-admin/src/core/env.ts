export const API_BASE_URL = import.meta.env.VITE_API_URL ?? "/api";

export const TRACKER_MAP_ENV = {
  MAP_TILE_LIGHT: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  MAP_TILE_DARK:
    "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  OSRM_URL: "https://router.project-osrm.org",
} as const;

export const LEGACY_MAP_TILES = {
  light: TRACKER_MAP_ENV.MAP_TILE_LIGHT,
  dark: TRACKER_MAP_ENV.MAP_TILE_DARK,
} as const;
