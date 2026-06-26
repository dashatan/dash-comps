import { createFileRoute } from "@tanstack/react-router";
import { ShipmentsPage } from "@/features/shipments/shipments-page";

export const Route = createFileRoute("/shipments")({
  component: ShipmentsPage,
});
