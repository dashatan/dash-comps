import { useState, type ReactNode } from "react";
import { CheckCircle2, Info } from "lucide-react";
import { Button } from "@/components/common/buttons";
import FadeAble from "@/components/common/fadeable";
import { useShowcasePage } from "@/features/catalog/i18n";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";
import { cn } from "@/lib";

const STYLE_VARIANTS = ["primary", "muted", "outline", "success"] as const;
const CONTENT_SWAP_KEYS = ["first", "second", "third"] as const;
const MULTI_ITEM_KEYS = ["alpha", "beta", "gamma"] as const;

type StyleVariant = (typeof STYLE_VARIANTS)[number];
type ContentSwapKey = (typeof CONTENT_SWAP_KEYS)[number];
type MultiItemKey = (typeof MULTI_ITEM_KEYS)[number];

const styleVariantClasses: Record<StyleVariant, string> = {
  primary: "rounded-lg bg-primary/15 px-4 py-2 text-sm text-primary",
  muted: "rounded-lg bg-muted px-4 py-2 text-sm text-muted-foreground",
  outline: "rounded-lg border border-border px-4 py-2 text-sm",
  success:
    "rounded-lg bg-emerald-500/15 px-4 py-2 text-sm text-emerald-700 dark:text-emerald-400",
};

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

function LayoutBlock({ label }: { label: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-muted/30 px-4 py-3 text-sm">
      {label}
    </div>
  );
}

