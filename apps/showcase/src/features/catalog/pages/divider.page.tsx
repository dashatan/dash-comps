import { Divider } from "@/components/common/divider";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";

export function DividerPage() {
  return (
    <CatalogPageShell slug="divider">
      <ShowcaseSection title="Horizontal">
        <div className="w-full max-w-md space-y-2">
          <p className="text-sm">Section above</p>
          <Divider />
          <p className="text-sm">Section below</p>
        </div>
      </ShowcaseSection>
      <ShowcaseSection title="Vertical" delay={0.05}>
        <div className="flex h-16 items-center gap-0">
          <span className="px-3 text-sm">Left</span>
          <Divider orientation="vertical" margin={8} />
          <span className="px-3 text-sm">Right</span>
        </div>
      </ShowcaseSection>
      <ShowcaseSection title="Custom margin" delay={0.1}>
        <Divider margin={32} className="max-w-md" />
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
