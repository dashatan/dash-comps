import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";

export function TrackerPage() {
  return (
    <CatalogPageShell slug="tracker">
      <ShowcaseSection title="Tracker compound" className="flex-col items-start">
        <p className="text-muted-foreground max-w-2xl text-sm">
          Vehicle tracker UI is in{" "}
          <code className="text-foreground">@/components/compound/tracker</code> (map routes, event
          cards, clustering). It depends on live tracking data. Explore Map and Charts pages for
          standalone pieces from <code className="text-foreground">packages/ui</code>.
        </p>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
