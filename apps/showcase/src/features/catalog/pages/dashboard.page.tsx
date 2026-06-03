import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";

export function DashboardPage() {
  return (
    <CatalogPageShell slug="dashboard">
      <ShowcaseSection title="Dashboard layout" className="flex-col items-start">
        <p className="text-muted-foreground max-w-2xl text-sm">
          You are viewing this page inside the live dashboard shell from{" "}
          <code className="text-foreground">@/components/layout/dashboard</code> (collapsible
          sidebar, header, breadcrumbs). Toggle the sidebar icon or resize below{" "}
          <code className="text-foreground">md</code> to open the mobile sheet menu.
        </p>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
