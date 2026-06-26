import { createFileRoute } from "@tanstack/react-router";
import { PlaybackTrackerPage } from "@/features/tracker/pages/playback-tracker-page";

export const Route = createFileRoute("/tracker/playback")({
  component: PlaybackTrackerPage,
});
