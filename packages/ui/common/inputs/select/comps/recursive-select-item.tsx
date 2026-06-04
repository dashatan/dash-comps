import { cn } from "@/lib";
import { TreeSelectItem } from "../types";
import { flattenData } from "../utils";
import { ChevronDown } from "lucide-react";
import { Checkbox } from "@/components/common/inputs/checkbox";
import {
  TreeChildrenContinuation,
  TreeRowGuidesMulti,
} from "@/components/common/inputs/select/comps/tree-guides";

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
  let active = hasChildren
    ? allChildrenChecked
    : selected.includes(option.value);
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
        {depth > 1 ? <TreeRowGuidesMulti depth={depth} last={last} /> : null}
        {hasChildren && (
          <span
            className="flex w-8 max-w-8 min-w-8 items-center justify-center rtl:rotate-180"
            onClick={(e) => {
              if (!hasChildren) return;
              e.stopPropagation();
              onClick(option);
            }}
          >
            <ChevronDown
              className={cn(
                "scale-75 transition-transform duration-200 ease-in-out",
                open ? "rotate-0" : "-rotate-90",
              )}
            />
          </span>
        )}
        <div
          id="checkbox-container"
          className="flex w-full items-center rounded-md p-2 transition-all hover:bg-input-accent/50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={cn("", {
              "ps-0": depth > 1,
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
          {depth > 1 && !last ? <TreeChildrenContinuation /> : null}
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
