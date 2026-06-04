import { cva } from "class-variance-authority";

export const switchTrackVariants = cva(
  "flex items-center justify-end rounded-full bg-switch-background cursor-pointer transition-colors duration-200 select-none dir-rtl",
  {
    variants: {
      size: {
        xs: "h-3.5 min-w-7 p-px",
        sm: "h-5 min-w-10 p-px",
        md: "h-6 min-w-12 p-px",
        lg: "h-7 min-w-14 p-px",
        xl: "h-8 min-w-16 p-px",
        "2xl": "h-10 min-w-20 p-px",
      },
      active: {
        true: "",
        false: "",
      },
      severity: {
        primary: "",
        secondary: "",
        success: "",
        warning: "",
        danger: "",
        info: "",
      },
    },
    compoundVariants: [
      { active: true, severity: "primary", class: "bg-primary" },
      { active: true, severity: "secondary", class: "bg-secondary" },
      { active: true, severity: "success", class: "bg-success" },
      { active: true, severity: "warning", class: "bg-warning" },
      { active: true, severity: "danger", class: "bg-error" },
      { active: true, severity: "info", class: "bg-info" },
    ],
    defaultVariants: {
      size: "md",
      active: false,
      severity: "primary",
    },
  },
);

export const switchThumbVariants = cva(
  "shrink-0 rounded-full bg-switch-foreground font-semibold will-change-transform transition-all duration-200 ease-in-out motion-reduce:transition-none",
  {
    variants: {
      size: {
        xs: "size-2.5",
        sm: "size-4",
        md: "size-5",
        lg: "size-6",
        xl: "size-7",
        "2xl": "size-9",
      },
      active: {
        true: "",
        false: "",
      },
      severity: {
        primary: "",
        secondary: "",
        success: "",
        warning: "",
        danger: "",
        info: "",
      },
    },
    compoundVariants: [
      { size: "xs", active: false, class: "scale-75" },
      { size: "xs", active: true, class: "translate-x-3.5 scale-90" },
      { size: "sm", active: false, class: "5 scale-75" },
      { size: "sm", active: true, class: "translate-x-5 " },
      { size: "md", active: false, class: "scale-75" },
      { size: "md", active: true, class: "translate-x-6 scale-90" },
      { size: "lg", active: false, class: "scale-75" },
      { size: "lg", active: true, class: "translate-x-7 scale-90" },
      { size: "xl", active: false, class: "5 scale-75" },
      { size: "xl", active: true, class: "translate-x-8 scale-90" },
      { size: "2xl", active: false, class: "scale-75" },
      { size: "2xl", active: true, class: "translate-x-10 scale-90" },
      { active: true, severity: "primary", class: "bg-primary-foreground" },
      { active: true, severity: "secondary", class: "bg-secondary-foreground" },
      { active: true, severity: "success", class: "bg-success-foreground" },
      { active: true, severity: "warning", class: "bg-warning-foreground" },
      { active: true, severity: "danger", class: "bg-error-foreground" },
      { active: true, severity: "info", class: "bg-info-foreground" },
    ],
    defaultVariants: {
      size: "md",
      active: false,
      severity: "primary",
    },
  },
);
