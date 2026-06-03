import { ActionMenuProps } from "./action-menu";
import { cn } from "@/lib";

export default function ActionMenuList({ onChange, options }: ActionMenuProps) {
  return (
    <div className="bg-popover border-popover-border z-5 flex min-w-28 flex-col overflow-hidden rounded-md border p-1">
      {options?.map((option, index) => {
        if (option.hide) return <></>;
        return (
          <div
            key={index}
            className={cn(
              "h-8 cursor-pointer rounded-sm px-2 text-sm font-medium last:border-0",
              "flex items-center gap-2 transition-all",
              "text-foreground hover:bg-table-row",
              option.className,
            )}
            onClick={(e) => {
              option.onClick?.();
              onChange?.(option.value);
            }}
          >
            <span className="flex min-w-4 items-center justify-center">
              {option.icon}
            </span>
            <span>{option.label}</span>
          </div>
        );
      })}
    </div>
  );
}
