import { createFileRoute } from "@tanstack/react-router";
import { IntegrationsPage } from "@/features/settings/integrations-page";

export const Route = createFileRoute("/settings/integrations")({
  component: IntegrationsPage,
});
