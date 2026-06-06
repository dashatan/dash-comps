import { useMemo, type ReactNode } from "react";
import { RotateCcw } from "lucide-react";
import type { FieldErrors, Resolver } from "react-hook-form";
import { useForm } from "react-hook-form";
import { Button } from "@/components/common/buttons";
import type {
  SelectItem,
  TreeSelectItem,
} from "@/components/common/inputs/select/types";
import { Form, FormField } from "@/components/compound/form";
import { FormHistory } from "@/components/compound/form/history";
import type { PlateValue } from "@/components/compound/license-plate/types";
import { showcaseCarouselImages } from "@/features/catalog/data/carousel-samples";
import { useShowcasePage } from "@/features/catalog/i18n";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { DeferredMount } from "@/features/catalog/ui/deferred-mount";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";
import { toast } from "@/components/common/sonner";
import { cn } from "@/lib";

const PRODUCT_KEYS = [
  "watch",
  "headphones",
  "camera",
  "sneaker",
  "chair",
  "plant",
] as const;

type ProductKey = (typeof PRODUCT_KEYS)[number];

type BasicFormValues = {
  title: string;
  accept: boolean;
};

type TextFieldsValues = {
  username: string;
  password: string;
  bio: string;
  phone: string;
};

type NumericFieldsValues = {
  quantity: number;
  weight: { from?: number; to?: number } | undefined;
  priceRange: [number | undefined, number | undefined];
};

type SelectionFieldsValues = {
  product: string | number | undefined;
  categories: (string | number)[];
  department: string | number | undefined;
  tags: (string | number)[];
  shipping: string | number | undefined;
};

type ToggleFieldsValues = {
  newsletter: boolean;
  notifications: boolean;
};

type SpecializedFieldsValues = {
  birthDate: number[];
  verificationCode: string;
  plate: PlateValue | undefined;
};

type ValidationFormValues = {
  email: string;
  password: string;
};

type HistoryFormValues = {
  keyword: string;
  plate: PlateValue | undefined;
  dateRange: number[];
};

type ProductListingValues = {
  title: string;
  product: ProductKey | undefined;
  category: string | number | undefined;
  price: number;
  description: string;
  featured: boolean;
  publish: boolean;
};

type FieldStatesValues = {
  errorField: string;
  successField: string;
  warningField: string;
  disabledField: string;
};

type FormTranslate = ReturnType<typeof useShowcasePage<"form">>;

function ShowcaseRow({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-2", className)}>
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      {children}
    </div>
  );
}

function ProductThumbnail({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={cn("size-8 shrink-0 rounded-md object-cover", className)}
    />
  );
}

function createProductSelectOptions(p: FormTranslate): SelectItem[] {
  return PRODUCT_KEYS.map((key) => ({
    value: key,
    label: p(`products.${key}.title`),
    description: p(`products.${key}.subtitle`),
    icon: (
      <ProductThumbnail
        src={showcaseCarouselImages.product[key]}
        alt={p(`products.${key}.imageAlt`)}
      />
    ),
  }));
}

function createCategoryTreeOptions(p: FormTranslate): TreeSelectItem[] {
  return [
    {
      label: p("selectionFields.groups.electronics"),
      value: "electronics",
      children: [
        {
          label: p("products.watch.title"),
          value: "watch",
          icon: (
            <ProductThumbnail
              src={showcaseCarouselImages.product.watch}
              alt={p("products.watch.imageAlt")}
            />
          ),
        },
        {
          label: p("products.headphones.title"),
          value: "headphones",
          icon: (
            <ProductThumbnail
              src={showcaseCarouselImages.product.headphones}
              alt={p("products.headphones.imageAlt")}
            />
          ),
        },
        {
          label: p("products.camera.title"),
          value: "camera",
          icon: (
            <ProductThumbnail
              src={showcaseCarouselImages.product.camera}
              alt={p("products.camera.imageAlt")}
            />
          ),
        },
      ],
    },
    {
      label: p("selectionFields.groups.lifestyle"),
      value: "lifestyle",
      children: [
        {
          label: p("products.sneaker.title"),
          value: "sneaker",
          icon: (
            <ProductThumbnail
              src={showcaseCarouselImages.product.sneaker}
              alt={p("products.sneaker.imageAlt")}
            />
          ),
        },
        {
          label: p("products.chair.title"),
          value: "chair",
          icon: (
            <ProductThumbnail
              src={showcaseCarouselImages.product.chair}
              alt={p("products.chair.imageAlt")}
            />
          ),
        },
        {
          label: p("products.plant.title"),
          value: "plant",
          icon: (
            <ProductThumbnail
              src={showcaseCarouselImages.product.plant}
              alt={p("products.plant.imageAlt")}
            />
          ),
        },
      ],
    },
  ];
}

