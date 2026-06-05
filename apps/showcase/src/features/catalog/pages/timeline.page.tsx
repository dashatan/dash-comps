import Timeline from "@/components/common/timeline";
import { useShowcasePage } from "@/features/catalog/i18n";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";

export function TimelinePage() {
  const p = useShowcasePage("timeline");

  return (
    <CatalogPageShell slug="timeline">
      <ShowcaseSection
        title={p("eventList.title")}
        className="w-full max-w-md flex-col items-stretch"
      >
        <Timeline
          items={[
            { title: p("eventList.events.orderPlaced"), time: "09:00" },
            { title: p("eventList.events.shipped"), time: "14:30" },
            { title: p("eventList.events.delivered"), time: "18:00" },
          ]}
        />
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
