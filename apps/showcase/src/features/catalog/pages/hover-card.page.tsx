import { Button } from "@/components/common/buttons";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/common/hover-card";
import { useShowcasePage } from "@/features/catalog/i18n";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";

export function HoverCardPage() {
  const p = useShowcasePage("hover-card");

  return (
    <CatalogPageShell slug="hover-card">
      <ShowcaseSection title={p("triggerContent.title")}>
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="outlined">{p("triggerContent.hoverMe")}</Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-64">
            <p className="text-sm font-medium">{p("triggerContent.hoverCardTitle")}</p>
            <p className="text-muted-foreground text-xs">{p("triggerContent.description")}</p>
          </HoverCardContent>
        </HoverCard>
      </ShowcaseSection>
      <ShowcaseSection title={p("alignedStart.title")} delay={0.05}>
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button severity="info" variant="text">
              {p("alignedStart.infoPreview")}
            </Button>
          </HoverCardTrigger>
          <HoverCardContent align="start" className="w-56">
            <p className="text-sm">{p("alignedStart.description")}</p>
          </HoverCardContent>
        </HoverCard>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
