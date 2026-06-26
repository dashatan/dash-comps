import { z } from "zod";

export const invoiceStatusSchema = z.enum(["draft", "sent", "paid", "overdue"]);

export const invoiceSchema = z.object({
  id: z.number().int(),
  customerId: z.number().int(),
  customerName: z.string(),
  shipmentId: z.number().int(),
  amountEur: z.number(),
  issuedAt: z.number(),
  status: invoiceStatusSchema,
});

export type InvoiceDto = z.infer<typeof invoiceSchema>;
export type InvoiceStatus = z.infer<typeof invoiceStatusSchema>;

export const paymentMethodSchema = z.enum(["bank_transfer", "sepa", "card"]);

export const paymentSchema = z.object({
  id: z.number().int(),
  invoiceId: z.number().int(),
  customerId: z.number().int(),
  customerName: z.string(),
  amountEur: z.number(),
  paidAt: z.number(),
  method: paymentMethodSchema,
  reference: z.string(),
});

export type PaymentDto = z.infer<typeof paymentSchema>;
export type PaymentMethod = z.infer<typeof paymentMethodSchema>;

export const financeSummarySchema = z.object({
  totalOutstandingEur: z.number(),
  paidMtdEur: z.number(),
  overdueCount: z.number().int(),
  settledCount: z.number().int(),
  pendingCount: z.number().int(),
});

export type FinanceSummaryDto = z.infer<typeof financeSummarySchema>;
