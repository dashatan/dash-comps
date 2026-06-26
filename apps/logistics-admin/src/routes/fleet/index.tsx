import { createFileRoute } from "@tanstack/react-router";
import { FleetOverviewPage } from "@/features/fleet/fleet-overview-page";

export const Route = createFileRoute("/fleet/")({
  component: FleetOverviewPage,
});
