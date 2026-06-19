import { memo, useCallback, useMemo, useState } from "react";
import Pagination from "./paginator";
import { Cog, List, Loader2, Search, X } from "lucide-react";
import { TableHeaderChangeEvent } from "@/components/common/inputs/select/types";
import {
  ColumnProps,
  TableData,
  TableStoreApi,
  tableDefaultState,
  TableProps,
} from "../../types";
import { orderColumnsWithoutHide } from "../../utils/order-columns";
import { Select } from "@/components/common/inputs/select";
import ActionMenu from "../body/action-menu";
import { cn, getDocumentDirection, useLanguage } from "@/lib";
import Badge from "@/components/common/badge";
import Button from "@/components/common/buttons";
import ExcelIcon from "@/components/common/icons/ExcelIcon";
import { ButtonProps } from "@/components/common/buttons/types";
import { useTableStore, useTableStoreApi } from "../../context";

function resolveColumnLabel(col: ColumnProps): string {
  if (typeof col.header === "string") return col.header;
  return col.field ?? String(col.id ?? "");
}

export type BulkActionOption = {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  className?: string;
  hide?: boolean;
  onChange?: (
    value: string | number,
    api?: TableStoreApi,
  ) => void | Promise<void>;
};

export interface ActionHeaderProps {
  bulkActionsOptions?: BulkActionOption[];
  firstExtraElements?: React.ReactNode;
  secondExtraElements?: React.ReactNode;
  totalSelected?: number;
  columns?: ColumnProps[];
  activeColumns?: string[];
  onOrderChange?: (data: TableData) => void;
  onChange?: TableProps["onTableChange"];
  loading?: boolean;
  hideBulkActions?: boolean;
  hideFilter?: boolean;
  hideTotalSelectedClearBtn?: boolean;
  excelExportOptions?: { isLoading: boolean; onRequest: () => void };
  className?:
    | string
    | { container?: string; firstSection?: string; secondSection?: string };
}

