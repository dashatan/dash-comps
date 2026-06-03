import { GridContainer } from "@/components/common/grid";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";

export function GridPage() {
  return (
    <CatalogPageShell slug="grid">
      <ShowcaseSection title="3 columns" className="w-full">
        <GridContainer className="grid w-full max-w-lg grid-cols-3 gap-2">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="bg-muted rounded-md p-3 text-center text-sm">
              {i + 1}
            </div>
          ))}
        </GridContainer>
      </ShowcaseSection>
      <ShowcaseSection title="Responsive spans" delay={0.05} className="w-full">
        <GridContainer className="grid w-full max-w-lg grid-cols-4 gap-2">
          <div className="bg-primary/20 col-span-2 rounded-md p-3 text-sm">Span 2</div>
          <div className="bg-primary/20 rounded-md p-3 text-sm">1</div>
          <div className="bg-primary/20 rounded-md p-3 text-sm">1</div>
        </GridContainer>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
