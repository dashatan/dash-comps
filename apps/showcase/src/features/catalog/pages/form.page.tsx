import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/common/buttons";
import { Checkbox } from "@/components/common/inputs/checkbox";
import TextInput from "@/components/common/inputs/text";
import { toast } from "@/components/common/sonner";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";

type DemoFormValues = {
  title: string;
  accept: boolean;
};

export function FormPage() {
  const form = useForm<DemoFormValues>({
    defaultValues: { title: "", accept: false },
  });

  return (
    <CatalogPageShell slug="form">
      <ShowcaseSection
        title="react-hook-form + inputs"
        description="Same primitives used by @/components/compound/form FormField."
        className="w-full max-w-md flex-col items-stretch"
      >
        <form
          className="flex w-full flex-col gap-4"
          onSubmit={form.handleSubmit((values) => toast.success(`Submitted: ${values.title}`))}
        >
          <Controller
            control={form.control}
            name="title"
            rules={{ required: "Title is required" }}
            render={({ field, fieldState }) => (
              <TextInput
                label="Title"
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
                label="I agree"
                checked={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
