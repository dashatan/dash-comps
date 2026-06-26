"use client";

import { X } from "lucide-react";
import Switch from "@/components/common/inputs/switch/switch";
import { useSettingsSlice } from "@/components/compound/tracker/store/hooks";

export default function SettingsPanel() {
  const {
    showSettingsPanel,
    filterIran,
    autoPan,
    autoPanMaxZoom,
    traceLength,
    routeMode,
    mapEngine,
    mode,
    emphasizeRadius,
    patchSettings,
    toggleSettingsPanel,
    setMode,
  } = useSettingsSlice();

  if (!showSettingsPanel) return null;

  return (
    <div className="flex w-80 flex-col rounded-md border bg-muted/50 p-4 text-sm dir-rtl">
      <div className="mb-4 flex items-center justify-between border-b pb-2">
        <span className="font-bold">Settings</span>
        <button
          type="button"
          onClick={toggleSettingsPanel}
          className="rounded-md border border-border p-1"
        >
          <X className="size-4" />
        </button>
      </div>
      <div className="flex flex-col gap-3">
        <Row label="Playback by time">
          <Switch
            active={mode === "time"}
            onChange={(a) => setMode(a ? "time" : "event")}
          />
        </Row>
        <Row label="Filter Iran">
          <Switch
            active={filterIran}
            onChange={(a) => patchSettings({ filterIran: a })}
          />
        </Row>
        <Row label="Follow on map">
          <Switch
            active={autoPan}
            onChange={(a) => patchSettings({ autoPan: a })}
          />
        </Row>
        <Row label="Max pan zoom">
          <input
            type="number"
            className="w-20 rounded-md border border-border px-2 py-1"
            value={autoPanMaxZoom}
            onChange={(e) =>
              patchSettings({ autoPanMaxZoom: Number(e.target.value) })
            }
          />
        </Row>
        <Row label="Trail length">
          <input
            type="number"
            className="w-20 rounded-md border border-border px-2 py-1"
            value={traceLength}
            onChange={(e) =>
              patchSettings({ traceLength: Number(e.target.value) })
            }
          />
        </Row>
        <Row label="Emphasize radius">
          <input
            type="number"
            className="w-20 rounded-md border border-border px-2 py-1"
            value={emphasizeRadius}
            onChange={(e) =>
              patchSettings({ emphasizeRadius: Number(e.target.value) })
            }
          />
        </Row>
        <Row label="Route mode">
          <select
            className="rounded-md border border-border px-2 py-1"
            value={routeMode}
            onChange={(e) =>
              patchSettings({
                routeMode: e.target.value as "none" | "direct" | "osrm",
              })
            }
          >
            <option value="none">None</option>
            <option value="direct">Direct</option>
            <option value="osrm">OSRM</option>
          </select>
        </Row>
        <Row label="Map engine">
          <select
            className="rounded-md border border-border px-2 py-1"
            value={mapEngine}
            onChange={(e) =>
              patchSettings({
                mapEngine: e.target.value as "leaflet" | "maplibre",
              })
            }
          >
            <option value="maplibre">MapLibre</option>
            <option value="leaflet">Leaflet</option>
          </select>
        </Row>
      </div>
    </div>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span>{label}</span>
      {children}
    </div>
  );
}
