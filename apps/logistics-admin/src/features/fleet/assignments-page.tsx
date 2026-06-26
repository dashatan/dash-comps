"use client";

import { useCallback, useMemo, useState } from "react";
import Badge from "@/components/common/badge";
import Table, {
  StatusBox,
  TableCellDateElement,
  TableCellNumberField,
  TableCellTextField,
  type ChangeTag,
  type ColumnProps,
  type TableData,
} from "@/components/compound/table";
import { EU_REGIONS } from "@/data/european-context";
import {
  ASSIGNMENTS,
  ASSIGNMENT_STATUSES,
  filterAndSortAssignments,
  getDriverById,
  getDriverDisplayName,
  getVehicleById,
  paginateAssignments,
  type Assignment,
} from "@/data/fleet";
import { useLogisticsT } from "@/i18n/provider";
import { PageHeader } from "@/shared/page-header";

const STATUS_COLORS = {
  scheduled: "warning",
  active: "info",
  completed: "success",
  cancelled: "secondary",
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

type LocalizedAssignment = Assignment & {
  vehiclePlate: string;
  driverName: string;
  statusLabel: string;
  regionLabel: string;
  shipmentLabel: string;
};

function headerCell(label: string) {
  return <TableCellTextField value={label} justify="center" />;
}

export function AssignmentsPage() {
  const t = useLogisticsT();
  const [tableState, setTableState] = useState<TableData>(INITIAL_TABLE_STATE);
  const [loading, setLoading] = useState(false);

  const localizeRow = useCallback(
    (row: Assignment): LocalizedAssignment => {
      const vehicle = getVehicleById(row.vehicleId);
      const driver = getDriverById(row.driverId);
      return {
        ...row,
        vehiclePlate: vehicle?.plate ?? "—",
        driverName: driver ? getDriverDisplayName(driver) : "—",
        statusLabel: t(`fleet.assignmentStatuses.${row.status}`),
        regionLabel: t(`shipments.regions.${row.region}`),
        shipmentLabel: row.shipmentId ? `#${row.shipmentId}` : "—",
      };
    },
    [t],
  );

  const localizedRows = useMemo(
    () => ASSIGNMENTS.map(localizeRow),
    [localizeRow],
  );
  const filteredRows = useMemo(
    () => filterAndSortAssignments(localizedRows, tableState),
    [localizedRows, tableState],
  );
  const pageData = useMemo(
    () => paginateAssignments(filteredRows, tableState),
    [filteredRows, tableState.page, tableState.rows],
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
        window.setTimeout(() => setLoading(false), 280);
      }
    },
    [],
  );

  const columns: ColumnProps[] = useMemo(
    () => [
      {
        field: "id",
        header: headerCell(t("fleet.columns.id")),
        sortable: true,
        width: 72,
        body: (row) => (
          <TableCellNumberField value={(row as LocalizedAssignment).id} />
        ),
      },
      {
        field: "vehiclePlate",
        header: headerCell(t("fleet.columns.vehicle")),
        width: 140,
        body: (row) => (
          <TableCellTextField
            value={(row as LocalizedAssignment).vehiclePlate}
            className="font-mono text-xs dir-ltr"
          />
        ),
      },
      {
        field: "driverName",
        header: headerCell(t("fleet.columns.driver")),
        width: 160,
        body: (row) => (
          <TableCellTextField value={(row as LocalizedAssignment).driverName} />
        ),
      },
      {
        field: "corridorLabel",
        header: headerCell(t("fleet.columns.corridor")),
        sortable: true,
        width: 200,
        filter: true,
        filterElementType: "text",
        filterKey: "corridorLabel",
        body: (row) => (
          <TableCellTextField
            value={(row as LocalizedAssignment).corridorLabel}
          />
        ),
      },
      {
        field: "status",
        header: headerCell(t("fleet.columns.status")),
        width: 130,
        filter: true,
        filterElementType: "select",
        filterOptions: ASSIGNMENT_STATUSES.map((status) => ({
          label: t(`fleet.assignmentStatuses.${status}`),
          value: status,
        })),
        body: (row) => {
          const a = row as LocalizedAssignment;
          return (
            <StatusBox text={a.statusLabel} color={STATUS_COLORS[a.status]} />
          );
        },
      },
      {
        field: "region",
        header: headerCell(t("fleet.columns.region")),
        width: 140,
        filter: true,
        filterElementType: "multi-select",
        filterOptions: EU_REGIONS.map((region) => ({
          label: t(`shipments.regions.${region}`),
          value: region,
        })),
        body: (row) => (
          <Badge severity="info">
            {(row as LocalizedAssignment).regionLabel}
          </Badge>
        ),
      },
      {
        field: "shipmentLabel",
        header: headerCell(t("fleet.columns.shipment")),
        width: 100,
        body: (row) => (
          <TableCellTextField
            value={(row as LocalizedAssignment).shipmentLabel}
          />
        ),
      },
      {
        field: "startAt",
        header: headerCell(t("fleet.columns.start")),
        sortable: true,
        width: 130,
        body: (row) => (
          <TableCellDateElement val={(row as LocalizedAssignment).startAt} />
        ),
      },
      {
        field: "endAt",
        header: headerCell(t("fleet.columns.end")),
        sortable: true,
        width: 130,
        body: (row) => {
          const endAt = (row as LocalizedAssignment).endAt;
          return endAt ? (
            <TableCellDateElement val={endAt} />
          ) : (
            <TableCellTextField value="—" />
          );
        },
      },
    ],
    [t],
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader
        title={t("fleet.assignments.title")}
        subtitle={t("fleet.assignments.subtitle")}
        breadcrumbLabel={t("fleet.title")}
        breadcrumbHref="/fleet"
      />
      <div className="p-4">
        <div className="h-[min(78vh,820px)] w-full overflow-hidden rounded-xl border border-border">
          <Table
            columns={columns}
            data={pageData as Record<string, unknown>[]}
            defaultValues={tableState}
            totalRecords={filteredRows.length}
            loading={loading}
            showActionHeader
            showActionFilters
            dataKey="id"
            onTableChange={handleTableChange}
          />
        </div>
      </div>
    </div>
  );
}
