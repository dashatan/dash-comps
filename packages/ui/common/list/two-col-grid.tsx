import Skeleton from "@/components/common/skeleton";
import { cn } from "@/lib";
import { ReactNode } from "react";

export type TwoColGridListProps = {
  list?: {
    name: string;
    value: ReactNode | string;
    hasValue?: boolean;
  }[];
  className?: string;
  loading?: boolean;
};

export default function TwoColGridList(props: TwoColGridListProps) {
  return (
    <div className={cn("grid w-full grid-cols-2 gap-4", props.className)}>
      {props.list?.map((item, index, a) => {
        if (props.loading) {
          return <Skeleton key={index} className="min-h-12 w-full" />;
        }
        const lastIsOdd = index === a.length - 1 && (index + 1) % 2 !== 0;

        return (
          <div
            key={index}
            className={cn(
              "border-border flex min-h-10 w-full flex-col justify-center gap-1 rounded-md border px-3 py-1",
              { "col-span-2": lastIsOdd },
            )}
          >
            <div className="text-muted-foreground text-xs font-medium">{item.name}</div>
            <div className="text-foreground text-xs font-semibold">{item.value}</div>
          </div>
        );
      })}
    </div>
  );
}
