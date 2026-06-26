import { createFileRoute } from "@tanstack/react-router";
import { LiveTrackerPage } from "@/features/tracker/pages/live-tracker-page";

export const Route = createFileRoute("/tracker/live")({
  component: LiveTrackerPage,
});
