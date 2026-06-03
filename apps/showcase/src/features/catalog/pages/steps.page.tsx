import Steps from "@/components/common/steps.tsx";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";

export function StepsPage() {
  return (
    <CatalogPageShell slug="steps">
      <ShowcaseSection title="Step 1 active" className="w-full max-w-lg">
        <Steps
          active={1}
          steps={[
            { name: "1", title: "Details", subtitle: "Basic information" },
            { name: "2", title: "Review", subtitle: "Check entries" },
            { name: "3", title: "Done", subtitle: "Finish" },
          ]}
        />
      </ShowcaseSection>
      <ShowcaseSection title="Mid progress" delay={0.05} className="w-full max-w-lg">
        <Steps
          active={2}
          steps={[
            { name: "1", title: "Start" },
            { name: "2", title: "Review" },
            { name: "3", title: "Done" },
          ]}
        />
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