function FormActions({
  submitLabel,
  resetLabel,
  onReset,
}: {
  submitLabel: string;
  resetLabel: string;
  onReset: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button type="submit">{submitLabel}</Button>
      <Button type="button" variant="outlined" onClick={onReset}>
        <RotateCcw className="size-4" />
        {resetLabel}
      </Button>
    </div>
  );
}

function createValidationResolver(
  p: FormTranslate,
): Resolver<ValidationFormValues> {
  return async (values) => {
    const errors: FieldErrors<ValidationFormValues> = {};

    if (!values.email.trim()) {
      errors.email = {
        type: "required",
        message: p("validation.emailRequired"),
      };
    }

    if (!values.password || values.password.length < 8) {
      errors.password = {
        type: "minLength",
        message: p("validation.passwordMin"),
      };
    }

    if (Object.keys(errors).length > 0) {
      return { values: {}, errors };
    }

    return { values, errors: {} };
  };
}

export function FormPage() {
  const p = useShowcasePage("form");

  const productOptions = useMemo(() => createProductSelectOptions(p), [p]);
  const categoryTreeOptions = useMemo(() => createCategoryTreeOptions(p), [p]);
  const validationResolver = useMemo(() => createValidationResolver(p), [p]);

  const basicForm = useForm<BasicFormValues>({
    defaultValues: { title: "", accept: false },
  });

  const textForm = useForm<TextFieldsValues>({
    defaultValues: {
      username: p("defaults.username"),
      password: "",
      bio: p("defaults.bio"),
      phone: "09121234567",
    },
  });

  const numericForm = useForm<NumericFieldsValues>({
    defaultValues: {
      quantity: 2,
      weight: undefined,
      priceRange: [50, 500],
    },
  });

  const selectionForm = useForm<SelectionFieldsValues>({
    defaultValues: {
      product: "watch",
      categories: ["watch", "camera"],
      department: "watch",
      tags: ["watch", "plant"],
      shipping: "standard",
    },
  });

  const toggleForm = useForm<ToggleFieldsValues>({
    defaultValues: { newsletter: true, notifications: false },
  });

  const specializedForm = useForm<SpecializedFieldsValues>({
    defaultValues: {
      birthDate: [],
      verificationCode: "",
      plate: undefined,
    },
  });

  const validationForm = useForm<ValidationFormValues>({
    defaultValues: { email: "", password: "" },
    resolver: validationResolver,
  });

  const historyForm = useForm<HistoryFormValues>({
    defaultValues: { keyword: "", plate: undefined, dateRange: [] },
  });

  const productListingForm = useForm<ProductListingValues>({
    defaultValues: {
      title: "",
      product: "watch",
      category: "electronics",
      price: 99,
      description: "",
      featured: false,
      publish: true,
    },
  });

  const fieldStatesForm = useForm<FieldStatesValues>({
    defaultValues: {
      errorField: "",
      successField: p("defaults.validValue"),
      warningField: p("defaults.reviewValue"),
      disabledField: p("defaults.lockedValue"),
    },
  });

  const selectedProduct = productListingForm.watch("product") ?? "watch";
  const selectedProductImage = showcaseCarouselImages.product[selectedProduct];

  const multiCategoryOptions: SelectItem[] = [
    { label: p("selectionFields.categories.accessories"), value: "accessories" },
    { label: p("selectionFields.categories.audio"), value: "audio" },
    { label: p("selectionFields.categories.furniture"), value: "furniture" },
    { label: p("selectionFields.categories.decor"), value: "decor" },
  ];

  const shippingOptions = [
    { name: "standard", label: p("selectionFields.shipping.standard") },
    { name: "express", label: p("selectionFields.shipping.express") },
    { name: "pickup", label: p("selectionFields.shipping.pickup") },
  ] as const;

  const listingCategoryOptions: SelectItem[] = [
    { label: p("selectionFields.groups.electronics"), value: "electronics" },
    { label: p("selectionFields.groups.lifestyle"), value: "lifestyle" },
  ];

  const weightPresets = [
    { label: p("numericFields.presets.light"), value: { from: 0, to: 5 } },
    { label: p("numericFields.presets.medium"), value: { from: 5, to: 20 } },
    { label: p("numericFields.presets.heavy"), value: { from: 20, to: 100 } },
  ];

  return (
    <CatalogPageShell slug="form">
      <ShowcaseSection
        title={p("basicUsage.title")}
        description={p("basicUsage.description")}
        layout="stack"
      >
        <Form
          form={basicForm}
          className="flex w-full flex-col gap-4"
          onSubmit={(values) =>
            toast.success(
              p("basicUsage.submittedToast", { title: values.title }),
            )
          }
        >
          <FormField
            type="text"
            name="title"
            label={p("basicUsage.titleLabel")}
            required
          />
          <FormField
            type="checkbox"
            name="accept"
            label={p("basicUsage.agreeLabel")}
          />
          <FormActions
            submitLabel={p("actions.submit")}
            resetLabel={p("actions.reset")}
            onReset={() => basicForm.reset()}
          />
        </Form>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("textFields.title")}
        description={p("textFields.description")}
        layout="stack"
      >
        <Form
          form={textForm}
          className="grid w-full gap-4 md:grid-cols-2"
          onSubmit={() => toast.success(p("textFields.submittedToast"))}
        >
          <FormField
            type="text"
            name="username"
            label={p("textFields.username")}
            required
          />
          <FormField
            type="password"
            name="password"
            label={p("textFields.password")}
          />
          <FormField
            type="phone"
            name="phone"
            label={p("textFields.phone")}
            className="md:col-span-2"
          />
          <FormField
            type="textarea"
            name="bio"
            label={p("textFields.bio")}
            className="md:col-span-2"
          />
          <div className="md:col-span-2">
            <FormActions
              submitLabel={p("actions.submit")}
              resetLabel={p("actions.reset")}
              onReset={() => textForm.reset()}
            />
          </div>
        </Form>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("numericFields.title")}
        description={p("numericFields.description")}
        layout="stack"
      >
        <Form
          form={numericForm}
          className="grid w-full gap-4 md:grid-cols-3"
          onSubmit={() => toast.success(p("numericFields.submittedToast"))}
        >
          <FormField
            type="number"
            name="quantity"
            label={p("numericFields.quantity")}
            min={0}
            max={999}
          />
          <FormField
            type="weight"
            name="weight"
            label={p("numericFields.weight")}
            presets={weightPresets}
            unit="kg"
          />
          <FormField
            type="number-range"
            name="priceRange"
            label={p("numericFields.priceRange")}
            min={0}
            max={10000}
          />
          <div className="md:col-span-3">
            <FormActions
              submitLabel={p("actions.submit")}
              resetLabel={p("actions.reset")}
              onReset={() => numericForm.reset()}
            />
          </div>
        </Form>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("selectionFields.title")}
        description={p("selectionFields.description")}
        layout="stack"
      >
        <DeferredMount minHeight={420}>
          <Form
            form={selectionForm}
            className="grid w-full gap-4 lg:grid-cols-2"
            onSubmit={() => toast.success(p("selectionFields.submittedToast"))}
          >
            <FormField
              type="select"
              name="product"
              label={p("selectionFields.product")}
              options={productOptions}
            />
            <FormField
              type="multi"
              name="categories"
              label={p("selectionFields.categoriesLabel")}
              options={multiCategoryOptions}
            />
            <FormField
              type="tree-single"
              name="department"
              label={p("selectionFields.department")}
              options={categoryTreeOptions}
            />
            <FormField
              type="tree"
              name="tags"
              label={p("selectionFields.tags")}
              options={categoryTreeOptions}
            />
            <FormField
              type="radio"
              name="shipping"
              label={p("selectionFields.shippingLabel")}
              options={shippingOptions}
              direction="horizontal"
              className="lg:col-span-2"
            />
            <div className="lg:col-span-2">
              <FormActions
                submitLabel={p("actions.submit")}
                resetLabel={p("actions.reset")}
                onReset={() => selectionForm.reset()}
              />
            </div>
          </Form>
        </DeferredMount>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("toggleFields.title")}
        description={p("toggleFields.description")}
        layout="stack"
      >
        <Form
          form={toggleForm}
          className="flex w-full flex-col gap-4"
          onSubmit={() => toast.success(p("toggleFields.submittedToast"))}
        >
          <FormField
            type="checkbox"
            name="newsletter"
            label={p("toggleFields.newsletter")}
          />
          <FormField
            type="switch"
            name="notifications"
            label={p("toggleFields.notifications")}
            severity="success"
          />
          <FormActions
            submitLabel={p("actions.submit")}
            resetLabel={p("actions.reset")}
            onReset={() => toggleForm.reset()}
          />
        </Form>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("specializedFields.title")}
        description={p("specializedFields.description")}
        layout="stack"
      >
        <DeferredMount minHeight={360}>
          <Form
            form={specializedForm}
            className="grid w-full gap-4 lg:grid-cols-3"
            onSubmit={() => toast.success(p("specializedFields.submittedToast"))}
          >
            <FormField
              type="date"
              name="birthDate"
              label={p("specializedFields.birthDate")}
            />
            <FormField
              type="otp"
              name="verificationCode"
              label={p("specializedFields.verificationCode")}
              length={6}
              numericOnly
            />
            <FormField
              type="plate"
              name="plate"
              variant="car"
              label={p("specializedFields.plate")}
            />
            <div className="lg:col-span-3">
              <FormActions
                submitLabel={p("actions.submit")}
                resetLabel={p("actions.reset")}
                onReset={() => specializedForm.reset()}
              />
            </div>
          </Form>
        </DeferredMount>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("fieldStates.title")}
        description={p("fieldStates.description")}
        layout="stack"
      >
        <Form
          form={fieldStatesForm}
          className="grid w-full gap-4 md:grid-cols-2 xl:grid-cols-4"
          onSubmit={() => undefined}
        >
          <FormField
            type="text"
            name="errorField"
            label={p("fieldStates.error")}
            status="error"
            message={p("fieldStates.errorMessage")}
          />
          <FormField
            type="text"
            name="successField"
            label={p("fieldStates.success")}
            status="success"
            message={p("fieldStates.successMessage")}
          />
          <FormField
            type="text"
            name="warningField"
            label={p("fieldStates.warning")}
            status="warning"
            message={p("fieldStates.warningMessage")}
          />
          <FormField
            type="text"
            name="disabledField"
            label={p("fieldStates.disabled")}
            disabled
          />
        </Form>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("validation.title")}
        description={p("validation.description")}
        layout="stack"
      >
        <div className="grid w-full gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <Form
            form={validationForm}
            className="flex w-full flex-col gap-4"
            onSubmit={() => toast.success(p("validation.successToast"))}
            onInvalid={() => toast.error(p("validation.invalidToast"))}
          >
            <FormField
              type="text"
              name="email"
              label={p("validation.email")}
              required
            />
            <FormField
              type="password"
              name="password"
              label={p("validation.password")}
              required
            />
            <FormActions
              submitLabel={p("actions.submit")}
              resetLabel={p("actions.reset")}
              onReset={() => validationForm.reset()}
            />
          </Form>
          <div className="relative min-h-48 overflow-hidden rounded-xl border border-border">
            <img
              src={showcaseCarouselImages.hero.workspace}
              alt={p("validation.imageAlt")}
              className="absolute inset-0 size-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-linear-to-t from-background/90 via-background/40 to-transparent" />
            <div className="relative flex h-full flex-col justify-end p-6">
              <p className="text-sm font-medium">{p("validation.imageCaption")}</p>
              <p className="text-muted-foreground mt-1 text-sm">
                {p("validation.imageHint")}
              </p>
            </div>
          </div>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("formHistory.title")}
        description={p("formHistory.description")}
        layout="stack"
      >
        <DeferredMount minHeight={480}>
          <Form
            form={historyForm}
            className="grid w-full gap-4 lg:grid-cols-3"
            onSubmit={() => toast.success(p("formHistory.submittedToast"))}
          >
            <FormField
              type="text"
              name="keyword"
              label={p("formHistory.keyword")}
            />
            <FormField
              type="plate"
              name="plate"
              variant="car"
              label={p("formHistory.plate")}
            />
            <FormField
              type="date"
              name="dateRange"
              label={p("formHistory.dateRange")}
              range
            />
            <div className="lg:col-span-3">
              <FormActions
                submitLabel={p("actions.search")}
                resetLabel={p("actions.reset")}
                onReset={() => historyForm.reset()}
              />
            </div>
          </Form>
          <FormHistory
            form={historyForm}
            storageKey="showcase-form-history"
            columns={[
              {
                field: "keyword",
                type: "string",
                label: p("formHistory.columns.keyword"),
              },
              {
                field: "plate",
                type: "plate",
                label: p("formHistory.columns.plate"),
              },
              {
                field: "dateRange",
                type: "dateRange",
                label: p("formHistory.columns.dateRange"),
              },
            ]}
          />
        </DeferredMount>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("productListing.title")}
        description={p("productListing.description")}
        layout="stack"
      >
        <div className="grid w-full gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <div className="relative min-h-72 overflow-hidden rounded-xl border border-border">
            <img
              src={selectedProductImage}
              alt={p(`products.${selectedProduct}.imageAlt`)}
              className="absolute inset-0 size-full object-cover transition-opacity duration-300"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-linear-to-t from-background/95 via-background/20 to-transparent" />
            <div className="relative flex h-full flex-col justify-end p-6">
              <p className="text-xs font-medium tracking-wide text-primary uppercase">
                {p("productListing.previewLabel")}
              </p>
              <p className="mt-1 text-xl font-semibold">
                {p(`products.${selectedProduct}.title`)}
              </p>
              <p className="text-muted-foreground mt-1 text-sm">
                {p(`products.${selectedProduct}.description`)}
              </p>
            </div>
          </div>

          <Form
            form={productListingForm}
            className="flex w-full flex-col gap-4"
            onSubmit={(values) =>
              toast.success(
                p("productListing.successToast", {
                  title: values.title || p(`products.${values.product ?? "watch"}.title`),
                }),
              )
            }
          >
            <FormField
              type="text"
              name="title"
              label={p("productListing.titleField")}
              required
            />
            <FormField
              type="select"
              name="product"
              label={p("productListing.product")}
              options={productOptions}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                type="select"
                name="category"
                label={p("productListing.category")}
                options={listingCategoryOptions}
              />
              <FormField
                type="number"
                name="price"
                label={p("productListing.price")}
                min={0}
              />
            </div>
            <FormField
              type="textarea"
              name="description"
              label={p("productListing.descriptionField")}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                type="switch"
                name="featured"
                label={p("productListing.featured")}
                severity="warning"
              />
              <FormField
                type="checkbox"
                name="publish"
                label={p("productListing.publish")}
              />
            </div>
            <FormActions
              submitLabel={p("productListing.submit")}
              resetLabel={p("actions.reset")}
              onReset={() => productListingForm.reset()}
            />
          </Form>
        </div>

        <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCT_KEYS.map((key) => (
            <ShowcaseRow key={key} label={p(`products.${key}.title`)}>
              <button
                type="button"
                onClick={() =>
                  productListingForm.setValue("product", key, {
                    shouldDirty: true,
                  })
                }
                className="group relative overflow-hidden rounded-xl border border-border text-left transition hover:border-primary/40"
              >
                <img
                  src={showcaseCarouselImages.product[key]}
                  alt={p(`products.${key}.imageAlt`)}
                  className="aspect-4/3 w-full object-cover transition group-hover:scale-[1.02]"
                  loading="lazy"
                />
                <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-background/95 to-transparent p-3">
                  <p className="text-sm font-medium">{p(`products.${key}.title`)}</p>
                  <p className="text-muted-foreground text-xs">
                    {p(`products.${key}.subtitle`)}
                  </p>
                </div>
              </button>
            </ShowcaseRow>
          ))}
        </div>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
