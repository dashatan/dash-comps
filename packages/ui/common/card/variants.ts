import { cva } from "class-variance-authority";

export const cardVariants = cva(
  "group/card relative flex w-full min-w-0 overflow-hidden border text-card-foreground transition-[box-shadow,border-color,background-color,transform]",
  {
    variants: {
      size: {
        sm: "gap-3",
        md: "gap-4",
        lg: "gap-5",
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
        ghost: "border-transparent bg-transparent shadow-none",
      },
      rounded: {
        none: "rounded-none",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-xl",
        "2xl": "rounded-2xl",
      },
      shadow: {
        none: "",
        sm: "shadow-sm",
        md: "shadow-md",
        lg: "shadow-lg",
      },
      orientation: {
        vertical: "flex-col",
        horizontal: "flex-col sm:flex-row",
      },
      divided: {
        true: "",
        false: "",
      },
      interactive: {
        true: "cursor-pointer hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        false: "",
      },
      selected: {
        true: "border-primary ring-1 ring-primary/20",
        false: "",
      },
    },
    compoundVariants: [
      {
        severity: "default",
        appearance: "soft",
        className: "border-border bg-card",
      },
      {
        severity: "default",
        appearance: "outline",
        className: "border-border bg-transparent",
      },
      {
        severity: "default",
        appearance: "solid",
        className: "border-border bg-card-accent",
      },

      {
        severity: "primary",
        appearance: "soft",
        className: "border-primary/20 bg-primary/5",
      },
      {
        severity: "primary",
        appearance: "outline",
        className: "border-primary bg-transparent",
      },
      {
        severity: "primary",
        appearance: "solid",
        className: "border-primary bg-primary text-primary-foreground",
      },

      {
        severity: "secondary",
        appearance: "soft",
        className: "border-secondary/20 bg-secondary/5",
      },
      {
        severity: "secondary",
        appearance: "outline",
        className: "border-secondary bg-transparent",
      },
      {
        severity: "secondary",
        appearance: "solid",
        className: "border-secondary bg-secondary text-secondary-foreground",
      },

      {
        severity: "success",
        appearance: "soft",
        className: "border-success/20 bg-success/5",
      },
      {
        severity: "success",
        appearance: "outline",
        className: "border-success bg-transparent",
      },
      {
        severity: "success",
        appearance: "solid",
        className: "border-success bg-success text-success-foreground",
      },

      {
        severity: "warning",
        appearance: "soft",
        className: "border-warning/20 bg-warning/5",
      },
      {
        severity: "warning",
        appearance: "outline",
        className: "border-warning bg-transparent",
      },
      {
        severity: "warning",
        appearance: "solid",
        className: "border-warning bg-warning text-warning-foreground",
      },

      {
        severity: "danger",
        appearance: "soft",
        className: "border-destructive/20 bg-destructive/5",
      },
      {
        severity: "danger",
        appearance: "outline",
        className: "border-destructive bg-transparent",
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
        className: "border-muted bg-muted/30",
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
        className: "border-border/70 bg-muted/20",
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

      {
        interactive: true,
        appearance: "ghost",
        className: "hover:bg-muted/40",
      },
      {
        interactive: true,
        appearance: ["soft", "outline"],
        className: "hover:border-primary/40",
      },
    ],
    defaultVariants: {
      size: "md",
      severity: "default",
      appearance: "soft",
      rounded: "xl",
      shadow: "sm",
      orientation: "vertical",
      divided: false,
      interactive: false,
      selected: false,
    },
  },
);

export const cardSectionVariants = cva("", {
  variants: {
    section: {
      header:
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 has-data-[slot=card-action]:grid-cols-[1fr_auto]",
      content: "",
      footer: "flex flex-wrap items-center gap-2",
    },
    size: {
      sm: "",
      md: "",
      lg: "",
    },
    divided: {
      true: "",
      false: "",
    },
  },
  compoundVariants: [
    {
      section: "header",
      size: "sm",
      className: "px-4 pt-4",
    },
    {
      section: "header",
      size: "md",
      className: "px-6 pt-6",
    },
    {
      section: "header",
      size: "lg",
      className: "px-8 pt-8",
    },
    {
      section: "content",
      size: "sm",
      className: "px-4",
    },
    {
      section: "content",
      size: "md",
      className: "px-6",
    },
    {
      section: "content",
      size: "lg",
      className: "px-8",
    },
    {
      section: "footer",
      size: "sm",
      className: "px-4 pb-4",
    },
    {
      section: "footer",
      size: "md",
      className: "px-6 pb-6",
    },
    {
      section: "footer",
      size: "lg",
      className: "px-8 pb-8",
    },
    {
      section: "header",
      divided: true,
      className: "border-b border-border/60 pb-4",
    },
    {
      section: "footer",
      divided: true,
      className: "border-t border-border/60 pt-4",
    },
  ],
  defaultVariants: {
    section: "content",
    size: "md",
    divided: false,
  },
});

export const cardTitleVariants = cva("font-semibold tracking-tight", {
  variants: {
    size: {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export const cardDescriptionVariants = cva("text-muted-foreground", {
  variants: {
    size: {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-sm",
    },
    solid: {
      true: "text-current/75",
      false: "",
    },
  },
  defaultVariants: {
    size: "md",
    solid: false,
  },
});

export const cardBadgeVariants = cva(
  "inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
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
        muted: "bg-muted/80 text-muted-foreground",
      },
    },
    defaultVariants: {
      severity: "primary",
    },
  },
);

export const cardMediaVariants = cva(
  "relative shrink-0 overflow-hidden bg-muted",
  {
    variants: {
      aspect: {
        auto: "",
        square: "aspect-square",
        video: "aspect-video",
        wide: "aspect-21/9",
      },
      fit: {
        cover: "[&_img]:object-cover",
        contain: "[&_img]:object-contain",
      },
      position: {
        top: "w-full",
        start: "w-full sm:w-2/5 ",
        end: "order-first w-full sm:order-last sm:w-2/5 ",
      },
    },
    defaultVariants: {
      aspect: "video",
      fit: "cover",
      position: "top",
    },
  },
);

export const cardActionsVariants = cva("flex flex-wrap items-center gap-2");

export const cardActionVariants = cva(
  "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
);
