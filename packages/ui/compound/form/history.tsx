"use client";

import {
  forwardRef,
  ReactElement,
  ReactNode,
  Ref,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import Button from "@/components/common/buttons";
import PlateCard from "@/components/compound/license-plate/components/plate-card";
import { Clock, Trash2 } from "lucide-react";
import { cn, formatPersianDate, formatPersianDateTime, useLanguage } from "@/lib";
import { UseFormReturn } from "react-hook-form";

export function FormHistoryInner<T>(
  {
    form,
    columns,
    storageKey,
    showClearAll = true,
    emptyStateIcon,
    emptyStateMessage,
    className = "",
    tableClassName = "",
    headerClassName = "",
    rowClassName = "",
    actionsColumnWidth = "w-32",
    showActions = true,
    maxItems = 10,
    saveManually = false,
    updateItemsOnSave = false,
  }: FormHistoryProps<T>,
  ref: Ref<FormHistoryRef<T>>,
) {
  const { t } = useLanguage();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (items.length > 0) {
      setShowHistory(true);
    }
  }, [items]);

  const hasItems = useMemo(() => items.length > 0, [items]);

  // Load items from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as HistoryItem[];
        setItems(parsed);
      } catch (error) {
        console.error("Error parsing saved history:", error);
      }
    }
  }, [storageKey]);

  useEffect(() => {
    if (form.formState.isSubmitSuccessful && !saveManually) saveItem(form.getValues());
  }, [form.formState.isSubmitSuccessful]);

  // Save item to history
  const saveItem = (data: Record<string, any>) => {
    // Check if this data already exists
    const dataExists = items.some((item) => {
      return JSON.stringify(item.data) === JSON.stringify(data);
    });

    if (dataExists) {
      return; // Don't save if data already exists
    }

    const newItem: HistoryItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      data,
    };

    const updatedItems = [newItem, ...items.slice(0, maxItems - 1)]; // Keep only last N items
    localStorage.setItem(storageKey, JSON.stringify(updatedItems));
    if (updateItemsOnSave) {
      setItems(updatedItems);
    }
  };

  useImperativeHandle(ref, () => ({
    saveItem,
    hasItems,
    showHistory,
    setShowHistory,
  }));

  // Load item from history and update form
  const loadItemFromHistory = (item: HistoryItem) => {
    const itm = items.find((i) => i.id === item.id);
    if (itm) {
      form.reset(itm.data as T);
    }
  };

  // Delete item from history
  const deleteItem = (itemId: string) => {
    const updatedItems = items.filter((item) => item.id !== itemId);
    setItems(updatedItems);
    localStorage.setItem(storageKey, JSON.stringify(updatedItems));
  };

  // Clear all history
  const clearAll = () => {
    setItems([]);
    localStorage.removeItem(storageKey);
  };

  const defaultEmptyStateIcon = <Clock className="mx-auto mb-2 h-12 w-12" />;
  const defaultEmptyStateMessage = t("form.noSearchHistory");

  if (!showHistory) return <></>;
  return (
    <div
      className={`bg-table m-2 overflow-auto rounded-lg border shadow-md ${className}`}
    >
      <div className="flex items-center justify-between p-4">
        <h3 className="text-lg font-semibold">{t("form.searchHistory")}</h3>
        {showClearAll && items.length > 0 && (
          <Button
            type="button"
            variant="outlined"
            severity="danger"
            size="sm"
            onClick={clearAll}
            className="text-error"
          >
            {t("common.clearAll")}
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="py-8 text-center">
          {emptyStateIcon || defaultEmptyStateIcon}
          <p>{emptyStateMessage || defaultEmptyStateMessage}</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className={`w-full text-right text-sm ${tableClassName}`}>
            <thead className={`bg-table-header text-xs uppercase ${headerClassName}`}>
              <tr>
                <th className="w-40 px-6 py-3">{t("form.searchCreationDate")}</th>
                {columns.map((col, index) => {
                  return (
                    <th key={index} className={cn(`px-6 py-3`, col.headerClassName)}>
                      {col.label}
                    </th>
                  );
                })}
                {showActions && (
                  <th className={`px-6 py-3 text-center ${actionsColumnWidth}`}>
                    {t("common.actions")}
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.id}
                  className={`bg-table hover:bg-table-header/50 cursor-pointer border-b last:border-b-0 ${rowClassName}`}
                  onClick={() => loadItemFromHistory(item)}
                >
                  <td className="dir-ltr w-40 px-6 py-4">
                    {formatPersianDateTime(item.timestamp)}
                  </td>
                  {columns.map((col, index) => {
                    const { customRenderer, type, field } = col;
                    return (
                      <td key={index} className={cn(`px-6 py-4`, col.className)}>
                        {renderColumnValue({
                          item,
                          type,
                          value: item.data[field],
                          customRenderer,
                        })}
                      </td>
                    );
                  })}
                  {showActions && (
                    <td className={`text-center ${actionsColumnWidth}`}>
                      <Button
                        variant="icon"
                        severity="danger"
                        size={40}
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteItem(item.id);
                        }}
                        className="text-error p-1"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export const FormHistory = forwardRef(FormHistoryInner) as <T>(
  props: FormHistoryProps<T> & { ref?: Ref<FormHistoryRef<T>> },
) => ReactElement;

// Base types for history items
export type HistoryItem = {
  id: string;
  timestamp: number;
  data: Record<string, any>;
};

// Column value types
export type ColumnValueType = "string" | "plate" | "dateRange" | "custom";

// Column configuration
export type HistoryColumn = {
  field?: string;
  type: ColumnValueType;
  label: string;
  className?: string;
  headerClassName?: string;
  customRenderer?: (item: HistoryItem) => ReactNode;
};

// FormHistoryRef
export type FormHistoryRef<T> = {
  saveItem: (data: T) => void;
  hasItems: boolean;
  showHistory: boolean;
  setShowHistory: (showHistory: boolean) => void;
};

// Props for the FormHistoryTable component
export type FormHistoryProps<T> = {
  form: UseFormReturn<T>;
  columns?: HistoryColumn[];
  storageKey: string;
  showClearAll?: boolean;
  saveManually?: boolean;
  emptyStateIcon?: ReactNode;
  emptyStateMessage?: string;
  className?: string;
  tableClassName?: string;
  headerClassName?: string;
  rowClassName?: string;
  actionsColumnWidth?: string;
  showActions?: boolean;
  maxItems?: number;
  updateItemsOnSave?: boolean;
};

export type RenderColumnValueProps = {
  value: any;
  type: ColumnValueType;
  item: HistoryItem;
  customRenderer?: (item: HistoryItem) => ReactNode;
};

// Default column renderers
const renderColumnValue = ({
  value,
  type,
  item,
  customRenderer,
}: RenderColumnValueProps): ReactNode => {
  switch (type) {
    case "string":
      return <span className="text-sm">{value || "-"}</span>;

    case "plate":
      return <PlateCard value={value} />;

    case "dateRange":
      if (Array.isArray(value) && value.length === 2) {
        return (
          <span className="text-sm">{`${formatPersianDate(value[0])} - ${formatPersianDate(value[1])}`}</span>
        );
      }
      return <span className="text-sm">-</span>;

    case "custom":
      return customRenderer ? customRenderer(item) : <span className="text-sm">-</span>;

    default:
      return <span className="text-sm">{value || "-"}</span>;
  }
};
