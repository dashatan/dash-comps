"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import {
  ExternalToast,
  Toaster as Sonner,
  ToasterProps,
  toast as sonnerToast,
} from "sonner";
import { cn } from "@/lib";
import { VariantProps } from "class-variance-authority";
import { sonnerVariants } from "./variants";
import { Check, CloseCircle, InfoCircle, TickCircle } from "iconsax-reactjs";
import { AlertTriangle } from "lucide-react";

export interface SonnerProps
  extends ToasterProps, VariantProps<typeof sonnerVariants> {
  asChild?: boolean;
}

export type ToastOptions = ExternalToast & {
  description?: string;
  descriptions?: string[];
};

// Custom toast functions with theme colors
export const toast = {
  ...sonnerToast,
  success: (message: string, options?: ToastOptions) =>
    sonnerToast.success(message, {
      ...options,
      className:
        "flex not-mobile:!w-auto !min-w-fit !whitespace-nowrap !gap-4 !items-center !font-sans !bg-toast-success !text-toast-success-foreground !border-toast-success-border",
      classNames: {
        icon: "text-toast-success-foreground mb-auto",
        actionButton:
          "!bg-card/10 !text-toast-success-foreground !px-4 !h-10 !border-2 !border-toast-success-foreground hover:!scale-105 !rounded-md !transition-all !duration-300",
      },
      description:
        options?.descriptions || options?.description ? (
          <div className="text-sm text-toast-success-foreground">
            {options?.descriptions?.map((description) => (
              <div key={description}>{description}</div>
            ))}
            {options?.description && <div>{options?.description}</div>}
          </div>
        ) : undefined,

      icon: (
        <TickCircle size={24} color="var(--color-toast-success-foreground)" />
      ),
    }),
  error: (message: string, options?: ToastOptions) =>
    sonnerToast.error(message, {
      ...options,
      className:
        "flex not-mobile:!w-auto !min-w-fit !whitespace-nowrap !gap-4 !items-center !font-sans !bg-toast-error !text-toast-error-foreground !border-toast-error-border",
      classNames: {
        icon: "text-toast-error-foreground mb-auto",
        actionButton:
          "!bg-card/10 !text-toast-error-foreground !px-4 !h-10 !border-2 !border-toast-error-foreground hover:!scale-105 !rounded-md !transition-all !duration-300",
      },
      description:
        options?.descriptions || options?.description ? (
          <div className="text-sm text-toast-error-foreground">
            {options?.descriptions?.map((description) => (
              <div key={description}>{description}</div>
            ))}
            {options?.description && <div>{options?.description}</div>}
          </div>
        ) : undefined,

      icon: (
        <CloseCircle size={24} color="var(--color-toast-error-foreground)" />
      ),
    }),
  warning: (message: string, options?: ToastOptions) =>
    sonnerToast.warning(message, {
      ...options,
      className:
        "flex not-mobile:!w-auto not-mobile:!min-w-fit not-mobile:!whitespace-nowrap !gap-4 !items-center !font-sans !bg-toast-warning !text-toast-warning-foreground !border-toast-warning-border",
      classNames: {
        icon: "text-toast-warning-foreground mb-auto",
        actionButton:
          "!bg-card/10 !text-toast-warning-foreground !px-4 !h-10 !border-2 !border-toast-warning-foreground hover:!scale-105 !rounded-md !transition-all !duration-300",
      },
      description:
        options?.descriptions || options?.description ? (
          <div className="text-sm text-toast-warning-foreground">
            {options?.descriptions?.map((description) => (
              <div key={description}>{description}</div>
            ))}
            {options?.description && <div>{options?.description}</div>}
          </div>
        ) : undefined,

      icon: (
        <AlertTriangle
          size={24}
          color="var(--color-toast-warning-foreground)"
        />
      ),
    }),
  info: (message: string, options?: ToastOptions) =>
    sonnerToast.info(message, {
      ...options,
      className:
        "flex not-mobile:!w-auto !min-w-fit !whitespace-nowrap !gap-4 !items-center !font-sans !bg-toast-info !text-toast-info-foreground !border-toast-info-border",
      classNames: {
        icon: "text-toast-info-foreground mb-auto",
        actionButton:
          "!bg-card/10 !text-toast-info-foreground !px-4 !h-10 !border-2 !border-toast-info-foreground hover:!scale-105 !rounded-md !transition-all !duration-300",
      },
      description:
        options?.descriptions || options?.description ? (
          <div className="text-sm text-toast-info-foreground">
            {options?.descriptions?.map((description) => (
              <div key={description}>{description}</div>
            ))}
            {options?.description && <div>{options?.description}</div>}
          </div>
        ) : undefined,

      icon: <InfoCircle size={24} color="var(--color-toast-info-foreground)" />,
    }),
};

const Toaster = React.forwardRef<HTMLDivElement, SonnerProps>(
  ({ className, variant, ...props }, ref) => {
    const { theme = "system" } = useTheme();

    return (
      <Sonner
        ref={ref}
        theme={theme as ToasterProps["theme"]}
        className={cn(sonnerVariants({ variant, className }))}
        style={
          {
            "--normal-bg": "var(--popover)",
            "--normal-text": "var(--popover-foreground)",
            "--normal-border": "var(--border)",
          } as React.CSSProperties
        }
        {...props}
      />
    );
  },
);
Toaster.displayName = "Toaster";

export { Toaster };
