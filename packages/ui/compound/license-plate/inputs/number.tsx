"use client";

import { cn } from "@/lib";
import { forwardRef, ReactNode, useEffect, useState } from "react";

type HtmlInputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;
export type NumberProps = Omit<HtmlInputProps, "onChange"> & {
  onFinish: (value: string | number, colorCode?: string) => void;
  onChange?: (value?: string | number) => void;
  suffix?: ReactNode;
  disabled?: boolean;
  containerWidth?: number | string;
  id?: string;
};

const Comp = forwardRef<HTMLInputElement, NumberProps>(
  ({ onChange, onFinish, suffix, containerWidth, id, ...props }, ref) => {
    const [value, setValue] = useState(props.value);
    const inputId = id || "plate-number-input";

    useEffect(() => {
      setValue(props.value);
    }, [props.value]);

    function handleChange(v: string) {
      const regex = /^\d+$/;
      if (v && !regex.test(v)) return;
      if (v.length === props.maxLength) {
        onFinish(v);
        return;
      }
      setValue(v);
      onChange && onChange(v);
    }

    return (
      <div
        className={cn(
          "flex w-full flex-1 flex-col items-center justify-center gap-1 overflow-hidden",
          props.className,
        )}
      >
        {!!suffix && (
          <div
            className={cn(
              "flex h-3/12 max-h-3/12 w-full flex-1 items-center justify-center",
            )}
          >
            {suffix}
          </div>
        )}
        <input
          ref={ref}
          {...props}
          id={inputId}
          type="text"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          autoComplete="off"
          className={cn(
            "peer h-full w-full flex-1 overflow-hidden py-2 text-xl font-extrabold transition-none",
            "appearance-none duration-200",
            "placeholder:text-xs",
            "p-0 text-center focus-visible:outline-0",
            {
              "h-7/12 max-h-7/12 py-0": suffix,
            },
            props.className,
          )}
        />
      </div>
    );
  },
);

Comp.displayName = "Number";
export default Comp;
