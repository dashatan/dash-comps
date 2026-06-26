import { createFileRoute } from "@tanstack/react-router";
import { CapacityPage } from "@/features/warehouses/capacity-page";

export const Route = createFileRoute("/warehouses/capacity")({
  component: CapacityPage,
});
