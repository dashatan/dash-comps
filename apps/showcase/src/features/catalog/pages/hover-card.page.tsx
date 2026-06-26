import type { ReactNode } from "react";
import { Calendar, ExternalLink, MapPin } from "lucide-react";
import { Avatar } from "@/components/common/avatar";
import { Button } from "@/components/common/buttons";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/common/hover-card";
import { showcaseAvatarImages } from "@/features/catalog/data/avatar-samples";
import { showcaseCarouselImages } from "@/features/catalog/data/carousel-samples";
import { useShowcasePage } from "@/features/catalog/i18n";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";
import { cn } from "@/lib";

const GALLERY_PRODUCT_KEYS = [
  "watch",
  "headphones",
  "camera",
  "sneaker",
] as const;

const ALIGN_OPTIONS = ["start", "center", "end"] as const;
const SIDE_OPTIONS = ["top", "right", "bottom", "left"] as const;

type GalleryProductKey = (typeof GALLERY_PRODUCT_KEYS)[number];

const CONTENT_WIDTH_CLASS = "w-72";

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

function ImageTrigger({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <HoverCardTrigger asChild>
      <button
        type="button"
        className={cn(
          "overflow-hidden rounded-xl border border-border",
          "cursor-pointer transition hover:opacity-95 active:scale-[0.99]",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
          className,
        )}
        aria-label={alt}
      >
        <img
          src={src}
          alt=""
          aria-hidden
          className="h-full w-full object-cover"
        />
      </button>
    </HoverCardTrigger>
  );
}

