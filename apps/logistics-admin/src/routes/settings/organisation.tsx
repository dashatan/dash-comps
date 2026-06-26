import { createFileRoute } from "@tanstack/react-router";
import { OrganisationPage } from "@/features/settings/organisation-page";

export const Route = createFileRoute("/settings/organisation")({
  component: OrganisationPage,
});
