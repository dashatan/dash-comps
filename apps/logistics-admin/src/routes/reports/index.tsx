import { createFileRoute } from "@tanstack/react-router";
import { ReportsIndexPage } from "@/features/reports/reports-index-page";

export const Route = createFileRoute("/reports/")({
  component: ReportsIndexPage,
});
