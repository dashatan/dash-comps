import { cva } from "class-variance-authority";

export const paginationVariants = cva("mx-auto flex px-2 justify-center", {
  variants: {
    variant: {
      default: "",
      ghost: "bg-transparent",
      outline: "border border-border bg-transparent",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});
