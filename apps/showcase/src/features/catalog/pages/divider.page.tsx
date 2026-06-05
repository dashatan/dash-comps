import { Divider } from "@/components/common/divider";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";
import { useShowcasePage } from "@/features/catalog/i18n";

export function DividerPage() {
  const p = useShowcasePage("divider");

  return (
    <CatalogPageShell slug="divider">
      <ShowcaseSection title={p("horizontal.title")}>
        <div className="w-full max-w-md space-y-2">
          <p className="text-sm">{p("horizontal.sectionAbove")}</p>
          <Divider />
          <p className="text-sm">{p("horizontal.sectionBelow")}</p>
        </div>
      </ShowcaseSection>
      <ShowcaseSection title={p("vertical.title")} delay={0.05}>
        <div className="flex h-16 items-center gap-0">
          <span className="px-3 text-sm">{p("vertical.left")}</span>
          <Divider orientation="vertical" margin={8} />
          <span className="px-3 text-sm">{p("vertical.right")}</span>
        </div>
      </ShowcaseSection>
      <ShowcaseSection title={p("customMargin.title")} delay={0.1}>
        <Divider margin={32} className="max-w-md" />
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
