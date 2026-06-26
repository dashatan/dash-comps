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
import { EU_COUNTRY_CODES, EU_REGIONS } from "@/shared/formatters";
import { createZodResolver } from "@/shared/zod-resolver";
import {
  demoAccountFormDefaults,
  demoAccountFormSchema,
  type DemoAccountFormValues,
} from "@/features/customers/schemas/demo-account.schema";
import { ActionButton } from "@dash/ui/compound/table/components/header/action-header";

const ACCOUNT_TIERS = ["standard", "premium", "enterprise"] as const;

export function AddAccountSheet() {
  const t = useLogisticsT();
  const [open, setOpen] = useState(false);
  const resolver = useMemo(() => createZodResolver(demoAccountFormSchema), []);

  const form = useForm<DemoAccountFormValues>({
    defaultValues: demoAccountFormDefaults,
    resolver,
    mode: "onSubmit",
  });

  const countryOptions = useMemo(
    () =>
      EU_COUNTRY_CODES.map((code) => ({
        value: code,
        label: code,
      })),
    [],
  );

  const regionOptions = useMemo(
    () =>
      EU_REGIONS.map((region) => ({
        value: region,
        label: t(`shipments.regions.${region}`),
      })),
    [t],
  );

  const tierOptions = useMemo(
    () =>
      ACCOUNT_TIERS.map((tier) => ({
        value: tier,
        label: t(`customers.tiers.${tier}`),
      })),
    [t],
  );

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      form.reset(demoAccountFormDefaults);
    }
  };

  const onSubmit = () => {
    toast.success(t("customers.forms.accountSubmitted"));
    setOpen(false);
    form.reset(demoAccountFormDefaults);
  };

  const onInvalid = () => {
    toast.error(t("customers.forms.validationFailed"));
  };

  return (
    <>
      <ActionButton
        onClick={() => setOpen(true)}
        tooltip={t("customers.forms.addAccount")}
      >
        <Plus className="size-7" />
      </ActionButton>
      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetContent side="right" className="flex w-full flex-col sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>{t("customers.forms.addAccountTitle")}</SheetTitle>
            <SheetDescription>
              {t("customers.forms.addAccountDescription")}
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
                name="name"
                label={t("customers.forms.fields.companyName")}
                required
              />
              <FormField
                type="text"
                name="legalSuffix"
                label={t("customers.forms.fields.legalSuffix")}
                required
              />
              <FormField
                type="text"
                name="city"
                label={t("customers.forms.fields.city")}
                required
              />
              <FormField
                type="select"
                name="countryCode"
                label={t("customers.columns.country")}
                options={countryOptions}
                required
              />
              <FormField
                type="select"
                name="region"
                label={t("customers.columns.region")}
                options={regionOptions}
                required
              />
              <FormField
                type="select"
                name="accountTier"
                label={t("customers.columns.tier")}
                options={tierOptions}
                required
              />
              <FormField
                type="text"
                name="vatNumber"
                label={t("customers.columns.vat")}
                className="font-mono text-xs dir-ltr"
                required
              />
              <FormField
                type="text"
                name="phone"
                label={t("customers.forms.fields.phone")}
                className="dir-ltr"
                required
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
