"use client";

import { cn } from "@/lib";
import { ListItem } from "./item";
import { useCallback, useMemo, useRef } from "react";
import { SelectItem } from "../select/types";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import Loading from "@/components/common/alert/loading";

export type ListProps = {
  onChange?: (option: SelectItem) => void;
  onReachBottom?: () => void;
  itemTemplate?: (option: SelectItem) => React.ReactNode;
  data?: SelectItem[];
  className?: string;
  itemClassName?: string;
  value?: string | number;
  loading?: boolean;
  virtualized?: boolean;
};

export default function List(props: ListProps) {
  const {
    value,
    onChange,
    onReachBottom,
    className,
    data,
    loading,
    itemTemplate,
    itemClassName,
    virtualized = true,
  } = props;
  const activeEl = useRef<HTMLDivElement | null>(null);
  const virtuoso = useRef<VirtuosoHandle>(null);

  const initialIndex = useMemo(() => {
    if (value == null || !data?.length) return 0;
    const i = data.findIndex((item) => item.value === value);
    return i >= 0 ? i : 0;
  }, [data, value]);

  const itemContent = useCallback(
    (index: number, option: SelectItem) => {
      const active = value === option.value;
      if (option.value === "loading") {
        return (
          <li className="flex items-center justify-center p-4 text-sm">
            <Loading />
          </li>
        );
      }
      return (
        <div
          key={option.value ?? index}
          ref={(el) => {
            if (active) activeEl.current = el;
          }}
        >
          {itemTemplate ? (
            itemTemplate(option)
          ) : (
            <ListItem
              {...option}
              onChange={() => onChange?.(option)}
              active={active}
              className={cn(option.className, itemClassName)}
              scrollIntoView={false}
            />
          )}
        </div>
      );
    },
    [value, itemTemplate, onChange, itemClassName],
  );

  const virtuosoData = !loading
    ? data
    : [...(data || []), { value: "loading", label: "loading" } as SelectItem];
  const endReached = useCallback(() => {
    if (!loading && onReachBottom) onReachBottom();
  }, [loading, onReachBottom]);

  return (
    <ul
      className={cn(
        "flex h-60 w-full flex-col overflow-x-hidden overflow-y-auto pe-2",
        className,
      )}
    >
      {virtualized ? (
        <Virtuoso
          data={virtuosoData}
          ref={virtuoso}
          initialTopMostItemIndex={initialIndex}
          endReached={endReached}
          style={{ height: "100%" }}
          itemContent={itemContent}
        />
      ) : (
        data?.map((item, index) => {
          return (
            <ListItem
              key={index}
              {...item}
              onChange={() => onChange?.(item)}
              active={value === item.value}
              className={cn(item.className, itemClassName)}
              template={itemTemplate?.(item)}
            />
          );
        })
      )}
    </ul>
  );
}
