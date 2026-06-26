import { createFileRoute } from "@tanstack/react-router";
import { AssignmentsPage } from "@/features/fleet/assignments-page";

export const Route = createFileRoute("/fleet/assignments")({
  component: AssignmentsPage,
});
