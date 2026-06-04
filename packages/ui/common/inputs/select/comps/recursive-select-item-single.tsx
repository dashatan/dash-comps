import { cn } from "@/lib";
import { TreeSelectItem } from "../types";
import { ChevronDown } from "lucide-react";
import { SelectRadioIndicator } from "@/components/common/inputs/select/comps/select-radio-indicator";
import {
  TreeChildrenContinuation,
  TreeRowGuidesSingle,
} from "@/components/common/inputs/select/comps/tree-guides";

export type RecursiveSelectItemSingleProps = {
  selected: number | string | undefined;
  opened: (number | string)[];
  onCollapse: (option: TreeSelectItem) => void;
  option: TreeSelectItem;
  onChange: (option: TreeSelectItem) => void;
  depth: number;
  last?: boolean;
  first?: boolean;
};

export function RecursiveSelectItemSingle({
  opened,
  selected,
  option,
  onCollapse,
  onChange,
  depth,
  last,
}: RecursiveSelectItemSingleProps) {
  const hasChildren = !!option.children?.length;
  const active = selected === option.value;
  const open = opened.includes(option.value);

  return (
    <li>
      <div
        className={cn(
          "relative flex cursor-pointer items-center transition-all",
        )}
      >
        {depth > 1 ? <TreeRowGuidesSingle last={last} /> : null}
        {hasChildren && (
          <span
            className="flex w-8 max-w-8 min-w-8 items-center justify-center rtl:rotate-180"
            onClick={(e) => {
              e.stopPropagation();
              onCollapse(option);
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
          className={cn(
            "flex flex-full items-center gap-2 rounded-md p-2 py-3 transition-all hover:bg-input-accent/50",
            {
              "ps-3": depth > 1,
            },
          )}
          onClick={(e) => {
            e.stopPropagation();
            onChange(option);
          }}
        >
          <SelectRadioIndicator active={active} />
          <div
            className={cn(
              "flex w-full items-center justify-between text-base select-none",
            )}
          >
            <span>{option.label}</span>
          </div>
        </div>
      </div>
      {hasChildren && open && (
        <ul className={cn("relative flex flex-col ps-3.5")}>
          {depth > 1 && !last ? <TreeChildrenContinuation /> : null}
          {option.children?.map((child, index, array) => {
            return (
              <RecursiveSelectItemSingle
                key={index}
                opened={opened}
                depth={depth + 1}
                selected={selected}
                last={index === array.length - 1}
                option={child}
                onChange={onChange}
                onCollapse={onCollapse}
              />
            );
          })}
        </ul>
      )}
    </li>
  );
}
