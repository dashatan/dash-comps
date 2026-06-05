import { cva } from "class-variance-authority";

export const avatarVariants = cva(
  "relative inline-flex shrink-0 items-center justify-center overflow-hidden select-none",
  {
    variants: {
      size: {
        xs: "size-6 min-w-6 min-h-6 text-[10px]",
        sm: "size-8 min-w-8 min-h-8 text-xs",
        md: "size-10 min-w-10 min-h-10 text-sm",
        lg: "size-12 min-w-12 min-h-12 text-base",
        xl: "size-14 min-w-14 min-h-14 text-lg",
        "2xl": "size-16 min-w-16 min-h-16 text-xl",
        "3xl": "size-20 min-w-20 min-h-20 text-2xl",
      },
      shape: {
        circle: "rounded-full",
        rounded: "rounded-lg",
        square: "rounded-none",
      },
      border: {
        none: "",
        default: "border-2 border-border",
        background: "border-2 border-background",
        ring: "ring-2 ring-primary ring-offset-2 ring-offset-background",
      },
      interactive: {
        true: "cursor-pointer transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        false: "",
      },
      disabled: {
        true: "pointer-events-none opacity-50 grayscale",
        false: "",
      },
    },
    defaultVariants: {
      size: "md",
      shape: "circle",
      border: "none",
      interactive: false,
      disabled: false,
    },
  },
);

export const avatarFallbackVariants = cva(
  "flex h-full w-full items-center justify-center font-semibold uppercase leading-none",
  {
    variants: {
      severity: {
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
      severity: "muted",
    },
  },
);

export const avatarStatusVariants = cva(
  "absolute z-10 block rounded-full ring-2 ring-background",
  {
    variants: {
      status: {
        online: "bg-success",
        offline: "bg-muted-foreground",
        busy: "bg-destructive",
        away: "bg-warning",
      },
      size: {
        xs: "size-1.5",
        sm: "size-2",
        md: "size-2.5",
        lg: "size-3",
        xl: "size-3.5",
        "2xl": "size-4",
        "3xl": "size-4",
      },
      position: {
        "bottom-end": "bottom-0 end-0 translate-x-1/4 translate-y-1/4",
        "bottom-start": "bottom-0 start-0 -translate-x-1/4 translate-y-1/4",
        "top-end": "top-0 end-0 translate-x-1/4 -translate-y-1/4",
        "top-start": "top-0 start-0 -translate-x-1/4 -translate-y-1/4",
      },
    },
    defaultVariants: {
      status: "online",
      size: "md",
      position: "bottom-end",
    },
  },
);

export const avatarGroupVariants = cva("flex items-center", {
  variants: {
    spacing: {
      overlap: "",
      gap: "gap-2",
    },
  },
  defaultVariants: {
    spacing: "overlap",
  },
});
