import { useShowcasePage } from "@/features/catalog/i18n";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";
import TabbedContent from "@/components/common/tabs";

export function TabsPage() {
  const p = useShowcasePage("tabs");

  return (
    <CatalogPageShell slug="tabs">
      <ShowcaseSection title={p("tabbedContent.title")}>
        <div className="w-full">
          <TabbedContent
            defaultActiveTab={0}
            tabs={[
              {
                name: "overview",
                header: p("tabbedContent.overview.header"),
                content: (
                  <div className="text-muted-foreground p-4 text-sm">
                    {p("tabbedContent.overview.content")}
                  </div>
                ),
              },
              {
                name: "analytics",
                header: p("tabbedContent.analytics.header"),
                content: (
                  <div className="text-muted-foreground p-4 text-sm">
                    {p("tabbedContent.analytics.content")}
                  </div>
                ),
              },
              {
                name: "settings",
                header: p("tabbedContent.settings.header"),
                content: (
                  <div className="text-muted-foreground p-4 text-sm">
                    {p("tabbedContent.settings.content")}
                  </div>
                ),
              },
            ]}
          />
        </div>
      </ShowcaseSection>

      <ShowcaseSection title={p("keepMounted.title")} delay={0.05}>
        <div className="w-full">
          <TabbedContent
            keepMounted
            defaultActiveTab={0}
            tabs={[
              {
                name: "draft",
                header: p("keepMounted.draft.header"),
                content: (
                  <div className="p-4 text-sm">{p("keepMounted.draft.content")}</div>
                ),
              },
              {
                name: "published",
                header: p("keepMounted.published.header"),
                content: (
                  <div className="p-4 text-sm">{p("keepMounted.published.content")}</div>
                ),
              },
            ]}
          />
        </div>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
