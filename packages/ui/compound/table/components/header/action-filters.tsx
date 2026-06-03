import React, { useMemo, useCallback } from "react";
import Chip from "@/components/common/chips/chip";
import {
  ColumnProps,
  FilterValue,
  TableData,
  TableProps,
} from "@/components/compound/table/types";
import { useFormContext } from "react-hook-form";

export type ActionFiltersProps = {
  columns?: ColumnProps[];
  onChange?: TableProps["onTableChange"];
  excludes?: string[];
  sort?: string[];
  templates?: { name: string; template: (value?: FilterValue) => React.ReactNode }[];
};

export default function ActionFilters(props: ActionFiltersProps) {
  const { sort, excludes, templates, columns, onChange } = props;
  const table = useFormContext<TableData>();
  const filters = table.watch("filters");
  const state = table.getValues();

  // Memoize filtered and sorted items
  const items = useMemo(() => {
    let keys = filters ? Object.keys(filters) : [];
    if (sort) {
      keys = keys.sort((a, b) => (sort.includes(a) ? -1 : sort.includes(b) ? 1 : 0));
    }
    return keys;
  }, [filters, sort]);

  // Handler for removing a filter
  const handleRemove = useCallback(
    (x: string) => {
      if (!filters) return;
      const newFilters = { ...filters, [x]: undefined };
      const newState = { ...state, filters: newFilters };
      table.setValue("filters", newFilters);
      onChange && onChange(newState, "filter");
    },
    [filters, state, table, onChange],
  );

  // Render a single filter chip or template
  const renderFilter = (x: string) => {
    if (!filters) return null;
    const val = filters[x];
    if (!val || (excludes && excludes.includes(x))) return <React.Fragment key={x} />;
    const col = columns?.find((y) => y.filterKey === x || y.field === x);
    const template = templates?.find((t) => t.name === x);
    if (col?.filterChips) {
      return <React.Fragment key={x}>{col.filterChips(val)}</React.Fragment>;
    } else if (template?.template) {
      return <React.Fragment key={x}>{template.template(val)}</React.Fragment>;
    } else {
      const label = col?.filterChipsLabel || (col?.header as string);
      return (
        <Chip
          key={x}
          label={`${label ? label + ": " : ""}${val}`}
          onRemove={() => handleRemove(x)}
        />
      );
    }
  };

  return (
    <div className="flex min-h-[68px] w-full gap-2 overflow-x-auto border-b p-4">
      {filters && items.map(renderFilter)}
    </div>
  );
}
