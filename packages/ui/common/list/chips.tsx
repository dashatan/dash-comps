import { cn } from "@/lib";
import { ReactNode } from "react";

export type TwoColGridListProps = {
  list?: {
    name: string;
    icon?: ReactNode;
    isActive?: boolean;
  }[];
  className?: string;
  icon?: ReactNode;
};

export default function ChipsList(props: TwoColGridListProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", props.className)}>
      {props.list?.map((item, index) => {
        return (
          <div
            key={index}
            className={cn(
              "flex h-8 min-h-8 cursor-default justify-center gap-2 rounded-md border px-4",
              "items-center",
              {
                "border-primary bg-primary": item.isActive,
                "border-background bg-background opacity-60": !item.isActive,
              },
            )}
          >
            {props.icon ||
              (item.icon && (
                <div className="text-xs">{item.icon || props.icon}</div>
              ))}
            <div className="text-xs font-medium text-foreground">
              {item.name}
            </div>
          </div>
        );
      })}
    </div>
  );
}