function ActionHeaderFunction(props: ActionHeaderProps) {
  const { t, language } = useLanguage();
  const isRtl = getDocumentDirection(language) === "rtl";
  const { onOrderChange } = props;
  const api = useTableStoreApi();
  const selected = useTableStore((s) => s.selected);
  const selectAll = useTableStore((s) => s.selectAll);
  const totalRecords = useTableStore((s) => s.totalRecords);
  const rows = useTableStore((s) => s.rows);
  const showFilter = useTableStore((s) => s.showFilter);
  const [reorder, setReorder] = useState(false);
  const totalSelected = selectAll ? totalRecords : selected?.length;

  const containerClass =
    typeof props.className === "string"
      ? props.className
      : props.className?.container;
  const firstSectionClass =
    typeof props.className === "object"
      ? props.className?.firstSection
      : undefined;
  const secondSectionClass =
    typeof props.className === "object"
      ? props.className?.secondSection
      : undefined;

  const handleColumnsOrder = useCallback(
    ({ data, selected: sel }: TableHeaderChangeEvent) => {
      const nextActiveColumns = data?.flatMap((x) =>
        sel?.includes(x.value) ? (x.value as string) : [],
      );
      onOrderChange?.({ activeColumns: nextActiveColumns });
    },
    [onOrderChange],
  );

  const handleRefresh = useCallback(() => {
    setReorder(true);
    onOrderChange?.({
      activeColumns: props.columns?.flatMap((x) => x.field || []),
    });
  }, [onOrderChange, props.columns]);

  const activeColumnsKey = (props.activeColumns ?? []).join(",");

  const columnsOptions = useMemo(
    () =>
      orderColumnsWithoutHide(
        props.columns || [],
        props.activeColumns || [],
      ).flatMap((x) => {
        if (!x.field) return [];
        return { label: resolveColumnLabel(x), value: x.field as string };
      }),
    [props.columns, activeColumnsKey],
  );

  function handleRows(newRows: number) {
    api.setRows(newRows);
  }

  function handleToggleFilter() {
    api.toggleFilterRow();
  }

  return (
    <div
      className={cn(
        "flex w-full flex-row-reverse items-center justify-between overflow-x-auto border-t border-b px-4",
        containerClass,
      )}
    >
      <div
        className={cn(
          "flex min-h-20 flex-row-reverse items-center gap-2 py-2",
          firstSectionClass,
        )}
      >
        <Pagination loading={props.loading} />
        <Select.Single
          label={t("table.rowCount")}
          value={rows || tableDefaultState.rows}
          onChange={(e) => e && handleRows(e as number)}
          scrollable
          options={[
            { label: t("table.item", { count: 5 }), value: 5, title: "5" },
            { label: t("table.item", { count: 10 }), value: 10, title: "10" },
            { label: t("table.item", { count: 15 }), value: 15, title: "15" },
            { label: t("table.item", { count: 20 }), value: 20, title: "20" },
            { label: t("table.item", { count: 50 }), value: 50, title: "50" },
            {
              label: t("table.item", { count: 100 }),
              value: 100,
              title: "100",
            },
            {
              label: t("table.item", { count: 1000 }),
              value: 1000,
              title: "1000",
            },
          ]}
        />
        {!props.hideBulkActions && !!props.bulkActionsOptions?.length && (
          <div className="w-fit shrink-0">
            <ActionMenu
              triggerTemplate={
                <ActionButton
                  tooltip={t("table.bulkActions", {
                    defaultValue: "Bulk actions",
                  })}
                >
                  <List className="size-7" />
                </ActionButton>
              }
              options={props.bulkActionsOptions.map((option) => ({
                label: option.label,
                value: String(option.value),
                icon: option.icon ?? <span className="size-4" />,
                className: option.className,
                hide: option.hide,
                onClick: () => void option.onChange?.(option.value, api),
              }))}
            />
          </div>
        )}
        <Select.MultiOrderable
          options={columnsOptions}
          labelTemplate={
            <ActionButton
              tooltip={t("table.tableSettings")}
              tooltipOptions={{ sideOffset: 22 }}
            >
              <Cog className="size-7 text-icon" />
            </ActionButton>
          }
          onChange={handleColumnsOrder}
          onRefresh={handleRefresh}
          selected={props.activeColumns}
          heading={t("table.tableSettings")}
          subHeading={t("table.tableOrder")}
          reorder={reorder}
          setReorder={setReorder}
          fitContent
          width={80}
        />
        {!props.hideFilter && (
          <ActionButton
            tooltip={t("common.filters")}
            onClick={handleToggleFilter}
          >
            <Search className={cn("size-6", showFilter && "text-primary")} />
          </ActionButton>
        )}
        {props.excelExportOptions && (
          <ActionButton
            tooltip={t("table.excelDownload")}
            onClick={props.excelExportOptions.onRequest}
          >
            {props.excelExportOptions.isLoading ? (
              <Loader2 className="size-6 animate-spin" />
            ) : (
              <ExcelIcon color="var(--color-icon)" className="size-6!" />
            )}
          </ActionButton>
        )}
        {props.firstExtraElements}
      </div>
      <div className={cn("flex h-full items-center", secondSectionClass)}>
        {!props.hideTotalSelectedClearBtn && (
          <div className="flex h-full w-20 items-center justify-center border-e">
            <div onClick={() => api.clearSelected()}>
              <Badge
                severity={!totalSelected ? "info" : "primary"}
                withRing
                disabled={!totalSelected}
              >
                {!!totalSelected && <X className="size-3" />}
                <span className="me-px">{totalSelected || 0}</span>
              </Badge>
            </div>
          </div>
        )}
        {props.secondExtraElements}
      </div>
    </div>
  );
}

const ActionHeader = memo(ActionHeaderFunction);
export default ActionHeader;

export function ActionButton(props: ButtonProps) {
  return (
    <Button
      asChild
      variant="outlined"
      severity="info"
      className={cn(
        "size-14 min-w-14 border bg-input p-0 text-icon",
        props.className,
      )}
      {...props}
    >
      <span>{props.children}</span>
    </Button>
  );
}
