import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/common/buttons";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/common/collapsible";
import { showcaseCarouselImages } from "@/features/catalog/data/carousel-samples";
import { useShowcasePage } from "@/features/catalog/i18n";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";
import { cn } from "@/lib";

const VARIANTS = ["default", "ghost", "outline"] as const;
const GALLERY_KEYS = [
  "watch",
  "headphones",
  "camera",
  "sneaker",
  "chair",
  "plant",
] as const;

type CollapsibleVariant = (typeof VARIANTS)[number];

function VariantFrame({
  label,
  variant,
  trigger,
  content,
}: {
  label: string;
  variant: CollapsibleVariant;
  trigger: string;
  content: string;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      <Collapsible
        variant={variant}
        className="w-full rounded-xl border border-border p-4"
      >
        <CollapsibleTrigger className="flex items-center justify-between gap-2 font-medium">
          {trigger}
          <ChevronDown className="size-4 shrink-0 transition-transform in-data-[state=open]:rotate-180" />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-3 text-sm text-muted-foreground">
          {content}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

function AnimatedChevronTrigger({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <CollapsibleTrigger
      className={cn(
        "flex items-center justify-between gap-2 font-medium",
        className,
      )}
    >
      {children}
      <ChevronDown className="size-4 shrink-0 transition-transform duration-200 in-data-[state=open]:rotate-180" />
    </CollapsibleTrigger>
  );
}

export function CollapsiblePage() {
  const p = useShowcasePage("collapsible");
  const [controlledOpen, setControlledOpen] = useState(false);

  return (
    <CatalogPageShell slug="collapsible">
      <ShowcaseSection
        title={p("basic.title")}
        description={p("basic.description")}
        layout="stack"
      >
        <Collapsible className="w-full rounded-xl border border-border p-4">
          <AnimatedChevronTrigger>{p("basic.trigger")}</AnimatedChevronTrigger>
          <CollapsibleContent className="mt-3 text-sm text-muted-foreground">
            {p("basic.content")}
          </CollapsibleContent>
        </Collapsible>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("variants.title")}
        description={p("variants.description")}
        layout="stack"
      >
        <div className="grid w-full gap-4 md:grid-cols-3">
          {VARIANTS.map((variant) => (
            <VariantFrame
              key={variant}
              label={p(`variants.${variant}`)}
              variant={variant}
              trigger={p("variants.trigger")}
              content={p("variants.content")}
            />
          ))}
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("defaultOpen.title")}
        description={p("defaultOpen.description")}
        layout="stack"
      >
        <Collapsible
          defaultOpen
          className="w-full rounded-xl border border-border p-4"
        >
          <AnimatedChevronTrigger>
            {p("defaultOpen.trigger")}
          </AnimatedChevronTrigger>
          <CollapsibleContent className="mt-3 text-sm text-muted-foreground">
            {p("defaultOpen.content")}
          </CollapsibleContent>
        </Collapsible>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("controlled.title")}
        description={p("controlled.description")}
        layout="stack"
      >
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant="outlined"
            onClick={() => setControlledOpen(true)}
          >
            {p("controlled.open")}
          </Button>
          <Button
            size="sm"
            variant="outlined"
            onClick={() => setControlledOpen(false)}
          >
            {p("controlled.close")}
          </Button>
          <p className="text-sm text-muted-foreground">
            {p("controlled.current", {
              value: controlledOpen
                ? p("controlled.openLabel")
                : p("controlled.closedLabel"),
            })}
          </p>
        </div>
        <Collapsible
          open={controlledOpen}
          onOpenChange={setControlledOpen}
          className="w-full rounded-xl border border-border p-4"
        >
          <AnimatedChevronTrigger>
            {p("controlled.trigger")}
          </AnimatedChevronTrigger>
          <CollapsibleContent className="mt-3 text-sm text-muted-foreground">
            {p("controlled.content")}
          </CollapsibleContent>
        </Collapsible>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("disabled.title")}
        description={p("disabled.description")}
        layout="stack"
      >
        <div className="grid w-full gap-4 md:grid-cols-2">
          <Collapsible className="w-full rounded-xl border border-border p-4">
            <AnimatedChevronTrigger>
              {p("disabled.enabledTrigger")}
            </AnimatedChevronTrigger>
            <CollapsibleContent className="mt-3 text-sm text-muted-foreground">
              {p("disabled.enabledContent")}
            </CollapsibleContent>
          </Collapsible>

          <Collapsible
            disabled
            className="w-full rounded-xl border border-border p-4 opacity-60"
          >
            <AnimatedChevronTrigger>
              {p("disabled.disabledTrigger")}
            </AnimatedChevronTrigger>
            <CollapsibleContent className="mt-3 text-sm text-muted-foreground">
              {p("disabled.disabledContent")}
            </CollapsibleContent>
          </Collapsible>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("asChildTrigger.title")}
        description={p("asChildTrigger.description")}
        layout="stack"
      >
        <Collapsible className="w-full">
          <CollapsibleTrigger asChild>
            <Button variant="outlined" className="w-full justify-between">
              {p("asChildTrigger.buttonLabel")}
              <ChevronDown className="size-4 shrink-0 transition-transform in-data-[state=open]:rotate-180" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 rounded-xl border border-border p-4 text-sm text-muted-foreground">
            {p("asChildTrigger.content")}
          </CollapsibleContent>
        </Collapsible>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("imageCard.title")}
        description={p("imageCard.description")}
        layout="stack"
      >
        <Collapsible className="w-full overflow-hidden rounded-xl border border-border">
          <CollapsibleTrigger className="flex items-center gap-4 p-4 text-start transition-colors hover:bg-muted/40">
            <img
              src={showcaseCarouselImages.product.watch}
              alt=""
              className="size-16 shrink-0 rounded-lg object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="font-medium">{p("imageCard.productName")}</p>
              <p className="text-sm text-muted-foreground">
                {p("imageCard.price")}
              </p>
            </div>
            <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform in-data-[state=open]:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="space-y-4 border-t border-border p-4">
              <img
                src={showcaseCarouselImages.product.watch}
                alt=""
                className="aspect-video w-full rounded-lg object-cover"
              />
              <p className="text-sm text-muted-foreground">
                {p("imageCard.content")}
              </p>
              <ul className="list-disc space-y-1 ps-5 text-sm text-muted-foreground">
                <li>{p("imageCard.spec1")}</li>
                <li>{p("imageCard.spec2")}</li>
                <li>{p("imageCard.spec3")}</li>
              </ul>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("imageGallery.title")}
        description={p("imageGallery.description")}
        layout="stack"
      >
        <Collapsible
          defaultOpen
          className="w-full rounded-xl border border-border p-4"
        >
          <AnimatedChevronTrigger>
            {p("imageGallery.trigger")}
          </AnimatedChevronTrigger>
          <CollapsibleContent className="mt-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {GALLERY_KEYS.map((key) => (
                <figure
                  key={key}
                  className="overflow-hidden rounded-lg border border-border bg-muted/30"
                >
                  <img
                    src={showcaseCarouselImages.product[key]}
                    alt=""
                    className="aspect-square w-full object-cover"
                  />
                  <figcaption className="px-2 py-1.5 text-xs text-muted-foreground">
                    {p(`imageGallery.items.${key}`)}
                  </figcaption>
                </figure>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("richContent.title")}
        description={p("richContent.description")}
        layout="stack"
      >
        <Collapsible className="w-full overflow-hidden rounded-xl border border-border">
          <AnimatedChevronTrigger className="p-4">
            {p("richContent.trigger")}
          </AnimatedChevronTrigger>
          <CollapsibleContent>
            <div className="space-y-4 border-t border-border p-4">
              <img
                src={showcaseCarouselImages.card.interior}
                alt=""
                className="aspect-video w-full rounded-lg object-cover"
              />
              <p className="text-sm">{p("richContent.intro")}</p>
              <ul className="list-disc space-y-1 ps-5 text-sm text-muted-foreground">
                <li>{p("richContent.listItem1")}</li>
                <li>{p("richContent.listItem2")}</li>
                <li>{p("richContent.listItem3")}</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                {p("richContent.outro")}
              </p>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
