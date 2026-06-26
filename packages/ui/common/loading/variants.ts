import { cva } from "class-variance-authority";
import type { LoadingSize } from "@/components/common/loading/types";

export const loadingSeverityVariants = cva("", {
  variants: {
    severity: {
      primary: "text-primary",
      muted: "text-muted-foreground",
      success: "text-success",
      warning: "text-warning",
      danger: "text-error",
      info: "text-info",
    },
  },
  defaultVariants: {
    severity: "primary",
  },
});

export const loadingContainerVariants = cva(
  "flex items-center justify-center",
  {
    variants: {
      mode: {
        inline: "relative w-fit",
        overlay: "absolute inset-0 z-9",
        fullscreen: "fixed inset-0 z-10",
      },
      backdrop: {
        none: "",
        subtle: "bg-accent/30",
        solid: "bg-background/80",
        blur: "bg-background/60 backdrop-blur-sm",
      },
    },
    compoundVariants: [
      { mode: "inline", backdrop: "subtle", class: "bg-transparent" },
      { mode: "inline", backdrop: "solid", class: "bg-transparent" },
      { mode: "inline", backdrop: "blur", class: "bg-transparent" },
    ],
    defaultVariants: {
      mode: "inline",
      backdrop: "subtle",
    },
  },
);

export const loadingLabelVariants = cva("text-sm font-medium", {
  variants: {
    severity: {
      primary: "text-foreground",
      muted: "text-muted-foreground",
      success: "text-success",
      warning: "text-warning",
      danger: "text-error",
      info: "text-info",
    },
  },
  defaultVariants: {
    severity: "muted",
  },
});

export const LOADING_SIZE_PX: Record<LoadingSize, number> = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 40,
};
