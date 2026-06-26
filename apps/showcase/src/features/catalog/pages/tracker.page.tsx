import { useShowcasePage } from "@/features/catalog/i18n";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";
import {
  observeEventsSample,
  TRACKER_MAP_ENV,
} from "@/features/catalog/data/tracker-samples";
import { appStore } from "@/store";
import { Tracker } from "@/components/compound/tracker-legacy";

appStore.getState().setEnv(TRACKER_MAP_ENV);

const LEGACY_MAP_TILES = {
  light: TRACKER_MAP_ENV.MAP_TILE_LIGHT,
  dark: TRACKER_MAP_ENV.MAP_TILE_DARK,
} as const;

export function TrackerPage() {
  const p = useShowcasePage("tracker");

  return (
    <CatalogPageShell slug="tracker">
      <ShowcaseSection
        title={p("compoundTracker.title")}
        className="flex-col items-start"
      >
        <p className="text-sm text-muted-foreground">
          {p("compoundTracker.description.vehicleTracker")}{" "}
          <code className="text-foreground">
            @/components/compound/tracker-legacy
          </code>{" "}
          {p("compoundTracker.description.dependsOnData")}{" "}
          <code className="text-foreground">packages/ui</code>.
        </p>
      </ShowcaseSection>

      <div className="h-[600px] w-full overflow-hidden rounded-xl border border-border bg-muted/10">
        <Tracker
          events={observeEventsSample.events}
          mapTiles={LEGACY_MAP_TILES}
          className="h-full"
        />
      </div>
    </CatalogPageShell>
  );
}
