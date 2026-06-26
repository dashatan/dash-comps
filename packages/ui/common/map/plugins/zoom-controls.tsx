"use client";

import MapControlButton from "@/components/common/map/controls/control-button";
import MapControlButtonGroup from "@/components/common/map/controls/control-button-group";
import {
  useLeafletMap,
  useLeafletMapReady,
} from "@/components/common/map/context";
import { cn, useLanguage } from "@/lib";
import { Minus, Plus } from "lucide-react";

export type MapZoomControlsProps = {
  className?: string;
};

export function MapZoomControls({ className }: MapZoomControlsProps) {
  const { t } = useLanguage();
  const map = useLeafletMap();
  const isReady = useLeafletMapReady();

  if (!isReady || !map) return null;

  return (
    <div
      className={cn(
        "pointer-events-auto absolute top-1/2 left-4 z-999 flex w-16 -translate-y-1/2 flex-col gap-2 p-2",
        className,
      )}
    >
      <MapControlButtonGroup>
        <MapControlButton
          onClick={() => map.zoomIn()}
          tooltip={t("common.zoomIn")}
        >
          <Plus className="size-6" />
        </MapControlButton>
        <MapControlButton
          onClick={() => map.zoomOut()}
          tooltip={t("common.zoomOut")}
        >
          <Minus className="size-6" />
        </MapControlButton>
      </MapControlButtonGroup>
    </div>
  );
}
