import { cn } from "@/lib";
import { cva, type VariantProps } from "class-variance-authority";

export const badgeVariants = cva(
  "flex items-center justify-center dir-ltr rounded-full text-xs font-semibold cursor-pointer ",
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
        xs: "",
        sm: "",
        md: "",
        lg: "",
        xl: "",
        "2xl": "text-sm",
      },
      variant: {
        circle: "",
        wide: "",
        square: "rounded-md",
      },
      highlight: {
        true: "relative z-20",
      },
      withRing: {
        true: "hover:ring-primary transition-all duration-300 hover:ring-2 hover:ring-offset-2 hover:outline-none hover:ring-offset-background",
      },
      withShadow: {
        true: "shadow-sm transition-all duration-300 hover:shadow-lg",
      },
      disabled: {
        true: "pointer-events-none ring-none",
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
      { variant: "circle", size: ["md"], className: "h-6 w-6" },
      { variant: "circle", size: "lg", className: "h-7 w-7" },
      { variant: "circle", size: "xl", className: "h-8 w-8" },
      { variant: "circle", size: "2xl", className: "h-10 w-10" },

      // Wide variants
      { variant: ["wide"], size: "xs", className: "h-2 min-w-6" },
      { variant: ["wide"], size: "sm", className: "h-4 min-w-8" },
      { variant: ["wide"], size: ["md"], className: "h-6 min-w-10" },
      { variant: ["wide"], size: "lg", className: "h-7 min-w-12" },
      { variant: ["wide"], size: "xl", className: "h-8 min-w-14" },
      { variant: ["wide"], size: "2xl", className: "h-10 min-w-16" },
    ],
    defaultVariants: {
      severity: "primary",
      size: "md",
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
  const classes = badgeVariants({
    severity,
    size,
    variant,
    highlight,
    appearance,
    withRing,
    withShadow,
    className,
    disabled,
  });

  return (
    <div className={cn(classes)}>
      {highlight && (
        <div
          className={cn(
            classes,
            "absolute top-1/2 left-1/2 z-2 -translate-x-1/2 -translate-y-1/2 scale-125 opacity-20",
          )}
        />
      )}
      {children}
    </div>
  );
}
