import { cva } from "class-variance-authority";

export const checkboxVariants = cva(
  "flex h-7 w-7 min-w-7 min-h-7 cursor-pointer items-center justify-center rounded-lg border transition-all duration-100 focus-visible:outline-none focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background ",
  {
    variants: {
      state: {
        checked: "",
        unchecked: "border-border",
        disabled: "border-border bg-muted cursor-default",
      },
      severity: {
        primary: "border-primary",
        secondary: "border-secondary",
        success: "border-success",
        warning: "border-warning",
        danger: "border-danger",
        info: "border-info",
        input: "border-input",
        muted: "border-muted",
        default: "border-border",
      },
    },
    defaultVariants: {
      state: "unchecked",
      severity: "default",
    },
  },
);

export const checkboxIconVariants = cva("h-4 w-4 transition-all duration-100", {
  variants: {
    state: {
      checked: "scale-110",
      unchecked: "scale-0",
      disabled: "text-muted-foreground cursor-default",
      loading: "animate-spin",
    },
    severity: {
      primary: "text-primary",
      secondary: "text-secondary",
      success: "text-success",
      warning: "text-warning",
      danger: "text-danger",
      info: "text-info",
      input: "text-input",
      muted: "text-muted",
      default: "text-foreground",
    },
  },
  defaultVariants: {
    state: "unchecked",
    severity: "default",
  },
});
