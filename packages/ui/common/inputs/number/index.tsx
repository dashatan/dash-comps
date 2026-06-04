"use client";

import {
  type KeyboardEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import LabelContainer from "../label/labelContainer";
import BasicNumberInput, { BasicNumberInputProps } from "./basic";
import { cn } from "@/lib";
import { Minus, Plus } from "lucide-react";
import { LabelContainerProps } from "@/components/common/inputs/select/types";

export type NumberInputProps = Partial<LabelContainerProps> &
  Omit<BasicNumberInputProps, "step" | "value" | "prefix" | "className"> & {
    step?: number;
    value?: number;
    inputClassName?: string;
    prefix?: ReactNode;
    buttonsVisible?: boolean;
  };

function parseBound(bound: number | string | undefined): number | undefined {
  if (bound === undefined || bound === "") return undefined;
  const parsed = typeof bound === "number" ? bound : Number(bound);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export default function NumberInput({
  label,
  message,
  status,
  inputClassName,
  prefix,
  suffix,
  buttonsVisible,
  width,
  step,
  showMessage,
  onChange,
  className,
  min,
  max,
  disabled,
  onKeyDown,
  ...props
}: NumberInputProps) {
  const ref = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(props.value);
  const hasValue = value !== undefined && !Number.isNaN(value);
  const [focused, setFocused] = useState(false);
  const stepValue = step ?? 1;
  const minValue = parseBound(min);
  const maxValue = parseBound(max);

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  const adjustValue = useCallback(
    (direction: 1 | -1) => {
      if (disabled) return;

      const current = value ?? 0;
      let next = current + direction * stepValue;

      if (maxValue !== undefined) next = Math.min(next, maxValue);
      if (minValue !== undefined) next = Math.max(next, minValue);

      setValue(next);
      onChange?.(next);
    },
    [disabled, maxValue, minValue, onChange, stepValue, value],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "ArrowUp") {
        event.preventDefault();
        adjustValue(1);
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        adjustValue(-1);
      }

      onKeyDown?.(event);
    },
    [adjustValue, onKeyDown],
  );

  const handleStep = useCallback(
    (direction: 1 | -1) => (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      adjustValue(direction);
    },
    [adjustValue],
  );

  return (
    <LabelContainer
      showMessage={showMessage}
      label={label}
      message={message}
      status={status ?? (focused ? "primary" : undefined)}
      hasValue={hasValue}
      onClick={() => ref.current?.focus()}
      focused={focused}
      width={width}
      className={className}
      prefix={prefix}
      suffix={suffix}
    >
      <div className="flex h-full w-full items-center select-none">
        <BasicNumberInput
          {...props}
          min={min}
          max={max}
          disabled={disabled}
          prefix=""
          ref={ref}
          className={cn(
            "h-full w-full px-4 pt-4 text-sm dir-ltr",
            inputClassName,
          )}
          value={value}
          onChange={(val) => {
            setValue(val);
            onChange?.(val);
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={handleKeyDown}
        />
        <div className="h-full min-w-px" />
        {buttonsVisible ? (
          <div className="flex h-full min-w-9 flex-col overflow-hidden">
            <CountButton onMouseDown={handleStep(1)}>
              <Plus className="w-3 text-input-foreground" />
            </CountButton>
            <div className="h-px w-full bg-input" />
            <CountButton onMouseDown={handleStep(-1)}>
              <Minus className="w-3 text-input-foreground" />
            </CountButton>
          </div>
        ) : null}
      </div>
    </LabelContainer>
  );
}

function CountButton(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn(
        "flex h-full w-full cursor-pointer items-center justify-center bg-input text-input-foreground hover:bg-input-accent",
        props.className,
      )}
    >
      {props.children}
    </div>
  );
}
