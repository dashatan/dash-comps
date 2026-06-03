"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
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

export default function NumberInput({
  label,
  message,
  status,
  inputClassName,
  prefix,
  buttonsVisible,
  width,
  step,
  showMessage,
  onChange,
  className,
  ...props
}: NumberInputProps) {
  const ref = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(props.value);
  const hasValue = ![undefined, NaN].includes(value);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  return (
    <LabelContainer
      showMessage={showMessage}
      label={label}
      message={message}
      status={status}
      hasValue={hasValue}
      onClick={() => ref.current?.focus()}
      focused={focused}
      width={width}
      className={className}
    >
      <div className="flex h-full w-full items-center select-none">
        <BasicNumberInput
          {...props}
          prefix=""
          ref={ref}
          className={cn("dir-ltr h-full w-full px-4 pt-4 text-sm", inputClassName)}
          value={value}
          onChange={(val) => {
            setValue(val);
            onChange && val && onChange(val);
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        <div className="h-full min-w-px" />
        {prefix}
        {buttonsVisible && (
          <div className="flex h-full min-w-9 flex-col overflow-hidden">
            <CountButton
              onMouseDown={() => {
                const newValue = (value || 0) + (step || 1);
                setValue(newValue);
                onChange && onChange(newValue);
              }}
            >
              <Plus className="text-input-foreground w-3" />
            </CountButton>
            <div className="bg-input h-px w-full" />
            <CountButton
              onMouseDown={() => {
                const newValue = value ? value - (step || 1) : 0;
                setValue(newValue);
                onChange && onChange(newValue);
              }}
            >
              <Minus className="text-input-foreground w-3" />
            </CountButton>
          </div>
        )}
      </div>
    </LabelContainer>
  );
}

function CountButton(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn(
        "bg-input text-input-foreground hover:bg-input-accent flex h-full w-full cursor-pointer items-center justify-center",
        props.className,
      )}
    >
      {props.children}
    </div>
  );
}
