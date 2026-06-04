"use client";

import { useEffect, useRef, useState, type FocusEvent } from "react";
import LabelContainer from "../label/labelContainer";
import { cn } from "@/lib";
import { useLanguage } from "@/lib";
import { LabelContainerProps } from "@/components/common/inputs/select/types";

export type numberDuplex = [number | undefined, number | undefined];

export type NumberRangeInputProps = Pick<
  LabelContainerProps,
  "label" | "message" | "status"
> & {
  min?: number;
  max?: number;
  value?: numberDuplex;
  onChange?: (value: numberDuplex) => void;
  className?: string;
  labelContainerProps?: Partial<LabelContainerProps>;
  fromLabel?: string;
  toLabel?: string;
  width?: number | string;
};

export default function NumberRangeInput(props: NumberRangeInputProps) {
  const { t } = useLanguage();
  const fromRef = useRef<HTMLInputElement>(null);
  const toRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState<numberDuplex | undefined>(props.value);
  const [fromFocused, setFromFocused] = useState(false);
  const [toFocused, setToFocused] = useState(false);
  const hasValue = ![undefined, NaN].includes(value?.[0] || value?.[1]);
  const { min, max, className, fromLabel, toLabel, status } = props;

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  function handleFromChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = parseFloat(e.target.value);
    setValue((x) => [val, x?.[1]]);
    props.onChange?.([val, value?.[1]]);
  }

  function handleToChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = parseFloat(e.target.value);
    setValue((x) => [x?.[0], val]);
    props.onChange?.([value?.[0], val]);
  }

  const inputClassName = cn(
    "h-full w-full border-b border-input-border bg-input-background px-2",
    className,
  );

  return (
    <LabelContainer
      {...props.labelContainerProps}
      label={props.label}
      message={props.message}
      status={status ?? (fromFocused || toFocused ? "primary" : undefined)}
      hasValue={hasValue}
      onClick={() => !fromFocused && !toFocused && fromRef.current?.focus()}
      focused={true}
      width={props.width}
    >
      <div className="mt-2 flex h-full w-full items-end justify-between gap-3 px-4 pt-4 pb-2 text-xs font-semibold whitespace-nowrap text-input-foreground">
        <div className="flex h-full flex-1 items-center gap-1">
          <span>{fromLabel || t("common.from")}:</span>
          <input
            ref={fromRef}
            id={`${props.label}-from`}
            name={`${props.label}-from`}
            type="number"
            className={inputClassName}
            min={min || 0}
            max={max}
            value={value?.[0] ?? ""}
            onChange={handleFromChange}
            onFocus={() => setFromFocused(true)}
            onBlur={() => setFromFocused(false)}
          />
        </div>
        <div className="flex h-full flex-1 items-center gap-1">
          <span>{toLabel || t("common.to")}:</span>
          <input
            ref={toRef}
            id={`${props.label}-to`}
            name={`${props.label}-to`}
            type="number"
            className={inputClassName}
            min={min || 0}
            max={max}
            value={value?.[1] ?? ""}
            onChange={handleToChange}
            onFocus={() => setToFocused(true)}
            onBlur={() => setToFocused(false)}
          />
        </div>
      </div>
    </LabelContainer>
  );
}
