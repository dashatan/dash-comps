import type { ServiceContractDto } from "@dash/logistics-contracts";
import { getCustomerDisplayName, type Customer } from "./customers";
import { daysAgo, daysFromNow, EU_CORRIDORS } from "./european-context";

export function buildServiceContracts(
  customers: Customer[],
): ServiceContractDto[] {
  const billingCycles = ["monthly", "quarterly", "annual"] as const;
  const count = 30;

  return Array.from({ length: count }, (_, index) => {
    const customer = customers[index % customers.length];
    const corridorCount = 1 + (index % 3);
    const corridorIds = EU_CORRIDORS.slice(0, corridorCount).map((c) => c.id);

    return {
      id: index + 1,
      customerId: customer.id,
      customerName: getCustomerDisplayName(customer),
      corridorIds,
      slaOnTimePercent: 88 + (index % 8),
      billingCycle: billingCycles[index % billingCycles.length],
      startDate: daysAgo(180 + index * 7),
      endDate: daysFromNow(180 - (index % 60)),
      tier: customer.accountTier,
    };
  });
}
