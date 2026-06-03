import Skeleton from "@/components/common/skeleton";
import { cn } from "@/lib";
import { ChevronLeft } from "lucide-react";
import { ReactNode } from "react";

export type CardsListProps = {
  list?: {
    name: ReactNode | string;
    value: ReactNode | string;
    hasValue?: boolean;
  }[];
  indicator?: boolean;
  className?: string;
  loading?: boolean;
};

export default function CardsList(props: CardsListProps) {
  if (props.loading) {
    return <Skeleton className="h-full w-full" />;
  }
  return (
    <div className={cn("grid grid-cols-2 gap-4", props.className)}>
      {props.list?.map((item, index) => {
        return (
          <div
            key={index}
            className="bg-card hover:bg-card-hover flex cursor-default flex-col gap-1 rounded-md border p-2"
          >
            <div className="flex items-center gap-2">
              {props.indicator && (
                <div
                  className={cn("bg-primary -mt-px min-h-2 min-w-2 rounded-sm", {
                    "bg-error": !item.hasValue,
                  })}
                />
              )}
              <div className="text-hint text-sm font-medium text-nowrap @sm:text-xs">
                {item.name}
              </div>
            </div>
            <div className="flex items-center gap-4 ps-4">
              <div
                className="flex max-w-full items-center justify-end text-nowrap whitespace-nowrap @sm:text-sm"
                title={typeof item.value === "string" ? item.value : ""}
              >
                <span className="truncate">{item.value}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
