import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/common/buttons";
import { Checkbox } from "@/components/common/inputs/checkbox";
import TextInput from "@/components/common/inputs/text";
import { toast } from "@/components/common/sonner";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";
import { useShowcasePage } from "@/features/catalog/i18n";

type DemoFormValues = {
  title: string;
  accept: boolean;
};

export function FormPage() {
  const p = useShowcasePage("form");
  const form = useForm<DemoFormValues>({
    defaultValues: { title: "", accept: false },
  });

  return (
    <CatalogPageShell slug="form">
      <ShowcaseSection
        title={p("reactHookForm.title")}
        description={p("reactHookForm.description")}
        className="w-full max-w-md flex-col items-stretch"
      >
        <form
          className="flex w-full flex-col gap-4"
          onSubmit={form.handleSubmit((values) =>
            toast.success(p("reactHookForm.submittedToast", { title: values.title })),
          )}
        >
          <Controller
            control={form.control}
            name="title"
            rules={{ required: p("reactHookForm.titleRequired") }}
            render={({ field, fieldState }) => (
              <TextInput
                label={p("reactHookForm.titleLabel")}
                value={field.value}
                onChange={field.onChange}
                status={fieldState.error ? "error" : undefined}
                message={fieldState.error?.message}
              />
            )}
          />
          <Controller
            control={form.control}
            name="accept"
            render={({ field }) => (
              <Checkbox.Basic
                label={p("reactHookForm.agreeLabel")}
                checked={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <Button type="submit">{p("reactHookForm.submit")}</Button>
        </form>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
