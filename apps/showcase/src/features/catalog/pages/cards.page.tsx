import { useState, type ReactNode } from "react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/common/buttons";
import { Card } from "@/components/common/card";
import {
  showcaseCardAppearances,
  showcaseCardImages,
  showcaseCardMediaAspects,
  showcaseCardRounded,
  showcaseCardSeverities,
  showcaseCardShadows,
  showcaseCardSizes,
} from "@/features/catalog/data/card-samples";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";
import { useShowcasePage } from "@/features/catalog/i18n";

function CardStack({ children }: { children: ReactNode }) {
  return <div className="flex w-full min-w-0 flex-col gap-4">{children}</div>;
}

function LabeledCard({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex w-full min-w-0 flex-col gap-2 ${className ?? ""}`}>
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      {children}
    </div>
  );
}

export function CardsPage() {
  const p = useShowcasePage("cards");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  return (
    <CatalogPageShell slug="cards">
      <ShowcaseSection
        title={p("compound.title")}
        description={p("compound.description")}
        layout="stack"
      >
        <Card className="" severity="primary" shadow="md">
          <Card.Header>
            <Card.Title>{p("compound.cardTitle")}</Card.Title>
            <Card.Description>{p("compound.cardDescription")}</Card.Description>
          </Card.Header>
          <Card.Content>
            <Card.Badge className="mb-3">{p("compound.badge")}</Card.Badge>
            <p className="text-sm">{p("compound.cardContent")}</p>
          </Card.Content>
          <Card.Footer>
            <Card.Actions>
              <Button size="sm">{p("compound.viewDetails")}</Button>
              <Button size="sm" variant="outlined">
                {p("compound.dismiss")}
              </Button>
            </Card.Actions>
          </Card.Footer>
        </Card>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("severities.title")}
        description={p("severities.description")}
        layout="stack"
      >
        <CardStack>
          {showcaseCardSeverities.map((severity) => (
            <Card key={severity} severity={severity} appearance="soft">
              <Card.Header>
                <Card.Title>{p(`severities.${severity}`)}</Card.Title>
                <Card.Description>
                  {p(`severities.${severity}Description`)}
                </Card.Description>
              </Card.Header>
            </Card>
          ))}
        </CardStack>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("appearances.title")}
        description={p("appearances.description")}
        layout="stack"
      >
        <CardStack>
          {showcaseCardAppearances.map((appearance) => (
            <Card key={appearance} severity="primary" appearance={appearance}>
              <Card.Header>
                <Card.Title>{p(`appearances.${appearance}`)}</Card.Title>
                <Card.Description>
                  {p(`appearances.${appearance}Description`)}
                </Card.Description>
              </Card.Header>
            </Card>
          ))}
        </CardStack>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("sizes.title")}
        description={p("sizes.description")}
        layout="stack"
      >
        <CardStack>
          {showcaseCardSizes.map((size) => (
            <LabeledCard key={size} label={size}>
              <Card size={size}>
                <Card.Header>
                  <Card.Title>{p("sizes.sampleTitle")}</Card.Title>
                </Card.Header>
                <Card.Content>
                  <p className="text-sm text-muted-foreground">
                    {p("sizes.sampleContent")}
                  </p>
                </Card.Content>
              </Card>
            </LabeledCard>
          ))}
        </CardStack>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("media.title")}
        description={p("media.description")}
        layout="stack"
      >
        <CardStack>
          {showcaseCardMediaAspects.map((aspect) => (
            <LabeledCard key={aspect} label={p(`media.${aspect}`)}>
              <Card className="overflow-hidden">
                <Card.Media
                  src={showcaseCardImages.workspace}
                  alt={p("media.imageAlt")}
                  aspect={aspect}
                />
                <Card.Header>
                  <Card.Title>{p("media.cardTitle")}</Card.Title>
                  <Card.Description>
                    {p("media.cardDescription")}
                  </Card.Description>
                </Card.Header>
                <Card.Footer>
                  <Button size="sm" variant="outlined">
                    {p("media.action")}
                  </Button>
                </Card.Footer>
              </Card>
            </LabeledCard>
          ))}
        </CardStack>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("orientation.title")}
        description={p("orientation.description")}
        layout="stack"
      >
        <Card
          orientation="horizontal"
          className="overflow-hidden"
          severity="secondary"
          appearance="soft"
        >
          <Card.Media
            src={showcaseCardImages.team}
            alt={p("orientation.imageAlt")}
            aspect="square"
            position="start"
          />
          <div className="flex min-w-0 flex-1 flex-col">
            <Card.Header>
              <Card.Title>{p("orientation.cardTitle")}</Card.Title>
              <Card.Description>
                {p("orientation.cardDescription")}
              </Card.Description>
            </Card.Header>
            <Card.Content>
              <p className="text-sm text-muted-foreground">
                {p("orientation.cardContent")}
              </p>
            </Card.Content>
            <Card.Footer>
              <Button size="sm">{p("orientation.action")}</Button>
            </Card.Footer>
          </div>
        </Card>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("headerAction.title")}
        description={p("headerAction.description")}
        layout="stack"
      >
        <Card className="" divided>
          <Card.Header>
            <Card.Title>{p("headerAction.cardTitle")}</Card.Title>
            <Card.Description>
              {p("headerAction.cardDescription")}
            </Card.Description>
            <Card.Action>
              <Button
                variant="icon"
                severity="muted"
                size={32}
                aria-label={p("headerAction.menuLabel")}
              >
                <MoreHorizontal className="size-4" />
              </Button>
            </Card.Action>
          </Card.Header>
          <Card.Content>
            <p className="text-sm text-muted-foreground">
              {p("headerAction.cardContent")}
            </p>
          </Card.Content>
        </Card>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("divided.title")}
        description={p("divided.description")}
        layout="stack"
      >
        <Card className="" divided severity="default">
          <Card.Header>
            <Card.Title>{p("divided.cardTitle")}</Card.Title>
            <Card.Description>{p("divided.cardDescription")}</Card.Description>
          </Card.Header>
          <Card.Content>
            <p className="text-sm font-medium">{p("divided.cardContent")}</p>
          </Card.Content>
          <Card.Footer>
            <Card.Actions>
              <Button size="sm">{p("divided.save")}</Button>
              <Button size="sm" variant="outlined">
                {p("divided.cancel")}
              </Button>
            </Card.Actions>
          </Card.Footer>
        </Card>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("roundedShadow.title")}
        description={p("roundedShadow.description")}
      >
        {showcaseCardRounded.map((rounded) => (
          <LabeledCard
            key={rounded}
            label={p(`roundedShadow.rounded.${rounded}`)}
          >
            <Card rounded={rounded} shadow="md" className="w-44">
              <Card.Content>
                <p className="text-sm font-medium">{rounded}</p>
              </Card.Content>
            </Card>
          </LabeledCard>
        ))}
        {showcaseCardShadows.map((shadow) => (
          <LabeledCard key={shadow} label={p(`roundedShadow.shadow.${shadow}`)}>
            <Card shadow={shadow} className="w-44">
              <Card.Content>
                <p className="text-sm font-medium">{shadow}</p>
              </Card.Content>
            </Card>
          </LabeledCard>
        ))}
      </ShowcaseSection>

      <ShowcaseSection
        title={p("interactive.title")}
        description={p("interactive.description")}
      >
        {(["basic", "pro"] as const).map((plan) => (
          <Card
            key={plan}
            className="w-full"
            severity="primary"
            appearance={selectedPlan === plan ? "solid" : "outline"}
            interactive
            selected={selectedPlan === plan}
            onClick={() =>
              setSelectedPlan((current) => (current === plan ? null : plan))
            }
          >
            <Card.Header>
              <Card.Title>{p(`interactive.${plan}.title`)}</Card.Title>
              <Card.Description>
                {p(`interactive.${plan}.description`)}
              </Card.Description>
            </Card.Header>
            <Card.Content>
              <p className="text-2xl font-bold">
                {p(`interactive.${plan}.price`)}
              </p>
            </Card.Content>
            <Card.Footer>
              <Button
                size="sm"
                variant={selectedPlan === plan ? "contained" : "outlined"}
                className="pointer-events-none"
              >
                {selectedPlan === plan
                  ? p("interactive.selected")
                  : p("interactive.select")}
              </Button>
            </Card.Footer>
          </Card>
        ))}
      </ShowcaseSection>

      <ShowcaseSection
        title={p("compositions.title")}
        description={p("compositions.description")}
      >
        <LabeledCard label={p("compositions.contentOnly")}>
          <Card appearance="ghost" shadow="none" className="w-full">
            <Card.Content>
              <p className="text-sm text-muted-foreground">
                {p("compositions.contentOnlyBody")}
              </p>
            </Card.Content>
          </Card>
        </LabeledCard>

        <LabeledCard label={p("compositions.headerContent")}>
          <Card className="w-full" severity="success" appearance="soft">
            <Card.Header>
              <Card.Title>{p("compositions.headerContentTitle")}</Card.Title>
              <Card.Description>
                {p("compositions.headerContentDescription")}
              </Card.Description>
            </Card.Header>
            <Card.Content>
              <p className="text-sm text-muted-foreground">
                {p("compositions.headerContentBody")}
              </p>
            </Card.Content>
          </Card>
        </LabeledCard>

        <LabeledCard label={p("compositions.mediaOnly")}>
          <Card className="w-full gap-0 overflow-hidden p-0">
            <Card.Media
              src={showcaseCardImages.analytics}
              alt={p("compositions.mediaAlt")}
              aspect="video"
            />
          </Card>
        </LabeledCard>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
