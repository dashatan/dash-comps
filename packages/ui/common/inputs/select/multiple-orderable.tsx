"use client";

import { cn } from "@/lib";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Reorder, useDragControls } from "framer-motion";
import { GripVertical, RefreshCw } from "lucide-react";
import Checkbox from "@/components/common/inputs/checkbox";
import {
  MultiSelectDNDProps,
  SelectItem,
  TableHeaderChangeEvent,
} from "./types";
import SelectContainer from "./container";

const REORDER_TRANSITION = {
  type: "spring" as const,
  stiffness: 500,
  damping: 35,
};

function pruneSelected(
  selected: SelectItem["value"][],
  options: SelectItem[],
): SelectItem["value"][] {
  const validValues = new Set(options.map((item) => item.value));
  return selected.filter((value) => validValues.has(value));
}

function orderSelectedByData(
  data: SelectItem[],
  selected: SelectItem["value"][],
): SelectItem["value"][] {
  const selectedSet = new Set(selected);
  return data
    .filter((item) => selectedSet.has(item.value))
    .map((item) => item.value);
}

function getSelectedOptions(
  data: SelectItem[],
  selected: SelectItem["value"][],
): SelectItem[] {
  const selectedSet = new Set(selected);
  return data.filter((item) => selectedSet.has(item.value));
}

type OrderableHeaderProps = {
  heading?: string;
  subHeading?: string;
  onRefresh?: () => void;
};

function OrderableHeader({
  heading,
  subHeading,
  onRefresh,
}: OrderableHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-10 border-b p-2">
      <div className="flex flex-col">
        <span className="text-base font-semibold">{heading}</span>
        <span className="text-xs font-light">{subHeading}</span>
      </div>
      {onRefresh ? (
        <button
          type="button"
          className="flex items-center rounded-md p-1 text-foreground transition-colors hover:bg-input-accent"
          aria-label="Reset order"
          onClick={onRefresh}
        >
          <RefreshCw className="size-5" />
        </button>
      ) : null}
    </div>
  );
}

type OrderableRowProps = {
  item: SelectItem;
  active: boolean;
  onToggle: () => void;
  onDragEnd: () => void;
};

function OrderableRow({
  item,
  active,
  onToggle,
  onDragEnd,
}: OrderableRowProps) {
  const dragControls = useDragControls();
  const disabled = item.disabled === true;

  return (
    <Reorder.Item
      as="li"
      value={item}
      drag={disabled ? false : "y"}
      dragDirectionLock
      dragMomentum={false}
      dragElastic={0}
      dragListener={false}
      dragControls={dragControls}
      onDragEnd={onDragEnd}
      transition={REORDER_TRANSITION}
      className="relative flex h-full w-full shrink-0 list-none items-center rounded-md"
      style={{ position: "relative" }}
    >
      <span
        className={cn(
          "flex shrink-0 touch-none",
          disabled
            ? "cursor-not-allowed opacity-40"
            : "cursor-grab active:cursor-grabbing",
        )}
        aria-label={
          disabled ? undefined : `Reorder ${item.label ?? String(item.value)}`
        }
        onPointerDown={(event) => {
          if (disabled) return;
          dragControls.start(event);
        }}
      >
        <GripVertical className="size-6 text-foreground/60" />
      </span>
      <Checkbox
        label={item.label}
        checked={active}
        disabled={disabled}
        onChange={() => {
          if (!disabled) onToggle();
        }}
        className="min-w-0 flex-full py-2 hover:bg-input-accent"
      />
    </Reorder.Item>
  );
}