function ProductPreviewContent({
  imageSrc,
  imageAlt,
  title,
  category,
  price,
  description,
}: {
  imageSrc: string;
  imageAlt: string;
  title: string;
  category: string;
  price: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-hidden rounded-lg">
        <img
          src={imageSrc}
          alt={imageAlt}
          className="aspect-video w-full object-cover"
        />
      </div>
      <div className="space-y-1">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {category}
        </p>
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-sm font-medium text-primary">{price}</p>
        <p className="text-xs leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}

function ProfilePreviewContent({
  name,
  handle,
  role,
  location,
  joined,
  bio,
  imageSrc,
  imageAlt,
}: {
  name: string;
  handle: string;
  role: string;
  location: string;
  joined: string;
  bio: string;
  imageSrc: string;
  imageAlt: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <Avatar
          user={{ first_name: name.split(" ")[0] ?? name, username: handle }}
          src={imageSrc}
          size="lg"
          alt={imageAlt}
        />
        <div className="min-w-0 flex-1 space-y-0.5">
          <p className="text-sm font-semibold">{name}</p>
          <p className="text-xs text-muted-foreground">@{handle}</p>
          <p className="text-xs text-muted-foreground">{role}</p>
        </div>
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground">{bio}</p>
      <div className="flex flex-col gap-1.5 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <MapPin className="size-3.5 shrink-0" aria-hidden />
          {location}
        </span>
        <span className="flex items-center gap-1.5">
          <Calendar className="size-3.5 shrink-0" aria-hidden />
          {joined}
        </span>
      </div>
    </div>
  );
}

export function HoverCardPage() {
  const p = useShowcasePage("hover-card");

  return (
    <CatalogPageShell slug="hover-card">
      <ShowcaseSection
        title={p("basic.title")}
        description={p("basic.description")}
      >
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="outlined">{p("basic.hoverMe")}</Button>
          </HoverCardTrigger>
          <HoverCardContent className={CONTENT_WIDTH_CLASS}>
            <p className="text-sm font-semibold">{p("basic.cardTitle")}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {p("basic.cardDescription")}
            </p>
          </HoverCardContent>
        </HoverCard>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("imageTrigger.title")}
        description={p("imageTrigger.description")}
      >
        <HoverCard>
          <ImageTrigger
            src={showcaseCarouselImages.card.coast}
            alt={p("imageTrigger.alt")}
            className="h-48 w-full"
          />
          <HoverCardContent className={CONTENT_WIDTH_CLASS}>
            <div className="overflow-hidden rounded-lg">
              <img
                src={showcaseCarouselImages.card.coast}
                alt={p("imageTrigger.alt")}
                className="aspect-video w-full object-cover"
              />
            </div>
            <p className="mt-3 text-sm font-semibold">
              {p("imageTrigger.titleText")}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {p("imageTrigger.caption")}
            </p>
          </HoverCardContent>
        </HoverCard>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("productPreview.title")}
        description={p("productPreview.description")}
      >
        <HoverCard openDelay={200} closeDelay={100}>
          <HoverCardTrigger asChild>
            <Button severity="info" variant="text">
              {p("productPreview.trigger")}
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className={CONTENT_WIDTH_CLASS}>
            <ProductPreviewContent
              imageSrc={showcaseCarouselImages.product.watch}
              imageAlt={p("productPreview.imageAlt")}
              title={p("productPreview.titleText")}
              category={p("productPreview.category")}
              price={p("productPreview.price")}
              description={p("productPreview.descriptionText")}
            />
          </HoverCardContent>
        </HoverCard>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("profileCard.title")}
        description={p("profileCard.description")}
      >
        <HoverCard openDelay={300}>
          <HoverCardTrigger asChild>
            <button
              type="button"
              className={cn(
                "inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-4",
                "hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
              )}
            >
              @{p("profileCard.handle")}
            </button>
          </HoverCardTrigger>
          <HoverCardContent className={CONTENT_WIDTH_CLASS}>
            <ProfilePreviewContent
              name={p("profileCard.name")}
              handle={p("profileCard.handle")}
              role={p("profileCard.role")}
              location={p("profileCard.location")}
              joined={p("profileCard.joined")}
              bio={p("profileCard.bio")}
              imageSrc={showcaseAvatarImages.sara}
              imageAlt={p("profileCard.imageAlt")}
            />
          </HoverCardContent>
        </HoverCard>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("alignment.title")}
        description={p("alignment.description")}
        layout="stack"
      >
        <div className="grid w-full gap-4 sm:grid-cols-3">
          {ALIGN_OPTIONS.map((align) => (
            <ShowcaseRow key={align} label={p(`alignment.${align}`)}>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button variant="outlined" className="w-full">
                    {p(`alignment.${align}`)}
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent align={align} className="w-56">
                  <p className="text-sm">{p("alignment.content")}</p>
                </HoverCardContent>
              </HoverCard>
            </ShowcaseRow>
          ))}
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("placement.title")}
        description={p("placement.description")}
        layout="stack"
      >
        <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-4">
          {SIDE_OPTIONS.map((side) => (
            <ShowcaseRow key={side} label={p(`placement.${side}`)}>
              <div className="flex w-full justify-center py-6">
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button size="sm" variant="outlined">
                      {p(`placement.${side}`)}
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent side={side} className="w-48">
                    <p className="text-sm">{p("placement.content")}</p>
                  </HoverCardContent>
                </HoverCard>
              </div>
            </ShowcaseRow>
          ))}
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("delays.title")}
        description={p("delays.description")}
        layout="stack"
      >
        <div className="grid w-full gap-4 sm:grid-cols-3">
          <ShowcaseRow label={p("delays.instantLabel")}>
            <HoverCard openDelay={0} closeDelay={0}>
              <HoverCardTrigger asChild>
                <Button variant="outlined">{p("delays.instant")}</Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-52">
                <p className="text-sm">{p("delays.instantContent")}</p>
              </HoverCardContent>
            </HoverCard>
          </ShowcaseRow>
          <ShowcaseRow label={p("delays.defaultLabel")}>
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="outlined">{p("delays.default")}</Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-52">
                <p className="text-sm">{p("delays.defaultContent")}</p>
              </HoverCardContent>
            </HoverCard>
          </ShowcaseRow>
          <ShowcaseRow label={p("delays.slowLabel")}>
            <HoverCard openDelay={700} closeDelay={500}>
              <HoverCardTrigger asChild>
                <Button variant="outlined">{p("delays.slow")}</Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-52">
                <p className="text-sm">{p("delays.slowContent")}</p>
              </HoverCardContent>
            </HoverCard>
          </ShowcaseRow>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("offsets.title")}
        description={p("offsets.description")}
        layout="stack"
      >
        <div className="grid w-full gap-4 sm:grid-cols-3">
          {(["compact", "default", "spacious"] as const).map((variant) => (
            <ShowcaseRow key={variant} label={p(`offsets.${variant}Label`)}>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button variant="outlined">{p(`offsets.${variant}`)}</Button>
                </HoverCardTrigger>
                <HoverCardContent
                  sideOffset={
                    variant === "compact" ? 0 : variant === "spacious" ? 16 : 4
                  }
                  className="w-52"
                >
                  <p className="text-sm">{p(`offsets.${variant}Content`)}</p>
                </HoverCardContent>
              </HoverCard>
            </ShowcaseRow>
          ))}
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("richContent.title")}
        description={p("richContent.description")}
      >
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button>
              <ExternalLink className="size-4 shrink-0" />
              {p("richContent.trigger")}
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80 p-0">
            <img
              src={showcaseCarouselImages.hero.travel}
              alt={p("richContent.imageAlt")}
              className="aspect-2/1 w-full object-cover"
            />
            <div className="space-y-2 p-4">
              <p className="text-sm font-semibold">
                {p("richContent.titleText")}
              </p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {p("richContent.body")}
              </p>
              <div className="flex gap-2 pt-1">
                <Button size="sm">{p("richContent.primaryAction")}</Button>
                <Button size="sm" variant="outlined">
                  {p("richContent.secondaryAction")}
                </Button>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("gallery.title")}
        description={p("gallery.description")}
        layout="stack"
        className="w-full"
      >
        <ShowcaseRow label={p("gallery.rowLabel")}>
          <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4">
            {GALLERY_PRODUCT_KEYS.map((key: GalleryProductKey) => (
              <HoverCard key={key} openDelay={200} closeDelay={100}>
                <ImageTrigger
                  src={showcaseCarouselImages.product[key]}
                  alt={p(`gallery.products.${key}.imageAlt`)}
                  className="aspect-square w-full"
                />
                <HoverCardContent className={CONTENT_WIDTH_CLASS}>
                  <ProductPreviewContent
                    imageSrc={showcaseCarouselImages.product[key]}
                    imageAlt={p(`gallery.products.${key}.imageAlt`)}
                    title={p(`gallery.products.${key}.title`)}
                    category={p(`gallery.products.${key}.category`)}
                    price={p(`gallery.products.${key}.price`)}
                    description={p(`gallery.products.${key}.description`)}
                  />
                </HoverCardContent>
              </HoverCard>
            ))}
          </div>
        </ShowcaseRow>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
