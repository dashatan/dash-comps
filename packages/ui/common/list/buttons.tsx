import Skeleton from "@/components/common/skeleton";
import Marquee from "@/components/common/typography/marquee";
import { cn, useLanguage } from "@/lib";
import { ReactNode } from "react";

export type ButtonListProps = {
  list?: {
    name: string;
    value: ReactNode | string;
    hasValue?: boolean;
  }[];
  indicator?: boolean;
  className?: string;
  itemClassName?: string;
  loading?: boolean;
};

export default function ButtonsList(props: ButtonListProps) {
  const { t } = useLanguage();
  return (
    <div className={cn("flex flex-col gap-4", props.className)}>
      {props.list?.map((item, index) => {
        return (
          <div
            key={index}
            className={cn("flex items-center justify-between", props.itemClassName)}
          >
            <div className="flex items-center gap-2">
              {props.indicator && (
                <div
                  className={cn("bg-foreground size-2 rounded-sm", {
                    "bg-primary": item.hasValue,
                    "bg-error": !item.hasValue,
                  })}
                />
              )}
              <div className="text-foreground text-sm font-semibold">{item.name}</div>
            </div>
            {props.loading ? (
              <Skeleton className="h-10 w-40" />
            ) : (
              <Marquee className="border-border text-foreground flex min-h-10 max-w-40 min-w-40 items-center justify-center overflow-hidden rounded border text-center text-sm font-semibold">
                {item.value ?? t("common.uncertain")}
              </Marquee>
            )}
          </div>
        );
      })}
    </div>
  );
}