export function FadeablePage() {
  const p = useShowcasePage("fadeable");
  const [toggleVisible, setToggleVisible] = useState(true);
  const [middleVisible, setMiddleVisible] = useState(true);
  const [controlledVisible, setControlledVisible] = useState(false);
  const [richVisible, setRichVisible] = useState(true);
  const [contentIndex, setContentIndex] = useState(0);
  const [swapVisible, setSwapVisible] = useState(true);
  const [visibleItems, setVisibleItems] = useState<
    Record<MultiItemKey, boolean>
  >({
    alpha: true,
    beta: false,
    gamma: true,
  });

  const contentKey = CONTENT_SWAP_KEYS[contentIndex] satisfies ContentSwapKey;

  const cycleContent = () => {
    setSwapVisible(false);
    requestAnimationFrame(() => {
      setContentIndex((index) => (index + 1) % CONTENT_SWAP_KEYS.length);
      setSwapVisible(true);
    });
  };

  const toggleItem = (key: MultiItemKey) => {
    setVisibleItems((current) => ({ ...current, [key]: !current[key] }));
  };

  return (
    <CatalogPageShell slug="fadeable">
      <ShowcaseSection
        title={p("visibilityToggle.title")}
        description={p("visibilityToggle.description")}
        layout="stack"
      >
        <Button onClick={() => setToggleVisible((current) => !current)}>
          {toggleVisible
            ? p("visibilityToggle.hide")
            : p("visibilityToggle.show")}
        </Button>
        <FadeAble
          isVisible={toggleVisible}
          className="rounded-lg bg-primary/15 px-4 py-2 text-sm"
        >
          {p("visibilityToggle.content")}
        </FadeAble>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("initialStates.title")}
        description={p("initialStates.description")}
        layout="stack"
      >
        <div className="grid w-full gap-4 md:grid-cols-2">
          <ShowcaseRow label={p("initialStates.visibleLabel")}>
            <FadeAble
              isVisible
              className="rounded-lg bg-primary/15 px-4 py-2 text-sm"
            >
              {p("initialStates.visibleContent")}
            </FadeAble>
          </ShowcaseRow>
          <ShowcaseRow label={p("initialStates.hiddenLabel")}>
            <div className="min-h-10 rounded-lg border border-dashed border-border px-4 py-2 text-sm text-muted-foreground">
              {p("initialStates.hiddenPlaceholder")}
            </div>
            <FadeAble
              isVisible={false}
              className="rounded-lg px-4 py-2 text-sm"
            >
              {p("initialStates.hiddenContent")}
            </FadeAble>
          </ShowcaseRow>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("layoutCollapse.title")}
        description={p("layoutCollapse.description")}
        layout="stack"
      >
        <Button
          size="sm"
          variant="outlined"
          onClick={() => setMiddleVisible((current) => !current)}
        >
          {middleVisible
            ? p("layoutCollapse.hideMiddle")
            : p("layoutCollapse.showMiddle")}
        </Button>
        <div className="flex w-full flex-col gap-2">
          <LayoutBlock label={p("layoutCollapse.blockAbove")} />
          <FadeAble
            isVisible={middleVisible}
            className="rounded-lg bg-primary/15 px-4 py-3 text-sm"
          >
            {p("layoutCollapse.middleContent")}
          </FadeAble>
          <LayoutBlock label={p("layoutCollapse.blockBelow")} />
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("styledVariants.title")}
        description={p("styledVariants.description")}
        layout="stack"
      >
        <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STYLE_VARIANTS.map((variant) => (
            <ShowcaseRow key={variant} label={p(`styledVariants.${variant}`)}>
              <FadeAble isVisible className={styleVariantClasses[variant]}>
                {p("styledVariants.content")}
              </FadeAble>
            </ShowcaseRow>
          ))}
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("richContent.title")}
        description={p("richContent.description")}
        layout="stack"
      >
        <Button
          size="sm"
          variant="outlined"
          onClick={() => setRichVisible((current) => !current)}
        >
          {richVisible ? p("richContent.hide") : p("richContent.show")}
        </Button>
        <FadeAble
          isVisible={richVisible}
          className="w-full rounded-xl border border-border bg-card p-4 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-primary/15 p-2 text-primary">
              <Info className="size-4" />
            </div>
            <div className="min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium">{p("richContent.heading")}</p>
                <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs text-emerald-700 dark:text-emerald-400">
                  {p("richContent.badge")}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {p("richContent.body")}
              </p>
            </div>
          </div>
        </FadeAble>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("contentSwap.title")}
        description={p("contentSwap.description")}
        layout="stack"
      >
        <Button size="sm" variant="outlined" onClick={cycleContent}>
          {p("contentSwap.next")}
        </Button>
        <FadeAble
          key={contentKey}
          isVisible={swapVisible}
          className="rounded-lg bg-muted px-4 py-3 text-sm"
        >
          {p(`contentSwap.messages.${contentKey}`)}
        </FadeAble>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("multipleItems.title")}
        description={p("multipleItems.description")}
        layout="stack"
      >
        <div className="flex w-full flex-col gap-2">
          {MULTI_ITEM_KEYS.map((key) => (
            <div
              key={key}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border px-4 py-3"
            >
              <p className="text-sm font-medium">
                {p(`multipleItems.items.${key}`)}
              </p>
              <Button
                size="sm"
                variant="outlined"
                onClick={() => toggleItem(key)}
              >
                {visibleItems[key]
                  ? p("multipleItems.hide")
                  : p("multipleItems.show")}
              </Button>
              <FadeAble
                isVisible={visibleItems[key]}
                className="w-full rounded-lg bg-primary/10 px-3 py-2 text-sm text-primary"
              >
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="size-4" />
                  {p(`multipleItems.details.${key}`)}
                </span>
              </FadeAble>
            </div>
          ))}
        </div>
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
            onClick={() => setControlledVisible(true)}
          >
            {p("controlled.show")}
          </Button>
          <Button
            size="sm"
            variant="outlined"
            onClick={() => setControlledVisible(false)}
          >
            {p("controlled.hide")}
          </Button>
          <p className="text-sm text-muted-foreground">
            {p("controlled.current", {
              value: controlledVisible
                ? p("controlled.visibleLabel")
                : p("controlled.hiddenLabel"),
            })}
          </p>
        </div>
        <FadeAble
          isVisible={controlledVisible}
          className="rounded-lg border border-border bg-card px-4 py-3 text-sm"
        >
          {p("controlled.content")}
        </FadeAble>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
