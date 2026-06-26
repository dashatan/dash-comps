import { createFileRoute } from "@tanstack/react-router";
import { FleetUtilizationReportPage } from "@/features/reports/fleet-utilization-page";

export const Route = createFileRoute("/reports/fleet-utilization")({
  component: FleetUtilizationReportPage,
});
