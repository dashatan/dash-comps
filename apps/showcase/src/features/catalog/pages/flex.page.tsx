import { FlexContainer } from "@/components/common/flex";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";

const box = "bg-primary/15 text-foreground rounded-md px-4 py-2 text-sm font-medium";

export function FlexPage() {
  return (
    <CatalogPageShell slug="flex">
      <ShowcaseSection title="Row">
        <FlexContainer gap="sm">
          <div className={box}>One</div>
          <div className={box}>Two</div>
          <div className={box}>Three</div>
        </FlexContainer>
      </ShowcaseSection>
      <ShowcaseSection title="Column" delay={0.05}>
        <FlexContainer direction="column" gap="sm">
          <div className={box}>A</div>
          <div className={box}>B</div>
        </FlexContainer>
      </ShowcaseSection>
      <ShowcaseSection title="Space between" delay={0.1} className="w-full">
        <FlexContainer justify="between" gap="md" className={{ container: "max-w-md" }}>
          <div className={box}>Start</div>
          <div className={box}>End</div>
        </FlexContainer>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
