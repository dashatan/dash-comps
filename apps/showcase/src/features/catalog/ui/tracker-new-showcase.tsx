"use client";

import { useEffect, useMemo, useState } from "react";
import {
  TrackerNew,
  TrackerNewProvider,
  type TrackerInput,
  type TrackerOptions,
} from "@/components/compound/tracker-new";
import Switch from "@/components/common/inputs/switch/switch";
import {
  fleetTracksSample,
  fullTracksSample,
  observeEventsSample,
  TRACKER_MAP_ENV,
} from "@/features/catalog/data/tracker-samples";
import { appStore } from "@/store";
import { cn } from "@/lib";

function TrackerFrame({
  label,
  description,
  children,
  className,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-2", className)}>
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{label}</p>
      {description ? <p className="text-muted-foreground text-xs">{description}</p> : null}
      <div className="border-border bg-muted/10 h-[600px] w-full overflow-hidden rounded-xl border">
        {children}
      </div>
    </div>
  );
}

const FLEET_PRESET_OPTIONS = { preset: "fleet" } as const;
const OBSERVE_PRESET_OPTIONS = { preset: "observe" } as const;
const FULL_PRESET_OPTIONS = { preset: "full" } as const;

function PresetDemo({
  label,
  description,
  input,
  options,
}: {
  label: string;
  description?: string;
  input: TrackerInput;
  options?: TrackerOptions;
}) {
  return (
    <TrackerFrame label={label} description={description}>
      <TrackerNewProvider input={input} options={options}>
        <TrackerNew className="h-full" />
      </TrackerNewProvider>
    </TrackerFrame>
  );
}

type PlaygroundState = {
  preset: TrackerOptions["preset"];
  mapEngine: NonNullable<TrackerOptions["map"]>["engine"];
  routeMode: NonNullable<TrackerOptions["route"]>["mode"];
  playbackMode: NonNullable<TrackerOptions["playback"]>["mode"];
  eventsPanel: NonNullable<TrackerOptions["panels"]>["events"];
  filterIran: boolean;
  traceLength: number;
  perTrack: boolean;
  timelineTotal: boolean;
  timelineDay: boolean;
  plateLegend: boolean;
  emphasizes: boolean;
  inputKind: "tracks" | "events";
};

const DEFAULT_PLAYGROUND: PlaygroundState = {
  preset: "custom",
  mapEngine: "maplibre",
  routeMode: "direct",
  playbackMode: "event",
  eventsPanel: "unified",
  filterIran: true,
  traceLength: 15,
  perTrack: true,
  timelineTotal: true,
  timelineDay: true,
  plateLegend: true,
  emphasizes: true,
  inputKind: "tracks",
};

export function TrackerNewPresets({ labels }: { labels: Record<string, string> }) {
  useEffect(() => {
    appStore.getState().setEnv(TRACKER_MAP_ENV);
  }, []);

  return (
    <div className="grid w-full gap-6 lg:grid-cols-1">
      <PresetDemo
        label={labels.fleetTitle}
        description={labels.fleetDescription}
        input={fleetTracksSample}
        options={FLEET_PRESET_OPTIONS}
      />
      <PresetDemo
        label={labels.observeTitle}
        description={labels.observeDescription}
        input={observeEventsSample}
        options={OBSERVE_PRESET_OPTIONS}
      />
      <PresetDemo
        label={labels.fullTitle}
        description={labels.fullDescription}
        input={fullTracksSample}
        options={FULL_PRESET_OPTIONS}
      />
    </div>
  );
}

