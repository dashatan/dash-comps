"use client";

import * as React from "react";
import * as CM from "@radix-ui/react-context-menu";
import { Check, ChevronRight, Circle } from "lucide-react";
import { cn } from "@/lib";

const ContextMenu = CM.Root;
const ContextMenuTrigger = CM.Trigger;
const ContextMenuGroup = CM.Group;
const ContextMenuPortal = CM.Portal;
const ContextMenuSub = CM.Sub;
const ContextMenuRadioGroup = CM.RadioGroup;

const itemStyles =
  "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50";
const destructiveItemStyles =
  "text-destructive focus:bg-destructive/10 focus:text-destructive";
const insetStyles = "ps-8";
const indicatorOffsetStyles =
  "absolute start-2 flex h-3.5 w-3.5 items-center justify-center";
const subMenuStyles =
  "bg-popover text-popover-foreground z-7 min-w-[8rem] overflow-hidden rounded-md border p-1 shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2";

const ContextMenuSubTrigger = React.forwardRef<
  React.ComponentRef<typeof CM.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof CM.SubTrigger> & { inset?: boolean }
>(({ className, inset, children, ...props }, ref) => (
  <CM.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
      inset && insetStyles,
      className,
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ms-auto h-4 w-4" />
  </CM.SubTrigger>
));
ContextMenuSubTrigger.displayName = CM.SubTrigger.displayName;

const ContextMenuSubContent = React.forwardRef<
  React.ComponentRef<typeof CM.SubContent>,
  React.ComponentPropsWithoutRef<typeof CM.SubContent>
>(({ className, ...props }, ref) => (
  <CM.SubContent
    ref={ref}
    className={cn(subMenuStyles, className)}
    {...props}
  />
));
ContextMenuSubContent.displayName = CM.SubContent.displayName;

const ContextMenuContent = React.forwardRef<
  React.ComponentRef<typeof CM.Content>,
  React.ComponentPropsWithoutRef<typeof CM.Content>
>(({ className, ...props }, ref) => (
  <CM.Portal>
    <CM.Content
      ref={ref}
      className={cn(subMenuStyles, "animate-in fade-in-80", className)}
      {...props}
    />
  </CM.Portal>
));
ContextMenuContent.displayName = CM.Content.displayName;

const ContextMenuItem = React.forwardRef<
  React.ComponentRef<typeof CM.Item>,
  React.ComponentPropsWithoutRef<typeof CM.Item> & {
    inset?: boolean;
    variant?: "default" | "destructive";
  }
>(({ className, inset, variant = "default", ...props }, ref) => (
  <CM.Item
    ref={ref}
    className={cn(
      itemStyles,
      variant === "destructive" && destructiveItemStyles,
      inset && insetStyles,
      className,
    )}
    {...props}
  />
));
ContextMenuItem.displayName = CM.Item.displayName;

const ContextMenuCheckboxItem = React.forwardRef<
  React.ComponentRef<typeof CM.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof CM.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <CM.CheckboxItem
    ref={ref}
    className={cn(itemStyles, "ps-8 pe-2", className)}
    checked={checked}
    {...props}
  >
    <span className={indicatorOffsetStyles}>
      <CM.ItemIndicator>
        <Check className="h-4 w-4" />
      </CM.ItemIndicator>
    </span>
    {children}
  </CM.CheckboxItem>
));
ContextMenuCheckboxItem.displayName = CM.CheckboxItem.displayName;

const ContextMenuRadioItem = React.forwardRef<
  React.ComponentRef<typeof CM.RadioItem>,
  React.ComponentPropsWithoutRef<typeof CM.RadioItem>
>(({ className, children, ...props }, ref) => (
  <CM.RadioItem
    ref={ref}
    className={cn(itemStyles, "ps-8 pe-2", className)}
    {...props}
  >
    <span className={indicatorOffsetStyles}>
      <CM.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </CM.ItemIndicator>
    </span>
    {children}
  </CM.RadioItem>
));
ContextMenuRadioItem.displayName = CM.RadioItem.displayName;

const ContextMenuLabel = React.forwardRef<
  React.ComponentRef<typeof CM.Label>,
  React.ComponentPropsWithoutRef<typeof CM.Label> & { inset?: boolean }
>(({ className, inset, ...props }, ref) => (
  <CM.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-semibold text-foreground",
      inset && insetStyles,
      className,
    )}
    {...props}
  />
));
ContextMenuLabel.displayName = CM.Label.displayName;

const ContextMenuSeparator = React.forwardRef<
  React.ComponentRef<typeof CM.Separator>,
  React.ComponentPropsWithoutRef<typeof CM.Separator>
>(({ className, ...props }, ref) => (
  <CM.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-border", className)}
    {...props}
  />
));
ContextMenuSeparator.displayName = CM.Separator.displayName;

const ContextMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    className={cn(
      "ms-auto text-xs tracking-widest text-muted-foreground",
      className,
    )}
    {...props}
  />
);
ContextMenuShortcut.displayName = "ContextMenuShortcut";

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
};
