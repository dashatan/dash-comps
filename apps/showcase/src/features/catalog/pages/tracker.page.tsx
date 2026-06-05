import { useShowcasePage } from "@/features/catalog/i18n";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";

export function TrackerPage() {
  const p = useShowcasePage("tracker");

  return (
    <CatalogPageShell slug="tracker">
      <ShowcaseSection
        title={p("compoundTracker.title")}
        className="flex-col items-start"
      >
        <p className="text-muted-foreground max-w-2xl text-sm">
          {p("compoundTracker.description.vehicleTracker")}{" "}
          <code className="text-foreground">@/components/compound/tracker</code>{" "}
          {p("compoundTracker.description.dependsOnData")}{" "}
          <code className="text-foreground">packages/ui</code>.
        </p>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
