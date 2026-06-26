import { useShowcasePage } from "@/features/catalog/i18n";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";
import {
  TrackerNewPlayground,
  TrackerNewPresets,
} from "@/features/catalog/ui/tracker-new-showcase";
import Tracker from "@dash/ui/compound/tracker-new/tracker";

export function TrackerPage() {
  const p = useShowcasePage("tracker");

  const presetLabels = {
    fleetTitle: p("trackerNew.presets.fleet.title"),
    fleetDescription: p("trackerNew.presets.fleet.description"),
    observeTitle: p("trackerNew.presets.observe.title"),
    observeDescription: p("trackerNew.presets.observe.description"),
    fullTitle: p("trackerNew.presets.full.title"),
    fullDescription: p("trackerNew.presets.full.description"),
  };

  const playgroundLabels = {
    inputKind: p("trackerNew.playground.inputKind"),
    tracksInput: p("trackerNew.playground.tracksInput"),
    eventsInput: p("trackerNew.playground.eventsInput"),
    mapEngine: p("trackerNew.playground.mapEngine"),
    routeMode: p("trackerNew.playground.routeMode"),
    routeNone: p("trackerNew.playground.routeNone"),
    routeDirect: p("trackerNew.playground.routeDirect"),
    routeOsrm: p("trackerNew.playground.routeOsrm"),
    playbackMode: p("trackerNew.playground.playbackMode"),
    playbackEvent: p("trackerNew.playground.playbackEvent"),
    playbackTime: p("trackerNew.playground.playbackTime"),
    eventsPanel: p("trackerNew.playground.eventsPanel"),
    panelOff: p("trackerNew.playground.panelOff"),
    panelFleet: p("trackerNew.playground.panelFleet"),
    panelObserve: p("trackerNew.playground.panelObserve"),
    panelUnified: p("trackerNew.playground.panelUnified"),
    traceLength: p("trackerNew.playground.traceLength"),
    filterIran: p("trackerNew.playground.filterIran"),
    perTrack: p("trackerNew.playground.perTrack"),
    timelineTotal: p("trackerNew.playground.timelineTotal"),
    timelineDay: p("trackerNew.playground.timelineDay"),
    plateLegend: p("trackerNew.playground.plateLegend"),
    emphasizes: p("trackerNew.playground.emphasizes"),
    livePreview: p("trackerNew.playground.livePreview"),
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

      <Tracker />
    </CatalogPageShell>
  );
}
