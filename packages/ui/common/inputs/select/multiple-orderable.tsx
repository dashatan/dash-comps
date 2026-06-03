"use client";

import { cn } from "@/lib";
import { useEffect, useRef, useState } from "react";
import { GripVertical, RefreshCw } from "lucide-react";
import Checkbox from "@/components/common/inputs/checkbox";
import { MultiSelectDNDProps, SelectItem } from "./types";
import SelectContainer from "./container";

export default function MultiSelectOrderable(props: MultiSelectDNDProps) {
  const dragItem = useRef<any>(null);
  const dragOverItem = useRef<any>(null);
  const [selected, setSelected] = useState<SelectItem["value"][]>(props.selected || []);
  const [data, setData] = useState(props.options);
  const showChips = selected.length > 0 && props.whitChips;
  const selectedOptions = props.options?.filter((x) => selected.includes(x.value));

  useEffect(() => {
    props.selected && setSelected(props.selected);
  }, [props.selected]);

  useEffect(() => {
    if (props.reorder) {
      setData(props.options);
      props.setReorder && props.setReorder(false);
    }
  }, [props.reorder]);

  function handleSelectChange(option: SelectItem) {
    let res = [...selected, option.value];
    if (selected.includes(option.value)) {
      res = selected.filter((y) => y !== option.value);
    }
    setSelected(res);
    props.onChange && props.onChange({ data, selected: res });
  }

  function handleOrderChange(val?: SelectItem[]) {
    setData(val);
    props.onChange && props.onChange({ data: val, selected });
  }

  function handleDragStart(e: any) {
    dragItem.current = e.target?.id;
  }

  function handleDragEnter(e: any) {
    let d = e.currentTarget?.id;
    if (dragItem.current === d) return;
    dragOverItem.current = d;
    const newData = [...(data || [])];
    const s = newData.findIndex((x) => x.value === dragItem.current);
    d = newData.findIndex((x) => x.value === d);
    const item1 = newData[s];
    newData.splice(s, 1);
    newData.splice(d, 0, item1);
    setData(newData);
  }

  function handleDrop() {
    dragItem.current = null;
    dragOverItem.current = null;
    handleOrderChange(data);
  }

  function HeaderTemplate() {
    return (
      <div className="flex items-center justify-between gap-10 border-b p-2">
        <div className="flex flex-col">
          <span className="text-base font-semibold">{props.heading}</span>
          <span className="text-xs font-light">{props.subHeading}</span>
        </div>
        <div className="flex items-center gap-3">
          <RefreshCw
            className="w-5 cursor-pointer"
            onClick={() => props.onRefresh && props.onRefresh()}
          />
        </div>
      </div>
    );
  }

  return (
    <SelectContainer
      {...props}
      showChips={showChips}
      chips={selectedOptions}
      count={selected.length}
      headerTemplate={<HeaderTemplate />}
    >
      <div className="relative flex h-full max-h-[400px] w-auto flex-col overflow-auto rounded-md">
        {data?.map((item) => {
          const active = selected.includes(item.value);
          const hidden = dragItem.current === item.value;
          return (
            <div
              id={`${item.value}`}
              key={item.value}
              draggable
              onDragStart={handleDragStart}
              onDragEnter={handleDragEnter}
              onDragEnd={handleDrop}
              className={cn(
                "flex min-h-10 items-center rounded-md [&_span]:hover:opacity-100",
                {
                  "opacity-0": hidden,
                },
              )}
            >
              <span className="cursor-grab opacity-100 transition-all">
                <GripVertical className="text-foreground/60 size-6" />
              </span>
              <Checkbox
                label={item.label}
                checked={active}
                onChange={() => handleSelectChange(item)}
              />
            </div>
          );
        })}
      </div>
    </SelectContainer>
  );
}
