"use client";

import { useCallback, useMemo } from "react";
import type { ShipmentDto } from "@dash/logistics-contracts";
import Badge from "@/components/common/badge";
import Table, {
  StatusBox,
  TableCellDateElement,
  TableCellNumberField,
  TableCellTextField,
  type ColumnProps,
} from "@/components/compound/table";
import { queryKeys } from "@/core/query-keys";
import { shipmentsRepository } from "@/infrastructure/http/repositories";
import { useLogisticsT } from "@/i18n/provider";
import { PageHeader } from "@/shared/page-header";
import { useServerTable } from "@/shared/hooks/use-server-table";
import {
  EU_COUNTRY_CODES,
  EU_REGIONS,
  SHIPMENT_STATUSES,
  formatEur,
  formatKg,
} from "@/shared/formatters";

const STATUS_COLORS = {
  pending: "warning",
  in_transit: "info",
  delivered: "success",
  delayed: "error",
  cancelled: "secondary" as const,
} as const;

type LocalizedShipment = ShipmentDto & {
  statusLabel: string;
  regionLabel: string;
  onTimeLabel: string;
};

function headerCell(label: string) {
  return <TableCellTextField value={label} justify="center" />;
}

export function ShipmentsPage() {
  const t = useLogisticsT();
  const { tableState, pageData, total, loading, handleTableChange } =
    useServerTable<ShipmentDto>({
      queryKey: queryKeys.shipments.list,
      fetchPage: shipmentsRepository.list,
    });

  const localizeRow = useCallback(
    (row: ShipmentDto): LocalizedShipment => ({
      ...row,
      statusLabel: t(`shipments.statuses.${row.status}`),
      regionLabel: t(`shipments.regions.${row.region}`),
      onTimeLabel:
        row.status === "delivered" || row.status === "delayed"
          ? row.onTime
            ? t("shipments.onTime.yes")
            : t("shipments.onTime.no")
          : t("shipments.onTime.na"),
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
        header: headerCell(t("shipments.columns.id")),
        sortable: true,
        width: 72,
        body: (row) => (
          <TableCellNumberField value={(row as LocalizedShipment).id} />
        ),
      },
      {
        field: "trackingNumber",
        header: headerCell(t("shipments.columns.trackingNumber")),
        sortable: true,
        width: 160,
        filter: true,
        filterElementType: "text",
        filterKey: "trackingNumber",
        body: (row) => (
          <TableCellTextField
            value={(row as LocalizedShipment).trackingNumber}
            justify="start"
            className="font-mono text-xs dir-ltr"
          />
        ),
      },
      {
        field: "status",
        header: headerCell(t("shipments.columns.status")),
        sortable: true,
        width: 130,
        filter: true,
        filterElementType: "select",
        filterOptions: SHIPMENT_STATUSES.map((status) => ({
          label: t(`shipments.statuses.${status}`),
          value: status,
        })),
        body: (row) => {
          const shipment = row as LocalizedShipment;
          return (
            <StatusBox
              text={shipment.statusLabel}
              color={STATUS_COLORS[shipment.status]}
            />
          );
        },
      },
      {
        field: "originCity",
        header: headerCell(t("shipments.columns.origin")),
        sortable: true,
        width: 120,
        body: (row) => (
          <TableCellTextField value={(row as LocalizedShipment).originCity} />
        ),
      },
      {
        field: "destinationCity",
        header: headerCell(t("shipments.columns.destination")),
        sortable: true,
        width: 120,
        body: (row) => (
          <TableCellTextField
            value={(row as LocalizedShipment).destinationCity}
          />
        ),
      },
      {
        field: "region",
        header: headerCell(t("shipments.columns.region")),
        width: 140,
        filter: true,
        filterElementType: "multi-select",
        filterOptions: EU_REGIONS.map((region) => ({
          label: t(`shipments.regions.${region}`),
          value: region,
        })),
        body: (row) => (
          <Badge severity="info">
            {(row as LocalizedShipment).regionLabel}
          </Badge>
        ),
      },
      {
        field: "countryCode",
        header: headerCell(t("shipments.columns.country")),
        width: 90,
        filter: true,
        filterElementType: "select",
        filterOptions: EU_COUNTRY_CODES.map((code) => ({
          label: code,
          value: code,
        })),
        body: (row) => (
          <TableCellTextField value={(row as LocalizedShipment).countryCode} />
        ),
      },
      {
        field: "weightKg",
        header: headerCell(t("shipments.columns.weight")),
        sortable: true,
        width: 110,
        body: (row) => (
          <TableCellTextField
            value={formatKg((row as LocalizedShipment).weightKg)}
          />
        ),
      },
      {
        field: "revenueEur",
        header: headerCell(t("shipments.columns.revenue")),
        sortable: true,
        width: 120,
        body: (row) => (
          <TableCellTextField
            value={formatEur((row as LocalizedShipment).revenueEur)}
            justify="end"
          />
        ),
      },
      {
        field: "costEur",
        header: headerCell(t("shipments.columns.cost")),
        sortable: true,
        width: 120,
        body: (row) => (
          <TableCellTextField
            value={formatEur((row as LocalizedShipment).costEur)}
            justify="end"
          />
        ),
      },
      {
        field: "scheduledAt",
        header: headerCell(t("shipments.columns.scheduled")),
        sortable: true,
        width: 130,
        body: (row) => (
          <TableCellDateElement val={(row as LocalizedShipment).scheduledAt} />
        ),
      },
      {
        field: "onTime",
        header: headerCell(t("shipments.columns.onTime")),
        width: 90,
        body: (row) => (
          <TableCellTextField value={(row as LocalizedShipment).onTimeLabel} />
        ),
      },
    ],
    [t],
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader
        title={t("shipments.title")}
        subtitle={t("shipments.subtitle")}
        breadcrumbLabel={t("shipments.title")}
        breadcrumbHref="/shipments"
      />
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
  );
}
