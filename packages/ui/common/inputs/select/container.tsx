"use client";

import { cn } from "@/lib";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "@/components/common/overlay/popover";
import SelectTriggerTemplate from "./comps/trigger";
import SelectBoxFilter from "./comps/filter";
import {
  useRef,
  forwardRef,
  useCallback,
  useState,
  useLayoutEffect,
} from "react";
import { motion } from "framer-motion";
import { SelectContainerProps } from "@/components/common/inputs/select/types";

const SelectContent = forwardRef<
  HTMLDivElement,
  SelectContainerProps & {
    triggerRef: React.RefObject<HTMLButtonElement | null>;
  }
>(
  (
    {
      className,
      onSearch,
      align,
      forceMount,
      fixedContent,
      contentWidth,
      fitContent,
      headerTemplate,
      filter,
      label,
      searchInputPlaceholder,
      loading,
      onOpenChange,
      children,
      layoutScroll,
      maxHeight,
      width,
      open,
      triggerRef,
    },
    ref,
  ) => {
    const [searchText, setSearchText] = useState("");
    const [dropdownWidth, setDropdownWidth] = useState<number | string>();

    const resolveDropdownWidth = useCallback(() => {
      if (fitContent) return undefined;
      if (contentWidth) return contentWidth;

      const measured = triggerRef.current?.offsetWidth;
      if (measured && measured > 0) return measured;

      if (width !== undefined) return width;

      return undefined;
    }, [contentWidth, fitContent, triggerRef, width]);

    useLayoutEffect(() => {
      if (!open || fitContent) return;
      const next = resolveDropdownWidth();
      if (next !== undefined) setDropdownWidth(next);
    }, [open, fitContent, resolveDropdownWidth]);

    useLayoutEffect(() => {
      const el = triggerRef.current;
      if (!el || fitContent) return;

      const update = () => {
        const next = resolveDropdownWidth();
        if (next !== undefined) setDropdownWidth(next);
      };

      update();
      const observer = new ResizeObserver(update);
      observer.observe(el);
      return () => observer.disconnect();
    }, [fitContent, resolveDropdownWidth, triggerRef, width, contentWidth]);

    return (
      <PopoverContent
        ref={ref}
        asChild
        withPortal
        side="bottom"
        avoidCollisions
        collisionPadding={8}
        className={cn("shadow select-none", className?.dropdown?.container, {
          "absolute top-16": fixedContent,
        })}
        style={{ width: dropdownWidth }}
        align={align || "start"}
        forceMount={forceMount}
      >
        <div
          className={cn("rounded-md border border-input-border bg-input", {
            "w-full min-w-full": !fitContent && dropdownWidth !== undefined,
          })}
        >
          {headerTemplate}
          {filter && onSearch && (
            <SelectBoxFilter
              className={className?.dropdown?.header}
              label={label}
              onClose={() => onOpenChange?.(false)}
              onSearch={(value) => {
                setSearchText(value);
                onSearch?.(value);
              }}
              placeholder={searchInputPlaceholder}
              loading={loading}
              searchText={searchText}
            />
          )}
          {layoutScroll ? (
            <motion.ul
              layoutScroll
              id={`${label}-scrollable-list`}
              className={cn(
                "flex max-h-60 flex-col gap-0.5 overflow-x-hidden overflow-y-auto p-2 shadow-sm select-none",
                className?.dropdown?.body,
              )}
            >
              {children}
            </motion.ul>
          ) : (
            <ul
              id={`${label}-scrollable-list`}
              className={cn(
                "flex max-h-60 flex-col gap-2 overflow-x-hidden overflow-y-auto p-2 shadow-sm select-none",
                className?.dropdown?.body,
              )}
            >
              {children}
            </ul>
          )}
        </div>
      </PopoverContent>
    );
  },
);

SelectContent.displayName = "SelectContent";

const SelectTrigger = forwardRef<HTMLButtonElement, SelectContainerProps>(
  ({ labelElement, onClear, filter, scrollable, ...props }, ref) => {
    if (props.disabled) {
      return (
        <div style={{ width: props.width || "100%", height: props.height }}>
          {props.labelTemplate || <SelectTriggerTemplate {...props} />}
        </div>
      );
    }

    return (
      <PopoverTrigger
        ref={ref}
        className={cn("select-none", props.className?.trigger?.container)}
        asChild
      >
        <div style={{ width: props.width || "100%", height: props.height }}>
          {props.labelTemplate || labelElement?.(props.value) || (
            <SelectTriggerTemplate {...props} onClear={onClear} />
          )}
        </div>
      </PopoverTrigger>
    );
  },
);

SelectTrigger.displayName = "SelectTrigger";

export default function SelectContainer({
  onClear,
  onOpenChange,
  onSearch,
  open: openProp,
  ...props
}: SelectContainerProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const { fitContent, filter, ...rest } = props;
  const isOpenControlled = openProp !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = isOpenControlled ? openProp : uncontrolledOpen;

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (!isOpenControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [isOpenControlled, onOpenChange],
  );

  const body = (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <SelectTrigger {...rest} ref={triggerRef} onClear={onClear} />
      <SelectContent
        {...rest}
        open={open}
        filter={filter}
        onSearch={onSearch}
        onOpenChange={handleOpenChange}
        triggerRef={triggerRef}
        fitContent={fitContent}
      />
    </Popover>
  );

  if (props.fixedContent) {
    return (
      <div className="relative w-full">
        <PopoverAnchor>
          <div className="absolute top-0 z-7 h-2 w-2"></div>
        </PopoverAnchor>
        {body}
      </div>
    );
  }

  return body;
}
