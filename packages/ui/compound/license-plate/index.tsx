"use client";

import { X } from "lucide-react";
import CarPlate from "./components/car";
import MotorcyclePlate from "./components/motorcycle";
import ProtocolPlate from "./components/protocol";
import SimplePlate from "./components/simple";
import { forwardRef, useState, useCallback, useEffect } from "react";
import { cn } from "@/lib";
import {
  PlateValue,
  PlateInputProps,
} from "@/components/compound/license-plate/types";

/* ---------------------------------- Types --------------------------------- */

// Plate component for rendering different plate types
export function Plate({
  variant,
  value,
  clear,
  setClear,
  onChange,
  disabled,
  readonly,
  error,
  className,
  containerWidth,
  id,
}: {
  variant?: PlateInputProps["variant"];
  value?: PlateValue;
  clear: boolean;
  setClear: (v: boolean) => void;
  onChange: (val?: PlateValue) => void;
  disabled?: boolean;
  readonly?: boolean;
  error?: boolean;
  className?: PlateInputProps["className"];
  containerWidth?: number | string;
  id?: string;
}) {
  const commonProps = {
    values: value,
    onChange,
    disabled,
    error,
    className,
    containerWidth,
    id,
  };
  switch (variant) {
    case "car":
      return (
        <CarPlate
          {...commonProps}
          clear={clear}
          onClear={() => setClear(false)}
          defaultValue={value}
          readonly={readonly}
        />
      );
    case "motorcycle":
      return <MotorcyclePlate {...commonProps} />;
    case "protocol":
      return <ProtocolPlate {...commonProps} />;
    case "simple":
      return <SimplePlate {...commonProps} />;
    default:
      return null;
  }
}

const PlateInput = forwardRef<HTMLDivElement, PlateInputProps>(
  (
    {
      onChange,
      withClear,
      variant,
      disabled,
      readonly,
      error,
      errorMessage,
      required,
      label,
      helperText,
      value,
      className = {},
      onClear,
      width = 280,
      id,
    },
    ref,
  ) => {
    const [clear, setClear] = useState(false);
    const [val, setVal] = useState(value);
    const inputId = id || `plate-${variant || "input"}`;

    useEffect(() => {
      setVal(value);
    }, [value]);

    // Handler for value change
    const handleChange = useCallback(
      (val?: PlateValue) => {
        setVal(val);
        onChange?.(val);
      },
      [onChange],
    );

    // Handler for clear button
    const handleClear = useCallback(() => {
      setClear(true);
      setVal(undefined);
      onClear?.();
      handleChange(undefined);
    }, [onClear, handleChange]);

    return (
      <div
        ref={ref}
        className={cn("flex flex-col gap-1", className.container)}
        style={{ width }}
      >
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-foreground"
          >
            {label}
            {required && <span className="text-destructive">*</span>}
          </label>
        )}
        <div
          className={cn(
            "flex h-14 w-full flex-row-reverse items-stretch justify-between gap-2",
            {
              "opacity cursor-not-allowed": disabled,
              "pointer-events-none": readonly,
            },

            className.root,
          )}
        >
          {withClear && val && !disabled && !readonly ? (
            <button
              type="button"
              onClick={handleClear}
              className="flex h-full shrink-0 items-center px-1 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Clear plate"
            >
              <X className="size-4" />
            </button>
          ) : null}
          <Plate
            variant={variant}
            value={val}
            clear={clear}
            setClear={setClear}
            onChange={handleChange}
            disabled={disabled}
            error={error || !!errorMessage}
            className={className}
            readonly={readonly}
            containerWidth={width}
            id={inputId}
          />
        </div>
        {(errorMessage || helperText) && (
          <p
            className={cn(
              "mx-2 mt-1 text-xs",
              errorMessage ? "text-destructive" : "text-muted-foreground",
            )}
            id={inputId + "-desc"}
            aria-live={errorMessage ? "assertive" : "polite"}
          >
            {errorMessage || helperText}
          </p>
        )}
      </div>
    );
  },
);

PlateInput.displayName = "PlateInput";

export default PlateInput;
