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
}: {
  label: string;
  rounded: ButtonRounded;
  variant?: ButtonVariant;
  severity?: ButtonSeverity;
  size?: (typeof SIZES)[number] | number;
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
        With icon
      </Button>
    </ShowcaseRow>
  );
}

export function ButtonsPage() {
  const [loading, setLoading] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  return (
    <CatalogPageShell slug="buttons">
      <ShowcaseSection
        title="Variants × severities"
        description="variant: contained | outlined | text — default is contained."
        layout="stack"
      >
        <div className="flex flex-col gap-6">
          {TEXT_VARIANTS.map((variant) => (
            <SeverityRow key={variant} variant={variant} label={variant} />
          ))}
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        title="Sizes"
        description='size: "xs" | "sm" | "md" | "lg" | "xl" — default "md".'
        delay={0.03}
      >
        {SIZES.map((size) => (
          <Button key={size} size={size}>
            {size}
          </Button>
        ))}
      </ShowcaseSection>

      <ShowcaseSection
        title="Fixed numeric size"
        description="size as number sets width/height in px (icon-style control)."
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
        title="Rounded (radius)"
        description='rounded: "sm" | "md" | "lg" | "full" | "circle" — default "md".'
        delay={0.09}
        layout="stack"
      >
        <ShowcaseRow label="All values — contained / primary / md">
          {ROUNDED.map((rounded) => (
            <Button key={rounded} rounded={rounded} severity="secondary">
              {rounded}
            </Button>
          ))}
        </ShowcaseRow>

        {ROUNDED.map((rounded) => (
          <RoundedRow
            key={rounded}
            label={`rounded="${rounded}"`}
            rounded={rounded}
          />
        ))}

        <ShowcaseRow label='By variant (rounded="lg")'>
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

        <ShowcaseRow label='Pill buttons (rounded="full")'>
          <Button rounded="full" severity="primary">
            Primary pill
          </Button>
          <Button
            rounded="full"
            variant="outlined"
            severity="success"
            leftIcon={<Plus className="size-4" />}
          >
            Add
          </Button>
          <Button
            rounded="full"
            variant="text"
            severity="info"
            rightIcon={<ChevronDown className="size-4" />}
          >
            More
          </Button>
        </ShowcaseRow>

        <ShowcaseRow label="Circle — icon variant (numeric size)">
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

        <ShowcaseRow label="Circle — icon-button variant">
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

        <ShowcaseRow label='Sizes with rounded="full"'>
          {SIZES.map((size) => (
            <Button key={size} rounded="full" size={size} severity="warning">
              {size}
            </Button>
          ))}
        </ShowcaseRow>

        <ShowcaseRow label='Severities with rounded="sm"'>
          {SEVERITIES.map((severity) => (
            <Button key={severity} rounded="sm" severity={severity}>
              {severity}
            </Button>
          ))}
        </ShowcaseRow>
      </ShowcaseSection>

      <ShowcaseSection
        title="Icon variant"
        description='variant="icon" — use children or the icon prop.'
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
        title="Icon button variant"
        description='variant="icon-button" — square icon-only actions (common with severity="input").'
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
        title="label prop"
        description="Use label instead of children when you want a dedicated label slot."
        delay={0.18}
      >
        <Button label="Save draft" severity="primary" />
        <Button label="Cancel" variant="outlined" severity="secondary" />
        <Button label="With icon" leftIcon={<Plus className="size-4" />} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Icons"
        description="leftIcon, rightIcon, or icon (replaces main content when set)."
        delay={0.21}
      >
        <Button leftIcon={<Plus className="size-4" />}>Add item</Button>
        <Button severity="danger" leftIcon={<Trash2 className="size-4" />}>
          Delete
        </Button>
        <Button variant="outlined" rightIcon={<Download className="size-4" />}>
          Export
        </Button>
        <Button
          leftIcon={<Plus className="size-4" />}
          rightIcon={<ChevronDown className="size-4" />}
          variant="outlined"
        >
          Both sides
        </Button>
      </ShowcaseSection>

      <ShowcaseSection
        title="fullWidth"
        description="fullWidth stretches the button to the container width."
        delay={0.24}
        layout="stack"
      >
        <Button fullWidth>Full width primary</Button>
        <Button fullWidth variant="outlined" severity="secondary">
          Full width outlined
        </Button>
      </ShowcaseSection>

      <ShowcaseSection
        title="Loading"
        description="isLoading shows a spinner and disables interaction."
        delay={0.27}
      >
        <Button isLoading>Loading</Button>
        <Button isLoading severity="success" variant="outlined">
          Saving
        </Button>
        <Button
          isLoading={loading}
          onClick={() => {
            setLoading(true);
            window.setTimeout(() => setLoading(false), 1500);
          }}
        >
          {loading ? "Saving…" : "Click to load"}
        </Button>
      </ShowcaseSection>

      <ShowcaseSection
        title="Disabled"
        description="disabled prevents clicks; pairs with isLoading."
        delay={0.3}
      >
        <Button disabled>Disabled</Button>
        <Button disabled variant="outlined" severity="danger">
          Disabled outlined
        </Button>
        <Button disabled variant="icon-button" severity="input" size="md">
          <Settings className="size-5" />
        </Button>
      </ShowcaseSection>

      <ShowcaseSection
        title="Tooltip"
        description="tooltip wraps the button in a HoverCard; configure with tooltipOptions."
        delay={0.33}
      >
        <Button tooltip="Default tooltip on top">Hover me</Button>
        <Button
          tooltip="Opens on the right"
          tooltipOptions={{ side: "right", align: "center", sideOffset: 8 }}
          variant="outlined"
        >
          Right tooltip
        </Button>
        <Button
          tooltip="Slower open/close"
          tooltipOptions={{ openDelay: 300, closeDelay: 200 }}
          severity="info"
        >
          Delayed tooltip
        </Button>
      </ShowcaseSection>

      <ShowcaseSection
        title="onClick"
        description="Standard button click handler."
        delay={0.36}
      >
        <Button
          onClick={() => setClickCount((c) => c + 1)}
          rightIcon={<Plus className="size-4" />}
        >
          Clicked {clickCount} times
        </Button>
      </ShowcaseSection>

      <ShowcaseSection
        title="asChild"
        description="Merges styles onto a single child element (e.g. link styled as a button)."
        delay={0.39}
      >
        <Button asChild variant="outlined" severity="primary">
          <a href="#buttons-as-child">Anchor as button</a>
        </Button>
      </ShowcaseSection>

      <ShowcaseSection
        title="type"
        description='type: "button" | "submit" | "reset" — default "button".'
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
          <Button type="submit">Submit</Button>
          <Button type="reset" variant="outlined" severity="secondary">
            Reset
          </Button>
        </form>
      </ShowcaseSection>

      <ShowcaseSection
        title="className & style"
        description="Extra Tailwind classes and inline styles merge with variants."
        delay={0.45}
      >
        <Button className="shadow-lg">Shadow via className</Button>
        <Button style={{ minWidth: 200 }} variant="outlined">
          minWidth 200px
        </Button>
      </ShowcaseSection>

      <ShowcaseSection
        title="Props reference"
        description="All ButtonProps from @/components/common/buttons."
        delay={0.48}
        layout="stack"
      >
        <div className="border-border bg-muted/30 overflow-x-auto rounded-xl border p-4 font-mono text-xs leading-relaxed">
          <pre className="text-muted-foreground whitespace-pre-wrap">
            {`variant?: "contained" | "outlined" | "text" | "icon" | "icon-button"
severity?: "primary" | "secondary" | "success" | "warning" | "danger" | "info" | "input" | "muted"
size?: "xs" | "sm" | "md" | "lg" | "xl" | number
rounded?: "sm" | "md" | "lg" | "full" | "circle"
fullWidth?: boolean
icon?: ReactNode
label?: string
isLoading?: boolean
leftIcon?: ReactNode
rightIcon?: ReactNode
children?: ReactNode
disabled?: boolean
type?: "button" | "submit" | "reset"
onClick?: (e) => void
className?: string
style?: CSSProperties
tooltip?: string
tooltipOptions?: { openDelay?, closeDelay?, side?, align?, className?, sideOffset? }
asChild?: boolean
id?: string`}
          </pre>
        </div>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
