import type { ReactNode } from "react";
import { Copy, Download, Share2 } from "lucide-react";
import { Divider } from "@/components/common/divider";
import {
  showcaseCarouselImages,
  type ShowcaseCarouselProductKey,
} from "@/features/catalog/data/carousel-samples";
import { useShowcasePage } from "@/features/catalog/i18n";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";
import { cn } from "@/lib";

const MARGIN_VALUES = [0, 8, 16, 32] as const;
const LIST_PRODUCT_KEYS = [
  "watch",
  "headphones",
  "camera",
] as const satisfies readonly ShowcaseCarouselProductKey[];

type MarginValue = (typeof MARGIN_VALUES)[number];

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

function MarginPreview({
  margin,
  label,
}: {
  margin: MarginValue;
  label: string;
}) {
  return (
    <ShowcaseRow label={label}>
      <div className="rounded-lg border border-border bg-muted/20 px-4 py-2">
        <p className="text-sm">{label}</p>
        <Divider margin={margin} />
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </ShowcaseRow>
  );
}

export function DividerPage() {
  const p = useShowcasePage("divider");

  return (
    <CatalogPageShell slug="divider">
      <ShowcaseSection
        title={p("horizontal.title")}
        description={p("horizontal.description")}
        layout="stack"
      >
        <div className="space-y-2">
          <p className="text-sm">{p("horizontal.sectionAbove")}</p>
          <Divider />
          <p className="text-sm">{p("horizontal.sectionBelow")}</p>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("vertical.title")}
        description={p("vertical.description")}
      >
        <div className="flex h-16 items-center gap-0">
          <span className="px-3 text-sm">{p("vertical.left")}</span>
          <Divider orientation="vertical" margin={8} />
          <span className="px-3 text-sm">{p("vertical.right")}</span>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("margins.title")}
        description={p("margins.description")}
        layout="stack"
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {MARGIN_VALUES.map((margin) => (
            <MarginPreview
              key={margin}
              margin={margin}
              label={p(`margins.values.${margin}`)}
            />
          ))}
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("productCard.title")}
        description={p("productCard.description")}
        layout="stack"
      >
        <div className="overflow-hidden rounded-xl border border-border">
          <img
            src={showcaseCarouselImages.product.watch}
            alt=""
            className="aspect-4/3 object-cover"
          />
          <Divider margin={0} />
          <div className="space-y-1 p-4">
            <p className="font-medium">{p("productCard.name")}</p>
            <p className="text-sm font-medium text-primary">
              {p("productCard.price")}
            </p>
            <p className="text-sm text-muted-foreground">
              {p("productCard.detail")}
            </p>
          </div>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("articleLayout.title")}
        description={p("articleLayout.description")}
        layout="stack"
        className=""
      >
        <div className="overflow-hidden rounded-xl border border-border">
          <img
            src={showcaseCarouselImages.card.coast}
            alt=""
            className="aspect-video object-cover"
          />
          <Divider margin={0} />
          <div className="space-y-2 p-4">
            <h4 className="font-semibold">{p("articleLayout.heading")}</h4>
            <p className="text-sm text-muted-foreground">
              {p("articleLayout.body")}
            </p>
          </div>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("productList.title")}
        description={p("productList.description")}
        layout="stack"
        className=""
      >
        <div className="rounded-xl border border-border px-4">
          {LIST_PRODUCT_KEYS.map((key, index) => (
            <div key={key}>
              {index > 0 ? <Divider margin={0} /> : null}
              <div className="flex items-center gap-3 py-3">
                <img
                  src={showcaseCarouselImages.product[key]}
                  alt=""
                  className="size-12 shrink-0 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">
                    {p(`productList.items.${key}`)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {p(`productList.prices.${key}`)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("verticalToolbar.title")}
        description={p("verticalToolbar.description")}
      >
        <div className="flex h-12 items-center gap-1 rounded-xl border border-border px-3">
          <img
            src={showcaseCarouselImages.thumb.desk}
            alt=""
            className="size-8 shrink-0 rounded-md object-cover"
          />
          <Divider orientation="vertical" margin={8} />
          <button
            type="button"
            className="flex items-center gap-1.5 px-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <Copy className="size-3.5" />
            {p("verticalToolbar.copy")}
          </button>
          <Divider orientation="vertical" margin={8} />
          <button
            type="button"
            className="flex items-center gap-1.5 px-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <Share2 className="size-3.5" />
            {p("verticalToolbar.share")}
          </button>
          <Divider orientation="vertical" margin={8} />
          <button
            type="button"
            className="flex items-center gap-1.5 px-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <Download className="size-3.5" />
            {p("verticalToolbar.download")}
          </button>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("splitPanel.title")}
        description={p("splitPanel.description")}
        layout="stack"
        className=""
      >
        <div className="flex h-48 overflow-hidden rounded-xl border border-border">
          <figure className="flex min-w-0 flex-1 flex-col">
            <img
              src={showcaseCarouselImages.hero.workspace}
              alt=""
              className="h-full flex-1 object-cover"
            />
            <figcaption className="border-t border-border px-3 py-2 text-xs text-muted-foreground">
              {p("splitPanel.left")}
            </figcaption>
          </figure>
          <Divider
            orientation="vertical"
            margin={0}
            className="shrink-0 self-stretch"
          />
          <figure className="flex min-w-0 flex-1 flex-col">
            <img
              src={showcaseCarouselImages.hero.travel}
              alt=""
              className="h-full flex-1 object-cover"
            />
            <figcaption className="border-t border-border px-3 py-2 text-xs text-muted-foreground">
              {p("splitPanel.right")}
            </figcaption>
          </figure>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("customStyle.title")}
        description={p("customStyle.description")}
        layout="stack"
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <ShowcaseRow label={p("customStyle.default")}>
            <Divider className="" />
          </ShowcaseRow>
          <ShowcaseRow label={p("customStyle.muted")}>
            <Divider className="bg-muted-foreground/25" />
          </ShowcaseRow>
          <ShowcaseRow label={p("customStyle.primary")}>
            <Divider className="bg-primary/50" />
          </ShowcaseRow>
        </div>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
