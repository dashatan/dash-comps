import { createFileRoute } from "@tanstack/react-router";
import { DeliveryPerformanceReportPage } from "@/features/reports/delivery-performance-page";

export const Route = createFileRoute("/reports/delivery-performance")({
  component: DeliveryPerformanceReportPage,
});
