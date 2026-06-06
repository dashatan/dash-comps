"use client";

import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import { useCallback, useState } from "react";
import { Pentagon, Square } from "lucide-react";
import MapControlButton from "@/components/common/map/controls/control-button";
import MapControlButtonGroup from "@/components/common/map/controls/control-button-group";
import { useGeomanCreate } from "@/components/common/map/hooks/use-geoman-create";
import { useGeomanDraw } from "@/components/common/map/hooks/use-geoman-draw";
import { useLeafletMapReady } from "@/components/common/map/context";
import type { GeomanCreateEvent, GeomanShape } from "@/components/common/map/types";
import { cn, useLanguage } from "@/lib";
import type { TranslationKeys } from "@/lib/language/locales";
import type L from "leaflet";

type GeomanControlShape = Extract<GeomanShape, "Polygon" | "Rectangle">;

const SHAPE_CONTROLS: Record<
  GeomanControlShape,
  { icon: typeof Square; tooltip: TranslationKeys }
> = {
  Polygon: { icon: Pentagon, tooltip: "map.geoman.polygon" },
  Rectangle: { icon: Square, tooltip: "map.geoman.rectangle" },
};

export type MapGeomanControlsProps = {
  shapes?: GeomanShape[];
  drawPathOptions?: L.PathOptions;
  onCreate?: (event: GeomanCreateEvent) => void;
  className?: string;
};

export function MapGeomanControls({
  shapes = ["Polygon", "Rectangle"],
  drawPathOptions,
  onCreate,
  className,
}: MapGeomanControlsProps) {
  const { t } = useLanguage();
  const isReady = useLeafletMapReady();
  const [activeShape, setActiveShape] = useState<GeomanShape | undefined>();

  useGeomanDraw(activeShape, { pathOptions: drawPathOptions, tooltips: false });

  const handleCreate = useCallback(
    (event: GeomanCreateEvent) => {
      setActiveShape(undefined);
      onCreate?.(event);
    },
    [onCreate],
  );

  useGeomanCreate(handleCreate);

  if (!isReady) return null;

  return (
    <div
      className={cn(
        "pointer-events-auto absolute top-1/2 left-24 z-999 flex w-16 -translate-y-1/2 flex-col gap-2 p-2",
        className,
      )}
    >
      <MapControlButtonGroup>
        {shapes.map((shape) => {
          const control = SHAPE_CONTROLS[shape as GeomanControlShape];
          if (!control) return null;
          const { icon: Icon, tooltip } = control;
          const isActive = activeShape === shape;
          return (
            <MapControlButton
              key={shape}
              onClick={() => setActiveShape((prev) => (prev === shape ? undefined : shape))}
              tooltip={t(tooltip)}
              className={cn(isActive && "bg-primary text-primary-foreground hover:bg-primary")}
            >
              <Icon className="size-6" />
            </MapControlButton>
          );
        })}
      </MapControlButtonGroup>
    </div>
  );
}
