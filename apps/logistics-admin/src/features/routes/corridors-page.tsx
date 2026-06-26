"use client";

import { useCallback, useMemo } from "react";
import type { EuCorridorDto } from "@dash/logistics-contracts";
import { getHubById } from "@dash/logistics-seed";
import Table, {
  TableCellTextField,
  type ColumnProps,
} from "@/components/compound/table";
import { queryKeys } from "@/core/query-keys";
import { referenceRepository } from "@/infrastructure/http/repositories";
import { useAppLanguage } from "@/i18n/use-app-language";
import { PageHeader } from "@/shared/page-header";
import { useServerTable } from "@/shared/hooks/use-server-table";
import { formatKm } from "@/shared/formatters";

type LocalizedCorridor = EuCorridorDto & {
  originCity: string;
  destinationCity: string;
};

function headerCell(label: string) {
  return <TableCellTextField value={label} justify="center" />;
}

export function CorridorsPage() {
  const { t } = useAppLanguage();
  const { tableState, pageData, total, loading, handleTableChange } =
    useServerTable<EuCorridorDto>({
      queryKey: queryKeys.reference.corridors,
      fetchPage: referenceRepository.listCorridors,
    });

  const localizeRow = useCallback((row: EuCorridorDto): LocalizedCorridor => {
    const origin = getHubById(row.originHubId);
    const destination = getHubById(row.destinationHubId);
    return {
      ...row,
      originCity: origin.city,
      destinationCity: destination.city,
    };
  }, []);

  const localizedRows = useMemo(
    () => pageData.map(localizeRow),
    [pageData, localizeRow],
  );

  const columns: ColumnProps[] = useMemo(
    () => [
      {
        field: "id",
        header: headerCell(t("routes.columns.id")),
        sortable: true,
        width: 100,
        body: (row) => (
          <TableCellTextField
            value={(row as LocalizedCorridor).id}
            className="font-mono text-xs dir-ltr"
          />
        ),
      },
      {
        field: "label",
        header: headerCell(t("routes.columns.label")),
        sortable: true,
        width: 220,
        filter: true,
        filterElementType: "text",
        filterKey: "label",
        body: (row) => (
          <TableCellTextField value={(row as LocalizedCorridor).label} />
        ),
      },
      {
        field: "originCity",
        header: headerCell(t("routes.columns.origin")),
        width: 130,
        body: (row) => (
          <TableCellTextField value={(row as LocalizedCorridor).originCity} />
        ),
      },
      {
        field: "destinationCity",
        header: headerCell(t("routes.columns.destination")),
        width: 130,
        body: (row) => (
          <TableCellTextField
            value={(row as LocalizedCorridor).destinationCity}
          />
        ),
      },
      {
        field: "distanceKm",
        header: headerCell(t("routes.columns.distance")),
        sortable: true,
        width: 120,
        body: (row) => (
          <TableCellTextField
            value={formatKm((row as LocalizedCorridor).distanceKm)}
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
        title={t("routes.corridors.title")}
        subtitle={t("routes.corridors.subtitle")}
        breadcrumbLabel={t("routes.title")}
        breadcrumbHref="/routes/corridors"
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
