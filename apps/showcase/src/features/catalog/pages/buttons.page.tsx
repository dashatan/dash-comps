import { useState, type ReactNode } from "react";
import {
  Plus,
  Trash2,
  Download,
  Settings,
  Search,
  X,
  Heart,
  ChevronDown,
} from "lucide-react";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";
import { useShowcasePage } from "@/features/catalog/i18n";
import { Button } from "@/components/common/buttons";
import type {
  ButtonRounded,
  ButtonSeverity,
  ButtonVariant,
} from "@/components/common/buttons/types";

const TEXT_VARIANTS = [
  "contained",
  "outlined",
  "text",
] as const satisfies readonly ButtonVariant[];
const SEVERITIES = [
  "primary",
  "secondary",
  "success",
  "warning",
  "danger",
  "info",
  "input",
  "muted",
] as const satisfies readonly ButtonSeverity[];

const SIZES = ["xs", "sm", "md", "lg", "xl"] as const;
const ROUNDED = ["sm", "md", "lg", "full"] as const;

function ShowcaseRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
        {label}
      </p>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}

function SeverityRow({
  variant,
  label,
}: {
  variant: (typeof TEXT_VARIANTS)[number];
  label: string;
}) {
  return (
    <ShowcaseRow label={label}>
      {SEVERITIES.map((severity) => (
        <Button key={severity} variant={variant} severity={severity}>
          {severity}
        </Button>
      ))}
    </ShowcaseRow>
  );
}

function RoundedRow({
  label,
  rounded,
  variant = "contained",
  severity = "primary",
  size,
  withIconLabel,
}: {
  label: string;
  rounded: ButtonRounded;
  variant?: ButtonVariant;
  severity?: ButtonSeverity;
  size?: (typeof SIZES)[number] | number;
  withIconLabel: string;
}) {
  return (
    <ShowcaseRow label={label}>
      <Button
        rounded={rounded}
        variant={variant}
        severity={severity}
        size={size}
      >
        {rounded}
      </Button>
      <Button
        rounded={rounded}
        variant={variant}
        severity={severity}
        size={size}
        leftIcon={<Plus className="size-4" />}
      >
        {withIconLabel}
      </Button>
    </ShowcaseRow>
  );
}

