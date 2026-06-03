import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";
import TabbedContent from "@/components/common/tabs";

export function TabsPage() {
  return (
    <CatalogPageShell slug="tabs">
      <ShowcaseSection title="Tabbed content">
        <div className="w-full">
          <TabbedContent
            defaultActiveTab={0}
            tabs={[
              {
                name: "overview",
                header: "Overview",
                content: (
                  <div className="text-muted-foreground p-4 text-sm">
                    Overview panel with summary metrics and quick actions.
                  </div>
                ),
              },
              {
                name: "analytics",
                header: "Analytics",
                content: (
                  <div className="text-muted-foreground p-4 text-sm">
                    Analytics panel with charts and trend data.
                  </div>
                ),
              },
              {
                name: "settings",
                header: "Settings",
                content: (
                  <div className="text-muted-foreground p-4 text-sm">
                    Settings panel for configuration and preferences.
                  </div>
                ),
              },
            ]}
          />
        </div>
      </ShowcaseSection>

      <ShowcaseSection title="Keep mounted" delay={0.05}>
        <div className="w-full">
          <TabbedContent
            keepMounted
            defaultActiveTab={0}
            tabs={[
              {
                name: "draft",
                header: "Draft",
                content: <div className="p-4 text-sm">Draft content preserves state when switching tabs.</div>,
              },
              {
                name: "published",
                header: "Published",
                content: <div className="p-4 text-sm">Published items appear here.</div>,
              },
            ]}
          />
        </div>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
