"use client";
import LabelContainer from "@/components/common/inputs/label/labelContainer";
import { LabelContainerProps } from "@/components/common/inputs/select/types";
import Switch from "@dash/ui/common/inputs/switch/switch";
import { cn } from "@/lib";
import { useEffect, useState } from "react";

export type SwitchFieldProps = {
  severity?:
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | "info";
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  active?: boolean;
  value?: boolean;
  onChange?: (active: boolean) => void;
  label?: string;
  width?: number | string;
  status?: LabelContainerProps["status"];
  message?: LabelContainerProps["message"];
  id?: string;
  labelContainerProps?: Omit<LabelContainerProps, "hasValue" | "ref">;
  className?: string;
  withContainer?: boolean;
};
export default function SwitchField({
  message,
  status,
  label,
  labelContainerProps,
  width,
  id,
  className,
  withContainer = true,
  ...props
}: SwitchFieldProps) {
  const [active, setActive] = useState(props.value);

  function handleChange() {
    setActive((x) => !x);
    props.onChange && props.onChange(!active);
  }

  useEffect(() => {
    setActive(props.value);
  }, [props.value]);

  if (!withContainer) {
    return <Switch {...props} id={id} active={active} onChange={() => {}} />;
  }

  return (
    <LabelContainer
      hasValue={true}
      message={message}
      status={status}
      {...labelContainerProps}
      className={{
        trigger: {
          container: "flex flex-row",
          ...labelContainerProps?.className?.trigger,
        },
        wrapper: {
          body: "cursor-pointer",
          ...labelContainerProps?.className?.wrapper,
        },
        ...labelContainerProps?.className,
      }}
      showMessage={!!message}
      width={width}
      onClick={handleChange}
      id={`${id || "switch"}-field`}
    >
      <div
        className={cn(
          "flex h-14 w-full items-center justify-between px-4 text-base font-medium",
          labelContainerProps?.className?.trigger?.container,
        )}
      >
        <span
          className={cn(
            "overflow-hidden pt-1 pl-2 text-ellipsis whitespace-nowrap",
            labelContainerProps?.className?.trigger?.label,
          )}
        >
          {label}
        </span>
        <Switch {...props} id={id} active={active} onChange={() => {}} />
      </div>
    </LabelContainer>
  );
}
