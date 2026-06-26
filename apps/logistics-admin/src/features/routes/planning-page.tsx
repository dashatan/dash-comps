"use client";

import { useCallback, useMemo } from "react";
import type { RoutePlanDto } from "@dash/logistics-contracts";
import Table, {
  StatusBox,
  TableCellDateElement,
  TableCellNumberField,
  TableCellTextField,
  type ColumnProps,
} from "@/components/compound/table";
import { queryKeys } from "@/core/query-keys";
import { routesRepository } from "@/infrastructure/http/repositories";
import { useLogisticsT } from "@/i18n/provider";
import { PageHeader } from "@/shared/page-header";
import { useServerTable } from "@/shared/hooks/use-server-table";

const PLAN_STATUSES = [
  "scheduled",
  "in_progress",
  "completed",
  "cancelled",
] as const;

const STATUS_COLORS = {
  scheduled: "info",
  in_progress: "warning",
  completed: "success",
  cancelled: "secondary",
} as const;

type LocalizedPlan = RoutePlanDto & { statusLabel: string };

function headerCell(label: string) {
  return <TableCellTextField value={label} justify="center" />;
}

export function PlanningPage() {
  const t = useLogisticsT();
  const { tableState, pageData, total, loading, handleTableChange } =
    useServerTable<RoutePlanDto>({
      queryKey: queryKeys.routes.plans,
      fetchPage: routesRepository.listPlans,
    });

  const localizeRow = useCallback(
    (row: RoutePlanDto): LocalizedPlan => ({
      ...row,
      statusLabel: t(`routes.planStatuses.${row.status}`),
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
        header: headerCell(t("routes.columns.id")),
        sortable: true,
        width: 72,
        body: (row) => (
          <TableCellNumberField value={(row as LocalizedPlan).id} />
        ),
      },
      {
        field: "corridorLabel",
        header: headerCell(t("routes.columns.label")),
        sortable: true,
        width: 220,
        filter: true,
        filterElementType: "text",
        filterKey: "corridorLabel",
        body: (row) => (
          <TableCellTextField value={(row as LocalizedPlan).corridorLabel} />
        ),
      },
      {
        field: "vehicleId",
        header: headerCell(t("routes.columns.vehicle")),
        width: 90,
        body: (row) => (
          <TableCellNumberField value={(row as LocalizedPlan).vehicleId} />
        ),
      },
      {
        field: "driverId",
        header: headerCell(t("routes.columns.driver")),
        width: 90,
        body: (row) => (
          <TableCellNumberField value={(row as LocalizedPlan).driverId} />
        ),
      },
      {
        field: "departureWindow",
        header: headerCell(t("routes.columns.departure")),
        sortable: true,
        width: 150,
        body: (row) => (
          <TableCellDateElement val={(row as LocalizedPlan).departureWindow} />
        ),
      },
      {
        field: "status",
        header: headerCell(t("routes.columns.status")),
        width: 130,
        filter: true,
        filterElementType: "select",
        filterOptions: PLAN_STATUSES.map((status) => ({
          label: t(`routes.planStatuses.${status}`),
          value: status,
        })),
        body: (row) => {
          const plan = row as LocalizedPlan;
          return (
            <StatusBox
              text={plan.statusLabel}
              color={STATUS_COLORS[plan.status]}
            />
          );
        },
      },
    ],
    [t],
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader
        title={t("routes.planning.title")}
        subtitle={t("routes.planning.subtitle")}
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
