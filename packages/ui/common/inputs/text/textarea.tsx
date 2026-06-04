"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { cn, createUUID } from "@/lib";
import { LabelContainerProps } from "@/components/common/inputs/select/types";
import LabelContainer from "@/components/common/inputs/label/labelContainer";

export type HtmlTextareaProps = React.DetailedHTMLProps<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
>;

export type TextareaInputProps = Omit<HtmlTextareaProps, "onChange"> & {
  id?: string;
  label?: string;
  width?: number | string;
  labelClassName?: LabelContainerProps["className"];
  status?: LabelContainerProps["status"];
  message?: LabelContainerProps["message"];
  onChange?: (val: string) => void;
};

export default function TextareaInput(props: TextareaInputProps) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState(props.value);
  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  const id = useMemo(() => `${createUUID()}-textarea`, []);

  return (
    <LabelContainer
      label={props.label}
      hasValue={!!value || focused}
      onClick={() => ref.current?.focus()}
      message={props.message}
      status={props.status ? props.status : focused ? "primary" : undefined}
      focused={focused}
      width={props.width}
      className={{
        wrapper: {
          body: "h-auto overflow-hidden pt-7",
          label: "top-2",
        },
      }}
    >
      <textarea
        {...props}
        id={id}
        ref={ref}
        className={cn(
          "min-h-28 w-full bg-transparent px-4 pb-4 text-base font-medium text-input-foreground",
          props.className,
        )}
        onChange={(e) => {
          setValue(e.target.value);
          props.onChange && props.onChange(e.target.value);
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </LabelContainer>
  );
}
