import { useEffect } from "react";
import { useShowcasePage } from "@/features/catalog/i18n";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";
import {
  TrackerPlayground,
  TrackerPresets,
} from "@/features/catalog/ui/tracker-showcase";
import {
  fleetTracksSample,
  TRACKER_MAP_ENV,
} from "@/features/catalog/data/tracker-samples";
import { appStore } from "@/store";
import { Tracker } from "@/components/compound/tracker";

export function TrackerPage() {
  const p = useShowcasePage("tracker");

  useEffect(() => {
    appStore.getState().setEnv(TRACKER_MAP_ENV);
  }, []);

  const presetLabels = {
    fleetTitle: p("presets.fleet.title"),
    fleetDescription: p("presets.fleet.description"),
    observeTitle: p("presets.observe.title"),
    observeDescription: p("presets.observe.description"),
    fullTitle: p("presets.full.title"),
    fullDescription: p("presets.full.description"),
  };

  const playgroundLabels = {
    inputKind: p("playground.inputKind"),
    tracksInput: p("playground.tracksInput"),
    eventsInput: p("playground.eventsInput"),
    mapEngine: p("playground.mapEngine"),
    routeMode: p("playground.routeMode"),
    routeNone: p("playground.routeNone"),
    routeDirect: p("playground.routeDirect"),
    routeOsrm: p("playground.routeOsrm"),
    playbackMode: p("playground.playbackMode"),
    playbackEvent: p("playground.playbackEvent"),
    playbackTime: p("playground.playbackTime"),
    eventsPanel: p("playground.eventsPanel"),
    panelOff: p("playground.panelOff"),
    panelFleet: p("playground.panelFleet"),
    panelObserve: p("playground.panelObserve"),
    panelUnified: p("playground.panelUnified"),
    traceLength: p("playground.traceLength"),
    filterIran: p("playground.filterIran"),
    perTrack: p("playground.perTrack"),
    timelineTotal: p("playground.timelineTotal"),
    timelineDay: p("playground.timelineDay"),
    plateLegend: p("playground.plateLegend"),
    emphasizes: p("playground.emphasizes"),
    livePreview: p("playground.livePreview"),
  };

  return (
    <CatalogPageShell slug="tracker">
      <ShowcaseSection
        title={p("compoundTracker.title")}
        className="flex-col items-start"
      >
        <p className="text-sm text-muted-foreground">
          {p("compoundTracker.description.vehicleTracker")}{" "}
          <code className="text-foreground">@/components/compound/tracker</code>{" "}
          {p("compoundTracker.description.dependsOnData")}{" "}
          <code className="text-foreground">packages/ui</code>.
        </p>
      </ShowcaseSection>

      <div className="border-border bg-muted/10 h-[600px] w-full overflow-hidden rounded-xl border">
        <Tracker
          input={fleetTracksSample}
          options={{ preset: "fleet" }}
          className="h-full"
        />
      </div>

      <ShowcaseSection title={p("presets.title")}>
        <TrackerPresets labels={presetLabels} />
      </ShowcaseSection>

      <ShowcaseSection
        title={p("playground.title")}
        description={p("playground.description")}
      >
        <TrackerPlayground labels={playgroundLabels} />
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
