import type { StyleSpecification } from "maplibre-gl";

function normalizeRasterTileUrl(tileUrl: string) {
  return tileUrl.replace(/\{s\}/g, "a").replace(/\{r\}/g, "");
}

function isStyleJsonUrl(tileUrl: string) {
  return tileUrl.endsWith(".json") || tileUrl.includes("style.json");
}

export function resolveMapStyle(tileUrl: string): string | StyleSpecification {
  if (!tileUrl) return tileUrl;
  if (isStyleJsonUrl(tileUrl)) return tileUrl;

  const tile = normalizeRasterTileUrl(tileUrl);

  return {
    version: 8,
    sources: {
      "tracker-raster-tiles": {
        type: "raster",
        tiles: [tile],
        tileSize: 256,
        attribution: "© OpenStreetMap contributors",
      },
    },
    layers: [
      {
        id: "tracker-raster-layer",
        type: "raster",
        source: "tracker-raster-tiles",
        minzoom: 0,
        maxzoom: 22,
      },
    ],
  };
}
