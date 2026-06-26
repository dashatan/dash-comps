import { createFileRoute } from "@tanstack/react-router";
import { AccountsPage } from "@/features/customers/accounts-page";

export const Route = createFileRoute("/customers/accounts")({
  component: AccountsPage,
});
