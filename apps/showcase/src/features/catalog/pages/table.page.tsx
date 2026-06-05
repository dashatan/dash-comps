import { useShowcasePage } from "@/features/catalog/i18n";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";

export function TablePage() {
  const p = useShowcasePage("table");

  return (
    <CatalogPageShell slug="table">
      <ShowcaseSection
        title={p("compoundTable.title")}
        className="flex-col items-start"
      >
        <p className="text-muted-foreground max-w-2xl text-sm">
          {p("compoundTable.description.dataTable")}{" "}
          <code className="text-foreground">@/components/compound/table</code>{" "}
          {p("compoundTable.description.expectsConfig")}
        </p>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
