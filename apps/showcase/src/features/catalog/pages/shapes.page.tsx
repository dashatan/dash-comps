import IndicatorShape from "@/components/common/shapes/indicator";
import Square from "@/components/common/shapes/square";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";

export function ShapesPage() {
  return (
    <CatalogPageShell slug="shapes">
      <ShowcaseSection title="Indicator">
        <IndicatorShape className="bg-success" />
        <IndicatorShape className="bg-warning" />
        <IndicatorShape className="bg-error" />
      </ShowcaseSection>
      <ShowcaseSection title="Square" delay={0.05}>
        <Square className="bg-primary size-4" />
        <Square className="bg-secondary size-6 rounded-sm" />
        <Square className="bg-muted-foreground size-8 rounded-md" />
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
