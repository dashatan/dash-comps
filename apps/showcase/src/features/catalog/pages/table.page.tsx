"use client";

import { useCallback, useMemo, useState } from "react";
import { useShowcasePage } from "@/features/catalog/i18n";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";
import Table, {
  TableCheckbox,
  ExpandButton,
  type ColumnProps,
  type TableData,
  type ChangeTag,
} from "@/components/compound/table";
import { Trash2, Download } from "lucide-react";
import { cn } from "@/lib";

type Row = {
  id: number;
  name: string;
  status: string;
  amount: number;
  createdAt: number;
};

const ALL_ROWS: Row[] = Array.from({ length: 47 }, (_, i) => ({
  id: i + 1,
  name: `Item ${i + 1}`,
  status: i % 3 === 0 ? "active" : i % 3 === 1 ? "pending" : "inactive",
  amount: (i + 1) * 1250,
  createdAt: Date.now() - i * 86400000,
}));

function filterRows(rows: Row[], state: TableData) {
  let result = [...rows];
  const search = state.filters?.name as string | undefined;
  if (search) {
    result = result.filter((r) =>
      r.name.toLowerCase().includes(search.toLowerCase()),
    );
  }
  const status = state.filters?.status as string | undefined;
  if (status) {
    result = result.filter((r) => r.status === status);
  }
  if (state.sortField === "name" && state.sortOrder) {
    result.sort((a, b) =>
      state.sortOrder === 1
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name),
    );
  }
  if (state.sortField === "amount" && state.sortOrder) {
    result.sort((a, b) =>
      state.sortOrder === 1 ? a.amount - b.amount : b.amount - a.amount,
    );
  }
  return result;
}

