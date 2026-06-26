"use client";

import { useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { PaymentDto } from "@dash/logistics-contracts";
import { CheckCircle, Clock, Wallet } from "lucide-react";
import Table, {
  TableCellDateElement,
  TableCellNumberField,
  TableCellTextField,
  type ColumnProps,
} from "@/components/compound/table";
import { GridContainer } from "@/components/common/grid";
import { queryKeys } from "@/core/query-keys";
import { KpiCard } from "@/features/overview/overview-components";
import { financeRepository } from "@/infrastructure/http/repositories";
import { useAppLanguage } from "@/i18n/use-app-language";
import { PageHeader } from "@/shared/page-header";
import { useServerTable } from "@/shared/hooks/use-server-table";
import { formatEur } from "@/shared/formatters";

const PAYMENT_METHODS = ["bank_transfer", "sepa", "card"] as const;

type LocalizedPayment = PaymentDto & { methodLabel: string };

function headerCell(label: string) {
  return <TableCellTextField value={label} justify="center" />;
}

export function PaymentsPage() {
  const { t } = useAppLanguage();
  const summaryQuery = useQuery({
    queryKey: queryKeys.finance.summary,
    queryFn: () => financeRepository.getSummary(),
  });

  const { tableState, pageData, total, loading, handleTableChange } =
    useServerTable<PaymentDto>({
      queryKey: queryKeys.finance.payments,
      fetchPage: financeRepository.listPayments,
    });

  const localizeRow = useCallback(
    (row: PaymentDto): LocalizedPayment => ({
      ...row,
      methodLabel: t(`finance.paymentMethods.${row.method}`),
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
          <TableCellNumberField value={(row as LocalizedPayment).id} />
        ),
      },
      {
        field: "reference",
        header: headerCell(t("finance.columns.reference")),
        width: 120,
        body: (row) => (
          <TableCellTextField
            value={(row as LocalizedPayment).reference}
            className="font-mono text-xs dir-ltr"
          />
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
          <TableCellTextField value={(row as LocalizedPayment).customerName} />
        ),
      },
      {
        field: "invoiceId",
        header: headerCell(t("finance.columns.invoice")),
        width: 100,
        body: (row) => (
          <TableCellNumberField value={(row as LocalizedPayment).invoiceId} />
        ),
      },
      {
        field: "amountEur",
        header: headerCell(t("finance.columns.amount")),
        sortable: true,
        width: 120,
        body: (row) => (
          <TableCellTextField
            value={formatEur((row as LocalizedPayment).amountEur)}
            justify="end"
          />
        ),
      },
      {
        field: "method",
        header: headerCell(t("finance.columns.method")),
        width: 130,
        filter: true,
        filterElementType: "select",
        filterOptions: PAYMENT_METHODS.map((method) => ({
          label: t(`finance.paymentMethods.${method}`),
          value: method,
        })),
        body: (row) => (
          <TableCellTextField value={(row as LocalizedPayment).methodLabel} />
        ),
      },
      {
        field: "paidAt",
        header: headerCell(t("finance.columns.paidAt")),
        sortable: true,
        width: 130,
        body: (row) => (
          <TableCellDateElement val={(row as LocalizedPayment).paidAt} />
        ),
      },
    ],
    [t],
  );

  const summary = summaryQuery.data;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader
        title={t("finance.payments.title")}
        subtitle={t("finance.payments.subtitle")}
        breadcrumbLabel={t("finance.title")}
        breadcrumbHref="/finance/invoices"
      />
      {summary ? (
        <div className="px-4 pt-4">
          <GridContainer className="auto-rows-auto grid-rows-none items-stretch">
            <KpiCard
              label={t("finance.summary.settled")}
              description={t("finance.summary.settledDescription")}
              value={String(summary.settledCount)}
              icon={<CheckCircle className="size-5" />}
            />
            <KpiCard
              label={t("finance.summary.pending")}
              description={t("finance.summary.pendingDescription")}
              value={String(summary.pendingCount)}
              icon={<Clock className="size-5" />}
            />
            <KpiCard
              label={t("finance.summary.paidMtd")}
              description={t("finance.summary.paidMtdDescription")}
              value={formatEur(summary.paidMtdEur)}
              icon={<Wallet className="size-5" />}
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
