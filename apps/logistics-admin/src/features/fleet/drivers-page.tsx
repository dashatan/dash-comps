"use client";

import { useCallback, useMemo, useState } from "react";
import Table, {
  TableCellNumberField,
  TableCellTextField,
  type ChangeTag,
  type ColumnProps,
  type TableData,
} from "@/components/compound/table";
import { EU_COUNTRY_CODES } from "@/data/european-context";
import {
  DRIVERS,
  filterAndSortDrivers,
  getDriverDisplayName,
  getHubById,
  paginateDrivers,
  type Driver,
} from "@/data/fleet";
import { useLogisticsT } from "@/i18n/provider";
import { PageHeader } from "@/shared/page-header";

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

type LocalizedDriver = Driver & {
  name: string;
  depotCity: string;
};

function headerCell(label: string) {
  return <TableCellTextField value={label} justify="center" />;
}

export function DriversPage() {
  const t = useLogisticsT();
  const [tableState, setTableState] = useState<TableData>(INITIAL_TABLE_STATE);
  const [loading, setLoading] = useState(false);

  const localizeRow = useCallback(
    (row: Driver): LocalizedDriver => ({
      ...row,
      name: getDriverDisplayName(row),
      depotCity: getHubById(row.depotHubId).city,
    }),
    [],
  );

  const localizedRows = useMemo(() => DRIVERS.map(localizeRow), [localizeRow]);
  const filteredRows = useMemo(
    () => filterAndSortDrivers(localizedRows, tableState),
    [localizedRows, tableState],
  );
  const pageData = useMemo(
    () => paginateDrivers(filteredRows, tableState),
    [filteredRows, tableState.page, tableState.rows],
  );

  const handleTableChange = useCallback(
    (data: TableData | Record<string, string>, tag: ChangeTag) => {
      setTableState(data as TableData);
      if (tag === "filter" || tag === "pagination" || tag === "rows" || tag === "sort") {
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
          <TableCellTextField value={(row as LocalizedDriver).name} justify="start" />
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
        sortable: true,
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
