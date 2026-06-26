"use client";

import { useCallback, useMemo } from "react";
import type { CustomerDto } from "@dash/logistics-contracts";
import Badge from "@/components/common/badge";
import Table, {
  TableCellNumberField,
  TableCellTextField,
  type ColumnProps,
} from "@/components/compound/table";
import { queryKeys } from "@/core/query-keys";
import { customersRepository } from "@/infrastructure/http/repositories";
import { useLogisticsT } from "@/i18n/provider";
import { PageHeader } from "@/shared/page-header";
import { useServerTable } from "@/shared/hooks/use-server-table";
import { EU_COUNTRY_CODES, EU_REGIONS } from "@/shared/formatters";

const ACCOUNT_TIERS = ["standard", "premium", "enterprise"] as const;

type LocalizedCustomer = CustomerDto & {
  displayName: string;
  regionLabel: string;
  tierLabel: string;
};

function headerCell(label: string) {
  return <TableCellTextField value={label} justify="center" />;
}

export function AccountsPage() {
  const t = useLogisticsT();
  const { tableState, pageData, total, loading, handleTableChange } =
    useServerTable<CustomerDto>({
      queryKey: queryKeys.customers.list,
      fetchPage: customersRepository.list,
    });

  const localizeRow = useCallback(
    (row: CustomerDto): LocalizedCustomer => ({
      ...row,
      displayName: `${row.name} ${row.suffix}`,
      regionLabel: t(`shipments.regions.${row.region}`),
      tierLabel: t(`customers.tiers.${row.accountTier}`),
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
        header: headerCell(t("customers.columns.id")),
        sortable: true,
        width: 72,
        body: (row) => (
          <TableCellNumberField value={(row as LocalizedCustomer).id} />
        ),
      },
      {
        field: "name",
        header: headerCell(t("customers.columns.name")),
        sortable: true,
        width: 200,
        filter: true,
        filterElementType: "text",
        filterKey: "name",
        body: (row) => (
          <TableCellTextField value={(row as LocalizedCustomer).displayName} />
        ),
      },
      {
        field: "city",
        header: headerCell(t("customers.columns.city")),
        width: 120,
        body: (row) => (
          <TableCellTextField value={(row as LocalizedCustomer).city} />
        ),
      },
      {
        field: "countryCode",
        header: headerCell(t("customers.columns.country")),
        width: 90,
        filter: true,
        filterElementType: "select",
        filterOptions: EU_COUNTRY_CODES.map((code) => ({
          label: code,
          value: code,
        })),
        body: (row) => (
          <TableCellTextField value={(row as LocalizedCustomer).countryCode} />
        ),
      },
      {
        field: "region",
        header: headerCell(t("customers.columns.region")),
        width: 140,
        filter: true,
        filterElementType: "multi-select",
        filterOptions: EU_REGIONS.map((region) => ({
          label: t(`shipments.regions.${region}`),
          value: region,
        })),
        body: (row) => (
          <Badge severity="info">
            {(row as LocalizedCustomer).regionLabel}
          </Badge>
        ),
      },
      {
        field: "accountTier",
        header: headerCell(t("customers.columns.tier")),
        width: 120,
        filter: true,
        filterElementType: "select",
        filterOptions: ACCOUNT_TIERS.map((tier) => ({
          label: t(`customers.tiers.${tier}`),
          value: tier,
        })),
        body: (row) => (
          <TableCellTextField value={(row as LocalizedCustomer).tierLabel} />
        ),
      },
      {
        field: "vatNumber",
        header: headerCell(t("customers.columns.vat")),
        width: 150,
        body: (row) => (
          <TableCellTextField
            value={(row as LocalizedCustomer).vatNumber}
            className="font-mono text-xs dir-ltr"
          />
        ),
      },
      {
        field: "shipmentCount",
        header: headerCell(t("customers.columns.shipments")),
        sortable: true,
        width: 110,
        body: (row) => (
          <TableCellNumberField
            value={(row as LocalizedCustomer).shipmentCount}
          />
        ),
      },
    ],
    [t],
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader
        title={t("customers.accounts.title")}
        subtitle={t("customers.accounts.subtitle")}
        breadcrumbLabel={t("customers.title")}
        breadcrumbHref="/customers/accounts"
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
