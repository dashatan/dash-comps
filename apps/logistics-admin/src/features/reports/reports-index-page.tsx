import { Link } from "@tanstack/react-router";
import { FileBarChart } from "lucide-react";
import { GridCard, GridContainer, GridHeader } from "@/components/common/grid";
import { useLogisticsT } from "@/i18n/provider";
import { PageHeader } from "@/shared/page-header";

const REPORT_LINKS = [
  {
    id: "delivery-performance",
    titleKey: "reports.deliveryPerformance.title",
    descriptionKey: "reports.deliveryPerformance.description",
    to: "/reports/delivery-performance",
  },
  {
    id: "revenue-by-route",
    titleKey: "reports.revenueByRoute.title",
    descriptionKey: "reports.revenueByRoute.description",
    to: "/reports/revenue-by-route",
  },
  {
    id: "fleet-utilization",
    titleKey: "reports.fleetUtilization.title",
    descriptionKey: "reports.fleetUtilization.description",
    to: "/reports/fleet-utilization",
  },
] as const;

export function ReportsIndexPage() {
  const t = useLogisticsT();

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader
        title={t("reports.title")}
        subtitle={t("reports.subtitle")}
        breadcrumbLabel={t("reports.title")}
        breadcrumbHref="/reports"
      />
      <GridContainer aria-label={t("reports.title")}>
        {REPORT_LINKS.map((report) => (
          <GridCard key={report.id} className="col-span-12 @lg:col-span-4">
            <GridHeader
              Icon={<FileBarChart className="size-5" />}
              title={t(report.titleKey)}
              subtitle={t(report.descriptionKey)}
            />
            <Link
              to={report.to}
              className="mt-auto inline-flex w-fit rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              {t("common.viewReport")}
            </Link>
          </GridCard>
        ))}
      </GridContainer>
    </div>
  );
}
