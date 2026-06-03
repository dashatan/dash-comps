import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";

export function TablePage() {
  return (
    <CatalogPageShell slug="table">
      <ShowcaseSection title="Compound table" className="flex-col items-start">
        <p className="text-muted-foreground max-w-2xl text-sm">
          The data table lives in{" "}
          <code className="text-foreground">@/components/compound/table</code> and expects app-level
          column config, filters, and API hooks. Use List, Pagination, and Inputs pages for related
          primitives; wire the full table in your app with real data sources.
        </p>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
