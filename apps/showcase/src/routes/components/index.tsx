import { createFileRoute } from "@tanstack/react-router";
import { CatalogIndexPage } from "@/features/catalog/index-page";

export const Route = createFileRoute("/components/")({
  component: CatalogIndexPage,
});
