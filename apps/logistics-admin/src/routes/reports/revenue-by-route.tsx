import { createFileRoute } from "@tanstack/react-router";
import { RevenueByRouteReportPage } from "@/features/reports/revenue-by-route-page";

export const Route = createFileRoute("/reports/revenue-by-route")({
  component: RevenueByRouteReportPage,
});
