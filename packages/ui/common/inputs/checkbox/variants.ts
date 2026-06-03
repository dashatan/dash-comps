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
    },
    defaultVariants: {
      state: "unchecked",
    },
  },
);

export const checkboxIconVariants = cva("h-4 w-4 transition-all duration-100", {
  variants: {
    state: {
      checked: "scale-110",
      unchecked: "scale-0",
      disabled: "text-muted-foreground",
      loading: "animate-spin",
    },
  },
  defaultVariants: {
    state: "unchecked",
  },
});
