import { cn, useLanguage } from "@/lib";
import { FilterElementProps } from ".";
import { useEffect, useState } from "react";
import type { NumberRangeFilterValue } from "../../types";

export type numberDuplex = [number | undefined, number | undefined];
export type NumberRangeInputProps = {
  min?: number;
  max?: number;
  value?: numberDuplex;
  onChange?: (value: numberDuplex) => void;
  className?: string;
};

function parseRangeInput(raw: string): number | undefined {
  if (raw === "") return undefined;
  const parsed = parseFloat(raw);
  return Number.isNaN(parsed) ? undefined : parsed;
}

function toFilterValue(
  range: numberDuplex | undefined,
): NumberRangeFilterValue | undefined {
  if (range?.[0] === undefined && range?.[1] === undefined) return undefined;
  return [range?.[0], range?.[1]];
}

export default function FilterNumberRangeElement(props: FilterElementProps) {
  const { t } = useLanguage();
  const [value, setValue] = useState<numberDuplex | undefined>(
    props.defaultValue as numberDuplex,
  );
  const { min, max, className } = props.inputProps as NumberRangeInputProps;

  useEffect(() => {
    setValue(props.defaultValue as numberDuplex);
  }, [props.defaultValue]);

  const handleRangeChange = (next: numberDuplex | undefined) => {
    setValue(next);
    props.onChange?.(toFilterValue(next));
  };

  const inputClassName = cn(
    "h-10 w-14 rounded-md border border-input px-2 bg-input focus:border-primary transition-all border-border",
    className,
  );

  return (
    <div className="text-input-foreground flex h-10 min-h-10 w-full items-center gap-2 text-sm font-semibold">
      <div className="flex items-center gap-1">
        <span>{t("common.from")}:</span>
        <input
          type="number"
          className={inputClassName}
          min={min || 0}
          max={max}
          value={value?.[0] ?? ""}
          onChange={(e) => {
            handleRangeChange([parseRangeInput(e.target.value), value?.[1]]);
          }}
        />
      </div>
      <div className="flex items-center gap-1">
        <span>{t("common.to")}:</span>
        <input
          type="number"
          className={inputClassName}
          min={min || 0}
          max={max}
          value={value?.[1] ?? ""}
          onChange={(e) => {
            handleRangeChange([value?.[0], parseRangeInput(e.target.value)]);
          }}
        />
      </div>
    </div>
  );
}
