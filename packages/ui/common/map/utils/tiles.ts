import type { MapTheme, MapTiles } from "@/components/common/map/types";

export function resolveTileUrl(tiles: MapTiles, theme: MapTheme = "light"): string {
  if (typeof tiles === "string") return tiles;
  if (theme === "dark" && tiles.dark) return tiles.dark;
  return tiles.light;
}
