import { type ReactNode } from "react";
import { LayoutGrid, Package, Sparkles } from "lucide-react";
import { Button } from "@/components/common/buttons";
import {
  FlexCard,
  FlexContainer,
  FlexHeader,
  FlexItem,
} from "@/components/common/flex";
import { showcaseCarouselImages } from "@/features/catalog/data/carousel-samples";
import { useShowcasePage } from "@/features/catalog/i18n";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";
import { cn } from "@/lib";

const DIRECTIONS = ["row", "column", "row-reverse", "column-reverse"] as const;
const JUSTIFY = [
  "start",
  "end",
  "center",
  "between",
  "around",
  "evenly",
] as const;
const ALIGNS = ["start", "end", "center", "baseline", "stretch"] as const;
const WRAPS = ["nowrap", "wrap", "wrap-reverse"] as const;
const GAPS = ["none", "sm", "md", "lg", "xl"] as const;
const CARD_VARIANTS = ["default", "elevated", "outlined"] as const;
const CARD_BASIS = ["auto", "full", "1/2", "1/3", "1/4"] as const;
const HEADER_ALIGNS = ["left", "center", "right"] as const;
const PRODUCT_KEYS = [
  "watch",
  "headphones",
  "camera",
  "sneaker",
  "chair",
  "plant",
] as const;

type CardVariant = (typeof CARD_VARIANTS)[number];
type CardBasis = (typeof CARD_BASIS)[number];
type ProductKey = (typeof PRODUCT_KEYS)[number];

type FlexTranslate = ReturnType<typeof useShowcasePage<"flex">>;

function ShowcaseRow({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-2", className)}>
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      {children}
    </div>
  );
}

function DemoFrame({
  children,
  className,
  minHeight = "min-h-28",
}: {
  children: ReactNode;
  className?: string;
  minHeight?: string;
}) {
  return (
    <div
      className={cn(
        "w-full rounded-xl border border-dashed border-border bg-muted/20",
        minHeight,
        className,
      )}
    >
      {children}
    </div>
  );
}

function FlexImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <img
      src={src}
      alt={alt}
      className={cn("w-full rounded-lg object-cover", className)}
      loading="lazy"
    />
  );
}

function DemoBox({ label, className }: { label: string; className?: string }) {
  return (
    <div
      className={cn(
        "rounded-md bg-primary/15 px-4 py-2 text-sm font-medium text-foreground",
        className,
      )}
    >
      {label}
    </div>
  );
}

function ProductCard({
  p,
  productKey,
  variant = "default",
  basis = "1/3",
  grow,
  shrink,
  imageClassName,
}: {
  p: FlexTranslate;
  productKey: ProductKey;
  variant?: CardVariant;
  basis?: CardBasis | "1/5" | "1/6";
  grow?: boolean;
  shrink?: boolean;
  imageClassName?: string;
}) {
  return (
    <FlexCard variant={variant} basis={basis} grow={grow} shrink={shrink}>
      <FlexHeader
        Icon={<Package className="size-5" />}
        title={p(`products.${productKey}.title`)}
        subtitle={p(`products.${productKey}.subtitle`)}
      />
      <FlexImage
        src={showcaseCarouselImages.product[productKey]}
        alt={p(`products.${productKey}.imageAlt`)}
        className={cn("h-36", imageClassName)}
      />
      <p className="text-sm text-muted-foreground">
        {p(`products.${productKey}.description`)}
      </p>
    </FlexCard>
  );
}

