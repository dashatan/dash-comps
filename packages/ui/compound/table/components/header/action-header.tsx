import { memo, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import Pagination from "./paginator";
import { Cog, Loader2, Search, X } from "lucide-react";
import {
  SelectItem,
  SingleSelectProps,
  TableHeaderChangeEvent,
} from "@/components/common/inputs/select/types";
import {
  ColumnProps,
  TableContextType,
  TableData,
  tableDefaultState,
  TableProps,
} from "@/components/compound/table/types";
import { orderColumnsWithoutHide } from "@/components/compound/table/utils/order-columns";
import { Select } from "@/components/common/inputs/select";
import { cn, useLanguage } from "@/lib";
import Badge from "@/components/common/badge";
import Button from "@/components/common/buttons";
import ExcelIcon from "@/components/common/icons/ExcelIcon";
import { ButtonProps } from "@/components/common/buttons/types";

export interface ActionHeaderProps {
  bulkActionsOptions?: (Omit<SelectItem, "onChange"> & {
    onChange?: (
      value: SelectItem["value"],
      table?: TableContextType,
    ) => void | Promise<void>;
  })[];
  bulActionsProps?: SingleSelectProps;
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
  className?: string;
}

function ActionHeaderFunction(props: ActionHeaderProps) {
  const { t } = useLanguage();
  const { onChange, onOrderChange } = props;
  const table = useFormContext<TableData>();
  const state = table.getValues();
  const [reorder, setReorder] = useState(false);
  const { selected, selectAll, totalRecords, rows } = useWatch<TableData>();
  const totalSelected = selectAll ? totalRecords : selected?.length;

  function handleColumnsOrder({ data, selected }: TableHeaderChangeEvent) {
    const activeColumns = data?.flatMap((x) =>
      selected?.includes(x.value) ? (x.value as string) : [],
    );
    onOrderChange && onOrderChange({ activeColumns });
  }
  function handleRefresh() {
    setReorder(true);
    onOrderChange &&
      onOrderChange({ activeColumns: props.columns?.flatMap((x) => x.field || []) });
  }

  const columnsOptions = orderColumnsWithoutHide(
    props.columns || [],
    props.activeColumns || [],
  ).flatMap((x) => {
    if (!x.field) return [];
    return { label: x.header as string, value: x.field as string };
  });

  function handleRows(rows: number) {
    const newState = { ...state, rows, page: 0 };
    onChange && onChange(newState, "rows");
    table.setValue("rows", rows);
    table.setValue("page", 0);
  }

  return (
    <div
      className={cn(
        "flex w-full flex-row-reverse items-center justify-between overflow-x-auto border-t border-b px-4",
        props.className,
      )}
    >
      <div className="flex min-h-20 flex-row-reverse items-center gap-2 py-2">
        <Pagination
          loading={props.loading}
          values={state}
          onchange={(data, tag) => props.onChange && props.onChange(data, tag)}
        />
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
            { label: t("table.item", { count: 100 }), value: 100, title: "100" },
            { label: t("table.item", { count: 1000 }), value: 1000, title: "1000" },
          ]}
        />
        <Select.MultiOrderable
          options={columnsOptions}
          labelTemplate={
            <ActionButton
              tooltip={t("table.tableSettings")}
              tooltipOptions={{ sideOffset: 22 }}
            >
              <Cog className="text-icon size-7" />
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
            tooltip={t("traffic.changeFilters")}
            onClick={() => {
              onChange && onChange({ ...state, showFilter: !state.showFilter }, "filter");
              table.setValue("showFilter", !state.showFilter);
            }}
          >
            <Search className="size-6" />
          </ActionButton>
        )}
        {props.excelExportOptions && (
          <ActionButton onClick={props.excelExportOptions.onRequest}>
            {props.excelExportOptions.isLoading ? (
              <Loader2 className="size-6 animate-spin" />
            ) : (
              <ExcelIcon color="var(--color-icon)" className="size-6!" />
            )}
          </ActionButton>
        )}
        {props.firstExtraElements}
      </div>
      <div className="flex h-full items-center">
        {!props.hideTotalSelectedClearBtn && (
          <div className="flex h-full w-20 items-center justify-center border-e">
            <div onClick={() => table.setValue("selected", [])}>
              <Badge
                severity={!totalSelected ? "info" : "primary"}
                withRing
                disabled={!totalSelected}
              >
                {!!totalSelected && <X className="size-3" />}
                <span className="me-px mt-px">{totalSelected || 0}</span>
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
      className={cn("bg-input text-icon size-14 min-w-14 border p-0", props.className)}
      {...props}
    >
      <span>{props.children}</span>
    </Button>
  );
}
