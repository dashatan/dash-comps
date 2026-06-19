import { cn } from "@/lib";
import { cva, type VariantProps } from "class-variance-authority";

export const badgeVariants = cva(
  "inline-flex items-center justify-center dir-ltr text-xs font-semibold cursor-pointer whitespace-nowrap",
  {
    variants: {
      severity: {
        primary: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        success: "bg-success text-success-foreground",
        warning: "bg-warning text-warning-foreground",
        danger: "bg-error text-error-foreground",
        info: "bg-muted text-muted-foreground",
      },
      appearance: {
        filled: "",
        outline: "",
      },
      size: {
        xs: "text-xs px-1",
        sm: "",
        md: "",
        lg: "",
        xl: "",
        "2xl": "text-sm",
      },
      variant: {
        circle: "rounded-full",
        wide: "rounded-full",
        square: "rounded-md",
      },
      highlight: {
        true: "",
      },
      withRing: {
        true: "hover:ring-primary transition-all duration-300 hover:ring-2 hover:ring-offset-2 hover:outline-none hover:ring-offset-background",
      },
      withShadow: {
        true: "shadow-[0_1px_3px_0_color-mix(in_srgb,var(--color-foreground)_18%,transparent)] transition-all duration-300 hover:shadow-[0_4px_14px_0_color-mix(in_srgb,var(--color-foreground)_28%,transparent)]",
      },
      disabled: {
        true: "pointer-events-none cursor-not-allowed opacity-50",
      },
    },
    compoundVariants: [
      // Outline colors per severity
      {
        appearance: "outline",
        severity: "primary",
        className: "bg-transparent border border-primary text-primary",
      },
      {
        appearance: "outline",
        severity: "secondary",
        className: "bg-transparent border border-secondary text-secondary",
      },
      {
        appearance: "outline",
        severity: "danger",
        className: "bg-transparent border border-destructive text-destructive",
      },
      {
        appearance: "outline",
        severity: "info",
        className: "bg-transparent border border-muted text-muted-foreground",
      },
      {
        appearance: "outline",
        severity: "success",
        className:
          "bg-transparent border text-[oklch(0.65_0.18_140)] border-[oklch(0.65_0.18_140)]",
      },
      {
        appearance: "outline",
        severity: "warning",
        className:
          "bg-transparent border text-[oklch(0.8_0.2_90)] border-[oklch(0.8_0.2_90)]",
      },
      {
        withRing: true,
        severity: "primary",
        className: "hover:ring-primary ",
      },
      {
        withRing: true,
        severity: "secondary",
        className: "hover:ring-secondary",
      },
      {
        withRing: true,
        severity: "danger",
        className: "hover:ring-destructive",
      },
      {
        withRing: true,
        severity: "info",
        className: "hover:ring-muted",
      },
      {
        withRing: true,
        severity: "success",
        className: "hover:ring-success",
      },
      {
        withRing: true,
        severity: "warning",
        className: "hover:ring-warning ",
      },

      // Circle variants
      { variant: "circle", size: "xs", className: "h-2 w-2" },
      { variant: "circle", size: "sm", className: "h-4 w-4" },
      { variant: "circle", size: "md", className: "h-6 w-6" },
      { variant: "circle", size: "lg", className: "h-7 w-7" },
      { variant: "circle", size: "xl", className: "h-8 w-8" },
      { variant: "circle", size: "2xl", className: "h-10 w-10" },

      // Wide variants
      { variant: "wide", size: "xs", className: "px-2" },
      { variant: "wide", size: "sm", className: "py-1 px-3" },
      { variant: "wide", size: "md", className: "py-1.5 px-4" },
      { variant: "wide", size: "lg", className: "py-2 px-5" },
      { variant: "wide", size: "xl", className: "py-2.5 px-6" },
      { variant: "wide", size: "2xl", className: "py-3 px-8" },

      // Square variants
      { variant: "square", size: "xs", className: "px-2 py-0.5" },
      { variant: "square", size: "sm", className: "py-1 px-3" },
      { variant: "square", size: "md", className: "py-1.5 px-4" },
      { variant: "square", size: "lg", className: "py-2 px-5" },
      { variant: "square", size: "xl", className: "py-2.5 px-6" },
      { variant: "square", size: "2xl", className: "py-3 px-8" },
    ],
    defaultVariants: {
      severity: "primary",
      size: "sm",
      variant: "wide",
      appearance: "filled",
    },
  },
);

export interface BadgeProps extends VariantProps<typeof badgeVariants> {
  children?: React.ReactNode;
  withShadow?: boolean;
  className?: string;
  withRing?: boolean;
  disabled?: boolean;
}

export default function Badge({
  children,
  severity,
  size,
  variant,
  highlight,
  appearance,
  withShadow,
  withRing,
  className,
  disabled,
}: BadgeProps) {
  const classes = cn(
    badgeVariants({
      severity,
      size,
      variant,
      highlight,
      appearance,
      withRing,
      withShadow,
      disabled,
    }),
    className,
  );

  if (!highlight) {
    return <div className={classes}>{children}</div>;
  }

  const glowClasses = badgeVariants({
    severity,
    size,
    variant,
    appearance,
  });

  return (
    <div className="relative inline-flex">
      <div
        aria-hidden
        className={cn(
          glowClasses,
          "pointer-events-none absolute top-1/2 left-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 scale-125 opacity-30",
        )}
      >
        <span className="invisible">{children}</span>
      </div>
      <div className={cn(classes, "relative z-10")}>{children}</div>
    </div>
  );
}
