"use client";

import { useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { InvoiceDto } from "@dash/logistics-contracts";
import { AlertTriangle, TrendingUp, Wallet } from "lucide-react";
import Table, {
  StatusBox,
  TableCellDateElement,
  TableCellNumberField,
  TableCellTextField,
  type ColumnProps,
} from "@/components/compound/table";
import { GridContainer } from "@/components/common/grid";
import { queryKeys } from "@/core/query-keys";
import { KpiCard } from "@/features/overview/overview-components";
import { financeRepository } from "@/infrastructure/http/repositories";
import { useLogisticsT } from "@/i18n/provider";
import { PageHeader } from "@/shared/page-header";
import { useServerTable } from "@/shared/hooks/use-server-table";
import { formatEur } from "@/shared/formatters";

const INVOICE_STATUSES = ["draft", "sent", "paid", "overdue"] as const;

const STATUS_COLORS = {
  draft: "secondary",
  sent: "info",
  paid: "success",
  overdue: "error",
} as const;

type LocalizedInvoice = InvoiceDto & { statusLabel: string };

function headerCell(label: string) {
  return <TableCellTextField value={label} justify="center" />;
}

export function InvoicesPage() {
  const t = useLogisticsT();
  const summaryQuery = useQuery({
    queryKey: queryKeys.finance.summary,
    queryFn: () => financeRepository.getSummary(),
  });

  const { tableState, pageData, total, loading, handleTableChange } =
    useServerTable<InvoiceDto>({
      queryKey: queryKeys.finance.invoices,
      fetchPage: financeRepository.listInvoices,
    });

  const localizeRow = useCallback(
    (row: InvoiceDto): LocalizedInvoice => ({
      ...row,
      statusLabel: t(`finance.invoiceStatuses.${row.status}`),
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
        header: headerCell(t("finance.columns.id")),
        sortable: true,
        width: 72,
        body: (row) => (
          <TableCellNumberField value={(row as LocalizedInvoice).id} />
        ),
      },
      {
        field: "customerName",
        header: headerCell(t("finance.columns.customer")),
        sortable: true,
        width: 200,
        filter: true,
        filterElementType: "text",
        filterKey: "customerName",
        body: (row) => (
          <TableCellTextField value={(row as LocalizedInvoice).customerName} />
        ),
      },
      {
        field: "shipmentId",
        header: headerCell(t("finance.columns.shipment")),
        width: 100,
        body: (row) => (
          <TableCellNumberField value={(row as LocalizedInvoice).shipmentId} />
        ),
      },
      {
        field: "amountEur",
        header: headerCell(t("finance.columns.amount")),
        sortable: true,
        width: 120,
        body: (row) => (
          <TableCellTextField
            value={formatEur((row as LocalizedInvoice).amountEur)}
            justify="end"
          />
        ),
      },
      {
        field: "issuedAt",
        header: headerCell(t("finance.columns.issued")),
        sortable: true,
        width: 130,
        body: (row) => (
          <TableCellDateElement val={(row as LocalizedInvoice).issuedAt} />
        ),
      },
      {
        field: "status",
        header: headerCell(t("finance.columns.status")),
        width: 120,
        filter: true,
        filterElementType: "select",
        filterOptions: INVOICE_STATUSES.map((status) => ({
          label: t(`finance.invoiceStatuses.${status}`),
          value: status,
        })),
        body: (row) => {
          const invoice = row as LocalizedInvoice;
          return (
            <StatusBox
              text={invoice.statusLabel}
              color={STATUS_COLORS[invoice.status]}
            />
          );
        },
      },
    ],
    [t],
  );

  const summary = summaryQuery.data;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader
        title={t("finance.invoices.title")}
        subtitle={t("finance.invoices.subtitle")}
        breadcrumbLabel={t("finance.title")}
        breadcrumbHref="/finance/invoices"
      />
      {summary ? (
        <div className="px-4 pt-4">
          <GridContainer className="auto-rows-auto grid-rows-none items-stretch">
            <KpiCard
              label={t("finance.summary.outstanding")}
              description={t("finance.summary.outstandingDescription")}
              value={formatEur(summary.totalOutstandingEur)}
              icon={<Wallet className="size-5" />}
            />
            <KpiCard
              label={t("finance.summary.paidMtd")}
              description={t("finance.summary.paidMtdDescription")}
              value={formatEur(summary.paidMtdEur)}
              icon={<TrendingUp className="size-5" />}
            />
            <KpiCard
              label={t("finance.summary.overdue")}
              description={t("finance.summary.overdueDescription")}
              value={String(summary.overdueCount)}
              icon={<AlertTriangle className="size-5" />}
            />
          </GridContainer>
        </div>
      ) : null}
      <div className="p-4">
        <div className="h-[min(68vh,720px)] w-full overflow-hidden rounded-xl border border-border">
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
