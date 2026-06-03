import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";

export function LocationPickerPage() {
  return (
    <CatalogPageShell slug="location-picker">
      <ShowcaseSection title="Location picker" className="flex-col items-start">
        <p className="text-muted-foreground max-w-2xl text-sm">
          Import from{" "}
          <code className="text-foreground">@/components/compound/location-picker</code>. It
          requires backend device/location resources and dashboard menu stubs. See the Map page for{" "}
          <code className="text-foreground">@/components/common/map</code> building blocks.
        </p>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
