import { cva } from "class-variance-authority";

export const collapsibleVariants = cva("", {
  variants: {
    variant: {
      default: "border-border",
      ghost: "border-transparent",
      outline: "border-border bg-transparent",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});
