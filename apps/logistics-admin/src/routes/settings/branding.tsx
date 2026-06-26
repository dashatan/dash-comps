import { createFileRoute } from "@tanstack/react-router";
import { BrandingPage } from "@/features/settings/branding-page";

export const Route = createFileRoute("/settings/branding")({
  component: BrandingPage,
});
