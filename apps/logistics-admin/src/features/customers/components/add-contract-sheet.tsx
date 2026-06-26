"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import Button from "@/components/common/buttons";
import { Form, FormField } from "@/components/compound/form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/common/overlay/sheet";
import { toast } from "@/components/common/sonner";
import { useLogisticsT } from "@/i18n/provider";
import { createZodResolver } from "@/shared/zod-resolver";
import {
  demoContractFormDefaults,
  demoContractFormSchema,
  type DemoContractFormValues,
} from "@/features/customers/schemas/demo-contract.schema";
import { ActionButton } from "@dash/ui/compound/table/components/header/action-header";

const ACCOUNT_TIERS = ["standard", "premium", "enterprise"] as const;
const BILLING_CYCLES = ["monthly", "quarterly", "annual"] as const;

export function AddContractSheet() {
  const t = useLogisticsT();
  const [open, setOpen] = useState(false);
  const resolver = useMemo(() => createZodResolver(demoContractFormSchema), []);

  const form = useForm<DemoContractFormValues>({
    defaultValues: demoContractFormDefaults,
    resolver,
    mode: "onSubmit",
  });

  const tierOptions = useMemo(
    () =>
      ACCOUNT_TIERS.map((tier) => ({
        value: tier,
        label: t(`customers.tiers.${tier}`),
      })),
    [t],
  );

  const billingOptions = useMemo(
    () =>
      BILLING_CYCLES.map((cycle) => ({
        value: cycle,
        label: t(`customers.billingCycles.${cycle}`),
      })),
    [t],
  );

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      form.reset(demoContractFormDefaults);
    }
  };

  const onSubmit = () => {
    toast.success(t("customers.forms.contractSubmitted"));
    setOpen(false);
    form.reset(demoContractFormDefaults);
  };

  const onInvalid = () => {
    toast.error(t("customers.forms.validationFailed"));
  };

  return (
    <>
      <ActionButton
        onClick={() => setOpen(true)}
        tooltip={t("customers.forms.addContract")}
      >
        <Plus className="size-7" />
      </ActionButton>
      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetContent side="right" className="flex w-full flex-col sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>{t("customers.forms.addContractTitle")}</SheetTitle>
            <SheetDescription>
              {t("customers.forms.addContractDescription")}
            </SheetDescription>
          </SheetHeader>
          <Form
            form={form}
            onSubmit={onSubmit}
            onInvalid={onInvalid}
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="flex flex-1 flex-col gap-3 overflow-y-auto py-4">
              <FormField
                type="text"
                name="customerName"
                label={t("customers.forms.fields.customerName")}
                required
              />
              <FormField
                type="select"
                name="tier"
                label={t("customers.columns.tier")}
                options={tierOptions}
                required
              />
              <FormField
                type="number"
                name="slaOnTimePercent"
                label={t("customers.columns.sla")}
                min={80}
                max={100}
                step={1}
                className="dir-ltr"
                required
              />
              <FormField
                type="select"
                name="billingCycle"
                label={t("customers.columns.billing")}
                options={billingOptions}
                required
              />
              <FormField
                type="number"
                name="corridorCount"
                label={t("customers.forms.fields.corridorCount")}
                min={1}
                max={24}
                step={1}
                className="dir-ltr"
                required
              />
              <FormField
                type="text"
                name="startDate"
                label={t("customers.columns.startDate")}
                placeholder="YYYY-MM-DD"
                className="dir-ltr"
                required
              />
              <FormField
                type="text"
                name="endDate"
                label={t("customers.columns.endDate")}
                placeholder="YYYY-MM-DD"
                className="dir-ltr"
                required
              />
              <FormField
                type="textarea"
                name="notes"
                label={t("customers.forms.fields.notes")}
              />
            </div>
            <SheetFooter className="gap-2 sm:gap-2">
              <Button
                type="button"
                variant="outlined"
                severity="secondary"
                onClick={() => handleOpenChange(false)}
              >
                {t("customers.forms.cancel")}
              </Button>
              <Button type="submit" variant="contained" severity="primary">
                {t("customers.forms.submit")}
              </Button>
            </SheetFooter>
          </Form>
        </SheetContent>
      </Sheet>
    </>
  );
}
