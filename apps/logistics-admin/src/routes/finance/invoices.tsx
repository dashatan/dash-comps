import { createFileRoute } from "@tanstack/react-router";
import { InvoicesPage } from "@/features/finance/invoices-page";

export const Route = createFileRoute("/finance/invoices")({
  component: InvoicesPage,
});
