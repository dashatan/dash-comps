"use client";

import { cn } from "@/lib";
import { ReactNode, useEffect, useState } from "react";
import {
  radioVariants,
  radioCircleVariants,
  radioContainerVariants,
  radioCircleContainerVariants,
} from "./variants";
import { Circle, CircleCheck } from "lucide-react";

export interface RadioItemProps {
  name: string | number;
  label?: string;
  active?: boolean;
  icon?: ReactNode;
  size?: RadioInputProps["size"];
  className?: string;
  showCircle?: boolean;
  onClick?: () => void;
}

export interface RadioInputProps<
  TOption extends RadioItemProps = RadioItemProps,
> {
  options: readonly TOption[];
  defaultValue?: TOption["name"];
  value?: TOption["name"];
  onChange?: (value: TOption["name"] | undefined) => void;
  direction?: "horizontal" | "vertical";
  size?: "lg" | "md" | "sm";
  className?: string;
  id?: string;
  showCircle?: boolean;
  width?: number | string;
}

export default function RadioInput<
  TOption extends RadioItemProps = RadioItemProps,
>({
  value,
  defaultValue,
  onChange,
  id,
  showCircle,
  size,
  direction,
  className,
  options,
  width,
}: RadioInputProps<TOption>) {
  const [selectedItem, setSelectedItem] = useState<TOption["name"] | undefined>(
    value ?? defaultValue,
  );

  useEffect(() => {
    if (value !== undefined) {
      setSelectedItem(value);
    }
  }, [value]);

  const selection = value ?? selectedItem;

  function handleClick(name: TOption["name"]) {
    setSelectedItem(name);
    onChange?.(name);
  }

  return (
    <div
      id={id}
      className={cn(radioContainerVariants({ size, direction }), className)}
      style={{ width }}
    >
      {options?.map((option, index) => {
        return (
          <Radio
            key={option.name || index}
            active={option.name === selection}
            size={size}
            showCircle={showCircle}
            onClick={() => handleClick(option.name)}
            {...option}
          />
        );
      })}
    </div>
  );
}

function Radio({
  active,
  size,
  className,
  showCircle = true,
  label,
  icon,
  name,
  onClick,
}: RadioItemProps) {
  return (
    <div
      id={`radio-option-${name}`}
      className={cn(radioVariants({ active, size }), className)}
      onClick={onClick}
    >
      {showCircle && (
        <div className={radioCircleContainerVariants({ size })}>
          <Circle className={radioCircleVariants({ size, active })} />
          <CircleCheck
            className={radioCircleVariants({ size, active, checked: true })}
          />
        </div>
      )}
      {label && <span className="flex-1">{label}</span>}
      {icon && <span>{icon}</span>}
    </div>
  );
}
