import type {
  TrackerOptions,
  ResolvedTrackerOptions,
} from "@/components/compound/tracker/types";
import {
  DEFAULT_CENTER,
  DEFAULT_PLAY_SPEED_PRESETS,
  SIDEBAR_WIDTH,
  TRACKER_PRESETS,
} from "@/components/compound/tracker/options/presets";

function deepMerge<T extends Record<string, unknown>>(
  base: T,
  patch?: Partial<T>,
): T {
  if (!patch) return { ...base };
  const result = { ...base } as T;
  for (const key of Object.keys(patch) as (keyof T)[]) {
    const patchVal = patch[key];
    const baseVal = base[key];
    if (
      patchVal &&
      typeof patchVal === "object" &&
      !Array.isArray(patchVal) &&
      baseVal &&
      typeof baseVal === "object" &&
      !Array.isArray(baseVal)
    ) {
      result[key] = deepMerge(
        baseVal as Record<string, unknown>,
        patchVal as Record<string, unknown>,
      ) as T[keyof T];
    } else if (patchVal !== undefined) {
      result[key] = patchVal as T[keyof T];
    }
  }
  return result;
}

export function resolveTrackerOptions(
  options?: TrackerOptions,
): ResolvedTrackerOptions {
  const preset = options?.preset ?? "custom";
  const presetBase =
    preset !== "custom" && preset in TRACKER_PRESETS
      ? TRACKER_PRESETS[preset as keyof typeof TRACKER_PRESETS]
      : {};

  const merged = deepMerge(presetBase as TrackerOptions, options);

  return {
    preset: merged.preset ?? "custom",
    map: {
      engine: merged.map?.engine ?? "maplibre",
      rtlSupport: merged.map?.rtlSupport ?? true,
      tiles: merged.map?.tiles ?? { light: "", dark: "" },
      controls: {
        zoom: merged.map?.controls?.zoom ?? true,
        compass: merged.map?.controls?.compass ?? true,
        fullscreen: merged.map?.controls?.fullscreen ?? true,
      },
      autoPan: merged.map?.autoPan ?? true,
      autoPanMaxZoom: merged.map?.autoPanMaxZoom ?? 8,
      autoPanPadding: merged.map?.autoPanPadding ?? {
        left: 300,
        top: 40,
        right: 40,
        bottom: 40,
      },
      center: merged.map?.center ?? DEFAULT_CENTER,
      defaultZoom: merged.map?.defaultZoom ?? 7,
    },
    route: {
      mode: merged.route?.mode ?? "direct",
      direct: {
        perTrack: merged.route?.direct?.perTrack ?? true,
        traceLength: merged.route?.direct?.traceLength ?? 15,
        showIntermediatePoints:
          merged.route?.direct?.showIntermediatePoints ?? true,
        lineWeight: merged.route?.direct?.lineWeight ?? 4,
      },
      osrm: {
        url: merged.route?.osrm?.url ?? "",
        animatePassedSegment: merged.route?.osrm?.animatePassedSegment ?? true,
        animateMovingMarker: merged.route?.osrm?.animateMovingMarker ?? true,
        chunkSize: merged.route?.osrm?.chunkSize ?? 100,
      },
      colors: {
        base: merged.route?.colors?.base ?? "--color-primary",
        passed: merged.route?.colors?.passed ?? "--color-foreground",
      },
    },
    playback: {
      mode: merged.playback?.mode ?? "event",
      autoPlay: merged.playback?.autoPlay ?? false,
      loop: merged.playback?.loop ?? false,
      initToFirstEvent: merged.playback?.initToFirstEvent ?? true,
      speed: {
        eventIntervalMs: merged.playback?.speed?.eventIntervalMs ?? 1000,
        timeMultiplier: merged.playback?.speed?.timeMultiplier ?? 1,
        timeStepMultiplier: merged.playback?.speed?.timeStepMultiplier ?? 1,
        presets: merged.playback?.speed?.presets ?? [
          ...DEFAULT_PLAY_SPEED_PRESETS,
        ],
      },
    },
    timeline: {
      total: merged.timeline?.total ?? false,
      day: merged.timeline?.day ?? false,
      plateLegend: merged.timeline?.plateLegend ?? false,
    },
    panels: {
      events: merged.panels?.events ?? "unified",
      emphasizes:
        merged.panels?.emphasizes ??
        (merged.geo?.emphasize?.enabled !== false && preset !== "observe"),
      settings:
        merged.panels?.settings ??
        (typeof merged.panels?.settings === "object"
          ? merged.panels.settings
          : merged.panels?.settings !== false),
      sidebarWidth: merged.panels?.sidebarWidth ?? SIDEBAR_WIDTH,
      playerHeight: merged.panels?.playerHeight ?? "auto",
      eventNavigation: {
        prevNext: merged.panels?.eventNavigation?.prevNext ?? true,
        firstLast: merged.panels?.eventNavigation?.firstLast ?? true,
        scrollSync: merged.panels?.eventNavigation?.scrollSync ?? true,
      },
    },
    geo: {
      filterIran: merged.geo?.filterIran ?? true,
      showOutsideIranBadge: merged.geo?.showOutsideIranBadge ?? true,
      emphasize: {
        enabled: merged.geo?.emphasize?.enabled ?? false,
        mapCircles: merged.geo?.emphasize?.mapCircles ?? true,
        circleRadius: merged.geo?.emphasize?.circleRadius ?? 120,
        timelineBands: merged.geo?.emphasize?.timelineBands ?? true,
        panel: merged.geo?.emphasize?.panel ?? true,
      },
    },
    markers: {
      headStyle: merged.markers?.headStyle ?? "arrow",
      headRotation: merged.markers?.headRotation ?? "bearing",
      showHeadTooltip: merged.markers?.showHeadTooltip ?? true,
      tooltipContent: merged.markers?.tooltipContent ?? "simple",
      perEventMarkers: merged.markers?.perEventMarkers ?? true,
      activeEventHighlight: merged.markers?.activeEventHighlight ?? true,
    },
    data: {
      useWorker: merged.data?.useWorker ?? true,
      inputKind: merged.data?.inputKind ?? "auto",
      normalizeTimes: merged.data?.normalizeTimes ?? true,
      extendDateRangeToEvents: merged.data?.extendDateRangeToEvents ?? true,
    },
    performance: {
      lazyMapEngine: merged.performance?.lazyMapEngine ?? true,
      scrubDebounceMs: merged.performance?.scrubDebounceMs ?? 0,
      mapUpdateStrategy: merged.performance?.mapUpdateStrategy ?? "incremental",
    },
  };
}
