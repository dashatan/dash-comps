import { cn } from "@/lib";
import { TreeSelectItem } from "../types";
import { flattenData } from "../utils";
import { ChevronDown } from "lucide-react";
import { Checkbox } from "@/components/common/inputs/checkbox";

export type RecursiveSelectItemProps = {
  selected: (number | string)[];
  opened: (number | string)[];
  onClick: (option: TreeSelectItem) => void;
  option: TreeSelectItem;
  onChange: (option: TreeSelectItem, active: boolean) => void;
  depth: number;
  last?: boolean;
  first?: boolean;
};

export function RecursiveSelectItem({
  opened,
  selected,
  option,
  onClick,
  onChange,
  depth,
  last,
}: RecursiveSelectItemProps) {
  const hasChildren = !!option.children?.length;
  const allChildren = option.children ? flattenData(option.children) : [];
  const allChildrenChecked = allChildren
    .filter((x) => x.last)
    .every((x) => selected.includes(x.value));
  const someChildrenChecked = allChildren
    .filter((x) => x.last)
    .some((x) => selected.includes(x.value));
  let active = hasChildren ? allChildrenChecked : selected.includes(option.value);
  let halfChecked = hasChildren && someChildrenChecked && !allChildrenChecked;
  const open = opened.includes(option.value);

  depth++;
  return (
    <li>
      <div
        className={cn("relative flex items-center transition-all", {
          "cursor-pointer": true,
        })}
        onClick={(e) => {
          e.stopPropagation();
          hasChildren ? onClick(option) : onChange(option, !active);
        }}
      >
        {depth > 1 && (
          <div>
            <div className={cn("bg-border h-px w-6", { "ms-6 w-6": depth > 2 })} />
            <div
              className={cn("bg-border absolute top-0 right-0 h-full w-px", {
                "h-1/2!": last,
                "right-6": depth > 2,
              })}
            />
          </div>
        )}
        {hasChildren && (
          <span
            className="w-8 max-w-8 min-w-8"
            onClick={(e) => {
              if (!hasChildren) return;
              e.stopPropagation();
              onClick(option);
            }}
          >
            <ChevronDown
              className={cn("scale-75 transition-all", { "rotate-90": !open })}
            />
          </span>
        )}
        <div
          id="checkbox-container"
          className="hover:bg-input-accent/50 flex w-full items-center rounded-md p-2 transition-all"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={cn("", {
              "ps-3": depth > 1,
            })}
          >
            <Checkbox.Basic
              checked={active}
              halfChecked={halfChecked}
              onChange={(a) => onChange(option, a)}
              className="border-table-border bg-table-checkbox"
              iconClassName="text-foreground"
            />
          </div>
          <div
            className={cn(
              "flex w-full items-center justify-between ps-3 text-base select-none",
            )}
          >
            <span>{option.label}</span>
          </div>
        </div>
      </div>
      {hasChildren && open && (
        <ul className={cn("relative flex flex-col ps-3.5")}>
          {depth > 1 && !last && (
            <div className={cn("bg-border absolute top-0 right-0 h-full w-px")} />
          )}
          {option.children?.map((child, index, a) => {
            return (
              <RecursiveSelectItem
                key={index}
                opened={opened}
                depth={depth}
                selected={selected}
                last={index === a.length - 1}
                option={child}
                onChange={onChange}
                onClick={onClick}
              />
            );
          })}
        </ul>
      )}
    </li>
  );
}
