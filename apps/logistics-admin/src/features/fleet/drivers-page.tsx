"use client";

import { useCallback, useMemo } from "react";
import type { DriverDto } from "@dash/logistics-contracts";
import { getDriverDisplayName, getHubById } from "@dash/logistics-seed";
import Table, {
  TableCellNumberField,
  TableCellTextField,
  type ColumnProps,
} from "@/components/compound/table";
import { queryKeys } from "@/core/query-keys";
import { fleetRepository } from "@/infrastructure/http/repositories";
import { useLogisticsT } from "@/i18n/provider";
import { PageHeader } from "@/shared/page-header";
import { useServerTable } from "@/shared/hooks/use-server-table";
import { EU_COUNTRY_CODES } from "@/shared/formatters";

type LocalizedDriver = DriverDto & {
  name: string;
  depotCity: string;
};

function headerCell(label: string) {
  return <TableCellTextField value={label} justify="center" />;
}

export function DriversPage() {
  const t = useLogisticsT();
  const { tableState, pageData, total, loading, handleTableChange } =
    useServerTable<DriverDto>({
      queryKey: queryKeys.fleet.drivers,
      fetchPage: fleetRepository.listDrivers,
    });

  const localizeRow = useCallback(
    (row: DriverDto): LocalizedDriver => ({
      ...row,
      name: getDriverDisplayName(row),
      depotCity: getHubById(row.depotHubId).city,
    }),
    [],
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
          <TableCellNumberField value={(row as LocalizedDriver).id} />
        ),
      },
      {
        field: "name",
        header: headerCell(t("fleet.columns.name")),
        sortable: true,
        width: 180,
        filter: true,
        filterElementType: "text",
        filterKey: "name",
        body: (row) => (
          <TableCellTextField
            value={(row as LocalizedDriver).name}
            justify="start"
          />
        ),
      },
      {
        field: "licenseCountry",
        header: headerCell(t("fleet.columns.licenseCountry")),
        width: 120,
        filter: true,
        filterElementType: "select",
        filterOptions: EU_COUNTRY_CODES.map((code) => ({
          label: code,
          value: code,
        })),
        body: (row) => (
          <TableCellTextField value={(row as LocalizedDriver).licenseCountry} />
        ),
      },
      {
        field: "depotCity",
        header: headerCell(t("fleet.columns.depot")),
        width: 140,
        body: (row) => (
          <TableCellTextField value={(row as LocalizedDriver).depotCity} />
        ),
      },
    ],
    [t],
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader
        title={t("fleet.drivers.title")}
        subtitle={t("fleet.drivers.subtitle")}
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
