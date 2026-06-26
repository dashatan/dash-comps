import { useEffect, useState, type ComponentProps } from "react";
import * as echarts from "echarts";
import GeoMapChart from "@/components/common/charts/map/geo-map";
import type { GeoMapDataItem } from "@/components/common/charts/map/geo-map";
import { getHexColor } from "@/lib/utils";
import { cn } from "@/lib";

const EU_GEO_JSON_PATH = "/charts/geo/world.json";

/** Approximate geographic center of the EU operating area. */
const EU_MAP_CENTER: [number, number] = [12, 52];

type GeoJson = Parameters<typeof echarts.registerMap>[1];

type LogisticsGeoMapProps<D extends readonly GeoMapDataItem[]> = {
  data: D;
  className?: string;
  rangeText?: [string, string];
  showLabel?: boolean;
  roam?: boolean;
} & Omit<
  ComponentProps<typeof GeoMapChart<D>>,
  | "mapId"
  | "geoJson"
  | "data"
  | "aspectScale"
  | "center"
  | "zoom"
  | "layoutCenter"
  | "layoutSize"
>;

function logisticsMapRangeColors() {
  return [
    getHexColor("--color-chart-range-2"),
    getHexColor("--color-chart-range-3"),
    getHexColor("--color-chart-range-4"),
    getHexColor("--color-chart-range-5"),
    getHexColor("--color-chart-range-6"),
    getHexColor("--color-chart-range-7"),
  ];
}

export function LogisticsGeoMap<const D extends readonly GeoMapDataItem[]>({
  data,
  className,
  rangeText,
  roam = true,
  showLabel = false,
  ...props
}: LogisticsGeoMapProps<D>) {
  const [geoJson, setGeoJson] = useState<GeoJson | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setGeoJson(null);
    setError(false);

    fetch(EU_GEO_JSON_PATH)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to load map");
        return response.json() as Promise<GeoJson>;
      })
      .then((json) => {
        if (!cancelled) setGeoJson(json);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <div
        className={cn(
          "flex h-full items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground",
          className,
        )}
      >
        Map failed to load
      </div>
    );
  }

  if (!geoJson) {
    return (
      <div
        className={cn("h-full animate-pulse rounded-lg bg-muted/60", className)}
      />
    );
  }

  return (
    <GeoMapChart
      mapId="logistics-eu"
      geoJson={geoJson}
      data={data}
      rangeText={rangeText}
      rangeColors={logisticsMapRangeColors()}
      defaultAreaColor={getHexColor("--color-chart-range-1")}
      borderColor={getHexColor("--color-chart-range-4")}
      aspectScale={0.75}
      center={EU_MAP_CENTER}
      zoom={3.6}
      layoutCenter={["50%", "46%"]}
      layoutSize="82%"
      roam={roam}
      showLabel={showLabel}
      className={className}
      grid={{ top: 4, bottom: 56, left: 8, right: 8 }}
      {...props}
    />
  );
}
