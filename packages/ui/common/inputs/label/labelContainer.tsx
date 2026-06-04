"use client";

import { cn } from "@/lib";
import { forwardRef } from "react";
import { cva } from "class-variance-authority";
import { LabelContainerProps } from "@/components/common/inputs/select/types";
import { Info } from "lucide-react";

export const labelContainerVariants = cva(
  "relative flex h-14 w-full cursor-text items-stretch overflow-hidden rounded-lg border bg-input-background text-input-foreground transition-colors duration-200",
  {
    variants: {
      status: {
        primary: "border-input-primary",
        secondary: "border-secondary",
        success: "border-success text-success",
        error: "border-error text-error",
        warning: "border-warning text-warning",
        disabled: "border-disabled text-disabled cursor-not-allowed opacity-50",
        default: "border-input-border ",
      },
      fillType: {
        fill: "",
        stroke: "",
      },
    },
    compoundVariants: [
      {
        status: "error",
        fillType: "stroke",
        className: "[&_*]:!stroke-error",
      },
    ],
    defaultVariants: {
      status: "default",
    },
  },
);

export const labelVariants = cva(
  "absolute min-h-5 cursor-text font-medium pointer-events-none inset-s-4 -translate-y-4 select-none",
  {
    variants: {
      size: {
        xs: "text-[11px] peer-focus:text-[10px]",
        sm: "text-sm peer-focus:text-xs",
        default: "text-sm peer-focus:text-xs",
      },
      focused: {
        true: "-translate-y-7.5",
      },
    },
    defaultVariants: {
      size: "default",
      focused: false,
    },
  },
);

export const messageVariants = cva("h-5 mt-2 px-2 text-start text-xs", {
  variants: {
    status: {
      primary: "text-input-primary",
      secondary: "text-secondary",
      success: "text-success",
      error: "text-error",
      warning: "text-warning",
      disabled: "text-disabled",
      default: "text-muted-foreground",
    },
  },
  defaultVariants: {
    status: "default",
  },
});

/**
 * A container component for form inputs with floating labels and status messages.
 * Supports various states (primary, secondary, success, error, warning, disabled)
 * and different label sizes (xs, sm, default).
 */
const LabelContainer = forwardRef<HTMLDivElement, LabelContainerProps>(
  (
    {
      hasValue,
      focused,
      showMessage,
      label,
      message,
      status,
      fillType,
      size,
      className,
      children,
      onClick,
      width,
      id,
      prefix,
      suffix,
      helperText,
      required,
    },
    ref,
  ) => {
    const isFocused = hasValue || focused;
    const rand = Math.random().toString(36).substring(2, 15);
    const idLabel = id || rand;

    return (
      <div
        id={`${idLabel}-container`}
        className={cn(
          "flex w-full flex-col gap-0.5 bg-input text-input-foreground transition-all",
          className?.wrapper?.container,
        )}
        style={{ width }}
        ref={ref}
      >
        <div
          id={`${idLabel}-body`}
          onClick={onClick}
          className={cn(
            labelContainerVariants({ status, fillType }),
            className?.wrapper?.body,
          )}
          role="group"
          aria-labelledby={label ? `${idLabel}-label` : undefined}
        >
          {prefix ? (
            <div
              className={cn(
                "flex shrink-0 items-center self-stretch px-2 text-muted-foreground",
                className?.wrapper?.prefix,
              )}
            >
              {prefix}
            </div>
          ) : null}

          <div
            className={cn(
              "relative flex min-h-0 min-w-0 flex-1 flex-col justify-end",
              className?.wrapper?.inner,
            )}
          >
            {children}
            {label ? (
              <label
                id={`${idLabel}-label`}
                className={cn(
                  labelVariants({ size, focused: isFocused }),
                  "transition-all duration-300 ease-in-out",
                  prefix && "inset-s-0",
                  className?.wrapper?.label,
                )}
              >
                {label}
                {required ? <span>*</span> : null}
              </label>
            ) : null}
          </div>

          {suffix ? (
            <div
              className={cn(
                "flex shrink-0 items-center self-stretch px-2",
                className?.wrapper?.suffix,
              )}
            >
              {suffix}
            </div>
          ) : null}
        </div>
        {showMessage !== false && !!message && (
          <span
            id={`${idLabel}-message`}
            className={cn(
              messageVariants({ status }),
              className?.wrapper?.message,
            )}
            role="status"
            aria-live="polite"
          >
            {message}
          </span>
        )}
        {helperText && !showMessage ? (
          <div
            id={`${idLabel}-helper-text`}
            className={cn(
              "mt-2 flex h-5 gap-2 px-2 text-start text-xs",
              className?.wrapper?.helperText,
            )}
          >
            <Info className="size-4 text-muted-foreground" />
            {helperText}
          </div>
        ) : null}
      </div>
    );
  },
);

LabelContainer.displayName = "LabelContainer";

export default LabelContainer;
