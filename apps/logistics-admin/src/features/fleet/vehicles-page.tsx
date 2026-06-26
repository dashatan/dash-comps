"use client";

import { useCallback, useMemo } from "react";
import type { VehicleDto } from "@dash/logistics-contracts";
import { getHubById } from "@dash/logistics-seed";
import Badge from "@/components/common/badge";
import Table, {
  StatusBox,
  TableCellNumberField,
  TableCellTextField,
  type ColumnProps,
} from "@/components/compound/table";
import { queryKeys } from "@/core/query-keys";
import { fleetRepository } from "@/infrastructure/http/repositories";
import { useLogisticsT } from "@/i18n/provider";
import { PageHeader } from "@/shared/page-header";
import { useServerTable } from "@/shared/hooks/use-server-table";
import {
  EU_COUNTRY_CODES,
  EU_REGIONS,
  VEHICLE_STATUSES,
  VEHICLE_TYPES,
  formatKg,
} from "@/shared/formatters";

const STATUS_COLORS = {
  active: "success",
  maintenance: "warning",
  idle: "info",
} as const;

type LocalizedVehicle = VehicleDto & {
  depotCity: string;
  typeLabel: string;
  statusLabel: string;
  regionLabel: string;
};

function headerCell(label: string) {
  return <TableCellTextField value={label} justify="center" />;
}

export function VehiclesPage() {
  const t = useLogisticsT();
  const { tableState, pageData, total, loading, handleTableChange } =
    useServerTable<VehicleDto>({
      queryKey: queryKeys.fleet.vehicles,
      fetchPage: fleetRepository.listVehicles,
    });

  const localizeRow = useCallback(
    (row: VehicleDto): LocalizedVehicle => ({
      ...row,
      depotCity: getHubById(row.depotHubId).city,
      typeLabel: t(`fleet.vehicleTypes.${row.type}`),
      statusLabel: t(`fleet.vehicleStatuses.${row.status}`),
      regionLabel: t(`shipments.regions.${row.region}`),
    }),
    [t],
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
          <TableCellNumberField value={(row as LocalizedVehicle).id} />
        ),
      },
      {
        field: "plate",
        header: headerCell(t("fleet.columns.plate")),
        sortable: true,
        width: 150,
        filter: true,
        filterElementType: "text",
        filterKey: "plate",
        body: (row) => (
          <TableCellTextField
            value={(row as LocalizedVehicle).plate}
            className="font-mono text-xs dir-ltr"
          />
        ),
      },
      {
        field: "type",
        header: headerCell(t("fleet.columns.type")),
        width: 130,
        filter: true,
        filterElementType: "select",
        filterOptions: VEHICLE_TYPES.map((type) => ({
          label: t(`fleet.vehicleTypes.${type}`),
          value: type,
        })),
        body: (row) => (
          <TableCellTextField value={(row as LocalizedVehicle).typeLabel} />
        ),
      },
      {
        field: "depotCity",
        header: headerCell(t("fleet.columns.depot")),
        width: 120,
        body: (row) => (
          <TableCellTextField value={(row as LocalizedVehicle).depotCity} />
        ),
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
          <Badge severity="info">{(row as LocalizedVehicle).regionLabel}</Badge>
        ),
      },
      {
        field: "countryCode",
        header: headerCell(t("fleet.columns.country")),
        width: 90,
        filter: true,
        filterElementType: "select",
        filterOptions: EU_COUNTRY_CODES.map((code) => ({
          label: code,
          value: code,
        })),
        body: (row) => (
          <TableCellTextField value={(row as LocalizedVehicle).countryCode} />
        ),
      },
      {
        field: "capacityKg",
        header: headerCell(t("fleet.columns.capacity")),
        sortable: true,
        width: 120,
        body: (row) => (
          <TableCellTextField
            value={formatKg((row as LocalizedVehicle).capacityKg)}
          />
        ),
      },
      {
        field: "fuelConsumptionL100",
        header: headerCell(t("fleet.columns.fuel")),
        sortable: true,
        width: 130,
        body: (row) => (
          <TableCellTextField
            value={`${(row as LocalizedVehicle).fuelConsumptionL100} L`}
            justify="end"
          />
        ),
      },
      {
        field: "status",
        header: headerCell(t("fleet.columns.status")),
        width: 130,
        filter: true,
        filterElementType: "select",
        filterOptions: VEHICLE_STATUSES.map((status) => ({
          label: t(`fleet.vehicleStatuses.${status}`),
          value: status,
        })),
        body: (row) => {
          const v = row as LocalizedVehicle;
          return (
            <StatusBox text={v.statusLabel} color={STATUS_COLORS[v.status]} />
          );
        },
      },
    ],
    [t],
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader
        title={t("fleet.vehicles.title")}
        subtitle={t("fleet.vehicles.subtitle")}
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
