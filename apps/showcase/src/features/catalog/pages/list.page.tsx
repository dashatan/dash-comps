import CardsList from "@/components/common/list/cards";
import ChipsList from "@/components/common/list/chips";
import LinesList from "@/components/common/list/lines";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";

const sample = [
  { name: "Status", value: "Active", hasValue: true },
  { name: "Region", value: "Tehran", hasValue: true },
  { name: "Notes", value: "—", hasValue: false },
];

export function ListPage() {
  return (
    <CatalogPageShell slug="list">
      <ShowcaseSection title="Lines list" className="w-full max-w-md flex-col items-stretch">
        <LinesList list={sample} indicator />
      </ShowcaseSection>
      <ShowcaseSection title="Cards list" delay={0.05} className="w-full max-w-lg flex-col items-stretch">
        <CardsList list={sample} indicator />
      </ShowcaseSection>
      <ShowcaseSection title="Chips list" delay={0.1}>
        <ChipsList
          list={[
            { name: "Tag A", isActive: true },
            { name: "Tag B" },
            { name: "Tag C" },
          ]}
        />
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
