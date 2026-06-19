"use client";

import { useCallback, useMemo, useState } from "react";
import { useShowcasePage } from "@/features/catalog/i18n";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";
import {
  TABLE_ALL_ROWS,
  TABLE_DEPARTMENTS,
  TABLE_REGIONS,
  TABLE_ROW_COUNT,
  TABLE_STATUSES,
  filterAndSortTableRows,
  paginateTableRows,
  type FleetVehicleRow,
} from "@/features/catalog/data/table-samples";
import Table, {
  DividerHor,
  ExpandButton,
  Section,
  StatusBox,
  TableCellColorDot,
  TableCellDateElement,
  TableCellNumberField,
  TableCellTextField,
  TableCheckbox,
  type ChangeTag,
  type ColumnProps,
  type TableData,
  type TableStoreApi,
} from "@/components/compound/table";
import {
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
} from "@/components/common/context-menu";
import Badge from "@/components/common/badge";
import Chip from "@/components/common/chips/chip";
import { Copy, Download, Eye, Maximize2, Trash2 } from "lucide-react";
import { cn } from "@/lib";

const STATUS_COLORS = {
  active: "success",
  pending: "warning",
  inactive: "info",
  maintenance: "error",
} as const;

const INITIAL_TABLE_STATE: TableData = {
  page: 0,
  rows: 15,
  offset: 0,
  limit: 15,
  first: 0,
  selected: [],
  selectAll: false,
  filters: {},
  expandedRows: {},
  showFilter: false,
  showFilterChips: false,
};

