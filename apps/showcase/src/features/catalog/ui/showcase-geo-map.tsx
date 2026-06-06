import { useEffect, useState, type ComponentProps } from "react";
import * as echarts from "echarts";
import GeoMapChart from "@/components/common/charts/map/geo-map";
import type { GeoMapDataItem } from "@/components/common/charts/map/geo-map";
import { cn } from "@/lib";

type GeoJson = Parameters<typeof echarts.registerMap>[1];

type ShowcaseGeoMapProps<D extends readonly GeoMapDataItem[]> = {
  geoPath: string;
  mapId: string;
  data: D;
  className?: string;
  heightClass?: string;
  rangeText?: [string, string];
  showLabel?: boolean;
  roam?: boolean;
  aspectScale?: number;
} & Omit<ComponentProps<typeof GeoMapChart<D>>, "mapId" | "geoJson" | "data">;

export function ShowcaseGeoMap<const D extends readonly GeoMapDataItem[]>({
  geoPath,
  mapId,
  data,
  className,
  heightClass = "h-full",
  ...props
}: ShowcaseGeoMapProps<D>) {
  const [geoJson, setGeoJson] = useState<GeoJson | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setGeoJson(null);
    setError(false);

    fetch(geoPath)
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
  }, [geoPath]);

  if (error) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground",
          heightClass,
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
        className={cn("animate-pulse rounded-lg bg-muted/60", heightClass, className)}
      />
    );
  }

  return (
    <GeoMapChart
      mapId={mapId}
      geoJson={geoJson}
      data={data}
      className={className}
      {...props}
    />
  );
}
