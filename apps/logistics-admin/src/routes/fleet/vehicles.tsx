import { createFileRoute } from "@tanstack/react-router";
import { VehiclesPage } from "@/features/fleet/vehicles-page";

export const Route = createFileRoute("/fleet/vehicles")({
  component: VehiclesPage,
});
