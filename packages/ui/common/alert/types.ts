import type { HTMLAttributes, ReactNode } from "react";
import type { VariantProps } from "class-variance-authority";
import type {
  alertDescriptionVariants,
  alertIconVariants,
  alertTitleVariants,
  alertVariants,
  AlertAnimation,
} from "@/components/common/alert/variants";

export type { AlertAnimation } from "@/components/common/alert/variants";

export const ALERT_SIZES = ["sm", "md", "lg", "xl"] as const;

export const ALERT_SEVERITIES = [
  "default",
  "primary",
  "secondary",
  "success",
  "warning",
  "danger",
  "info",
  "muted",
] as const;

export const ALERT_APPEARANCES = ["soft", "outline", "ghost"] as const;

export const ALERT_LAYOUTS = ["center", "start", "row"] as const;

export const ALERT_ANIMATIONS = [
  "jumpIn",
  "shake",
  "bounceIn",
  "flipUp",
  "none",
] as const satisfies readonly AlertAnimation[];

export type AlertSize = (typeof ALERT_SIZES)[number];
export type AlertSeverity = (typeof ALERT_SEVERITIES)[number];
export type AlertAppearance = (typeof ALERT_APPEARANCES)[number];
export type AlertLayout = (typeof ALERT_LAYOUTS)[number];

export type AlertProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> &
  VariantProps<typeof alertVariants> & {
    children?: ReactNode;
    animation?: AlertAnimation;
  };

export type AlertIconProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof alertIconVariants> & {
    animate?: boolean;
  };

export type AlertTitleProps = HTMLAttributes<HTMLHeadingElement> &
  VariantProps<typeof alertTitleVariants> & {
    animate?: boolean;
  };

export type AlertDescriptionProps = HTMLAttributes<HTMLParagraphElement> &
  VariantProps<typeof alertDescriptionVariants> & {
    animate?: boolean;
  };

export type AlertActionsProps = HTMLAttributes<HTMLDivElement>;

export type AlertContentProps = HTMLAttributes<HTMLDivElement>;

export type AlertDividerProps = HTMLAttributes<HTMLDivElement>;

export type LegacyAlertProps = {
  message?: string;
  icon?: ReactNode;
  className?: string;
  children?: ReactNode;
  /** @deprecated Use `animation="jumpIn"` on Alert instead */
  animation?: string;
};
