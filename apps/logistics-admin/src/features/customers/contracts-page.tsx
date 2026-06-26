"use client";

import { useCallback, useMemo } from "react";
import type { ServiceContractDto } from "@dash/logistics-contracts";
import Table, {
  TableCellDateElement,
  TableCellNumberField,
  TableCellTextField,
  type ColumnProps,
} from "@/components/compound/table";
import { queryKeys } from "@/core/query-keys";
import { customersRepository } from "@/infrastructure/http/repositories";
import { useLogisticsT } from "@/i18n/provider";
import { PageHeader } from "@/shared/page-header";
import { useServerTable } from "@/shared/hooks/use-server-table";

const ACCOUNT_TIERS = ["standard", "premium", "enterprise"] as const;

type LocalizedContract = ServiceContractDto & {
  tierLabel: string;
  billingLabel: string;
};

function headerCell(label: string) {
  return <TableCellTextField value={label} justify="center" />;
}

export function ContractsPage() {
  const t = useLogisticsT();
  const { tableState, pageData, total, loading, handleTableChange } =
    useServerTable<ServiceContractDto>({
      queryKey: queryKeys.customers.contracts,
      fetchPage: customersRepository.listContracts,
    });

  const localizeRow = useCallback(
    (row: ServiceContractDto): LocalizedContract => ({
      ...row,
      tierLabel: t(`customers.tiers.${row.tier}`),
      billingLabel: t(`customers.billingCycles.${row.billingCycle}`),
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
          <TableCellNumberField value={(row as LocalizedContract).id} />
        ),
      },
      {
        field: "customerName",
        header: headerCell(t("customers.columns.name")),
        sortable: true,
        width: 200,
        filter: true,
        filterElementType: "text",
        filterKey: "customerName",
        body: (row) => (
          <TableCellTextField value={(row as LocalizedContract).customerName} />
        ),
      },
      {
        field: "tier",
        header: headerCell(t("customers.columns.tier")),
        width: 120,
        filter: true,
        filterElementType: "select",
        filterOptions: ACCOUNT_TIERS.map((tier) => ({
          label: t(`customers.tiers.${tier}`),
          value: tier,
        })),
        body: (row) => (
          <TableCellTextField value={(row as LocalizedContract).tierLabel} />
        ),
      },
      {
        field: "slaOnTimePercent",
        header: headerCell(t("customers.columns.sla")),
        sortable: true,
        width: 100,
        body: (row) => (
          <TableCellTextField
            value={`${(row as LocalizedContract).slaOnTimePercent}%`}
            justify="end"
          />
        ),
      },
      {
        field: "billingCycle",
        header: headerCell(t("customers.columns.billing")),
        width: 120,
        body: (row) => (
          <TableCellTextField value={(row as LocalizedContract).billingLabel} />
        ),
      },
      {
        field: "corridorIds",
        header: headerCell(t("customers.columns.corridors")),
        width: 100,
        body: (row) => (
          <TableCellNumberField
            value={(row as LocalizedContract).corridorIds.length}
          />
        ),
      },
      {
        field: "startDate",
        header: headerCell(t("customers.columns.startDate")),
        sortable: true,
        width: 130,
        body: (row) => (
          <TableCellDateElement val={(row as LocalizedContract).startDate} />
        ),
      },
      {
        field: "endDate",
        header: headerCell(t("customers.columns.endDate")),
        sortable: true,
        width: 130,
        body: (row) => (
          <TableCellDateElement val={(row as LocalizedContract).endDate} />
        ),
      },
    ],
    [t],
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader
        title={t("customers.contracts.title")}
        subtitle={t("customers.contracts.subtitle")}
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
