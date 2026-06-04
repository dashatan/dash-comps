import { cn } from "@/lib";
import { ChevronDown, Loader2 } from "lucide-react";
import { ReactNode } from "react";

type TriggerActionsProps = {
  open?: boolean;
  Icon?: ReactNode;
  loading?: boolean;
  chevronClassName?: string;
};

export function TriggerActions({
  open,
  Icon,
  loading,
  chevronClassName,
}: TriggerActionsProps) {
  if (loading) {
    return <Loader2 className="size-5 animate-spin" />;
  }

  if (Icon) {
    return Icon;
  }

  return (
    <ChevronDown
      className={cn("size-5 transition-all", chevronClassName, {
        "rotate-180": open,
      })}
      aria-hidden="true"
    />
  );
}