export function TrackerNewPlayground({ labels }: { labels: Record<string, string> }) {
  const [state, setState] = useState<PlaygroundState>(DEFAULT_PLAYGROUND);

  useEffect(() => {
    appStore.getState().setEnv(TRACKER_MAP_ENV);
  }, []);

  const input = useMemo(
    (): TrackerInput => (state.inputKind === "tracks" ? fleetTracksSample : observeEventsSample),
    [state.inputKind],
  );

  const options = useMemo(
    (): TrackerOptions => ({
      preset: state.preset,
      map: { engine: state.mapEngine, autoPan: true, autoPanMaxZoom: 8 },
      route: {
        mode: state.routeMode,
        direct: { perTrack: state.perTrack, traceLength: state.traceLength },
      },
      playback: { mode: state.playbackMode, initToFirstEvent: true },
      timeline: {
        total: state.timelineTotal,
        day: state.timelineDay ? { showPerTrackRows: true } : false,
        plateLegend: state.plateLegend,
      },
      panels: {
        events: state.eventsPanel,
        emphasizes: state.emphasizes,
        settings: true,
      },
      geo: {
        filterIran: state.filterIran,
        emphasize: { enabled: state.emphasizes, mapCircles: true, timelineBands: true },
      },
      data: { useWorker: state.inputKind === "tracks", inputKind: state.inputKind },
    }),
    [state],
  );

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="border-border bg-muted/20 grid gap-4 rounded-xl border p-4 md:grid-cols-2 lg:grid-cols-3">
        <PlaygroundSelect
          label={labels.inputKind}
          value={state.inputKind}
          onChange={(value) => setState((s) => ({ ...s, inputKind: value as "tracks" | "events" }))}
          options={[
            { label: labels.tracksInput, value: "tracks" },
            { label: labels.eventsInput, value: "events" },
          ]}
        />
        <PlaygroundSelect
          label={labels.mapEngine}
          value={state.mapEngine ?? "maplibre"}
          onChange={(value) =>
            setState((s) => ({ ...s, mapEngine: value as PlaygroundState["mapEngine"] }))
          }
          options={[
            { label: "MapLibre", value: "maplibre" },
            { label: "Leaflet", value: "leaflet" },
          ]}
        />
        <PlaygroundSelect
          label={labels.routeMode}
          value={state.routeMode ?? "direct"}
          onChange={(value) =>
            setState((s) => ({ ...s, routeMode: value as PlaygroundState["routeMode"] }))
          }
          options={[
            { label: labels.routeNone, value: "none" },
            { label: labels.routeDirect, value: "direct" },
            { label: labels.routeOsrm, value: "osrm" },
          ]}
        />
        <PlaygroundSelect
          label={labels.playbackMode}
          value={state.playbackMode ?? "event"}
          onChange={(value) =>
            setState((s) => ({ ...s, playbackMode: value as PlaygroundState["playbackMode"] }))
          }
          options={[
            { label: labels.playbackEvent, value: "event" },
            { label: labels.playbackTime, value: "time" },
          ]}
        />
        <PlaygroundSelect
          label={labels.eventsPanel}
          value={String(state.eventsPanel ?? "unified")}
          onChange={(value) =>
            setState((s) => ({
              ...s,
              eventsPanel: (value === "false" ? false : value) as PlaygroundState["eventsPanel"],
            }))
          }
          options={[
            { label: labels.panelOff, value: "false" },
            { label: labels.panelFleet, value: "fleet" },
            { label: labels.panelObserve, value: "observe" },
            { label: labels.panelUnified, value: "unified" },
          ]}
        />
        <PlaygroundNumber
          label={labels.traceLength}
          value={state.traceLength}
          onChange={(traceLength) => setState((s) => ({ ...s, traceLength }))}
        />
        <PlaygroundRow label={labels.filterIran}>
          <Switch
            active={state.filterIran}
            onChange={(filterIran) => setState((s) => ({ ...s, filterIran }))}
          />
        </PlaygroundRow>
        <PlaygroundRow label={labels.perTrack}>
          <Switch active={state.perTrack} onChange={(perTrack) => setState((s) => ({ ...s, perTrack }))} />
        </PlaygroundRow>
        <PlaygroundRow label={labels.timelineTotal}>
          <Switch
            active={state.timelineTotal}
            onChange={(timelineTotal) => setState((s) => ({ ...s, timelineTotal }))}
          />
        </PlaygroundRow>
        <PlaygroundRow label={labels.timelineDay}>
          <Switch
            active={state.timelineDay}
            onChange={(timelineDay) => setState((s) => ({ ...s, timelineDay }))}
          />
        </PlaygroundRow>
        <PlaygroundRow label={labels.plateLegend}>
          <Switch
            active={state.plateLegend}
            onChange={(plateLegend) => setState((s) => ({ ...s, plateLegend }))}
          />
        </PlaygroundRow>
        <PlaygroundRow label={labels.emphasizes}>
          <Switch
            active={state.emphasizes}
            onChange={(emphasizes) => setState((s) => ({ ...s, emphasizes }))}
          />
        </PlaygroundRow>
      </div>
      <TrackerFrame label={labels.livePreview}>
        <TrackerNewProvider key={JSON.stringify({ state, input: input.kind })} input={input} options={options}>
          <TrackerNew className="h-full" />
        </TrackerNewProvider>
      </TrackerFrame>
    </div>
  );
}

function PlaygroundRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2 text-sm">
      <span>{label}</span>
      {children}
    </div>
  );
}

function PlaygroundSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-muted-foreground text-xs">{label}</span>
      <select
        className="border-border bg-background rounded-md border px-2 py-1.5 text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function PlaygroundNumber({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-muted-foreground text-xs">{label}</span>
      <input
        type="number"
        className="border-border bg-background rounded-md border px-2 py-1.5 text-sm"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}
