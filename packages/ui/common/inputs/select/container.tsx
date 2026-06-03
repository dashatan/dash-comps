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
import { useRef, forwardRef, useCallback, useState } from "react";
import { SelectContainerProps } from "@/components/common/inputs/select/types";

const SelectContent = forwardRef<
  HTMLDivElement,
  SelectContainerProps & { triggerRef: React.RefObject<HTMLButtonElement | null> }
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
      scrollable,
      maxHeight,
      triggerRef,
    },
    ref,
  ) => {
    const [searchText, setSearchText] = useState("");

    const getContentWidth = useCallback(() => {
      if (fitContent) return;
      if (contentWidth) return contentWidth;
      return triggerRef.current?.offsetWidth;
    }, [contentWidth, fitContent, triggerRef]);

    return (
      <PopoverContent
        ref={ref}
        asChild
        withPortal
        side="bottom"
        avoidCollisions
        collisionPadding={8}
        className={cn("shadow", className?.dropdown?.container, {
          "absolute top-16": fixedContent,
        })}
        style={{ width: getContentWidth() }}
        align={align || "start"}
        forceMount={forceMount}
      >
        <div className="bg-input border-input rounded-md border">
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
          <ul
            id={`${label}-scrollable-list`}
            className={cn(
              "flex flex-col gap-2 overflow-x-hidden overflow-y-hidden p-2 shadow-sm",
              { "overflow-y-auto [scrollbar-gutter:stable]": scrollable },
              className?.dropdown?.body,
            )}
            style={{ maxHeight: scrollable ? maxHeight || "300px" : undefined }}
          >
            {children}
          </ul>
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
      <PopoverTrigger ref={ref} className={props.className?.trigger?.container} asChild>
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
  ...props
}: SelectContainerProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const { fitContent, filter, ...rest } = props;

  const body = (
    <Popover open={props.open} onOpenChange={onOpenChange}>
      <SelectTrigger {...rest} ref={triggerRef} onClear={onClear} />
      <SelectContent
        {...rest}
        filter={filter}
        onSearch={onSearch}
        onOpenChange={onOpenChange}
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
