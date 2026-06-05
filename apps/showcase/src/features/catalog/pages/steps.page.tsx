import Steps from "@/components/common/steps.tsx";
import { useShowcasePage } from "@/features/catalog/i18n";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";

export function StepsPage() {
  const p = useShowcasePage("steps");

  return (
    <CatalogPageShell slug="steps">
      <ShowcaseSection title={p("step1Active.title")} className="w-full max-w-lg">
        <Steps
          active={1}
          steps={[
            {
              name: "1",
              title: p("step1Active.steps.details.title"),
              subtitle: p("step1Active.steps.details.subtitle"),
            },
            {
              name: "2",
              title: p("step1Active.steps.review.title"),
              subtitle: p("step1Active.steps.review.subtitle"),
            },
            {
              name: "3",
              title: p("step1Active.steps.done.title"),
              subtitle: p("step1Active.steps.done.subtitle"),
            },
          ]}
        />
      </ShowcaseSection>
      <ShowcaseSection title={p("midProgress.title")} delay={0.05} className="w-full max-w-lg">
        <Steps
          active={2}
          steps={[
            { name: "1", title: p("midProgress.steps.start") },
            { name: "2", title: p("midProgress.steps.review") },
            { name: "3", title: p("midProgress.steps.done") },
          ]}
        />
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
