"use client";

import { useEffect, useState, useMemo, useCallback, ReactNode } from "react";
import Checkbox from "@/components/common/inputs/checkbox";
import { MultiSelectProps, SelectItem } from "./types";
import SelectContainer from "./container";
import EmptyTemplate from "./comps/empty";
import List from "../list";
import { cn } from "@/lib";

export default function MultiSelect({
  value,
  selected: selectedProp,
  onChange,
  ...props
}: MultiSelectProps) {
  const isSelectedControlled = selectedProp !== undefined;
  const isValueControlled = !isSelectedControlled && value !== undefined;
  /** `onChange` without `value` still means parent owns selection (e.g. draft state). */
  const isControlled =
    isSelectedControlled || isValueControlled || onChange !== undefined;

  const externalSelected = (isSelectedControlled ? selectedProp : value) as
    | any[]
    | undefined;

  const [internalSelected, setInternalSelected] = useState<any[]>(externalSelected ?? []);

  const selectedKey = JSON.stringify(externalSelected ?? []);

  useEffect(() => {
    if (!isControlled) return;
    setInternalSelected(JSON.parse(selectedKey) as any[]);
  }, [isControlled, selectedKey]);

  const selected = internalSelected;
  const options = props.options ?? [];

  const [data, setData] = useState(options);
  const [open, setOpen] = useState(false);

  const showChips = selected.length > 0 && props.showChips;

  const selectedOptions = useMemo(
    () => options.filter((x) => selected.includes(x.value)),
    [options, selected],
  );

  useEffect(() => {
    setData(options);
  }, [options]);

  const emitChange = useCallback(
    (next: any[]) => {
      if (!isControlled) {
        setInternalSelected(next);
      }
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  const handleChange = useCallback(
    (option: SelectItem) => {
      const exists = selected.includes(option.value);
      const next = exists
        ? selected.filter((y) => y !== option.value)
        : [...selected, option.value];

      emitChange(next);
    },
    [selected, emitChange],
  );

  const handleSearch = useCallback(
    (text?: string) => {
      if (text) {
        const textNormalized = text.trim();
        const newData = options.filter((item) =>
          `${item.label || ""} ${item?.description || ""}`.includes(textNormalized),
        );
        setData(newData);
      } else {
        setData(options);
      }
    },
    [options],
  );

  const handleClear = useCallback(() => {
    emitChange([]);
  }, [emitChange]);

  const renderOption = useCallback(
    (option: SelectItem, template?: ReactNode) => {
      const active = selected.includes(option.value);
      const checkbox = (
        <Checkbox
          title={template ? undefined : option.label}
          label={template ? undefined : option.label}
          description={option?.description}
          checked={active}
          onChange={() => (template ? undefined : handleChange(option))}
          checkboxClassName={cn(
            !template && "hover:bg-input-accent/50 p-2 w-full transition-all",
          )}
          labelClassName="text-foreground"
          iconClassName="text-table-foreground"
          id={`${option.id}`}
        />
      );
      if (template) {
        return (
          <div
            className={cn(
              "flex items-center gap-2",
              props.virtualized &&
                "hover:bg-input-hover/50 me-2 cursor-pointer rounded-md p-3",
            )}
            onClick={() => handleChange(option)}
          >
            {checkbox}
            {template}
          </div>
        );
      }
      return checkbox;
    },
    [selected, handleChange],
  );

  return (
    <SelectContainer
      {...props}
      count={selected.length}
      showChips={showChips}
      chips={selectedOptions}
      onRemove={handleChange}
      onClear={selected.length > 0 ? handleClear : undefined}
      onSearch={handleSearch}
      open={open}
      onOpenChange={(e) => setOpen(e)}
      labelType="count"
    >
      {open && data?.length ? (
        <List
          onChange={handleChange}
          onReachBottom={props.onReachBottom}
          itemTemplate={(option) => renderOption(option, props.itemTemplate?.(option))}
          itemClassName={props.className?.dropdown?.item}
          className={props.className?.dropdown?.body}
          data={data}
          loading={props.loading}
          virtualized={props.virtualized}
        />
      ) : open ? (
        <EmptyTemplate />
      ) : null}
    </SelectContainer>
  );
}
