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
        "text-icon flex size-full flex-1 flex-col items-center justify-center gap-2 text-lg font-semibold",
        className,
      )}
    >
      {icon && <div className={animation}>{icon}</div>}
      {message && <span className={animation}>{message}</span>}
      {children}
    </div>
  );
}
