import { Link } from "@tanstack/react-router";
import { ArrowRight, FileBarChart, Route, Truck } from "lucide-react";
import { GridContainer } from "@/components/common/grid";
import { PanelCard } from "@/features/overview/overview-components";
import { useLogisticsT } from "@/i18n/provider";
import { PageHeader } from "@/shared/page-header";

const REPORT_LINKS = [
  {
    id: "delivery-performance",
    titleKey: "reports.deliveryPerformance.title",
    descriptionKey: "reports.deliveryPerformance.description",
    to: "/reports/delivery-performance",
    icon: FileBarChart,
  },
  {
    id: "revenue-by-route",
    titleKey: "reports.revenueByRoute.title",
    descriptionKey: "reports.revenueByRoute.description",
    to: "/reports/revenue-by-route",
    icon: Route,
  },
  {
    id: "fleet-utilization",
    titleKey: "reports.fleetUtilization.title",
    descriptionKey: "reports.fleetUtilization.description",
    to: "/reports/fleet-utilization",
    icon: Truck,
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
      <GridContainer
        className="auto-rows-auto grid-rows-none items-stretch"
        aria-label={t("reports.title")}
      >
        {REPORT_LINKS.map((report) => {
          const Icon = report.icon;

          return (
            <PanelCard
              key={report.id}
              className="col-span-12 @lg:col-span-4"
              icon={<Icon className="size-5" />}
              title={t(report.titleKey)}
              description={t(report.descriptionKey)}
            >
              <Link
                to={report.to}
                className="mt-auto inline-flex w-fit items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                {t("common.viewReport")}
                <ArrowRight className="size-4" />
              </Link>
            </PanelCard>
          );
        })}
      </GridContainer>
    </div>
  );
}
