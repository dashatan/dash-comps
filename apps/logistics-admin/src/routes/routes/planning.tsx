import { createFileRoute } from "@tanstack/react-router";
import { PlanningPage } from "@/features/routes/planning-page";

export const Route = createFileRoute("/routes/planning")({
  component: PlanningPage,
});