function TableDemo({
  title,
  description,
  draggable,
  columnHover,
  fullScreen,
  loading: initialLoading,
  empty,
  wideColumns,
}: {
  title: string;
  description?: string;
  draggable?: boolean;
  columnHover?: boolean;
  fullScreen?: boolean;
  loading?: boolean;
  empty?: boolean;
  wideColumns?: boolean;
}) {
  const initialDefaults = useMemo<TableData>(
    () => ({
      page: 0,
      rows: 10,
      offset: 0,
      limit: 10,
      first: 0,
      selected: [],
      filters: {},
    }),
    [],
  );

  const [tableState, setTableState] = useState<TableData>(initialDefaults);
  const [loading, setLoading] = useState(initialLoading ?? false);

  const filtered = useMemo(
    () => filterRows(empty ? [] : ALL_ROWS, tableState),
    [tableState, empty],
  );
  const page = tableState.page ?? 0;
  const rows = tableState.rows ?? 10;
  const pageData = filtered.slice(page * rows, page * rows + rows);
  const pageIds = useMemo(() => pageData.map((r) => r.id), [page, rows, filtered.length, tableState.filters, tableState.sortField, tableState.sortOrder]);

  const columns: ColumnProps[] = useMemo(
    () => [
      {
        field: "select",
        header: <TableCheckbox.SelectAll ids={pageIds} />,
        body: (row) => <TableCheckbox.SelectOne value={(row as Row).id} />,
        width: 56,
      },
      {
        field: "expand",
        header: "",
        body: (row) => <ExpandButton key={(row as Row).id} />,
        width: 56,
        excludeExpand: { pos: "right" },
      },
      {
        field: "id",
        header: "#",
        sortable: true,
        width: 64,
        body: (row) => (row as Row).id,
      },
      {
        field: "name",
        header: "Name",
        sortable: true,
        filter: true,
        filterElementType: "text",
        width: wideColumns ? 220 : undefined,
        body: (row) => (row as Row).name,
      },
      {
        field: "status",
        header: "Status",
        filter: true,
        filterElementType: "select",
        filterOptions: [
          { label: "Active", value: "active" },
          { label: "Pending", value: "pending" },
          { label: "Inactive", value: "inactive" },
        ],
        body: (row) => {
          const r = row as Row;
          return (
            <span
              className={cn("rounded-full px-2 py-0.5 text-xs capitalize", {
                "bg-success/10 text-success": r.status === "active",
                "bg-warning/10 text-warning": r.status === "pending",
                "bg-muted text-muted-foreground": r.status === "inactive",
              })}
            >
              {r.status}
            </span>
          );
        },
      },
      {
        field: "amount",
        header: "Amount",
        sortable: true,
        width: wideColumns ? 160 : undefined,
        body: (row) => (row as Row).amount.toLocaleString(),
      },
      ...(wideColumns
        ? ([
            {
              field: "notes",
              header: "Notes",
              width: 280,
              body: (row) => `Notes for ${(row as Row).name}`,
            },
            {
              field: "region",
              header: "Region",
              width: 180,
              body: (row) => `Region ${((row as Row).id % 5) + 1}`,
            },
          ] as ColumnProps[])
        : []),
    ],
    [pageIds, wideColumns],
  );

  const handleTableChange = useCallback(
    (data: TableData | Record<string, string>, tag: ChangeTag) => {
      setTableState(data as TableData);
      if (
        tag === "filter" ||
        tag === "pagination" ||
        tag === "rows" ||
        tag === "sort"
      ) {
        setLoading(true);
        setTimeout(() => setLoading(false), 400);
      }
    },
    [],
  );

  return (
    <ShowcaseSection title={title} description={description} layout="stack">
      <div className="h-[520px] w-full overflow-hidden rounded-xl border border-border">
        <Table
          columns={columns}
          data={pageData as Record<string, unknown>[]}
          defaultValues={initialDefaults}
          totalRecords={filtered.length}
          loading={loading}
          showActionHeader
          showActionFilters
          draggable={draggable}
          columnHover={columnHover}
          fullScreen={fullScreen}
          dataKey="id"
          expandOnNewRow
          onTableChange={handleTableChange}
          rowExpansionTemplate={(row) => (
            <div className="p-4 text-sm text-muted-foreground">
              Expanded details for {(row as Row).name} — amount:{" "}
              {(row as Row).amount.toLocaleString()}
            </div>
          )}
          actionHeaderProps={{
            bulkActionsOptions: [
              {
                label: "Export selected",
                value: "export",
                icon: <Download className="size-4" />,
                onChange: (_value, api) => {
                  const selected = api?.getSnapshot().selected;
                  alert(`Export ${selected?.length ?? 0} rows`);
                },
              },
              {
                label: "Delete selected",
                value: "delete",
                icon: <Trash2 className="size-4" />,
                onChange: (_value, api) => {
                  api?.clearSelected();
                },
              },
            ],
            excelExportOptions: {
              isLoading: loading,
              onRequest: () => alert("Excel export requested"),
            },
          }}
        />
      </div>
    </ShowcaseSection>
  );
}

export function TablePage() {
  const p = useShowcasePage("table");

  return (
    <CatalogPageShell slug="table">
      <ShowcaseSection
        title={p("compoundTable.title")}
        className="flex-col items-start"
        layout="stack"
      >
        <p className="text-sm text-muted-foreground">
          {p("compoundTable.description.dataTable")}{" "}
          <code className="text-foreground">@/components/compound/table</code>{" "}
          {p("compoundTable.description.expectsConfig")}
        </p>
      </ShowcaseSection>

      <TableDemo
        title="Full-featured table"
        description="Pagination, filters, sort, selection, bulk actions, expansion"
      />
      <TableDemo
        title="Column hover"
        description="Highlights column on hover"
        columnHover
      />
      <TableDemo
        title="Draggable scroll"
        description="Click and drag to scroll the table horizontally (RTL/LTR aware)"
        draggable
        wideColumns
      />
      <TableDemo title="Empty state" description="No results" empty />
      <TableDemo
        title="Loading state"
        description="Skeleton rows while loading"
        loading
      />
    </CatalogPageShell>
  );
}
