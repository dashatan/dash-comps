import { cva } from "class-variance-authority";

export const otpInputVariants = cva(
  "shrink-0 rounded-sm border transition-all outline-none focus-visible:ring-1 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  {
    variants: {
      size: {
        sm: "size-9",
        md: "size-11",
        lg: "size-14",
      },
      status: {
        default: "border-border text-foreground focus-visible:ring-primary",
        error: "border-error text-error focus-visible:ring-error",
        warning: "border-warning text-warning focus-visible:ring-warning",
        success: "border-success text-success focus-visible:ring-success",
        primary: "border-primary text-primary focus-visible:ring-primary",
        secondary:
          "border-secondary text-secondary focus-visible:ring-secondary",
      },
    },
    defaultVariants: {
      size: "md",
      status: "default",
    },
  },
);
