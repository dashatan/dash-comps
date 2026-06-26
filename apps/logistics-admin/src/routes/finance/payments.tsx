import { createFileRoute } from "@tanstack/react-router";
import { PaymentsPage } from "@/features/finance/payments-page";

export const Route = createFileRoute("/finance/payments")({
  component: PaymentsPage,
});
