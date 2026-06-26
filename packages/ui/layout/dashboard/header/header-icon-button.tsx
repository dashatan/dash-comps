import { forwardRef } from "react";
import Button from "@dash/ui/common/buttons";
import type { ButtonProps } from "@dash/ui/common/buttons/types";
import { cn } from "@dash/core";

export const HEADER_ICON_BUTTON_CLASS =
  "relative size-10 shrink-0 overflow-hidden rounded-full p-0 transition-all duration-300";

export const HeaderIconButton = forwardRef<HTMLButtonElement, ButtonProps>(
  function HeaderIconButton(
    {
      className,
      variant = "outlined",
      severity = "info",
      type = "button",
      ...props
    },
    ref,
  ) {
    return (
      <Button
        ref={ref}
        type={type}
        variant={variant}
        severity={severity}
        className={cn(HEADER_ICON_BUTTON_CLASS, className)}
        {...props}
      />
    );
  },
);
