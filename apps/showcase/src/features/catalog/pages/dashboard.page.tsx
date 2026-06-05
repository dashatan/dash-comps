import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";
import { useShowcasePage } from "@/features/catalog/i18n";

export function DashboardPage() {
  const p = useShowcasePage("dashboard");

  return (
    <CatalogPageShell slug="dashboard">
      <ShowcaseSection title={p("dashboardLayout.title")} className="flex-col items-start">
        <p className="text-muted-foreground max-w-2xl text-sm">
          {p("dashboardLayout.descriptionPrefix")}
          <code className="text-foreground">@/components/layout/dashboard</code>
          {p("dashboardLayout.descriptionMiddle")}
          <code className="text-foreground">md</code>
          {p("dashboardLayout.descriptionSuffix")}
        </p>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
