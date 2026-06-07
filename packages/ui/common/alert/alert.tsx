"use client";

import { forwardRef, useMemo } from "react";
import { cn } from "@/lib";
import BaseAlert from "@/components/common/alert/base-alert";
import DataErrorAlert from "@/components/common/alert/data-error";
import EmptyAlert from "@/components/common/alert/empty";
import LoadingAlert from "@/components/common/alert/loading";
import PermissionAlert from "@/components/common/alert/permission";
import { AlertProvider, useAlertContext } from "@/components/common/alert/context";
import type {
  AlertActionsProps,
  AlertContentProps,
  AlertDescriptionProps,
  AlertDividerProps,
  AlertIconProps,
  AlertProps,
  AlertTitleProps,
} from "@/components/common/alert/types";
import {
  alertActionsVariants,
  alertBodyVariants,
  alertDescriptionVariants,
  alertDividerVariants,
  alertIconVariants,
  alertTitleVariants,
  alertVariants,
  resolveAlertAnimation,
} from "@/components/common/alert/variants";

const AlertRoot = forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      className,
      children,
      size = "md",
      severity = "muted",
      appearance = "ghost",
      layout = "center",
      animation = "none",
      fullWidth,
      ...props
    },
    ref,
  ) => {
    const contextValue = useMemo(
      () => ({
        size: size ?? "md",
        severity: severity ?? "muted",
        appearance: appearance ?? "ghost",
        layout: layout ?? "center",
        animation: animation ?? "none",
      }),
      [size, severity, appearance, layout, animation],
    );

    return (
      <AlertProvider value={contextValue}>
        <div
          ref={ref}
          role="status"
          aria-live="polite"
          data-slot="alert"
          className={cn(
            alertVariants({
              size,
              severity,
              appearance,
              layout,
              fullWidth,
            }),
            className,
          )}
          {...props}
        >
          {children}
        </div>
      </AlertProvider>
    );
  },
);

AlertRoot.displayName = "Alert";

const AlertIcon = forwardRef<HTMLDivElement, AlertIconProps>(
  ({ className, children, animate = true, size, severity, appearance, ...props }, ref) => {
    const context = useAlertContext();
    const resolvedSize = size ?? context.size;
    const resolvedSeverity = severity ?? context.severity;
    const resolvedAppearance = appearance ?? context.appearance;
    const animationClass = animate ? resolveAlertAnimation(context.animation) : "";

    return (
      <div
        ref={ref}
        data-slot="alert-icon"
        className={cn(
          alertIconVariants({
            size: resolvedSize,
            severity: resolvedSeverity,
            appearance: resolvedAppearance,
          }),
          animationClass,
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

AlertIcon.displayName = "AlertIcon";

const AlertTitle = forwardRef<HTMLHeadingElement, AlertTitleProps>(
  ({ className, children, animate = true, size, ...props }, ref) => {
    const { size: contextSize, layout, animation } = useAlertContext();
    const resolvedSize = size ?? contextSize;
    const animationClass = animate ? resolveAlertAnimation(animation) : "";

    return (
      <h3
        ref={ref}
        data-slot="alert-title"
        className={cn(
          alertTitleVariants({ size: resolvedSize, layout }),
          animationClass,
          className,
        )}
        {...props}
      >
        {children}
      </h3>
    );
  },
);

AlertTitle.displayName = "AlertTitle";

const AlertDescription = forwardRef<HTMLParagraphElement, AlertDescriptionProps>(
  (
    {
      className,
      children,
      animate = true,
      size,
      severity,
      appearance,
      ...props
    },
    ref,
  ) => {
    const context = useAlertContext();
    const resolvedSize = size ?? context.size;
    const resolvedSeverity = severity ?? context.severity;
    const resolvedAppearance = appearance ?? context.appearance;
    const animationClass = animate ? resolveAlertAnimation(context.animation) : "";

    return (
      <p
        ref={ref}
        data-slot="alert-description"
        className={cn(
          alertDescriptionVariants({
            size: resolvedSize,
            layout: context.layout,
            severity: resolvedSeverity,
            appearance: resolvedAppearance,
          }),
          animationClass,
          className,
        )}
        {...props}
      >
        {children}
      </p>
    );
  },
);

AlertDescription.displayName = "AlertDescription";

const AlertContent = forwardRef<HTMLDivElement, AlertContentProps>(
  ({ className, ...props }, ref) => {
    const { layout, size } = useAlertContext();

    return (
      <div
        ref={ref}
        data-slot="alert-content"
        className={cn(
          alertBodyVariants({ layout: layout === "row" ? "start" : layout, size }),
          layout === "row" ? "min-w-0 flex-1" : "w-full",
          className,
        )}
        {...props}
      />
    );
  },
);

AlertContent.displayName = "AlertContent";

const AlertActions = forwardRef<HTMLDivElement, AlertActionsProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="alert-actions"
      className={cn(alertActionsVariants(), className)}
      {...props}
    />
  ),
);

AlertActions.displayName = "AlertActions";

const AlertDivider = forwardRef<HTMLDivElement, AlertDividerProps>(
  ({ className, ...props }, ref) => {
    const { size } = useAlertContext();

    return (
      <div
        ref={ref}
        aria-hidden
        data-slot="alert-divider"
        className={cn(alertDividerVariants({ size }), className)}
        {...props}
      />
    );
  },
);

AlertDivider.displayName = "AlertDivider";

type AlertComponent = typeof AlertRoot & {
  Icon: typeof AlertIcon;
  Title: typeof AlertTitle;
  Description: typeof AlertDescription;
  Content: typeof AlertContent;
  Actions: typeof AlertActions;
  Divider: typeof AlertDivider;
  Empty: typeof EmptyAlert;
  Loading: typeof LoadingAlert;
  Error: typeof DataErrorAlert;
  Forbidden: typeof PermissionAlert;
  Base: typeof BaseAlert;
};

export const Alert = Object.assign(AlertRoot, {
  Icon: AlertIcon,
  Title: AlertTitle,
  Description: AlertDescription,
  Content: AlertContent,
  Actions: AlertActions,
  Divider: AlertDivider,
  Empty: EmptyAlert,
  Loading: LoadingAlert,
  Error: DataErrorAlert,
  Forbidden: PermissionAlert,
  Base: BaseAlert,
}) as AlertComponent;

export {
  AlertRoot,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  AlertContent,
  AlertActions,
  AlertDivider,
  alertVariants,
};

export default Alert;
