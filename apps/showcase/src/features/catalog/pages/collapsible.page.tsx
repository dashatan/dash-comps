import { ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/common/collapsible";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";
import { useShowcasePage } from "@/features/catalog/i18n";

export function CollapsiblePage() {
  const p = useShowcasePage("collapsible");

  return (
    <CatalogPageShell slug="collapsible">
      <ShowcaseSection title={p("expandableBlock.title")} className="flex-col items-start">
        <Collapsible className="w-full max-w-md">
          <CollapsibleTrigger className="flex items-center gap-2 font-medium">
            {p("expandableBlock.trigger")}
            <ChevronDown className="size-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="text-muted-foreground mt-2 text-sm">
            {p("expandableBlock.content")}
          </CollapsibleContent>
        </Collapsible>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
