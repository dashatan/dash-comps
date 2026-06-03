import { useEffect, useRef, useState } from "react";
import orderColumns from "./utils/order-columns";
import ActionHeader from "./components/header/action-header";
import { useFormContext } from "react-hook-form";
import { ChangeTag, ColumnProps, TableData, TableProps } from "./types";
import ActionFilters from "./components/header/action-filters";
import Body from "./components/body";
import Header from "./components/header";
import { cn } from "@/lib";

export function TableComponent({
  columns: initialColumns,
  data,
  totalRecords,
  loading = false,
  showActionHeader = false,
  showActionFilters = false,
  expandOnNewRow = false,
  dataKey = "id",
  draggable = false,
  columnHover = false,
  fullScreen = false,
  actionHeaderProps,
  actionFilterProps,
  THProps,
  TDProps,
  rowProps,
  className,
  onTableChange,
  rowExpansionTemplate,
  sidePanelTemplate,
  rightClickMenu,
  defaultValues,
}: TableProps) {
  /* -------------------------------- Variables ------------------------------- */

  const table = useFormContext<TableData>();
  const activeCols = table.watch("activeColumns");
  const sidePanelData = table.watch("sidePanelData");
  const state = table.getValues();
  const initialActiveColumns =
    activeCols ||
    initialColumns?.flatMap((x) => {
      return !x.defaultInactive && x.field ? (x.field as string) : [];
    });
  const orderedColumns = orderColumns(initialColumns || [], initialActiveColumns || []);
  const [activeColumns, setActiveColumns] = useState<string[] | undefined>(
    initialActiveColumns,
  );
  const [columns, setColumns] = useState<ColumnProps[] | undefined>(orderedColumns);
  const [hoveredColumnIndex, setHoveredColumnIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const scrollLeft = useRef(0);
  const scrollTop = useRef(0);
  const noResult = !loading && !data?.length;
  /* --------------------------------- Effects -------------------------------- */

  useEffect(() => {
    if (sidePanelData && loading) {
      table.setValue("sidePanelData", undefined);
    }
  }, [loading]);

  useEffect(() => {
    if (initialColumns && initialActiveColumns) {
      setColumns(orderColumns(initialColumns, activeColumns || initialActiveColumns));
    }
  }, [initialColumns]);

  useEffect(() => {
    table.setValue("totalRecords", totalRecords);
  }, [totalRecords]);

  useEffect(() => {
    table.setValue("selected", defaultValues?.selected);
  }, [defaultValues?.selected]);

  /* -------------------------------- Functions ------------------------------- */

  function handleOrder({ activeColumns }: TableData) {
    if (loading) return;
    setActiveColumns(activeColumns);
    const newColumns = orderColumns(initialColumns || [], activeColumns || []);
    setColumns(newColumns);
    handleChange({ ...table.getValues(), activeColumns }, "order");
  }

  function handleChange(data: Partial<TableData>, tag: ChangeTag) {
    if (loading) return;
    onTableChange && onTableChange(data, tag);
  }

  function handleMouseDown(e: React.MouseEvent) {
    if (!scrollRef.current) return;
    isDragging.current = true;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    startY.current = e.pageY - scrollRef.current.offsetTop;
    scrollLeft.current = scrollRef.current.scrollLeft;
    scrollTop.current = scrollRef.current.scrollTop;
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (!isDragging.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const y = e.pageY - scrollRef.current.offsetTop;
    scrollRef.current.scrollLeft = scrollLeft.current - (x - startX.current);
    scrollRef.current.scrollTop = scrollTop.current - (y - startY.current);
  }

  function handleMouseUp() {
    isDragging.current = false;
  }

  /* ----------------------------------- JSX ---------------------------------- */

  const tableContent = (
    <div
      id="table-container"
      className={cn(
        "flex-full flex h-full w-full flex-col overflow-hidden",
        className?.l1,
      )}
    >
      {showActionHeader && (
        <ActionHeader
          {...actionHeaderProps}
          columns={initialColumns}
          activeColumns={activeColumns}
          onOrderChange={handleOrder}
          onChange={handleChange}
          loading={loading}
        />
      )}
      {showActionFilters && state.showFilterChips && (
        <ActionFilters
          columns={initialColumns}
          onChange={handleChange}
          {...actionFilterProps}
        />
      )}
      <div
        id="table-content"
        className={cn(
          "flex-full flex flex-col overflow-hidden",
          { "p-4": showActionHeader },
          className?.l2,
        )}
      >
        <div
          ref={scrollRef}
          id="table-inner"
          className={cn(
            "border-table-border relative flex max-h-full min-h-0 w-full min-w-0 flex-col overflow-auto rounded-md border select-none",
            { "cursor-grab active:cursor-grabbing": draggable },
            !isDragging.current && "select-text",
            noResult && "flex-full",
            className?.l3,
          )}
          onMouseDown={draggable ? handleMouseDown : undefined}
          onMouseMove={draggable ? handleMouseMove : undefined}
          onMouseUp={draggable ? handleMouseUp : undefined}
        >
          <table
            id="table-non-scrollable"
            className={cn(
              "flex-full w-full border-separate border-spacing-0",
              className?.table,
            )}
          >
            <Header
              onChange={handleChange}
              actionHeaderProps={actionHeaderProps}
              columns={columns}
              loading={loading}
              THProps={THProps}
              columnHover={columnHover}
              hoveredColumnIndex={hoveredColumnIndex}
              onColumnHover={setHoveredColumnIndex}
            />
            <Body
              columns={columns}
              data={data}
              dataKey={dataKey}
              loading={loading}
              rightClickMenu={rightClickMenu}
              rowExpansionTemplate={rowExpansionTemplate}
              rowProps={rowProps}
              expandOnNewRow={expandOnNewRow}
              TDProps={TDProps}
              columnHover={columnHover}
              hoveredColumnIndex={hoveredColumnIndex}
              onColumnHover={setHoveredColumnIndex}
              draggable={draggable}
            />
          </table>
        </div>
        {sidePanelData && sidePanelTemplate && sidePanelTemplate(sidePanelData)}
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="bg-background fixed inset-0 z-9999 flex flex-col">
        {tableContent}
      </div>
    );
  }

  return tableContent;
}