export function FlexPage() {
  const p = useShowcasePage("flex");
  const imageAlt = p("shared.imageAlt");

  return (
    <CatalogPageShell slug="flex">
      <ShowcaseSection
        title={p("direction.title")}
        description={p("direction.description")}
        layout="stack"
        className="w-full"
      >
        <div className="grid w-full gap-4 md:grid-cols-2">
          {DIRECTIONS.map((direction) => (
            <ShowcaseRow key={direction} label={p(`direction.${direction}`)}>
              <DemoFrame>
                <FlexContainer
                  direction={direction}
                  gap="sm"
                  wrap="nowrap"
                  className={{ flex: "p-3" }}
                >
                  <DemoBox label={p("direction.itemOne")} />
                  <DemoBox label={p("direction.itemTwo")} />
                  <DemoBox label={p("direction.itemThree")} />
                </FlexContainer>
              </DemoFrame>
            </ShowcaseRow>
          ))}
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("justify.title")}
        description={p("justify.description")}
        layout="stack"
        className="w-full"
      >
        <div className="grid w-full gap-4 md:grid-cols-2">
          {JUSTIFY.map((justify) => (
            <ShowcaseRow key={justify} label={p(`justify.${justify}`)}>
              <DemoFrame>
                <FlexContainer
                  justify={justify}
                  gap="sm"
                  wrap="nowrap"
                  className={{ flex: "p-3" }}
                >
                  <DemoBox label={p("justify.alpha")} />
                  <DemoBox label={p("justify.beta")} />
                </FlexContainer>
              </DemoFrame>
            </ShowcaseRow>
          ))}
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("align.title")}
        description={p("align.description")}
        layout="stack"
        className="w-full"
      >
        <div className="grid w-full gap-4 md:grid-cols-2">
          {ALIGNS.map((align) => (
            <ShowcaseRow key={align} label={p(`align.${align}`)}>
              <DemoFrame minHeight="min-h-36">
                <FlexContainer
                  align={align}
                  gap="sm"
                  wrap="nowrap"
                  className={{ flex: "h-full p-3" }}
                >
                  {align === "baseline" ? (
                    <>
                      <span className="rounded-md bg-primary/15 px-3 py-1 text-xs font-medium">
                        {p("align.small")}
                      </span>
                      <span className="rounded-md bg-primary/15 px-3 py-6 text-lg font-medium">
                        {p("align.large")}
                      </span>
                      <span className="rounded-md bg-primary/15 px-3 py-2 text-sm font-medium">
                        {p("align.medium")}
                      </span>
                    </>
                  ) : (
                    <>
                      <DemoBox label={p("align.short")} className="py-2" />
                      <DemoBox label={p("align.tall")} className="py-8" />
                      <DemoBox label={p("align.mid")} className="py-4" />
                    </>
                  )}
                </FlexContainer>
              </DemoFrame>
            </ShowcaseRow>
          ))}
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("wrap.title")}
        description={p("wrap.description")}
        layout="stack"
        className="w-full"
      >
        {WRAPS.map((wrap) => (
          <ShowcaseRow key={wrap} label={p(`wrap.${wrap}`)}>
            <DemoFrame minHeight="min-h-0">
              <FlexContainer wrap={wrap} gap="sm" className={{ flex: "p-3" }}>
                {PRODUCT_KEYS.map((key) => (
                  <FlexItem key={key} basis="1/5" shrink={false}>
                    <FlexImage
                      src={showcaseCarouselImages.product[key]}
                      alt={p(`products.${key}.imageAlt`)}
                      className="h-20"
                    />
                  </FlexItem>
                ))}
              </FlexContainer>
            </DemoFrame>
          </ShowcaseRow>
        ))}
      </ShowcaseSection>

      <ShowcaseSection
        title={p("gap.title")}
        description={p("gap.description")}
        layout="stack"
        className="w-full"
      >
        {GAPS.map((gap) => (
          <ShowcaseRow key={gap} label={p(`gap.${gap}`)}>
            <DemoFrame minHeight="min-h-0">
              <FlexContainer
                gap={gap}
                wrap="nowrap"
                className={{ flex: "p-3" }}
              >
                {(["city", "interior", "coast"] as const).map((key) => (
                  <FlexItem key={key} basis="1/3" shrink={false}>
                    <FlexImage
                      src={showcaseCarouselImages.card[key]}
                      alt={imageAlt}
                      className="h-16"
                    />
                  </FlexItem>
                ))}
              </FlexContainer>
            </DemoFrame>
          </ShowcaseRow>
        ))}
      </ShowcaseSection>

      <ShowcaseSection
        title={p("cardVariants.title")}
        description={p("cardVariants.description")}
        layout="stack"
        className="w-full"
      >
        <FlexContainer gap="md" wrap="wrap" className={{ flex: "p-0" }}>
          {CARD_VARIANTS.map((variant) => (
            <ProductCard
              key={variant}
              p={p}
              productKey="watch"
              variant={variant}
              basis="1/3"
            />
          ))}
        </FlexContainer>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("cardBasis.title")}
        description={p("cardBasis.description")}
        layout="stack"
        className="w-full"
      >
        {CARD_BASIS.map((basis) => (
          <ShowcaseRow key={basis} label={p(`cardBasis.${basis}`)}>
            <FlexContainer gap="sm" wrap="wrap" className={{ flex: "p-0" }}>
              <FlexCard basis={basis}>
                <FlexImage
                  src={showcaseCarouselImages.hero.workspace}
                  alt={imageAlt}
                  className="h-24"
                />
                <p className="text-sm">{p("cardBasis.sample")}</p>
              </FlexCard>
              <FlexCard basis={basis}>
                <FlexImage
                  src={showcaseCarouselImages.hero.travel}
                  alt={imageAlt}
                  className="h-24"
                />
                <p className="text-sm">{p("cardBasis.sample")}</p>
              </FlexCard>
              <FlexCard basis={basis}>
                <FlexImage
                  src={showcaseCarouselImages.hero.food}
                  alt={imageAlt}
                  className="h-24"
                />
                <p className="text-sm">{p("cardBasis.sample")}</p>
              </FlexCard>
            </FlexContainer>
          </ShowcaseRow>
        ))}
      </ShowcaseSection>

      <ShowcaseSection
        title={p("cardFlex.title")}
        description={p("cardFlex.description")}
        layout="stack"
        className="w-full"
      >
        <ShowcaseRow label={p("cardFlex.growLabel")}>
          <FlexContainer gap="md" wrap="nowrap" className={{ flex: "p-0" }}>
            <ProductCard p={p} productKey="headphones" basis="auto" grow />
            <ProductCard p={p} productKey="camera" basis="auto" grow />
          </FlexContainer>
        </ShowcaseRow>
        <ShowcaseRow label={p("cardFlex.shrinkLabel")}>
          <FlexContainer gap="md" wrap="nowrap" className={{ flex: "p-0" }}>
            <ProductCard
              p={p}
              productKey="sneaker"
              basis="1/3"
              shrink={false}
            />
            <ProductCard p={p} productKey="chair" basis="1/3" shrink={false} />
            <ProductCard p={p} productKey="plant" basis="1/3" shrink={false} />
          </FlexContainer>
        </ShowcaseRow>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("header.title")}
        description={p("header.description")}
        layout="stack"
        className="w-full"
      >
        {HEADER_ALIGNS.map((align) => (
          <FlexCard key={align} variant="outlined">
            <FlexHeader
              align={align}
              Icon={<Sparkles className="size-5" />}
              title={p(`header.${align}.title`)}
              subtitle={p(`header.${align}.subtitle`)}
              additionalText={p(`header.${align}.additional`)}
            />
            <FlexImage
              src={showcaseCarouselImages.banner.release}
              alt={imageAlt}
              className="h-32"
            />
          </FlexCard>
        ))}
        <FlexCard variant="elevated">
          <FlexHeader
            Icon={<LayoutGrid className="size-5" />}
            title={p("header.withActions.title")}
            subtitle={p("header.withActions.subtitle")}
            extraElements={
              <>
                <Button size="sm" variant="outlined">
                  {p("header.withActions.secondary")}
                </Button>
                <Button size="sm">{p("header.withActions.primary")}</Button>
              </>
            }
          />
          <FlexImage
            src={showcaseCarouselImages.banner.event}
            alt={imageAlt}
            className="h-32"
          />
        </FlexCard>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("item.title")}
        description={p("item.description")}
        layout="stack"
        className="w-full"
      >
        <ShowcaseRow label={p("item.basisLabel")}>
          <FlexContainer gap="sm" wrap="wrap" className={{ flex: "p-0" }}>
            <FlexItem basis="1/4">
              <FlexImage
                src={showcaseCarouselImages.thumb.coffee}
                alt={imageAlt}
                className="h-20"
              />
            </FlexItem>
            <FlexItem basis="1/2">
              <FlexImage
                src={showcaseCarouselImages.thumb.desk}
                alt={imageAlt}
                className="h-20"
              />
            </FlexItem>
            <FlexItem basis="1/4">
              <FlexImage
                src={showcaseCarouselImages.thumb.fitness}
                alt={imageAlt}
                className="h-20"
              />
            </FlexItem>
          </FlexContainer>
        </ShowcaseRow>
        <ShowcaseRow label={p("item.orderLabel")}>
          <FlexContainer gap="sm" wrap="nowrap" className={{ flex: "p-3" }}>
            <FlexItem order={3} className="order-3">
              <DemoBox label={p("item.first")} />
            </FlexItem>
            <FlexItem order={1} className="order-1">
              <DemoBox label={p("item.second")} />
            </FlexItem>
            <FlexItem order={2} className="order-2">
              <DemoBox label={p("item.third")} />
            </FlexItem>
          </FlexContainer>
        </ShowcaseRow>
        <ShowcaseRow label={p("item.growLabel")}>
          <FlexContainer gap="sm" wrap="nowrap" className={{ flex: "p-3" }}>
            <FlexItem grow>
              <DemoBox label={p("item.grows")} className="w-full text-center" />
            </FlexItem>
            <FlexItem basis="none" shrink={false}>
              <DemoBox label={p("item.fixed")} />
            </FlexItem>
          </FlexContainer>
        </ShowcaseRow>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("gallery.title")}
        description={p("gallery.description")}
        layout="stack"
        className="w-full"
      >
        <FlexContainer direction="column" gap="lg" className={{ flex: "p-0" }}>
          <FlexHeader
            Icon={<Package className="size-5" />}
            title={p("gallery.headerTitle")}
            subtitle={p("gallery.headerSubtitle")}
            additionalText={p("gallery.headerAdditional")}
            extraElements={
              <Button size="sm" variant="outlined">
                {p("gallery.viewAll")}
              </Button>
            }
          />
          <FlexContainer gap="md" wrap="wrap" className={{ flex: "p-0" }}>
            {PRODUCT_KEYS.map((key) => (
              <ProductCard
                key={key}
                p={p}
                productKey={key}
                basis="1/3"
                variant="elevated"
              />
            ))}
          </FlexContainer>
        </FlexContainer>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("customization.title")}
        description={p("customization.description")}
        layout="stack"
        className="w-full"
      >
        <FlexContainer
          gap="md"
          aria-label={p("customization.ariaLabel")}
          className={{
            container:
              "rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5",
            flex: "bg-card/80 p-6",
          }}
        >
          <FlexItem basis="1/2">
            <FlexImage
              src={showcaseCarouselImages.hero.retail}
              alt={imageAlt}
              className="h-40"
            />
          </FlexItem>
          <FlexItem basis="1/2" className="flex flex-col justify-center gap-3">
            <h4 className="text-lg font-semibold">
              {p("customization.titleText")}
            </h4>
            <p className="text-sm text-muted-foreground">
              {p("customization.body")}
            </p>
            <Button size="sm" className="w-fit">
              {p("customization.action")}
            </Button>
          </FlexItem>
        </FlexContainer>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
