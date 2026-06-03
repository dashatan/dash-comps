"use client";

import { cn } from "@/lib";
import { useEffect, useState } from "react";

export interface SwitchProps {
  severity?:
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | "info";
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  active?: boolean;
  id?: string;
  onChange?: (active: boolean) => void;
}
export default function Switch(props: SwitchProps) {
  const [active, setActive] = useState(props.active);

  function handleChange() {
    setActive((x) => !x);
    props.onChange && props.onChange(!active);
  }

  useEffect(() => {
    setActive(props.active);
  }, [props.active]);

  const switchId = props.id || "switch";

  return (
    <div
      id={`${switchId}-container`}
      onClick={handleChange}
      className={cn(
        "bg-switch-background flex h-8 min-w-14 items-center justify-end rounded-full",
        "dir-rtl cursor-pointer transition-all select-none",
        {
          "scale-50": props.size === "xs",
          "scale-75": props.size === "sm",
          "scale-100": props.size === "md" || props.size === undefined,
          "scale-125": props.size === "lg",
          "scale-150": props.size === "xl",
          ...(active && {
            "bg-primary":
              props.severity === "primary" || props.severity === undefined,
            "bg-secondary": props.severity === "secondary",
            "bg-success": props.severity === "success",
            "bg-warning": props.severity === "warning",
            "bg-error": props.severity === "danger",
            "bg-info": props.severity === "info",
          }),
        },
      )}
    >
      <div
        id={`${switchId}-toggle`}
        className={cn(
          "bg-switch-foreground flex h-6 w-6 items-center justify-center",
          "rounded-full text-xs font-semibold transition-all",
          {
            ...(active && {
              "bg-primary-foreground":
                props.severity === "primary" || props.severity === undefined,
              "bg-secondary-foreground": props.severity === "secondary",
              "bg-success-foreground": props.severity === "success",
              "bg-warning-foreground": props.severity === "warning",
              "bg-error-foreground": props.severity === "danger",
              "bg-info-foreground": props.severity === "info",
            }),
            "translate-x-1 scale-75": !active,
            "translate-x-7 scale-90": active,
          },
        )}
      ></div>
    </div>
  );
}
