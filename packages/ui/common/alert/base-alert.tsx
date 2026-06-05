import { cn } from "@/lib";
import { ReactNode } from "react";

export type BaseAlertProps = {
  icon?: ReactNode;
  message?: string;
  className?: string;
  children?: ReactNode;
  animation?: string;
};

export default function BaseAlert({
  icon,
  message,
  className,
  children,
  animation = "animate-jump-in",
}: BaseAlertProps) {
  return (
    <div
      className={cn(
        "flex size-full flex-full flex-col items-center justify-center gap-2 text-lg font-semibold text-icon",
        className,
      )}
    >
      {icon && <div className={animation}>{icon}</div>}
      {message && (
        <span className={cn(animation, "text-center")}>{message}</span>
      )}
      {children}
    </div>
  );
}
