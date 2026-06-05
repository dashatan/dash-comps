import { FlexContainer } from "@/components/common/flex";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";
import { useShowcasePage } from "@/features/catalog/i18n";

const box = "bg-primary/15 text-foreground rounded-md px-4 py-2 text-sm font-medium";

export function FlexPage() {
  const p = useShowcasePage("flex");

  return (
    <CatalogPageShell slug="flex">
      <ShowcaseSection title={p("row.title")}>
        <FlexContainer gap="sm">
          <div className={box}>{p("row.one")}</div>
          <div className={box}>{p("row.two")}</div>
          <div className={box}>{p("row.three")}</div>
        </FlexContainer>
      </ShowcaseSection>
      <ShowcaseSection title={p("column.title")} delay={0.05}>
        <FlexContainer direction="column" gap="sm">
          <div className={box}>{p("column.a")}</div>
          <div className={box}>{p("column.b")}</div>
        </FlexContainer>
      </ShowcaseSection>
      <ShowcaseSection title={p("spaceBetween.title")} delay={0.1} className="w-full">
        <FlexContainer justify="between" gap="md" className={{ container: "max-w-md" }}>
          <div className={box}>{p("spaceBetween.start")}</div>
          <div className={box}>{p("spaceBetween.end")}</div>
        </FlexContainer>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
