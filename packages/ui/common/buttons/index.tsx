"use client";

import { forwardRef, useState, isValidElement, cloneElement } from "react";
import { cn } from "@/lib";
import { Loader2 } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/common/hover-card";
import { buttonVariants } from "@/components/common/buttons/variants";
import { ButtonProps } from "@/components/common/buttons/types";

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      severity,
      size = "md",
      rounded,
      icon,
      label,
      isLoading,
      leftIcon,
      rightIcon,
      children,
      disabled,
      type = "button",
      style,
      fullWidth,
      onClick,
      tooltip,
      tooltipOptions,
      asChild = false,
      ...props
    },
    ref,
  ) => {
    const [isHoverCardOpen, setIsHoverCardOpen] = useState(false);

    const hasFixedSize = typeof size === "number";
    const mergedStyle = hasFixedSize
      ? {
          ...style,
          width: `${size}px`,
          minWidth: `${size}px`,
          height: `${size}px`,
          minHeight: `${size}px`,
        }
      : style;

    const getLoaderSize = () => {
      if (hasFixedSize) return size / 2.5;
      switch (size) {
        case "xs":
          return 12;
        case "sm":
          return 14;
        case "md":
          return 16;
        case "lg":
          return 18;
        case "xl":
          return 20;
        default:
          return 16;
      }
    };

    const content = icon ? (
      <span className="flex items-center justify-center">{icon}</span>
    ) : (
      <>
        {isLoading ? (
          <div className="flex h-full items-center gap-2">
            <Loader2
              className="animate-spin"
              style={{ width: getLoaderSize(), height: getLoaderSize() }}
            />
          </div>
        ) : (
          <>
            {leftIcon && <span aria-hidden="true">{leftIcon}</span>}
            {label && <span className="font-medium">{label}</span>}
            {children}
            {rightIcon && <span aria-hidden="true">{rightIcon}</span>}
          </>
        )}
      </>
    );

    const buttonProps = {
      ref,
      type,
      disabled: disabled || isLoading,
      className: cn(
        buttonVariants({
          variant,
          severity,
          size: hasFixedSize ? undefined : size,
          rounded,
          hasFixedSize,
          fullWidth,
          className,
        }),
      ),
      style: mergedStyle,
      onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(e);
        if (tooltip) {
          setIsHoverCardOpen(true);
        }
      },
      ...props,
    };

    let button: React.ReactNode;
    if (asChild && isValidElement(children)) {
      // Pass all button props to the child element
      button = cloneElement(children, {
        ...buttonProps,
        ...Object(children.props),
        children: content,
      });
    } else {
      button = <button {...buttonProps}>{content}</button>;
    }

    if (tooltip) {
      return (
        <HoverCard
          open={isHoverCardOpen}
          onOpenChange={setIsHoverCardOpen}
          openDelay={tooltipOptions?.openDelay || 100}
          closeDelay={tooltipOptions?.closeDelay || 100}
        >
          <HoverCardTrigger>{button}</HoverCardTrigger>
          <HoverCardContent
            className={cn("text-sm", tooltipOptions?.className)}
            side={tooltipOptions?.side || "top"}
            align={tooltipOptions?.align || "center"}
            sideOffset={tooltipOptions?.sideOffset || 0}
          >
            {tooltip}
          </HoverCardContent>
        </HoverCard>
      );
    }

    return button;
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
export default Button;
