import { createFileRoute } from "@tanstack/react-router";
import { ContractsPage } from "@/features/customers/contracts-page";

export const Route = createFileRoute("/customers/contracts")({
  component: ContractsPage,
});
