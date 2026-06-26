import { createFileRoute } from "@tanstack/react-router";
import { DriversPage } from "@/features/fleet/drivers-page";

export const Route = createFileRoute("/fleet/drivers")({
  component: DriversPage,
});
