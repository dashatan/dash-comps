"use client";

import { cn } from "@/lib";
import { forwardRef, useCallback, useEffect, useState } from "react";
import { Check, Loader2, Minus } from "lucide-react";
import { checkboxVariants, checkboxIconVariants } from "./variants";
import type { VariantProps } from "class-variance-authority";

export interface BasicCheckboxProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">,
    VariantProps<typeof checkboxVariants> {
  /** Whether the checkbox is checked */
  checked?: boolean;
  /** Whether the checkbox is in an indeterminate state */
  halfChecked?: boolean;
  /** Callback when checked state changes */
  onChange?: (checked: boolean) => void;
  /** Whether the checkbox is disabled */
  disabled?: boolean;
  /** Whether the checkbox is in a loading state */
  loading?: boolean;
  /** Unique identifier for the checkbox */
  id?: string;
  /** Callback when a key is pressed */
  onKeyDown?: (e: React.KeyboardEvent) => void;
  /** Accessible label for the checkbox */
  "aria-label"?: string;
  /** Name attribute for form submission */
  name?: string;
  /** Value attribute for form submission */
  value?: string;
  /** Additional class name for the checkbox icon */
  iconClassName?: string;
  checkboxClassName?: string;
  label?: string;
  description?: string;
  width?: number | string;
  minWidth?: number | string;
  boxed?: boolean;
}

const CheckboxIcon = ({
  checked,
  halfChecked,
  loading,
  disabled,
  className,
}: {
  checked?: boolean;
  halfChecked?: boolean;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}) => {
  if (loading) {
    return (
      <Loader2 className={cn(checkboxIconVariants({ state: "loading" }), className)} />
    );
  }

  if (halfChecked) {
    return (
      <Minus className={cn(checkboxIconVariants({ state: "checked" }), className)} />
    );
  }

  return (
    <Check
      className={cn(
        checkboxIconVariants({
          state: checked ? "checked" : disabled ? "disabled" : "unchecked",
        }),
        className,
      )}
    />
  );
};

const CheckboxBasic = forwardRef<HTMLDivElement, BasicCheckboxProps>(
  (
    {
      checked: initialChecked = false,
      halfChecked,
      onChange,
      className,
      disabled,
      loading,
      id,
      onKeyDown,
      "aria-label": ariaLabel,
      name,
      value,
      iconClassName,
      label,
      description,
      width,
      minWidth,
      checkboxClassName,
      boxed = false,
      ...props
    },
    ref,
  ) => {
    const [checked, setChecked] = useState(initialChecked);
    const checkboxId = id || `checkbox-${Math.random().toString(36).substring(2, 9)}`;

    useEffect(() => {
      setChecked(initialChecked);
    }, [initialChecked]);

    const handleClick = useCallback(() => {
      if (disabled) return;
      const newValue = !checked;
      setChecked(newValue);
      onChange?.(newValue);
    }, [checked, disabled, onChange]);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (disabled) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
        onKeyDown?.(e);
      },
      [disabled, handleClick, onKeyDown],
    );

    const state = disabled
      ? "disabled"
      : checked || halfChecked
        ? "checked"
        : "unchecked";

    return (
      <div
        className={cn(
          "group flex w-fit cursor-pointer items-center gap-2 rounded-lg bg-transparent whitespace-nowrap",
          className,
          {
            "hover:bg-input rounded-lg border p-1 pe-2": boxed,
            "bg-primary/10 border-primary": checked && boxed,
          },
        )}
        onClick={(e) => {
          e.stopPropagation();
          handleClick();
        }}
        onKeyDown={handleKeyDown}
        style={{ width, minWidth }}
      >
        <div
          ref={ref}
          role="checkbox"
          aria-checked={halfChecked ? "mixed" : checked}
          aria-disabled={disabled}
          aria-label={ariaLabel}
          tabIndex={disabled ? -1 : 0}
          id={checkboxId}
          data-state={state}
          className={cn(checkboxVariants({ state }), checkboxClassName)}
          {...props}
        >
          <CheckboxIcon
            checked={checked}
            halfChecked={halfChecked}
            loading={loading}
            disabled={disabled}
            className={iconClassName}
          />
        </div>
        {label && (
          <label
            htmlFor={`${checkboxId}-input`}
            className="text-foreground group-hover:text-foreground/80 cursor-pointer text-sm transition-colors duration-200 select-none"
          >
            {label}
          </label>
        )}
        {description && <span className="text-foreground/60 text-xs">{description}</span>}
      </div>
    );
  },
);

CheckboxBasic.displayName = "CheckboxBasic";
export default CheckboxBasic;
