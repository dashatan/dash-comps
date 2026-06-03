import Skeleton from "@/components/common/skeleton";
import { cn } from "@/lib";
import { ReactNode } from "react";

export type LinesListProps = {
  list?: {
    name: string;
    value?: ReactNode | string;
    hasValue?: boolean;
  }[];
  indicator?: boolean;
  className?: string;
  loading?: boolean;
};

export default function LinesList(props: LinesListProps) {
  if (props.loading) {
    return <Skeleton className="h-full w-full" />;
  }
  return (
    <div className={cn("flex cursor-default flex-col gap-4", props.className)}>
      {props.list?.map((item, index) => {
        return (
          <div key={index} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {props.indicator && (
                <div
                  className={cn("size-2 min-h-2 min-w-2 rounded-sm", {
                    "bg-primary": item.hasValue,
                    "bg-error": !item.hasValue,
                  })}
                />
              )}
              <div className="text-foreground text-sm font-medium text-nowrap">
                {item.name}
              </div>
            </div>
            <div className="bg-border h-px w-full" />
            <div
              className="flex items-center justify-center text-sm text-nowrap"
              title={item.value && typeof item.value === "string" ? item.value : ""}
            >
              <span className="truncate">{item.value ?? "—"}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
