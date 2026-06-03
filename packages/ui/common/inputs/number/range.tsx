"use client";

import { useEffect, useRef, useState } from "react";
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
  const ref = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState<numberDuplex | undefined>(
    props.value as numberDuplex,
  );
  const hasValue = ![undefined, NaN].includes(value?.[0] || value?.[1]);
  const { min, max, className, fromLabel, toLabel } = props;

  useEffect(() => {
    setValue(props.value as numberDuplex);
  }, [props.value]);

  function handleFromChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = parseFloat(e.target.value);
    setValue((x) => [val, x?.[1]]);
    props.onChange && props.onChange([val, value?.[1]]);
  }

  function handleToChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = parseFloat(e.target.value);

    setValue((x) => [x?.[0], val]);
    props.onChange && props.onChange([value?.[0], val]);
  }

  const inputClassName = cn(
    " w-full h-full px-2 bg-input-background  border-b border-input-border",
    className,
  );

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  return (
    <LabelContainer
      {...props.labelContainerProps}
      label={props.label}
      message={props.message}
      status={props.status}
      hasValue={hasValue}
      onClick={() => ref.current?.focus()}
      focused={true}
      width={props.width}
    >
      <div className="text-input-foreground flex h-full w-full items-end justify-between gap-3 px-4 pt-4 pb-2 text-xs font-semibold whitespace-nowrap">
        <div className="flex h-full items-center gap-1">
          <span>{fromLabel || t("common.from")}:</span>
          <input
            id={`${props.label}-from`}
            name={`${props.label}-from`}
            type="number"
            className={inputClassName}
            min={min || 0}
            max={max}
            value={value ? value[0] : undefined}
            onChange={handleFromChange}
          />
        </div>
        <div className="flex h-full items-center gap-1">
          <span>{toLabel || t("common.to")}:</span>
          <input
            id={`${props.label}-to`}
            name={`${props.label}-to`}
            type="number"
            className={inputClassName}
            min={min || 0}
            max={max}
            value={value ? value[1] : undefined}
            onChange={handleToChange}
          />
        </div>
      </div>
    </LabelContainer>
  );
}
