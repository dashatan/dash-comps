import { cva } from "class-variance-authority";

export const ALERT_ANIMATION_CLASSES = {
  jumpIn: "animate-jump-in",
  shake: "animate-shake",
  bounceIn: "animate-bounce-in",
  flipUp: "animate-flip-up",
  none: "",
} as const;

export type AlertAnimation = keyof typeof ALERT_ANIMATION_CLASSES;

export function resolveAlertAnimation(animation?: AlertAnimation | null) {
  if (!animation || animation === "none") return "";
  return ALERT_ANIMATION_CLASSES[animation];
}

export function resolveLegacyAnimationClass(animation?: string) {
  if (!animation) return ALERT_ANIMATION_CLASSES.jumpIn;
  return animation;
}

export const alertVariants = cva(
  "flex size-full min-w-0 text-foreground transition-colors",
  {
    variants: {
      size: {
        sm: "gap-2 p-3",
        md: "gap-3 p-4",
        lg: "gap-4 p-5",
        xl: "gap-5 p-6",
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
        soft: "rounded-xl border",
        outline: "rounded-xl border bg-transparent",
        ghost: "rounded-xl border border-transparent bg-transparent",
      },
      layout: {
        center:
          "flex-col items-center justify-center text-center [&_[data-slot=alert-actions]]:justify-center",
        start: "flex-col items-start justify-center text-start",
        row: "flex-row items-center justify-start gap-4 text-start",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    compoundVariants: [
      {
        severity: "default",
        appearance: "soft",
        className: "border-border bg-muted/30",
      },
      {
        severity: "default",
        appearance: "outline",
        className: "border-border",
      },

      {
        severity: "primary",
        appearance: "soft",
        className: "border-primary/20 bg-primary/10 text-primary",
      },
      {
        severity: "primary",
        appearance: "outline",
        className: "border-primary text-primary",
      },

      {
        severity: "secondary",
        appearance: "soft",
        className: "border-secondary/20 bg-secondary/10 text-secondary",
      },
      {
        severity: "secondary",
        appearance: "outline",
        className: "border-secondary text-secondary",
      },

      {
        severity: "success",
        appearance: "soft",
        className: "border-success/20 bg-success/10 text-success",
      },
      {
        severity: "success",
        appearance: "outline",
        className: "border-success text-success",
      },

      {
        severity: "warning",
        appearance: "soft",
        className: "border-warning/20 bg-warning/10 text-warning",
      },
      {
        severity: "warning",
        appearance: "outline",
        className: "border-warning text-warning",
      },

      {
        severity: "danger",
        appearance: "soft",
        className: "border-destructive/20 bg-destructive/10 text-destructive",
      },
      {
        severity: "danger",
        appearance: "outline",
        className: "border-destructive text-destructive",
      },

      {
        severity: "info",
        appearance: "soft",
        className: "border-muted bg-muted/40 text-muted-foreground",
      },
      {
        severity: "info",
        appearance: "outline",
        className: "border-muted text-muted-foreground",
      },

      {
        severity: "muted",
        appearance: "soft",
        className: "border-border bg-muted/20 text-icon",
      },
      {
        severity: "muted",
        appearance: "outline",
        className: "border-border text-icon",
      },
      {
        severity: "muted",
        appearance: "ghost",
        className: "text-icon",
      },
    ],
    defaultVariants: {
      size: "md",
      severity: "muted",
      appearance: "ghost",
      layout: "center",
      fullWidth: false,
    },
  },
);

export const alertBodyVariants = cva("flex min-w-0 flex-col", {
  variants: {
    layout: {
      center: "items-center gap-2 text-center",
      start: "items-start gap-2 text-start",
      row: "items-start gap-1 text-start",
    },
    size: {
      sm: "gap-1",
      md: "gap-2",
      lg: "gap-2.5",
      xl: "gap-3",
    },
  },
  defaultVariants: {
    layout: "center",
    size: "md",
  },
});

export const alertIconVariants = cva(
  "inline-flex shrink-0 items-center justify-center [&_svg]:size-full",
  {
    variants: {
      size: {
        sm: "size-8",
        md: "size-10",
        lg: "size-12",
        xl: "size-14",
      },
      severity: {
        default: "text-muted-foreground",
        primary: "text-primary",
        secondary: "text-secondary",
        success: "text-success",
        warning: "text-warning",
        danger: "text-destructive",
        info: "text-muted-foreground",
        muted: "text-icon",
      },
      appearance: {
        soft: "",
        outline: "",
        ghost: "",
      },
    },
    defaultVariants: {
      size: "md",
      severity: "muted",
      appearance: "ghost",
    },
  },
);

export const alertTitleVariants = cva("font-semibold tracking-tight", {
  variants: {
    size: {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
      xl: "text-xl",
    },
    layout: {
      center: "text-center",
      start: "text-start",
      row: "text-start",
    },
  },
  defaultVariants: {
    size: "md",
    layout: "center",
  },
});

export const alertDescriptionVariants = cva("text-muted-foreground", {
  variants: {
    size: {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base",
      xl: "text-lg",
    },
    layout: {
      center: "text-center",
      start: "text-start",
      row: "text-start",
    },
    severity: {
      default: "",
      primary: "text-primary/80",
      secondary: "text-secondary/80",
      success: "text-success/80",
      warning: "text-warning/80",
      danger: "text-destructive/80",
      info: "",
      muted: "",
    },
    appearance: {
      soft: "",
      outline: "",
      ghost: "",
    },
  },
  compoundVariants: [
    {
      appearance: "ghost",
      severity: "muted",
      className: "text-icon/80",
    },
  ],
  defaultVariants: {
    size: "md",
    layout: "center",
    severity: "muted",
    appearance: "ghost",
  },
});

export const alertActionsVariants = cva(
  "flex flex-wrap items-center gap-2 pt-1",
);

export const alertDividerVariants = cva("rounded-full bg-border", {
  variants: {
    size: {
      sm: "h-px w-14",
      md: "h-px w-16",
      lg: "h-px w-20",
      xl: "h-px w-24",
    },
  },
  defaultVariants: {
    size: "md",
  },
});
