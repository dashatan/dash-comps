import CardsList from "@/components/common/list/cards";
import ChipsList from "@/components/common/list/chips";
import LinesList from "@/components/common/list/lines";
import { useShowcasePage } from "@/features/catalog/i18n";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";

export function ListPage() {
  const p = useShowcasePage("list");

  const sample = [
    { name: p("sample.status"), value: p("sample.active"), hasValue: true },
    { name: p("sample.region"), value: p("sample.tehran"), hasValue: true },
    { name: p("sample.notes"), value: p("sample.dash"), hasValue: false },
  ];

  return (
    <CatalogPageShell slug="list">
      <ShowcaseSection
        title={p("linesList.title")}
        className="w-full max-w-md flex-col items-stretch"
      >
        <LinesList list={sample} indicator />
      </ShowcaseSection>
      <ShowcaseSection
        title={p("cardsList.title")}
        delay={0.05}
        className="w-full max-w-lg flex-col items-stretch"
      >
        <CardsList list={sample} indicator />
      </ShowcaseSection>
      <ShowcaseSection title={p("chipsList.title")} delay={0.1}>
        <ChipsList
          list={[
            { name: p("chipsList.tagA"), isActive: true },
            { name: p("chipsList.tagB") },
            { name: p("chipsList.tagC") },
          ]}
        />
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
