import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "relative inline-flex items-center select-none justify-center border-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ring-offset-background disabled:opacity-60 disabled:pointer-events-none cursor-pointer w-fit",
  {
    variants: {
      variant: {
        contained: "border-transparent",
        outlined: "",
        text: "border-transparent",
        icon: "border-transparent p-0",
        "icon-button": "p-0",
      },
      severity: {
        primary: "",
        secondary: "",
        success: "",
        warning: "",
        danger: "",
        info: "",
        input: "",
        muted: "",
      },
      size: {
        xs: "text-xs h-6",
        sm: "text-sm h-8",
        md: "text-base h-10",
        lg: "text-lg h-12",
        xl: "text-xl h-14",
      },
      rounded: {
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        full: "rounded-full",
        circle: "aspect-square rounded-full",
      },
      hasFixedSize: {
        true: "p-0",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    compoundVariants: [
      // Sizes
      {
        variant: ["contained", "outlined", "text"],
        size: "xs",
        hasFixedSize: false,
        class: "px-2 gap-1",
      },
      {
        variant: ["contained", "outlined", "text"],
        size: "sm",
        hasFixedSize: false,
        class: "px-3 gap-1.5",
      },
      {
        variant: ["contained", "outlined", "text"],
        size: "md",
        hasFixedSize: false,
        class: "px-4 gap-2",
      },
      {
        variant: ["contained", "outlined", "text"],
        size: "lg",
        hasFixedSize: false,
        class: "px-6 gap-2.5",
      },
      {
        variant: ["contained", "outlined", "text"],
        size: "xl",
        hasFixedSize: false,
        class: "px-8 gap-3",
      },

      // Primary
      {
        severity: "primary",
        variant: "contained",
        class:
          "bg-primary text-primary-foreground hover:bg-primary-hover focus-visible:ring-primary ",
      },
      {
        severity: "primary",
        variant: "outlined",
        class:
          "bg-primary/5 border-primary text-primary hover:bg-primary/30 focus-visible:ring-primary",
      },
      {
        severity: "primary",
        variant: ["icon", "icon-button"],
        class:
          "text-primary-foreground bg-primary hover:bg-primary-hover focus-visible:ring-primary",
      },
      {
        severity: "primary",
        variant: "text",
        class:
          "text-primary bg-primary/5 hover:bg-primary/10 focus-visible:ring-primary",
      },

      // Secondary
      {
        severity: "secondary",
        variant: "contained",
        class:
          "bg-secondary text-secondary-foreground hover:bg-secondary-hover focus-visible:ring-secondary",
      },
      {
        severity: "secondary",
        variant: "outlined",
        class:
          "bg-secondary/5 border-secondary text-secondary hover:bg-secondary/10 focus-visible:ring-secondary",
      },
      {
        severity: "secondary",
        variant: ["icon", "icon-button"],
        class:
          "text-secondary-foreground bg-secondary hover:bg-secondary-hover focus-visible:ring-secondary",
      },
      {
        severity: "secondary",
        variant: "text",
        class:
          "text-secondary bg-secondary/5 hover:bg-secondary/10 focus-visible:ring-secondary",
      },

      // Success
      {
        severity: "success",
        variant: "contained",
        class:
          "bg-success text-success-foreground hover:bg-success-hover focus-visible:ring-success",
      },
      {
        severity: "success",
        variant: "outlined",
        class:
          "bg-success/5 border-success text-success hover:bg-success/10 focus-visible:ring-success",
      },
      {
        severity: "success",
        variant: ["icon", "icon-button"],
        class:
          "text-success-foreground bg-success hover:bg-success-hover focus-visible:ring-success",
      },
      {
        severity: "success",
        variant: "text",
        class:
          "text-success bg-success/5 hover:bg-success/10 focus-visible:ring-success",
      },

      // Warning
      {
        severity: "warning",
        variant: "contained",
        class:
          "bg-warning text-warning-foreground hover:bg-warning-hover focus-visible:ring-warning",
      },
      {
        severity: "warning",
        variant: "outlined",
        class:
          "bg-warning/5 border-warning text-warning hover:bg-warning/10 focus-visible:ring-warning",
      },
      {
        severity: "warning",
        variant: ["icon", "icon-button"],
        class:
          "text-warning-foreground bg-warning hover:bg-warning-hover focus-visible:ring-warning",
      },
      {
        severity: "warning",
        variant: "text",
        class:
          "text-warning bg-warning/5 hover:bg-warning/10 focus-visible:ring-warning",
      },

      // Danger
      {
        severity: "danger",
        variant: "contained",
        class:
          "bg-destructive text-destructive-foreground hover:bg-destructive-hover focus-visible:ring-destructive",
      },
      {
        severity: "danger",
        variant: "outlined",
        class:
          "bg-destructive/5 border-destructive text-destructive hover:bg-destructive/10 focus-visible:ring-destructive",
      },
      {
        severity: "danger",
        variant: "text",
        class:
          "text-destructive bg-destructive/5 hover:bg-destructive/10 focus-visible:ring-destructive",
      },
      {
        severity: "danger",
        variant: ["icon", "icon-button"],
        class:
          "text-destructive-foreground bg-destructive hover:bg-destructive-hover focus-visible:ring-destructive",
      },

      // Info
      {
        severity: "info",
        variant: "contained",
        class:
          "bg-muted text-muted-foreground hover:bg-muted-hover focus-visible:ring-muted",
      },
      {
        severity: "info",
        variant: "outlined",
        class:
          "bg-muted/10 border-muted-border text-muted-foreground hover:bg-muted/300 focus-visible:ring-muted",
      },
      {
        severity: "info",
        variant: ["icon", "icon-button"],
        class:
          "text-muted-foreground bg-muted hover:bg-muted-hover focus-visible:ring-muted",
      },
      {
        severity: "info",
        variant: "text",
        class:
          "text-muted bg-muted/5 hover:bg-muted/10 focus-visible:ring-muted",
      },

      // input
      {
        severity: "input",
        class:
          "bg-input text-input-foreground hover:bg-input-hover focus-visible:ring-input border-input-border",
      },
      {
        severity: "input",
        variant: "outlined",
        class:
          "bg-input/5 border-input-border text-input-foreground hover:bg-input/10 focus-visible:ring-input",
      },
      {
        severity: "input",
        variant: ["icon", "icon-button"],
        class:
          "text-input-foreground bg-input hover:bg-input-hover focus-visible:ring-input",
      },
      {
        severity: "input",
        variant: "text",
        class:
          "text-input-foreground bg-input/5 hover:bg-input/10 focus-visible:ring-input",
      },

      // muted
      {
        severity: "muted",
        variant: "contained",
        class:
          "bg-muted text-muted-foreground hover:bg-muted-hover focus-visible:ring-muted",
      },
      {
        severity: "muted",
        variant: "outlined",
        class:
          "bg-muted/5 border-muted text-muted hover:bg-muted/10 focus-visible:ring-muted",
      },
      {
        severity: "muted",
        variant: ["icon", "icon-button"],
        class:
          "text-muted-foreground bg-muted hover:bg-muted-hover focus-visible:ring-muted",
      },
      {
        severity: "muted",
        variant: "text",
        class:
          "text-muted-foreground bg-muted/5 hover:bg-muted/10 focus-visible:ring-muted",
      },

      // icon-button sizes
      {
        variant: "icon-button",
        size: "md",
        class: "size-10 min-w-10 p-0",
      },
      {
        variant: "icon-button",
        size: "sm",
        class: "size-8 min-w-8 p-0",
      },
      {
        variant: "icon-button",
        size: "xs",
        class: "size-6 min-w-6 p-0",
      },
      {
        variant: "icon-button",
        size: "lg",
        class: "size-12 min-w-12 p-0",
      },
      {
        variant: "icon-button",
        size: "xl",
        class: "size-14 min-w-14 p-0",
      },

      // icon-button severities
      {
        variant: "icon-button",
        severity: "input",
        class: "border p-0 text-icon",
      },
    ],
    defaultVariants: {
      variant: "contained",
      severity: "primary",
      size: "md",
      rounded: "md",
    },
  },
);
