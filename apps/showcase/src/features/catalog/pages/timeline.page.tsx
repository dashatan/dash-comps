import Timeline from "@/components/common/timeline";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";

export function TimelinePage() {
  return (
    <CatalogPageShell slug="timeline">
      <ShowcaseSection title="Event list" className="w-full max-w-md flex-col items-stretch">
        <Timeline
          items={[
            { title: "Order placed", time: "09:00" },
            { title: "Shipped", time: "14:30" },
            { title: "Delivered", time: "18:00" },
          ]}
        />
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
