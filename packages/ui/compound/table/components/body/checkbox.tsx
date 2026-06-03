import { Checkbox } from "@/components/common/inputs/checkbox";
import { TableData } from "@/components/compound/table/types";
import { cn } from "@/lib";
import { useFormContext, useWatch } from "react-hook-form";

export namespace TableCheckbox {
  export function SelectAll({
    ids,
    onChange,
  }: {
    ids?: (number | string)[];
    onChange?: (selected: (number | string)[]) => void;
  }) {
    const table = useFormContext<TableData>();
    const { selectAll, selected } = useWatch<TableData>();
    const pageIsSelected = !!ids?.length && ids?.every((x) => selected?.includes(x));
    const checked = selectAll || pageIsSelected;
    return (
      <div className="relative me-0 flex items-center rounded-md p-2">
        <Checkbox.Basic
          onChange={(active) => {
            table.setValue("selectAll", false);
            if (active && ids) {
              const newSelected = [
                ...(selected || []),
                ...ids.filter((x) => !selected?.includes(x)),
              ];
              table.setValue("selected", newSelected);
              onChange && onChange(newSelected);
            } else {
              const newSelected = selected?.filter((x) => !ids?.includes(x));
              table.setValue("selected", newSelected);
              newSelected && onChange && onChange(newSelected);
            }
          }}
          checked={checked}
          className={cn("border-table-border bg-table-checkbox")}
        />
      </div>
    );
  }
  export function SelectOne({
    value,
    onChange,
  }: {
    value: string | number;
    onChange?: (selected: (number | string)[]) => void;
  }) {
    const table = useFormContext<TableData>();
    const { selectAll, selected } = useWatch<TableData>();
    const checked = selectAll || selected?.includes(value);

    return (
      <div className="flex w-full items-center justify-center">
        <Checkbox.Basic
          checked={checked}
          className={cn("border-table-border bg-table-checkbox")}
          onChange={() => {
            let newSelected = [...(selected || [])];
            if (newSelected.includes(value)) {
              newSelected = newSelected.filter((x) => x !== value);
            } else {
              newSelected = [...newSelected, value];
            }
            table.setValue("selected", newSelected);
            onChange && onChange(newSelected);
          }}
        />
      </div>
    );
  }
}
