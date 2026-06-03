"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { SelectItem, SingleSelectProps } from "./types";
import SelectContainer from "./container";
import EmptyTemplate from "./comps/empty";
import List from "../list";
import { ListItem } from "../list/item";
import { cn, useLanguage } from "@/lib";

const SELECT_ALL_VALUE = "__SELECT_ALL__";

export default function SingleSelect({
  options = [],
  onChange,
  onReachBottom,
  value: propValue,
  defaultValueTitle,
  noValueChange,
  itemTemplate,
  virtualized = false,
  className,
  unClearable,
  withSelectAll = false,
  selectAllLabel,
  disabled,
  height,
  width,
  ...props
}: SingleSelectProps) {
  const { t } = useLanguage();
  const [data, setData] = useState<SelectItem[]>(options);
  const [value, setValue] = useState<string | number | undefined>(propValue);
  const [open, setOpen] = useState(false);

  const selectedOption = useMemo(
    () => options?.find((x) => x.value === value),
    [options, value],
  );
  const displayValue = useMemo(
    () => selectedOption?.label || defaultValueTitle,
    [selectedOption, defaultValueTitle],
  );

  const memoizedOptions = useMemo(() => {
    if (!withSelectAll) return options;
    const selectAllOption: SelectItem = {
      value: SELECT_ALL_VALUE,
      label: selectAllLabel || t("common.selectAll"),
    };
    return [selectAllOption, ...options];
  }, [options, withSelectAll, t]);

  useEffect(() => {
    setData(memoizedOptions);
  }, [memoizedOptions]);

  useEffect(() => {
    setValue(propValue);
  }, [propValue]);

  const handleChange = useCallback(
    (option: SelectItem) => {
      if (option.disabled) return;
      setOpen(false);
      let newVal: string | number | undefined;
      if (option.value === SELECT_ALL_VALUE) {
        newVal = undefined;
      } else if (withSelectAll || unClearable) {
        newVal = option.value;
      } else {
        newVal = value === option.value ? undefined : option.value;
      }

      if (!noValueChange) setValue(newVal);
      onChange?.(newVal);
    },
    [value, noValueChange, onChange, withSelectAll, unClearable],
  );

  const handleSearch = useCallback(
    (text?: string) => {
      if (text) {
        const searchText = text.toLowerCase();
        const filtered = memoizedOptions.filter(
          (item) =>
            item.value === SELECT_ALL_VALUE ||
            item.label
              ?.split(" ")
              .some((word) => word.toLowerCase().startsWith(searchText)),
        );
        setData(filtered);
      } else {
        setData(memoizedOptions);
      }
    },
    [memoizedOptions],
  );

  const handleClear = useCallback(() => {
    onChange?.();
  }, [onChange]);

  const renderContent = useMemo(() => {
    if (!data.length) return <EmptyTemplate />;

    if (virtualized) {
      return (
        <List
          onChange={handleChange}
          onReachBottom={onReachBottom}
          itemTemplate={itemTemplate}
          itemClassName={className?.dropdown?.item}
          className={className?.dropdown?.body}
          data={data}
          value={value}
          loading={props.loading}
        />
      );
    }

    return data.map((item, index) => {
      const template = itemTemplate ? itemTemplate(item) : undefined;
      const isActive =
        item.value === SELECT_ALL_VALUE ? value === undefined : value === item.value;
      return (
        <ListItem
          key={item.value || index}
          {...item}
          active={isActive}
          onChange={() => handleChange(item)}
          className={cn(item.className, className?.dropdown?.item)}
          template={template}
        />
      );
    });
  }, [
    data,
    virtualized,
    handleChange,
    onReachBottom,
    itemTemplate,
    className,
    value,
    props.loading,
  ]);

  return (
    <div
      className={cn(
        "w-full transition-all",
        disabled && "pointer-events-none cursor-not-allowed opacity-50 grayscale",
        className?.wrapper?.container,
      )}
      style={{ width, height }}
    >
      <SelectContainer
        onSearch={handleSearch}
        onClear={withSelectAll ? undefined : handleClear}
        value={displayValue}
        open={open}
        onOpenChange={setOpen}
        className={className}
        withSelectAll={withSelectAll}
        selectAllLabel={selectAllLabel}
        {...props}
      >
        {renderContent}
      </SelectContainer>
    </div>
  );
}
