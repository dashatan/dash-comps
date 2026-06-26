import { cva } from "class-variance-authority";

export const carouselVariants = cva("relative flex w-full min-w-0 flex-col", {
  variants: {
    size: {
      sm: "gap-2",
      md: "gap-3",
      lg: "gap-4",
    },
    rounded: {
      none: "",
      md: "",
      lg: "",
      xl: "",
      "2xl": "",
    },
    orientation: {
      horizontal: "",
      vertical: "",
    },
  },
  defaultVariants: {
    size: "md",
    rounded: "xl",
    orientation: "horizontal",
  },
});

export const carouselViewportVariants = cva(
  "relative isolate w-full min-w-0 overflow-hidden bg-muted/20",
  {
    variants: {
      size: {
        sm: "",
        md: "",
        lg: "",
      },
      transition: {
        slide: "h-auto",
        fade: "",
      },
      rounded: {
        none: "rounded-none",
        md: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-xl",
        "2xl": "rounded-2xl",
      },
      orientation: {
        horizontal: "",
        vertical: "h-72",
      },
    },
    compoundVariants: [
      { transition: "fade", size: "sm", className: "h-36" },
      { transition: "fade", size: "md", className: "h-48" },
      { transition: "fade", size: "lg", className: "h-60" },
      { transition: "fade", orientation: "vertical", className: "h-72" },
    ],
    defaultVariants: {
      size: "md",
      transition: "slide",
      rounded: "xl",
      orientation: "horizontal",
    },
  },
);

export const carouselTrackVariants = cva(
  "flex touch-pan-y will-change-transform",
  {
    variants: {
      transition: {
        slide: "h-auto items-start",
        fade: "relative h-full w-full",
      },
      orientation: {
        horizontal: "flex-row",
        vertical: "flex-col",
      },
      gap: {
        none: "gap-0",
        sm: "gap-2",
        md: "gap-4",
        lg: "gap-6",
      },
      dragging: {
        true: "transition-none",
        false:
          "transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]",
      },
    },
    defaultVariants: {
      transition: "slide",
      orientation: "horizontal",
      gap: "none",
      dragging: false,
    },
  },
);

export const carouselItemVariants = cva("relative shrink-0 self-start", {
  variants: {
    transition: {
      slide: "min-w-0",
      fade: "absolute inset-0 transition-opacity duration-500 ease-out",
    },
    orientation: {
      horizontal: "",
      vertical: "w-full",
    },
    visible: {
      true: "",
      false: "",
    },
    fixedHeight: {
      true: "h-full min-h-0",
      false: "",
    },
  },
  compoundVariants: [
    {
      transition: "fade",
      visible: true,
      className: "pointer-events-auto z-1 opacity-100",
    },
    {
      transition: "fade",
      visible: false,
      className: "pointer-events-none z-0 opacity-0",
    },
  ],
  defaultVariants: {
    transition: "slide",
    orientation: "horizontal",
    visible: false,
    fixedHeight: false,
  },
});

export const carouselControlVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center border transition-[background-color,opacity,transform] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variant: {
        ghost:
          "border-transparent bg-background/70 text-foreground shadow-none backdrop-blur-sm hover:bg-background/90",
        outline:
          "border-border bg-background/85 text-foreground shadow-sm backdrop-blur-sm hover:bg-background",
        solid:
          "border-transparent bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
      },
      size: {
        sm: "size-8",
        md: "size-9",
        lg: "size-11",
      },
      rounded: {
        md: "rounded-md",
        full: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "outline",
      size: "md",
      rounded: "full",
    },
  },
);

export const carouselControlsGroupVariants = cva(
  "pointer-events-none absolute inset-0 z-10 flex items-center justify-between px-3",
  {
    variants: {
      position: {
        inside: "",
        outside: "static inset-auto z-auto h-auto px-0",
        bottom: "static inset-auto z-auto h-auto justify-center gap-3 px-0",
      },
    },
    defaultVariants: {
      position: "inside",
    },
  },
);

export const carouselIndicatorsVariants = cva(
  "flex items-center justify-center",
  {
    variants: {
      variant: {
        dots: "gap-1.5",
        bars: "gap-1.5",
        pills: "gap-1.5",
        fraction: "",
        progress: "w-full",
      },
      position: {
        bottom:
          "pointer-events-none absolute inset-x-0 bottom-0 z-10 px-4 pb-3 pt-8",
        "bottom-outside": "mt-2 w-full",
        overlay:
          "pointer-events-none absolute inset-x-0 bottom-0 z-10 px-4 pb-3 pt-8",
      },
      size: {
        sm: "",
        md: "",
        lg: "",
      },
    },
    defaultVariants: {
      variant: "dots",
      position: "bottom",
      size: "md",
    },
  },
);

export const carouselIndicatorVariants = cva(
  "pointer-events-auto cursor-pointer transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  {
    variants: {
      variant: {
        dots: "rounded-full",
        bars: "rounded-full",
        pills: "rounded-full",
        fraction: "",
        progress: "",
      },
      size: {
        sm: "",
        md: "",
        lg: "",
      },
      active: {
        true: "bg-primary",
        false: "bg-primary/35 hover:bg-primary/55",
      },
    },
    compoundVariants: [
      { variant: "dots", size: "sm", className: "size-1.5" },
      { variant: "dots", size: "md", className: "size-2" },
      { variant: "dots", size: "lg", className: "size-2.5" },
      { variant: "dots", active: true, className: "scale-110" },

      { variant: "bars", size: "sm", className: "h-1 w-7" },
      { variant: "bars", size: "md", className: "h-1.5 w-10" },
      { variant: "bars", size: "lg", className: "h-2 w-12" },
      { variant: "bars", active: true, className: "bg-primary" },
      {
        variant: "bars",
        active: false,
        className: "bg-primary/35 hover:bg-primary/55",
      },

      { variant: "pills", size: "sm", className: "h-1.5 w-5" },
      { variant: "pills", size: "md", className: "h-2 w-6" },
      { variant: "pills", size: "lg", className: "h-2.5 w-7" },
      { variant: "pills", active: true, className: "w-9 bg-primary" },
    ],
    defaultVariants: {
      variant: "dots",
      size: "md",
      active: false,
    },
  },
);

export const carouselProgressVariants = cva(
  "pointer-events-auto h-1 w-full overflow-hidden rounded-full bg-primary/25",
  {
    variants: {
      size: {
        sm: "h-0.5",
        md: "h-1",
        lg: "h-1.5",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export const carouselFractionVariants = cva(
  "pointer-events-auto rounded-full bg-background/85 px-3 py-1 text-xs font-medium tabular-nums text-foreground shadow-sm backdrop-blur-sm",
  {
    variants: {
      size: {
        sm: "text-[10px]",
        md: "text-xs",
        lg: "text-sm",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export const GAP_PX = {
  none: 0,
  sm: 8,
  md: 16,
  lg: 24,
} as const;
