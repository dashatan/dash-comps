import { Button } from "@/components/common/buttons";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/common/hover-card";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";

export function HoverCardPage() {
  return (
    <CatalogPageShell slug="hover-card">
      <ShowcaseSection title="Trigger + content">
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="outlined">Hover me</Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-64">
            <p className="text-sm font-medium">Hover card</p>
            <p className="text-muted-foreground text-xs">Rich preview on pointer hover.</p>
          </HoverCardContent>
        </HoverCard>
      </ShowcaseSection>
      <ShowcaseSection title="Aligned start" delay={0.05}>
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button severity="info" variant="text">
              Info preview
            </Button>
          </HoverCardTrigger>
          <HoverCardContent align="start" className="w-56">
            <p className="text-sm">Aligned to start edge of trigger.</p>
          </HoverCardContent>
        </HoverCard>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
