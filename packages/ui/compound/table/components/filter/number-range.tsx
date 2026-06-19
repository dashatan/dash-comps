import { cn, useLanguage } from "@/lib";
import { FilterElementProps } from ".";
import { useEffect, useState } from "react";

export type numberDuplex = [number | undefined, number | undefined];
export type NumberRangeInputProps = {
  min?: number;
  max?: number;
  value?: numberDuplex;
  onChange?: (value: numberDuplex) => void;
  className?: string;
};

export default function FilterNumberRangeElement(props: FilterElementProps) {
  const { t } = useLanguage();
  const [value, setValue] = useState<numberDuplex | undefined>(
    props.defaultValue as numberDuplex,
  );
  const { min, max, className } = props.inputProps as NumberRangeInputProps;

  useEffect(() => {
    setValue(props.defaultValue as numberDuplex);
  }, [props.defaultValue]);

  useEffect(() => {
    const val = value?.[0] || value?.[1] ? [value?.[0], value?.[1]] : undefined;
    props.onChange && props.onChange(val as any);
  }, [value]);

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
          value={value ? value[0] : undefined}
          onChange={(e) => {
            const val = parseFloat(e.target.value);
            setValue((x) => [val, x?.[1]]);
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
          value={value ? value[1] : undefined}
          onChange={(e) => {
            const val = parseFloat(e.target.value);
            setValue((x) => [x?.[0], val]);
          }}
        />
      </div>
    </div>
  );
}