function statusLabel(status: FleetVehicleRow["status"]) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function TablePage() {
  const p = useShowcasePage("table");
  const [tableState, setTableState] = useState<TableData>(INITIAL_TABLE_STATE);
  const [loading, setLoading] = useState(false);
  const [lastChangeTag, setLastChangeTag] = useState<ChangeTag | null>(null);

  const filteredRows = useMemo(
    () => filterAndSortTableRows(TABLE_ALL_ROWS, tableState),
    [tableState],
  );

  const pageData = useMemo(
    () => paginateTableRows(filteredRows, tableState),
    [filteredRows, tableState.page, tableState.rows],
  );

  const pageIds = useMemo(() => pageData.map((r) => r.id), [pageData]);

  const simulateFetch = useCallback((tag: ChangeTag) => {
    setLastChangeTag(tag);
    setLoading(true);
    window.setTimeout(() => setLoading(false), 380);
  }, []);

  const handleTableChange = useCallback(
    (data: TableData | Record<string, string>, tag: ChangeTag) => {
      setTableState(data as TableData);
      if (
        tag === "filter" ||
        tag === "pagination" ||
        tag === "rows" ||
        tag === "sort"
      ) {
        simulateFetch(tag);
      } else {
        setLastChangeTag(tag);
      }
    },
    [simulateFetch],
  );

  const columns: ColumnProps[] = useMemo(
    () => [
      {
        field: "select",
        header: <TableCheckbox.SelectAll ids={pageIds} />,
        body: (row) => (
          <TableCheckbox.SelectOne value={(row as FleetVehicleRow).id} />
        ),
        width: 56,
        frozen: { pos: "right", distance: 0 },
      },
      {
        field: "expand",
        header: "",
        body: (row) => <ExpandButton key={(row as FleetVehicleRow).id} />,
        width: 56,
        frozen: { pos: "right", distance: 56 },
        excludeExpand: { pos: "right" },
      },
      {
        field: "id",
        header: "#",
        sortable: true,
        width: 72,
        frozen: { pos: "right", distance: 112 },
        body: (row) => (
          <TableCellTextField
            value={(row as FleetVehicleRow).id}
            justify="center"
            className="font-semibold"
          />
        ),
      },
      {
        field: "plate",
        header: "Plate",
        width: 120,
        body: (row) => (
          <TableCellTextField
            value={(row as FleetVehicleRow).plate}
            justify="center"
            className="font-medium dir-ltr"
          />
        ),
      },
      {
        field: "driver",
        header: "Driver",
        sortable: true,
        filter: true,
        filterElementType: "text",
        width: 140,
        body: (row) => (
          <TableCellTextField
            value={(row as FleetVehicleRow).driver}
            justify="start"
          />
        ),
      },
      {
        field: "status",
        header: "Status",
        filter: true,
        filterElementType: "select",
        filterOptions: TABLE_STATUSES.map((s) => ({
          label: statusLabel(s),
          value: s,
        })),
        filterChips: (val) => <Chip label={`Status: ${val}`} />,
        width: 130,
        body: (row) => {
          const r = row as FleetVehicleRow;
          return (
            <StatusBox
              text={statusLabel(r.status)}
              color={STATUS_COLORS[r.status]}
              justify="center"
            />
          );
        },
      },
      {
        field: "region",
        header: "Region",
        filter: true,
        filterElementType: "multi-select",
        filterOptions: TABLE_REGIONS.map((r) => ({ label: r, value: r })),
        width: 120,
        body: (row) => (
          <TableCellTextField value={(row as FleetVehicleRow).region} />
        ),
      },
      {
        field: "department",
        header: "Department",
        defaultInactive: true,
        filter: true,
        filterElementType: "select",
        filterOptions: TABLE_DEPARTMENTS.map((d) => ({ label: d, value: d })),
        width: 130,
        body: (row) => (
          <TableCellTextField value={(row as FleetVehicleRow).department} />
        ),
      },
      {
        field: "category",
        header: "Category",
        width: 110,
        body: (row) => (
          <TableCellTextField
            value={(row as FleetVehicleRow).category}
            className="capitalize"
          />
        ),
      },
      {
        field: "mileage",
        header: "Mileage (km)",
        sortable: true,
        filter: true,
        filterElementType: "number-range",
        filterKey: "mileage",
        width: 150,
        body: (row) => (
          <TableCellNumberField
            value={(row as FleetVehicleRow).mileage}
            suffix=" km"
            justify="end"
          />
        ),
      },
      {
        field: "fuelLevel",
        header: "Fuel %",
        sortable: true,
        width: 100,
        body: (row) => (
          <TableCellNumberField
            value={(row as FleetVehicleRow).fuelLevel}
            suffix="%"
            justify="center"
          />
        ),
      },
      {
        field: "lastServiceAt",
        header: "Last service",
        filter: true,
        filterElementType: "date",
        width: 180,
        body: (row) => (
          <TableCellDateElement val={(row as FleetVehicleRow).lastServiceAt} />
        ),
      },
      {
        field: "registeredAt",
        header: "Registered",
        sortable: true,
        width: 200,
        body: (row) => (
          <TableCellDateElement val={(row as FleetVehicleRow).registeredAt} />
        ),
      },
      {
        field: "contractEnd",
        header: "Contract end",
        defaultInactive: true,
        width: 160,
        body: (row) => (
          <TableCellDateElement val={(row as FleetVehicleRow).contractEnd} />
        ),
      },
      {
        field: "color",
        header: "Tag",
        width: 72,
        body: (row) => (
          <div className="flex justify-center">
            <TableCellColorDot color={(row as FleetVehicleRow).color} />
          </div>
        ),
      },
      {
        field: "gpsEnabled",
        header: "GPS",
        width: 88,
        body: (row) => (
          <TableCellTextField
            value={(row as FleetVehicleRow).gpsEnabled ? "On" : "Off"}
            className={cn({
              "text-success": (row as FleetVehicleRow).gpsEnabled,
              "text-muted-foreground": !(row as FleetVehicleRow).gpsEnabled,
            })}
          />
        ),
      },
      {
        field: "notes",
        header: "Notes",
        width: 280,
        body: (row) => (
          <TableCellTextField
            value={(row as FleetVehicleRow).notes}
            justify="start"
            className="max-w-[260px]"
          />
        ),
      },
      {
        field: "assignedRoute",
        header: "Assigned route",
        defaultInactive: true,
        width: 320,
        body: (row) => (
          <TableCellTextField
            value={(row as FleetVehicleRow).assignedRoute}
            justify="start"
            className="max-w-[300px]"
          />
        ),
      },
    ],
    [pageIds],
  );

  const openSidePanel = useCallback(
    (row: Record<string, unknown>, api: TableStoreApi) => {
      const data = row as FleetVehicleRow;
      const current = api.getSnapshot().sidePanelData as
        | FleetVehicleRow
        | undefined;
      api.setSidePanelData(current?.id === data.id ? undefined : data);
    },
    [],
  );

  return (
    <CatalogPageShell slug="table">
      <ShowcaseSection
        title={p("compoundTable.title")}
        className="flex-col items-start"
        layout="stack"
      >
        <p className="max-w-3xl text-sm text-muted-foreground">
          {p("compoundTable.description.lead")}
        </p>
        <ul className="mt-3 grid gap-1.5 text-sm text-muted-foreground sm:grid-cols-2">
          {(
            [
              p("compoundTable.features.pagination"),
              p("compoundTable.features.filters"),
              p("compoundTable.features.selection"),
              p("compoundTable.features.columns"),
              p("compoundTable.features.frozen"),
              p("compoundTable.features.scroll"),
              p("compoundTable.features.expansion"),
              p("compoundTable.features.sidePanel"),
            ] as const
          ).map((item) => (
            <li key={item} className="flex items-center gap-2">
              <span className="size-1.5 shrink-0 rounded-full bg-primary" />
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-muted-foreground">
          {TABLE_ROW_COUNT.toLocaleString()} {p("compoundTable.meta.records")} ·{" "}
          {lastChangeTag ? (
            <>
              {p("compoundTable.meta.lastEvent")}:{" "}
              <code className="text-foreground">{lastChangeTag}</code>
            </>
          ) : (
            p("compoundTable.meta.interact")
          )}
        </p>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("compoundTable.showcase.title")}
        description={p("compoundTable.showcase.description")}
        layout="stack"
      >
        <div className="h-[min(78vh,820px)] w-full overflow-hidden rounded-xl border border-border">
          <Table
            columns={columns}
            data={pageData as Record<string, unknown>[]}
            defaultValues={INITIAL_TABLE_STATE}
            totalRecords={filteredRows.length}
            loading={loading}
            showActionHeader
            showActionFilters
            draggable
            columnHover
            dataKey="id"
            expandOnNewRow
            onTableChange={handleTableChange}
            rowProps={{
              onClick: openSidePanel,
              getRowClassName: (data, api) => {
                const active = (
                  api.getSnapshot().sidePanelData as FleetVehicleRow | undefined
                )?.id;
                return cn({
                  "ring-primary/30 ring-1 ring-inset":
                    active === (data as FleetVehicleRow).id,
                });
              },
            }}
            rowExpansionTemplate={(row) => {
              const r = row as FleetVehicleRow;
              return (
                <div className="flex flex-col gap-3 p-4 text-sm">
                  <div className="flex flex-wrap items-center gap-3">
                    <StatusBox
                      text={statusLabel(r.status)}
                      color={STATUS_COLORS[r.status]}
                    />
                    <Badge severity="info">{r.category}</Badge>
                    <Badge severity={r.gpsEnabled ? "success" : "secondary"}>
                      GPS {r.gpsEnabled ? "on" : "off"}
                    </Badge>
                  </div>
                  <DividerHor className="h-px w-full" />
                  <Section title="Route">{r.assignedRoute}</Section>
                  <Section title="Notes">{r.notes}</Section>
                </div>
              );
            }}
            sidePanelTemplate={(row) => {
              const r = row as FleetVehicleRow;
              return (
                <aside className="flex h-full w-80 shrink-0 flex-col gap-4 overflow-y-auto rounded-md border border-table-border bg-table p-4">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-semibold">{r.driver}</h3>
                    <Badge severity="primary">#{r.id}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground dir-ltr">
                    {r.plate}
                  </p>
                  <StatusBox
                    text={statusLabel(r.status)}
                    color={STATUS_COLORS[r.status]}
                  />
                  <dl className="grid gap-2 text-sm">
                    <div className="flex justify-between gap-2">
                      <dt className="text-muted-foreground">Region</dt>
                      <dd>{r.region}</dd>
                    </div>
                    <div className="flex justify-between gap-2">
                      <dt className="text-muted-foreground">Department</dt>
                      <dd>{r.department}</dd>
                    </div>
                    <div className="flex justify-between gap-2">
                      <dt className="text-muted-foreground">Mileage</dt>
                      <dd>{r.mileage.toLocaleString()} km</dd>
                    </div>
                    <div className="flex justify-between gap-2">
                      <dt className="text-muted-foreground">Fuel</dt>
                      <dd>{r.fuelLevel}%</dd>
                    </div>
                  </dl>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {r.notes}
                  </p>
                </aside>
              );
            }}
            rightClickMenu={(row) => {
              const r = row as FleetVehicleRow;
              return (
                <>
                  <ContextMenuItem
                    onClick={() => window.alert(`View ${r.driver}`)}
                  >
                    <Eye className="me-2 size-4" />
                    View record
                    <ContextMenuShortcut>↵</ContextMenuShortcut>
                  </ContextMenuItem>
                  <ContextMenuItem
                    onClick={() => navigator.clipboard.writeText(r.plate)}
                  >
                    <Copy className="me-2 size-4" />
                    Copy plate
                  </ContextMenuItem>
                  <ContextMenuSeparator />
                  <ContextMenuItem
                    variant="destructive"
                    onClick={() => window.alert(`Archive ${r.plate}`)}
                  >
                    <Trash2 className="me-2 size-4" />
                    Archive
                  </ContextMenuItem>
                </>
              );
            }}
            actionHeaderProps={{
              firstExtraElements: (
                <Badge severity="secondary" className="h-10 px-3">
                  {filteredRows.length.toLocaleString()} /{" "}
                  {TABLE_ROW_COUNT.toLocaleString()}
                </Badge>
              ),
              secondExtraElements: (
                <Badge severity="info" className="me-2 hidden sm:inline-flex">
                  <Maximize2 className="me-1 size-3.5" />
                  {p("compoundTable.showcase.hint")}
                </Badge>
              ),
              bulkActionsOptions: [
                {
                  label: "Export selected",
                  value: "export",
                  icon: <Download className="size-4" />,
                  onChange: (_value, api) => {
                    const selected = api?.getSnapshot().selected;
                    window.alert(`Export ${selected?.length ?? 0} row(s)`);
                  },
                },
                {
                  label: "Clear selection",
                  value: "clear",
                  icon: <Trash2 className="size-4" />,
                  onChange: (_value, api) => api?.clearSelected(),
                },
              ],
              excelExportOptions: {
                isLoading: loading,
                onRequest: () =>
                  window.alert(`Export ${filteredRows.length} filtered rows`),
              },
            }}
            actionFilterProps={{
              sort: ["status", "region", "driver", "mileage"],
            }}
          />
        </div>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
