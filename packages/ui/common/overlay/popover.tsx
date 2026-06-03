"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import { cn } from "@/lib";

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverAnchor = PopoverPrimitive.Anchor;

const PopoverContent = React.forwardRef<
  React.ComponentRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> & {
    withPortal?: boolean;
  }
>(
  (
    {
      className,
      align = "center",
      sideOffset = 4,
      withPortal = false,
      forceMount,
      ...props
    },
    ref,
  ) => {
    return withPortal ? (
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          ref={ref}
          align={align}
          sideOffset={sideOffset}
          forceMount={forceMount}
          className={cn(
            "z-50 rounded-lg outline-none",
            "data-[state=open]:animate-in duration-300",
            "data-[state=closed]:animate-out data-[state=closed]:pointer-events-none data-[state=closed]:duration-200",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
            "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
            className,
          )}
          {...props}
        />
      </PopoverPrimitive.Portal>
    ) : (
      <PopoverPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        forceMount={forceMount}
        asChild
        className={cn(
          "z-7 rounded-lg border outline-none",
          "data-[state=open]:animate-in duration-300",
          "data-[state=closed]:animate-out data-[state=closed]:pointer-events-none data-[state=closed]:duration-200",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:slide-out-to-top-4 data-[state=open]:slide-in-from-top-4",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "data-[side=bottom]:slide-in-from-top-4 data-[side=left]:slide-in-from-right-4",
          "data-[side=right]:slide-in-from-left-4 data-[side=top]:slide-in-from-bottom-4",
          className,
        )}
        {...props}
      />
    );
  },
);
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
