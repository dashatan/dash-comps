"use client";

import { useCallback, useMemo } from "react";
import type { EuHubDto } from "@dash/logistics-contracts";
import Badge from "@/components/common/badge";
import Table, {
  TableCellTextField,
  type ColumnProps,
} from "@/components/compound/table";
import { queryKeys } from "@/core/query-keys";
import { referenceRepository } from "@/infrastructure/http/repositories";
import { useAppLanguage } from "@/i18n/use-app-language";
import { PageHeader } from "@/shared/page-header";
import { useServerTable } from "@/shared/hooks/use-server-table";
import { EU_COUNTRY_CODES, EU_REGIONS } from "@/shared/formatters";

type LocalizedHub = EuHubDto & { regionLabel: string };

function headerCell(label: string) {
  return <TableCellTextField value={label} justify="center" />;
}

export function HubsPage() {
  const { t } = useAppLanguage();
  const { tableState, pageData, total, loading, handleTableChange } =
    useServerTable<EuHubDto>({
      queryKey: queryKeys.reference.hubs,
      fetchPage: referenceRepository.listHubs,
    });

  const localizeRow = useCallback(
    (row: EuHubDto): LocalizedHub => ({
      ...row,
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
        header: headerCell(t("warehouses.columns.id")),
        sortable: true,
        width: 100,
        body: (row) => (
          <TableCellTextField
            value={(row as LocalizedHub).id}
            className="font-mono text-xs dir-ltr"
          />
        ),
      },
      {
        field: "city",
        header: headerCell(t("warehouses.columns.city")),
        sortable: true,
        width: 140,
        filter: true,
        filterElementType: "text",
        filterKey: "city",
        body: (row) => (
          <TableCellTextField value={(row as LocalizedHub).city} />
        ),
      },
      {
        field: "countryCode",
        header: headerCell(t("warehouses.columns.country")),
        sortable: true,
        width: 90,
        filter: true,
        filterElementType: "select",
        filterOptions: EU_COUNTRY_CODES.map((code) => ({
          label: code,
          value: code,
        })),
        body: (row) => (
          <TableCellTextField value={(row as LocalizedHub).countryCode} />
        ),
      },
      {
        field: "region",
        header: headerCell(t("warehouses.columns.region")),
        sortable: true,
        width: 150,
        filter: true,
        filterElementType: "multi-select",
        filterOptions: EU_REGIONS.map((region) => ({
          label: t(`shipments.regions.${region}`),
          value: region,
        })),
        body: (row) => (
          <Badge severity="info">{(row as LocalizedHub).regionLabel}</Badge>
        ),
      },
      {
        field: "lat",
        header: headerCell(t("warehouses.columns.latitude")),
        width: 110,
        body: (row) => (
          <TableCellTextField
            value={(row as LocalizedHub).lat.toFixed(4)}
            className="tabular-nums dir-ltr"
            justify="end"
          />
        ),
      },
      {
        field: "lng",
        header: headerCell(t("warehouses.columns.longitude")),
        width: 110,
        body: (row) => (
          <TableCellTextField
            value={(row as LocalizedHub).lng.toFixed(4)}
            className="tabular-nums dir-ltr"
            justify="end"
          />
        ),
      },
    ],
    [t],
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader
        title={t("warehouses.hubs.title")}
        subtitle={t("warehouses.hubs.subtitle")}
        breadcrumbLabel={t("warehouses.title")}
        breadcrumbHref="/warehouses/hubs"
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
