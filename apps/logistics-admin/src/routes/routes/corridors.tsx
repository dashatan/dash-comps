import { createFileRoute } from "@tanstack/react-router";
import { CorridorsPage } from "@/features/routes/corridors-page";

export const Route = createFileRoute("/routes/corridors")({
  component: CorridorsPage,
});
