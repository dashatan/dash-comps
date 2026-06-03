import { ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/common/collapsible";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";

export function CollapsiblePage() {
  return (
    <CatalogPageShell slug="collapsible">
      <ShowcaseSection title="Expandable block" className="flex-col items-start">
        <Collapsible className="w-full max-w-md">
          <CollapsibleTrigger className="flex items-center gap-2 font-medium">
            Details
            <ChevronDown className="size-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="text-muted-foreground mt-2 text-sm">
            Hidden content revealed when the trigger is activated.
          </CollapsibleContent>
        </Collapsible>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
