"use client";

import { useCallback, useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import type { AssignmentDto } from "@dash/logistics-contracts";
import {
  DRIVER_COUNT,
  VEHICLE_COUNT,
  getDriverDisplayName,
} from "@dash/logistics-seed";
import Badge from "@/components/common/badge";
import Table, {
  StatusBox,
  TableCellDateElement,
  TableCellNumberField,
  TableCellTextField,
  type ColumnProps,
} from "@/components/compound/table";
import { queryKeys } from "@/core/query-keys";
import { fleetRepository } from "@/infrastructure/http/repositories";
import { useLogisticsT } from "@/i18n/provider";
import { PageHeader } from "@/shared/page-header";
import { useServerTable } from "@/shared/hooks/use-server-table";
import { ASSIGNMENT_STATUSES, EU_REGIONS } from "@/shared/formatters";

const STATUS_COLORS = {
  scheduled: "warning",
  active: "info",
  completed: "success",
  cancelled: "secondary",
} as const;

type LocalizedAssignment = AssignmentDto & {
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
  const { tableState, pageData, total, loading, handleTableChange } =
    useServerTable<AssignmentDto>({
      queryKey: queryKeys.fleet.assignments,
      fetchPage: fleetRepository.listAssignments,
    });

  const [vehiclesLookupQuery, driversLookupQuery] = useQueries({
    queries: [
      {
        queryKey: queryKeys.fleet.vehicles({
          page: 0,
          pageSize: VEHICLE_COUNT,
        }),
        queryFn: () =>
          fleetRepository.listVehicles({
            page: 0,
            pageSize: VEHICLE_COUNT,
          }),
        staleTime: Number.POSITIVE_INFINITY,
      },
      {
        queryKey: queryKeys.fleet.drivers({ page: 0, pageSize: DRIVER_COUNT }),
        queryFn: () =>
          fleetRepository.listDrivers({ page: 0, pageSize: DRIVER_COUNT }),
        staleTime: Number.POSITIVE_INFINITY,
      },
    ],
  });

  const vehiclePlateById = useMemo(() => {
    const map = new Map<number, string>();
    for (const vehicle of vehiclesLookupQuery.data?.items ?? []) {
      map.set(vehicle.id, vehicle.plate);
    }
    return map;
  }, [vehiclesLookupQuery.data]);

  const driverNameById = useMemo(() => {
    const map = new Map<number, string>();
    for (const driver of driversLookupQuery.data?.items ?? []) {
      map.set(driver.id, getDriverDisplayName(driver));
    }
    return map;
  }, [driversLookupQuery.data]);

  const localizeRow = useCallback(
    (row: AssignmentDto): LocalizedAssignment => ({
      ...row,
      vehiclePlate: vehiclePlateById.get(row.vehicleId) ?? "—",
      driverName: driverNameById.get(row.driverId) ?? "—",
      statusLabel: t(`fleet.assignmentStatuses.${row.status}`),
      regionLabel: t(`shipments.regions.${row.region}`),
      shipmentLabel: row.shipmentId ? `#${row.shipmentId}` : "—",
    }),
    [t, vehiclePlateById, driverNameById],
  );

  const localizedRows = useMemo(
    () => pageData.map(localizeRow),
    [pageData, localizeRow],
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
            data={localizedRows as Record<string, unknown>[]}
            defaultValues={tableState}
            totalRecords={total}
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
