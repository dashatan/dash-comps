import type {
  CustomerDto,
  InvoiceDto,
  PaymentDto,
  FinanceSummaryDto,
  ShipmentDto,
} from "@dash/logistics-contracts";
import { getCustomerDisplayName, type Customer } from "./customers";
import { daysAgo } from "./european-context";

const INVOICE_STATUSES = ["draft", "sent", "paid", "overdue"] as const;

export function buildInvoices(
  shipments: ShipmentDto[],
  customers: Customer[],
): InvoiceDto[] {
  const delivered = shipments.filter((s) => s.status === "delivered");

  return delivered.map((shipment, index) => {
    const customer = customers.find((c) => c.id === shipment.customerId);
    const statusIndex = index % INVOICE_STATUSES.length;
    const status = INVOICE_STATUSES[statusIndex];

    return {
      id: index + 1,
      customerId: shipment.customerId,
      customerName: customer
        ? getCustomerDisplayName(customer)
        : `Customer #${shipment.customerId}`,
      shipmentId: shipment.id,
      amountEur: shipment.revenueEur,
      issuedAt: shipment.deliveredAt ?? shipment.scheduledAt,
      status,
    };
  });
}

export function buildPayments(invoices: InvoiceDto[]): PaymentDto[] {
  const paidInvoices = invoices.filter((inv) => inv.status === "paid");

  return paidInvoices.map((invoice, index) => ({
    id: index + 1,
    invoiceId: invoice.id,
    customerId: invoice.customerId,
    customerName: invoice.customerName,
    amountEur: invoice.amountEur,
    paidAt: invoice.issuedAt + 86400000 * (3 + (index % 5)),
    method: (["bank_transfer", "sepa", "card"] as const)[index % 3],
    reference: `PAY-${String(invoice.id).padStart(5, "0")}`,
  }));
}

export function getFinanceSummary(invoices: InvoiceDto[]): FinanceSummaryDto {
  const mtdStart = daysAgo(30);
  const outstanding = invoices.filter(
    (inv) => inv.status === "sent" || inv.status === "overdue",
  );
  const paidMtd = invoices.filter(
    (inv) => inv.status === "paid" && inv.issuedAt >= mtdStart,
  );

  return {
    totalOutstandingEur: outstanding.reduce(
      (sum, inv) => sum + inv.amountEur,
      0,
    ),
    paidMtdEur: paidMtd.reduce((sum, inv) => sum + inv.amountEur, 0),
    overdueCount: invoices.filter((inv) => inv.status === "overdue").length,
    settledCount: invoices.filter((inv) => inv.status === "paid").length,
    pendingCount: invoices.filter(
      (inv) => inv.status === "sent" || inv.status === "draft",
    ).length,
  };
}

export function toCustomerDto(
  customer: Customer,
  shipmentCount: number,
): CustomerDto {
  return {
    id: customer.id,
    name: customer.name,
    suffix: customer.suffix,
    city: customer.city,
    countryCode: customer.countryCode,
    region: customer.region,
    vatNumber: customer.vatNumber,
    phone: customer.phone,
    accountTier: customer.accountTier,
    shipmentCount,
  };
}
