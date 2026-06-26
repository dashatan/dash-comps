import { createFileRoute } from "@tanstack/react-router";
import { HubsPage } from "@/features/warehouses/hubs-page";

export const Route = createFileRoute("/warehouses/hubs")({
  component: HubsPage,
});