export default function MultiSelectOrderable({
  selected: selectedProp,
  value,
  onChange,
  onRefresh,
  options = [],
  heading,
  subHeading,
  whitChips,
  showChips: showChipsProp,
  reorder,
  setReorder,
  labelType = "count",
  ...rest
}: MultiSelectDNDProps) {
  const isSelectedControlled = selectedProp !== undefined;
  const isValueControlled = !isSelectedControlled && value !== undefined;
  const isControlled =
    isSelectedControlled || isValueControlled || onChange !== undefined;

  const externalSelected = (isSelectedControlled ? selectedProp : value) ?? [];

  const selectedKey = JSON.stringify(externalSelected);
  const optionsContentKey = JSON.stringify(
    options.map((item) => [item.value, item.label, item.disabled]),
  );

  const [internalSelected, setInternalSelected] = useState<
    SelectItem["value"][]
  >(() => pruneSelected(externalSelected, options));

  const [data, setData] = useState<SelectItem[]>(options);
  const dataRef = useRef(data);
  dataRef.current = data;

  useEffect(() => {
    if (!isControlled) return;
    const next = JSON.parse(selectedKey) as SelectItem["value"][];
    setInternalSelected(pruneSelected(next, dataRef.current));
  }, [isControlled, selectedKey]);

  const notifyChange = useCallback(
    (event: TableHeaderChangeEvent) => {
      onChange?.(event);
    },
    [onChange],
  );

  useEffect(() => {
    setData(options);
    dataRef.current = options;

    if (isControlled) {
      const baseSelected = isSelectedControlled
        ? (selectedProp ?? [])
        : (value ?? []);
      const pruned = pruneSelected(baseSelected, options);
      if (pruned.length !== baseSelected.length) {
        notifyChange({ data: options, selected: pruned });
      }
      return;
    }

    setInternalSelected((prev) => {
      const pruned = pruneSelected(prev, options);
      if (pruned.length !== prev.length) {
        notifyChange({ data: options, selected: pruned });
      }
      return pruned;
    });
    // Only reset list order when option content changes — not when selection changes.
  }, [optionsContentKey]);

  useEffect(() => {
    if (!reorder) return;
    setData(options);
    dataRef.current = options;
    setReorder?.(false);
  }, [reorder, options, setReorder]);

  const selected = internalSelected;

  const emitChange = useCallback(
    (nextSelected: SelectItem["value"][], nextData: SelectItem[]) => {
      const orderedSelected = orderSelectedByData(nextData, nextSelected);

      if (!isControlled) {
        setInternalSelected(orderedSelected);
      }

      notifyChange({ data: nextData, selected: orderedSelected });
    },
    [isControlled, notifyChange],
  );

  const selectedOptions = useMemo(
    () => getSelectedOptions(data, selected),
    [data, selected],
  );

  const showChipsEnabled = showChipsProp ?? whitChips ?? false;
  const showChips = selected.length > 0 && showChipsEnabled;

  const handleSelectChange = useCallback(
    (option: SelectItem) => {
      if (option.disabled) return;

      const exists = selected.includes(option.value);
      const nextSelected = exists
        ? selected.filter((itemValue) => itemValue !== option.value)
        : [...selected, option.value];

      emitChange(nextSelected, data);
    },
    [selected, data, emitChange],
  );

  const handleReorder = useCallback((next: SelectItem[]) => {
    dataRef.current = next;
    setData(next);
  }, []);

  const handleDragEnd = useCallback(() => {
    emitChange(selected, dataRef.current);
  }, [selected, emitChange]);

  const handleClear = useCallback(() => {
    emitChange([], data);
  }, [data, emitChange]);

  const headerTemplate = useMemo(
    () =>
      heading || subHeading || onRefresh ? (
        <OrderableHeader
          heading={heading}
          subHeading={subHeading}
          onRefresh={onRefresh}
        />
      ) : undefined,
    [heading, subHeading, onRefresh],
  );

  return (
    <SelectContainer
      {...rest}
      scrollable
      layoutScroll
      labelType={labelType}
      showChips={showChips}
      chips={selectedOptions}
      count={selected.length}
      onRemove={handleSelectChange}
      onClear={selected.length > 0 ? handleClear : undefined}
      headerTemplate={headerTemplate}
    >
      <Reorder.Group
        axis="y"
        values={data}
        onReorder={handleReorder}
        className="contents w-full select-none"
      >
        {data.map((item) => (
          <OrderableRow
            key={item.value}
            item={item}
            active={selected.includes(item.value)}
            onToggle={() => handleSelectChange(item)}
            onDragEnd={handleDragEnd}
          />
        ))}
      </Reorder.Group>
    </SelectContainer>
  );
}
