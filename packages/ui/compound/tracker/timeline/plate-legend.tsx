"use client";

import ColorField, { colors, getColor } from "@dash/ui/common/badge/color";
import { useTrackerStore } from "@dash/ui/compound/tracker/store/hooks";
import type { PlateInputValue } from "@dash/ui/compound/tracker/types/input";

function formatPlate(plate?: PlateInputValue) {
  return (
    [plate?.p1, plate?.p2, plate?.p3, plate?.p4].filter(Boolean).join(" ") ||
    "—"
  );
}

export default function PlateLegend() {
  const tracks = useTrackerStore((s) => s.tracks);
  if (!tracks.length) return null;

  return (
    <div className="flex flex-col gap-2 border-s border-border p-2">
      <div className="h-10 border-y border-transparent" />
      {tracks.map((track, i) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          <span className="min-w-24">{formatPlate(track.plate)}</span>
          <ColorField color={getColor(colors[i % colors.length])} />
        </div>
      ))}
    </div>
  );
}
