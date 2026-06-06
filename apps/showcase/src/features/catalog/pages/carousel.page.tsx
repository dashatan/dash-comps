import { useMemo, type ReactNode } from "react";
import { cn } from "@/lib";
import { Carousel } from "@/components/common/carousel";
import {
  showcaseCarouselCardImages,
  showcaseCarouselCardKeys,
  showcaseCarouselControlVariants,
  showcaseCarouselHeroImages,
  showcaseCarouselHeroKeys,
  showcaseCarouselIndicatorVariants,
  showcaseCarouselProductKeys,
  showcaseCarouselRounded,
  showcaseCarouselSizes,
  showcaseCarouselSlidesPerView,
  showcaseCarouselThumbKeys,
  showcaseCarouselTransitions,
  showcaseCarouselImages,
} from "@/features/catalog/data/carousel-samples";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";
import { useShowcasePage } from "@/features/catalog/i18n";

type SlidePreset = "hero" | "banner" | "compact" | "card" | "stat";

function CarouselStack({ children }: { children: ReactNode }) {
  return <div className="flex w-full min-w-0 flex-col gap-8">{children}</div>;
}

function DemoFrame({
  label,
  widthClass = "w-full",
  children,
}: {
  label: string;
  widthClass?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-2", widthClass)}>
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      {children}
    </div>
  );
}

