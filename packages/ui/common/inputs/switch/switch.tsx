"use client";

import {
  switchThumbVariants,
  switchTrackVariants,
} from "@/components/common/inputs/switch/variants";
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
  const size = props.size ?? "md";
  const severity = props.severity ?? "primary";

  return (
    <div
      id={`${switchId}-container`}
      onClick={handleChange}
      className={cn(switchTrackVariants({ size, active, severity }))}
    >
      <div
        id={`${switchId}-toggle`}
        className={cn(switchThumbVariants({ size, active, severity }))}
      />
    </div>
  );
}
