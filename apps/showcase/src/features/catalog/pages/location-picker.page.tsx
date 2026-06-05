import { useShowcasePage } from "@/features/catalog/i18n";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";

export function LocationPickerPage() {
  const p = useShowcasePage("location-picker");

  return (
    <CatalogPageShell slug="location-picker">
      <ShowcaseSection
        title={p("locationPicker.title")}
        className="flex-col items-start"
      >
        <p className="text-muted-foreground max-w-2xl text-sm">
          {p("description.importFrom")}{" "}
          <code className="text-foreground">@/components/compound/location-picker</code>
          {p("description.requiresBackend")}{" "}
          <code className="text-foreground">@/components/common/map</code>{" "}
          {p("description.mapBlocks")}
        </p>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