function DemoSlide({
  label,
  description,
  preset,
  image,
  tone = "primary",
}: {
  label: string;
  description?: string;
  preset: SlidePreset;
  image?: string;
  tone?: "primary" | "secondary" | "muted";
}) {
  const toneClass =
    tone === "primary"
      ? "from-primary/90 to-primary text-primary-foreground"
      : tone === "secondary"
        ? "from-secondary/90 to-secondary text-secondary-foreground"
        : "from-muted to-muted/80 text-foreground";

  const presetClass: Record<SlidePreset, string> = {
    hero: "h-full min-h-64 p-8",
    banner: "h-full min-h-28 px-5 py-4",
    compact: "px-3 py-2",
    card: "h-full min-h-36 p-5",
    stat: "h-full px-4 py-6",
  };

  const titleClass: Record<SlidePreset, string> = {
    hero: "text-2xl font-bold drop-shadow-sm",
    banner: "text-base font-semibold drop-shadow-sm",
    compact: "text-xs font-medium",
    card: "text-base font-semibold",
    stat: "text-3xl font-bold tabular-nums",
  };

  const isImageSlide =
    Boolean(image) &&
    (preset === "hero" || preset === "card" || preset === "banner");

  return (
    <div
      className={cn(
        "relative flex h-full min-h-0 w-full flex-col justify-end overflow-hidden rounded-[inherit] bg-linear-to-br",
        isImageSlide ? "text-primary-foreground" : toneClass,
        presetClass[preset],
        preset === "stat" && "items-center justify-center text-center",
        preset === "compact" &&
          "border border-border/60 from-primary/10 to-primary/5 text-primary",
        preset === "banner" &&
          !isImageSlide &&
          "border border-border/50 from-background to-muted/30 text-foreground",
      )}
      style={
        isImageSlide
          ? {
              backgroundImage: `linear-gradient(to top, rgb(0 0 0 / 0.65), rgb(0 0 0 / 0.15)), url(${image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      <p className={titleClass[preset]}>{label}</p>
      {description ? (
        <p
          className={cn(
            "mt-1 opacity-90",
            preset === "hero" || preset === "banner" ? "text-sm" : "text-xs",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}

function ProductSlide({
  name,
  price,
  image,
}: {
  name: string;
  price: string;
  image: string;
}) {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-[inherit] border border-border/50 bg-card">
      <div className="aspect-square w-full shrink-0 overflow-hidden bg-muted">
        <img src={image} alt="" className="h-full w-full object-cover" />
      </div>
      <div className="flex flex-col gap-0.5 p-3">
        <p className="text-sm font-medium">{name}</p>
        <p className="text-xs text-muted-foreground">{price}</p>
      </div>
    </div>
  );
}

function ThumbSlide({ label, image }: { label: string; image: string }) {
  return (
    <div className="relative h-20 w-full overflow-hidden rounded-[inherit]">
      <img
        src={image}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="relative flex h-full w-full items-end bg-linear-to-t from-black/70 to-transparent p-2">
        <p className="text-xs font-medium text-white">{label}</p>
      </div>
    </div>
  );
}

function buildPresetSlides(
  label: (index: number) => string,
  preset: SlidePreset,
  count: number,
  options?: { descriptions?: string[]; images?: string[] },
) {
  const tones: Array<"primary" | "secondary" | "muted"> = [
    "primary",
    "secondary",
    "muted",
    "primary",
    "secondary",
    "muted",
  ];

  return Array.from({ length: count }, (_, index) => (
    <Carousel.Item key={index}>
      <DemoSlide
        label={label(index)}
        description={options?.descriptions?.[index]}
        preset={preset}
        image={options?.images?.[index]}
        tone={tones[index % tones.length]}
      />
    </Carousel.Item>
  ));
}

export function CarouselPage() {
  const p = useShowcasePage("carousel");
  const slideLabel = (index: number) =>
    p("shared.slideLabel", { n: index + 1 });

  const heroSlides = useMemo(
    () =>
      showcaseCarouselHeroKeys.map((key) => (
        <Carousel.Item key={key}>
          <DemoSlide
            label={p(`useCases.heroes.${key}.title`)}
            description={p(`useCases.heroes.${key}.description`)}
            preset="hero"
            image={showcaseCarouselImages.hero[key]}
          />
        </Carousel.Item>
      )),
    [p],
  );

  const productGallerySlides = useMemo(
    () =>
      showcaseCarouselProductKeys.map((key) => (
        <Carousel.Item key={key}>
          <ProductSlide
            name={p(`useCases.products.${key}.name`)}
            price={p(`useCases.products.${key}.price`)}
            image={showcaseCarouselImages.product[key]}
          />
        </Carousel.Item>
      )),
    [p],
  );

  const destinationSlides = useMemo(
    () =>
      showcaseCarouselCardKeys.map((key) => (
        <Carousel.Item key={key}>
          <DemoSlide
            label={p(`useCases.destinations.${key}.title`)}
            description={p(`useCases.destinations.${key}.description`)}
            preset="card"
            image={showcaseCarouselImages.card[key]}
          />
        </Carousel.Item>
      )),
    [p],
  );

  const promoSlides = useMemo(
    () =>
      (["release", "event"] as const).map((key) => (
        <Carousel.Item key={key}>
          <DemoSlide
            label={p(`useCases.promos.${key}.title`)}
            description={p(`useCases.promos.${key}.description`)}
            preset="banner"
            image={showcaseCarouselImages.banner[key]}
          />
        </Carousel.Item>
      )),
    [p],
  );

  const categorySlides = useMemo(
    () =>
      showcaseCarouselThumbKeys.map((key) => (
        <Carousel.Item key={key}>
          <ThumbSlide
            label={p(`useCases.categories.${key}`)}
            image={showcaseCarouselImages.thumb[key]}
          />
        </Carousel.Item>
      )),
    [p],
  );

  return (
    <CatalogPageShell slug="carousel">
      <ShowcaseSection
        title={p("compound.title")}
        description={p("compound.description")}
        layout="stack"
      >
        <Carousel
          autoPlay
          loop
          rounded="2xl"
          size="lg"
          indicatorVariant="progress"
          controlsVariant="solid"
          height={400}
        >
          <Carousel.Content>{heroSlides}</Carousel.Content>
          <Carousel.Controls />
          <Carousel.Indicators variant="progress" />
        </Carousel>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("layouts.title")}
        description={p("layouts.description")}
        layout="stack"
      >
        <CarouselStack>
          <DemoFrame label={p("layouts.fullWidth")} widthClass="w-full">
            <Carousel rounded="xl" indicatorVariant="dots">
              <Carousel.Content>{promoSlides}</Carousel.Content>
              <Carousel.Controls />
              <Carousel.Indicators />
            </Carousel>
          </DemoFrame>

          <DemoFrame label={p("layouts.sidebar")} widthClass="w-72">
            <Carousel rounded="lg" indicatorVariant="pills" size="sm">
              <Carousel.Content>{categorySlides}</Carousel.Content>
              <Carousel.Controls />
              <Carousel.Indicators variant="pills" />
            </Carousel>
          </DemoFrame>

          <DemoFrame
            label={p("layouts.halfWidth")}
            widthClass="w-full sm:w-1/2"
          >
            <Carousel rounded="xl" indicatorVariant="bars">
              <Carousel.Content>{destinationSlides}</Carousel.Content>
              <Carousel.Controls />
              <Carousel.Indicators variant="bars" />
            </Carousel>
          </DemoFrame>

          <DemoFrame label={p("layouts.fixedDimensions")} widthClass="w-full">
            <Carousel
              width="50%"
              height="400px"
              rounded="xl"
              indicatorVariant="dots"
            >
              <Carousel.Content>
                {buildPresetSlides(slideLabel, "card", 3, {
                  images: showcaseCarouselCardImages,
                  descriptions: showcaseCarouselCardKeys.map((key) =>
                    p(`useCases.destinations.${key}.description`),
                  ),
                })}
              </Carousel.Content>
              <Carousel.Controls />
              <Carousel.Indicators />
            </Carousel>
            <p className="text-xs text-muted-foreground">
              {p("layouts.fixedDimensionsHint")}
            </p>
          </DemoFrame>

          <DemoFrame
            label={p("layouts.dynamicHeight")}
            widthClass="w-full sm:w-2/3"
          >
            <Carousel rounded="lg" indicatorVariant="fraction">
              <Carousel.Content>
                <Carousel.Item>
                  <DemoSlide
                    label={p("layouts.bannerSlide")}
                    preset="banner"
                    description={p("layouts.shortSlideHint")}
                    image={showcaseCarouselImages.banner.release}
                  />
                </Carousel.Item>
                <Carousel.Item>
                  <DemoSlide
                    label={p("layouts.heroSlide")}
                    preset="hero"
                    image={showcaseCarouselHeroImages[0]}
                    description={p("layouts.tallSlideHint")}
                  />
                </Carousel.Item>
                <Carousel.Item>
                  <DemoSlide
                    label={p("layouts.statSlide")}
                    preset="stat"
                    tone="secondary"
                    description={p("layouts.metricHint")}
                  />
                </Carousel.Item>
                <Carousel.Item>
                  <DemoSlide
                    label={p("layouts.compactSlide")}
                    preset="compact"
                  />
                </Carousel.Item>
              </Carousel.Content>
              <Carousel.Controls />
              <Carousel.Indicators
                variant="fraction"
                position="bottom-outside"
              />
            </Carousel>
          </DemoFrame>
        </CarouselStack>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("slidesPerView.title")}
        description={p("slidesPerView.description")}
        layout="stack"
      >
        <CarouselStack>
          {showcaseCarouselSlidesPerView.map((perView) => (
            <DemoFrame
              key={perView}
              label={p(
                `slidesPerView.${perView === 2 ? "two" : perView === 3 ? "three" : "four"}`,
              )}
            >
              <Carousel
                slidesPerView={perView}
                gap="md"
                rounded="lg"
                indicatorVariant="dots"
                controlsSize="sm"
              >
                <Carousel.Content>
                  {showcaseCarouselProductKeys.map((key) => (
                    <Carousel.Item key={key}>
                      <ProductSlide
                        name={p(`useCases.products.${key}.name`)}
                        price={p(`useCases.products.${key}.price`)}
                        image={showcaseCarouselImages.product[key]}
                      />
                    </Carousel.Item>
                  ))}
                </Carousel.Content>
                <Carousel.Controls />
                <Carousel.Indicators />
              </Carousel>
            </DemoFrame>
          ))}

          <DemoFrame label={p("slidesPerView.pageScroll")}>
            <Carousel
              slidesPerView={3}
              slidesToScroll={3}
              gap="md"
              rounded="lg"
              indicatorVariant="bars"
              controlsSize="sm"
            >
              <Carousel.Content>
                {buildPresetSlides(slideLabel, "stat", 6)}
              </Carousel.Content>
              <Carousel.Controls />
              <Carousel.Indicators variant="bars" />
            </Carousel>
          </DemoFrame>
        </CarouselStack>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("transitions.title")}
        description={p("transitions.description")}
        layout="stack"
      >
        <CarouselStack>
          {showcaseCarouselTransitions.map((transition) => (
            <DemoFrame
              key={transition}
              label={p(`transitions.${transition}`)}
              widthClass={transition === "fade" ? "w-full sm:w-2/3" : "w-full"}
            >
              <Carousel
                transition={transition}
                rounded="xl"
                indicatorVariant="dots"
              >
                <Carousel.Content>
                  {transition === "fade" ? destinationSlides : promoSlides}
                </Carousel.Content>
                <Carousel.Controls />
                <Carousel.Indicators />
              </Carousel>
            </DemoFrame>
          ))}
        </CarouselStack>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("indicators.title")}
        description={p("indicators.description")}
        layout="stack"
      >
        <CarouselStack>
          {showcaseCarouselIndicatorVariants.map((variant) => (
            <DemoFrame key={variant} label={p(`indicators.${variant}`)}>
              <Carousel
                autoPlay={variant === "progress"}
                rounded="lg"
                indicatorVariant={variant}
                showControls={variant !== "fraction"}
              >
                <Carousel.Content>{promoSlides}</Carousel.Content>
                {variant !== "fraction" ? <Carousel.Controls /> : null}
                <Carousel.Indicators variant={variant} />
              </Carousel>
            </DemoFrame>
          ))}
        </CarouselStack>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("sizes.title")}
        description={p("sizes.description")}
        layout="stack"
      >
        <CarouselStack>
          {showcaseCarouselSizes.map((size) => (
            <DemoFrame key={size} label={size}>
              <Carousel size={size} rounded="lg" indicatorVariant="bars">
                <Carousel.Content>{categorySlides}</Carousel.Content>
                <Carousel.Controls />
                <Carousel.Indicators variant="bars" />
              </Carousel>
            </DemoFrame>
          ))}
        </CarouselStack>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("controls.title")}
        description={p("controls.description")}
        layout="stack"
      >
        <CarouselStack>
          {showcaseCarouselControlVariants.map((variant) => (
            <DemoFrame key={variant} label={p(`controls.${variant}`)}>
              <Carousel
                controlsVariant={variant}
                rounded="lg"
                indicatorVariant="dots"
              >
                <Carousel.Content>{destinationSlides}</Carousel.Content>
                <Carousel.Controls />
                <Carousel.Indicators />
              </Carousel>
            </DemoFrame>
          ))}
        </CarouselStack>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("autoplay.title")}
        description={p("autoplay.description")}
        layout="stack"
      >
        <DemoFrame label={p("layouts.fullWidth")}>
          <Carousel
            autoPlay
            loop
            pauseOnHover
            rounded="xl"
            indicatorVariant="bars"
          >
            <Carousel.Content>{heroSlides}</Carousel.Content>
            <Carousel.Controls />
            <Carousel.Indicators variant="bars" />
          </Carousel>
        </DemoFrame>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("peek.title")}
        description={p("peek.description")}
        layout="stack"
      >
        <DemoFrame label={p("layouts.halfWidth")} widthClass="w-full sm:w-3/5">
          <Carousel peek gap="md" rounded="xl" loop indicatorVariant="pills">
            <Carousel.Content>{productGallerySlides}</Carousel.Content>
            <Carousel.Controls />
            <Carousel.Indicators variant="pills" />
          </Carousel>
        </DemoFrame>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("outsideControls.title")}
        description={p("outsideControls.description")}
        layout="stack"
      >
        <DemoFrame label={p("layouts.sidebar")} widthClass="w-80">
          <Carousel loop rounded="lg" indicatorVariant="fraction">
            <div className="flex w-full min-w-0 items-center gap-2">
              <Carousel.Previous variant="outline" />
              <Carousel.Content className="min-w-0 flex-1">
                {categorySlides}
              </Carousel.Content>
              <Carousel.Next variant="outline" />
            </div>
            <Carousel.Indicators variant="fraction" position="bottom-outside" />
          </Carousel>
        </DemoFrame>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("rounded.title")}
        description={p("rounded.description")}
        layout="stack"
      >
        <CarouselStack>
          {showcaseCarouselRounded.map((rounded) => (
            <DemoFrame key={rounded} label={p(`rounded.${rounded}`)}>
              <Carousel rounded={rounded} indicatorVariant="dots">
                <Carousel.Content>{promoSlides}</Carousel.Content>
                <Carousel.Controls />
                <Carousel.Indicators />
              </Carousel>
            </DemoFrame>
          ))}
        </CarouselStack>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
