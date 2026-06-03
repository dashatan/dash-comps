"use client";

import { cn } from "@/lib";
import { forwardRef, useEffect, useState } from "react";
import { useTheme } from "next-themes";

export interface BasicTextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Error message to display below the input */
  error?: string;
  /** Loading state of the input */
  isLoading?: boolean;
  /** Helper text to display below the input */
  helperText?: string;
  /** Whether the input is required */
  required?: boolean;
  /** Custom class name for the input wrapper */
  wrapperClassName?: string;
}

const BasicTextInput = forwardRef<HTMLInputElement, BasicTextInputProps>(
  (
    {
      className,
      wrapperClassName,
      error,
      isLoading,
      helperText,
      required,
      disabled,
      value,
      onChange,
      onBlur,
      ...props
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = useState(value);
    const { theme } = useTheme();
    const isDark = theme === "dark";

    useEffect(() => {
      setInternalValue(value);
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInternalValue(e.target.value);
      onChange?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      onBlur?.(e);
    };

    return (
      <div className={cn("relative h-full w-full", wrapperClassName)}>
        <input
          {...props}
          ref={ref}
          value={internalValue || ""}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={disabled || isLoading}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error || helperText ? `${props.id}-description` : undefined}
          className={cn(
            // Base styles
            "h-full w-full px-3 py-2",
            "transition-colors duration-200",
            "focus-visible:outline-none",
            "disabled:cursor-not-allowed disabled:opacity-50",
            // Theme-based styles
            isDark
              ? "text-foreground placeholder:text-muted-foreground"
              : "text-foreground placeholder:text-muted-foreground",
            // Custom styles
            className,
          )}
        />
        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute top-1/2 right-3 -translate-y-1/2">
            <div className="border-primary h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
          </div>
        )}
        {/* Helper text and error message */}
        {(error || helperText) && (
          <div
            id={`${props.id}-description`}
            className="text-muted-foreground mt-1 text-xs"
          >
            {error || helperText}
          </div>
        )}
      </div>
    );
  },
);

BasicTextInput.displayName = "BasicTextInput";

export default BasicTextInput;