export function ButtonsPage() {
  const p = useShowcasePage("buttons");
  const [loading, setLoading] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  return (
    <CatalogPageShell slug="buttons">
      <ShowcaseSection
        title={p("variantsSeverities.title")}
        description={p("variantsSeverities.description")}
        layout="stack"
      >
        <div className="flex flex-col gap-6">
          {TEXT_VARIANTS.map((variant) => (
            <SeverityRow key={variant} variant={variant} label={variant} />
          ))}
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("sizes.title")}
        description={p("sizes.description")}
        delay={0.03}
      >
        {SIZES.map((size) => (
          <Button key={size} size={size}>
            {size}
          </Button>
        ))}
      </ShowcaseSection>

      <ShowcaseSection
        title={p("fixedNumericSize.title")}
        description={p("fixedNumericSize.description")}
        delay={0.06}
      >
        <Button variant="icon" severity="info" size={32}>
          <Search className="size-4" />
        </Button>
        <Button variant="icon" severity="primary" size={40}>
          <Plus className="size-5" />
        </Button>
        <Button variant="icon" severity="danger" size={48}>
          <X className="size-6" />
        </Button>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("rounded.title")}
        description={p("rounded.description")}
        delay={0.09}
        layout="stack"
      >
        <ShowcaseRow label={p("rounded.allValues")}>
          {ROUNDED.map((rounded) => (
            <Button key={rounded} rounded={rounded} severity="secondary">
              {rounded}
            </Button>
          ))}
        </ShowcaseRow>

        {ROUNDED.map((rounded) => (
          <RoundedRow
            key={rounded}
            label={p("rounded.rowLabel", { rounded })}
            rounded={rounded}
            withIconLabel={p("rounded.withIcon")}
          />
        ))}

        <ShowcaseRow label={p("rounded.byVariant")}>
          <Button rounded="lg" variant="contained">
            contained
          </Button>
          <Button rounded="lg" variant="outlined" severity="primary">
            outlined
          </Button>
          <Button rounded="lg" variant="text" severity="danger">
            text
          </Button>
        </ShowcaseRow>

        <ShowcaseRow label={p("rounded.pillButtons")}>
          <Button rounded="full" severity="primary">
            {p("rounded.primaryPill")}
          </Button>
          <Button
            rounded="full"
            variant="outlined"
            severity="success"
            leftIcon={<Plus className="size-4" />}
          >
            {p("rounded.add")}
          </Button>
          <Button
            rounded="full"
            variant="text"
            severity="info"
            rightIcon={<ChevronDown className="size-4" />}
          >
            {p("rounded.more")}
          </Button>
        </ShowcaseRow>

        <ShowcaseRow label={p("rounded.circleIcon")}>
          {([32, 40, 48] as const).map((px) => (
            <Button
              key={px}
              rounded="circle"
              variant="icon"
              severity="primary"
              size={px}
            >
              <Heart className={px <= 32 ? "size-4" : "size-5"} />
            </Button>
          ))}
        </ShowcaseRow>

        <ShowcaseRow label={p("rounded.circleIconButton")}>
          {SIZES.map((size) => (
            <Button
              key={size}
              rounded="circle"
              variant="icon-button"
              severity="input"
              size={size}
            >
              <Settings className="size-5" />
            </Button>
          ))}
        </ShowcaseRow>

        <ShowcaseRow label={p("rounded.sizesWithFull")}>
          {SIZES.map((size) => (
            <Button key={size} rounded="full" size={size} severity="warning">
              {size}
            </Button>
          ))}
        </ShowcaseRow>

        <ShowcaseRow label={p("rounded.severitiesWithSm")}>
          {SEVERITIES.map((severity) => (
            <Button key={severity} rounded="sm" severity={severity}>
              {severity}
            </Button>
          ))}
        </ShowcaseRow>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("iconVariant.title")}
        description={p("iconVariant.description")}
        delay={0.12}
      >
        <Button variant="icon" severity="info" size={40}>
          <Settings className="size-5" />
        </Button>
        <Button
          variant="icon"
          severity="primary"
          icon={<Plus className="size-5" />}
          size={40}
        />
        <Button variant="icon" severity="secondary" size={32} disabled>
          <Search className="size-4" />
        </Button>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("iconButtonVariant.title")}
        description={p("iconButtonVariant.description")}
        delay={0.15}
      >
        {SIZES.map((size) => (
          <Button key={size} variant="icon-button" severity="input" size={size}>
            <ChevronDown className="size-5" />
          </Button>
        ))}
        <Button variant="icon-button" severity="danger" size="md">
          <Trash2 className="size-5" />
        </Button>
        <Button variant="icon-button" severity="primary" size="lg">
          <Plus className="size-6" />
        </Button>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("labelProp.title")}
        description={p("labelProp.description")}
        delay={0.18}
      >
        <Button label={p("labelProp.saveDraft")} severity="primary" />
        <Button label={p("labelProp.cancel")} variant="outlined" severity="secondary" />
        <Button label={p("labelProp.withIcon")} leftIcon={<Plus className="size-4" />} />
      </ShowcaseSection>

      <ShowcaseSection
        title={p("icons.title")}
        description={p("icons.description")}
        delay={0.21}
      >
        <Button leftIcon={<Plus className="size-4" />}>{p("icons.addItem")}</Button>
        <Button severity="danger" leftIcon={<Trash2 className="size-4" />}>
          {p("icons.delete")}
        </Button>
        <Button variant="outlined" rightIcon={<Download className="size-4" />}>
          {p("icons.export")}
        </Button>
        <Button
          leftIcon={<Plus className="size-4" />}
          rightIcon={<ChevronDown className="size-4" />}
          variant="outlined"
        >
          {p("icons.bothSides")}
        </Button>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("fullWidth.title")}
        description={p("fullWidth.description")}
        delay={0.24}
        layout="stack"
      >
        <Button fullWidth>{p("fullWidth.primary")}</Button>
        <Button fullWidth variant="outlined" severity="secondary">
          {p("fullWidth.outlined")}
        </Button>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("loading.title")}
        description={p("loading.description")}
        delay={0.27}
      >
        <Button isLoading>{p("loading.loading")}</Button>
        <Button isLoading severity="success" variant="outlined">
          {p("loading.saving")}
        </Button>
        <Button
          isLoading={loading}
          onClick={() => {
            setLoading(true);
            window.setTimeout(() => setLoading(false), 1500);
          }}
        >
          {loading ? p("loading.savingEllipsis") : p("loading.clickToLoad")}
        </Button>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("disabled.title")}
        description={p("disabled.description")}
        delay={0.3}
      >
        <Button disabled>{p("disabled.disabled")}</Button>
        <Button disabled variant="outlined" severity="danger">
          {p("disabled.disabledOutlined")}
        </Button>
        <Button disabled variant="icon-button" severity="input" size="md">
          <Settings className="size-5" />
        </Button>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("tooltip.title")}
        description={p("tooltip.description")}
        delay={0.33}
      >
        <Button tooltip={p("tooltip.defaultTooltip")}>{p("tooltip.hoverMe")}</Button>
        <Button
          tooltip={p("tooltip.opensRight")}
          tooltipOptions={{ side: "right", align: "center", sideOffset: 8 }}
          variant="outlined"
        >
          {p("tooltip.rightTooltip")}
        </Button>
        <Button
          tooltip={p("tooltip.slowerOpenClose")}
          tooltipOptions={{ openDelay: 300, closeDelay: 200 }}
          severity="info"
        >
          {p("tooltip.delayedTooltip")}
        </Button>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("onClick.title")}
        description={p("onClick.description")}
        delay={0.36}
      >
        <Button
          onClick={() => setClickCount((c) => c + 1)}
          rightIcon={<Plus className="size-4" />}
        >
          {p("onClick.clickedTimes", { count: clickCount })}
        </Button>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("asChild.title")}
        description={p("asChild.description")}
        delay={0.39}
      >
        <Button asChild variant="outlined" severity="primary">
          <a href="#buttons-as-child">{p("asChild.anchorAsButton")}</a>
        </Button>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("type.title")}
        description={p("type.description")}
        delay={0.42}
        layout="stack"
      >
        <form
          className="flex flex-wrap gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            setClickCount((c) => c + 1);
          }}
        >
          <Button type="submit">{p("type.submit")}</Button>
          <Button type="reset" variant="outlined" severity="secondary">
            {p("type.reset")}
          </Button>
        </form>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("classNameStyle.title")}
        description={p("classNameStyle.description")}
        delay={0.45}
      >
        <Button className="shadow-lg">{p("classNameStyle.shadowViaClassName")}</Button>
        <Button style={{ minWidth: 200 }} variant="outlined">
          {p("classNameStyle.minWidth200px")}
        </Button>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("propsReference.title")}
        description={p("propsReference.description")}
        delay={0.48}
        layout="stack"
      >
        <div className="border-border bg-muted/30 overflow-x-auto rounded-xl border p-4 font-mono text-xs leading-relaxed">
          <pre className="text-muted-foreground whitespace-pre-wrap">
            {p("propsReference.content")}
          </pre>
        </div>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
