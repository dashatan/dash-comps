import { cva } from "class-variance-authority";

export const bannerVariants = cva(
  "relative w-full overflow-hidden border text-banner-foreground ",
  {
    variants: {
      size: {
        sm: "min-h-16 px-4 py-3",
        md: "min-h-28 px-6 py-5",
        lg: "min-h-40 px-6 py-6",
        xl: "min-h-52 px-8 py-8",
        hero: "min-h-64 px-8 py-10",
      },
      severity: {
        default: "",
        primary: "",
        secondary: "",
        success: "",
        warning: "",
        danger: "",
        info: "",
        muted: "",
      },
      appearance: {
        soft: "",
        outline: "",
        solid: "",
      },
      rounded: {
        none: "rounded-none",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-2xl",
      },
      shadow: {
        none: "",
        sm: "shadow-sm",
        md: "shadow-md",
      },
      layout: {
        start: "flex flex-col items-start justify-center gap-3",
        center: "flex flex-col items-center justify-center gap-3 text-center",
        row: "flex flex-col items-start justify-center gap-4 md:flex-row md:items-center md:justify-between",
      },
      imageMode: {
        none: "",
        decor: "",
        cover: "",
        contain: "",
      },
      dismissible: {
        true: "pe-12",
        false: "",
      },
      interactive: {
        true: "cursor-pointer transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        false: "",
      },
    },
    compoundVariants: [
      {
        severity: "default",
        appearance: "soft",
        className: "border-banner-border bg-banner",
      },
      {
        severity: "default",
        appearance: "outline",
        className: "border-banner-border bg-transparent",
      },
      {
        severity: "default",
        appearance: "solid",
        className: "border-banner-border bg-banner",
      },

      {
        severity: "primary",
        appearance: "soft",
        className: "border-primary/20 bg-primary/10",
      },
      {
        severity: "primary",
        appearance: "outline",
        className: "border-primary bg-transparent text-primary",
      },
      {
        severity: "primary",
        appearance: "solid",
        className: "border-primary bg-primary text-primary-foreground",
      },

      {
        severity: "secondary",
        appearance: "soft",
        className: "border-secondary/20 bg-secondary/10",
      },
      {
        severity: "secondary",
        appearance: "outline",
        className: "border-secondary bg-transparent text-secondary",
      },
      {
        severity: "secondary",
        appearance: "solid",
        className: "border-secondary bg-secondary text-secondary-foreground",
      },

      {
        severity: "success",
        appearance: "soft",
        className: "border-success/20 bg-success/10",
      },
      {
        severity: "success",
        appearance: "outline",
        className: "border-success bg-transparent text-success",
      },
      {
        severity: "success",
        appearance: "solid",
        className: "border-success bg-success text-success-foreground",
      },

      {
        severity: "warning",
        appearance: "soft",
        className: "border-warning/20 bg-warning/10",
      },
      {
        severity: "warning",
        appearance: "outline",
        className: "border-warning bg-transparent text-warning",
      },
      {
        severity: "warning",
        appearance: "solid",
        className: "border-warning bg-warning text-warning-foreground",
      },

      {
        severity: "danger",
        appearance: "soft",
        className: "border-destructive/20 bg-destructive/10",
      },
      {
        severity: "danger",
        appearance: "outline",
        className: "border-destructive bg-transparent text-destructive",
      },
      {
        severity: "danger",
        appearance: "solid",
        className:
          "border-destructive bg-destructive text-destructive-foreground",
      },

      {
        severity: "info",
        appearance: "soft",
        className: "border-muted bg-muted/40",
      },
      {
        severity: "info",
        appearance: "outline",
        className: "border-muted bg-transparent text-muted-foreground",
      },
      {
        severity: "info",
        appearance: "solid",
        className: "border-muted bg-muted text-muted-foreground",
      },

      {
        severity: "muted",
        appearance: "soft",
        className: "border-border bg-muted/30",
      },
      {
        severity: "muted",
        appearance: "outline",
        className: "border-border bg-transparent text-muted-foreground",
      },
      {
        severity: "muted",
        appearance: "solid",
        className: "border-border bg-muted text-muted-foreground",
      },
    ],
    defaultVariants: {
      size: "md",
      severity: "default",
      appearance: "soft",
      rounded: "lg",
      shadow: "none",
      layout: "start",
      imageMode: "none",
      dismissible: false,
      interactive: false,
    },
  },
);

export const bannerBadgeVariants = cva(
  "inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold",
  {
    variants: {
      severity: {
        default: "bg-muted text-muted-foreground",
        primary: "bg-primary/15 text-primary",
        secondary: "bg-secondary/15 text-secondary",
        success: "bg-success/15 text-success",
        warning: "bg-warning/15 text-warning",
        danger: "bg-destructive/15 text-destructive",
        info: "bg-muted text-muted-foreground",
        muted: "bg-muted text-muted-foreground",
      },
    },
    defaultVariants: {
      severity: "primary",
    },
  },
);

export const bannerTitleVariants = cva("font-bold tracking-tight", {
  variants: {
    size: {
      sm: "text-sm",
      md: "text-lg",
      lg: "text-xl",
      xl: "text-2xl",
      hero: "text-3xl",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export const bannerDescriptionVariants = cva("text-muted-foreground ", {
  variants: {
    size: {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-sm",
      xl: "text-base",
      hero: "text-base",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export const bannerActionsVariants = cva("flex flex-wrap items-center gap-2");

export const bannerDismissVariants = cva(
  [
    "absolute z-2 inline-flex shrink-0 cursor-pointer items-center justify-center",
    "rounded-full border border-border/40 bg-background/50 text-muted-foreground shadow-sm",
    "backdrop-blur-[6px]",
    "transition-[color,background-color,border-color,transform,box-shadow] duration-200 ease-out",
    "hover:border-border/70 hover:bg-background/75 hover:text-foreground hover:shadow",
    "active:scale-95",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "inset-e-2 top-2 size-7 [&_svg]:size-3.5",
        md: "inset-e-3 top-3 size-8 [&_svg]:size-4",
        lg: "inset-e-3 top-3 size-8 [&_svg]:size-4",
        xl: "inset-e-4 top-4 size-9 [&_svg]:size-[18px]",
        hero: "inset-e-4 top-4 size-9 [&_svg]:size-[18px]",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);
