import { cn, useLanguage } from "@/lib";

export type StatusType = "normal" | "alert" | "critical";

export interface StatusElementProps {
  type: StatusType;
}

export default function StatusElement({ type }: StatusElementProps) {
  const { t } = useLanguage();

  return (
    <div className="flex w-full items-center justify-center gap-1 dir-ltr">
      <span>{t(`common.${type}`)}</span>
      <span
        className={cn("h-2 w-2 rounded-full", {
          "bg-success": type === "normal",
          "bg-warning": type === "alert",
          "bg-destructive": type === "critical",
        })}
        aria-hidden="true"
      />
    </div>
  );
}
