import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { FormProvider, useForm } from "react-hook-form";
import { LocationPickerDialogBody } from "@/components/compound/location-picker/comps/dialog-body";
import { LocationPickerCore } from "@/components/compound/location-picker";
import LocationPicker from "@/components/compound/location-picker";
import type {
  LocationPickerCommitPayload,
  LocationPickerFilters,
} from "@/components/compound/location-picker/types";
import {
  COMMITTED_SAMPLE,
  DATE_HINT_SAMPLE,
  DEVICES_FILTERS,
  DIALOG_PREVIEW_CONFIGS,
  EMPTY_FILTERS,
  FILTER_SELECTED,
  PROVINCES_FILTERS,
  ROADS_FILTERS,
  SOURCES_FILTERS,
  showcaseLocationPickerImages,
  type DialogPreviewKey,
  type ShowcaseLocationPickerImageKey,
} from "@/features/catalog/data/location-picker-samples";
import { useShowcasePage } from "@/features/catalog/i18n";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";
import { appStore } from "@/store";
import { cn } from "@/lib";

const MAP_ENV = {
  MAP_TILE_LIGHT: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  MAP_TILE_DARK:
    "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  NOMINATIM_URL: "https://nominatim.openstreetmap.org/search",
  OSRM_URL: "https://router.project-osrm.org",
} as const;

const TRIGGER_WIDTH = 360;

type FormValues = {
  filters: LocationPickerFilters;
  routing: LocationPickerCommitPayload["routing"];
};

function ShowcaseRow({
  label,
  description,
  children,
  className,
}: {
  label: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-2", className)}>
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      {description ? (
        <p className="text-xs text-muted-foreground/80">{description}</p>
      ) : null}
      {children}
    </div>
  );
}

function StateImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-xl border border-border bg-muted/10",
        className,
      )}
    >
      <img
        src={src}
        alt={alt}
        className="aspect-video w-full object-cover object-top"
        loading="lazy"
      />
    </div>
  );
}

function CommitPreview({ payload }: { payload: LocationPickerCommitPayload }) {
  return (
    <pre className="w-full overflow-x-auto rounded-lg border border-border bg-muted/50 p-3 text-xs">
      {JSON.stringify(payload, null, 2)}
    </pre>
  );
}

function PickerDemo({
  committed,
  label,
  width = TRIGGER_WIDTH,
  dateHint,
  labelContainerProps,
  onCommit,
}: {
  committed: LocationPickerFilters;
  label?: string;
  width?: number;
  dateHint?: typeof DATE_HINT_SAMPLE;
  labelContainerProps?: React.ComponentProps<
    typeof LocationPickerCore
  >["labelContainerProps"];
  onCommit?: (payload: LocationPickerCommitPayload) => void;
}) {
  const [filters, setFilters] = useState(committed);

  useEffect(() => {
    setFilters(committed);
  }, [committed]);

  const handleCommit = useCallback(
    (payload: LocationPickerCommitPayload) => {
      setFilters(payload.filters);
      onCommit?.(payload);
    },
    [onCommit],
  );

  return (
    <LocationPickerCore
      committed={filters}
      onCommit={handleCommit}
      onCommittedChange={setFilters}
      label={label}
      width={width}
      dateHint={dateHint}
      labelContainerProps={labelContainerProps}
    />
  );
}

function DialogPreviewPanel({
  previewKey,
  onPreviewKeyChange,
  labels,
}: {
  previewKey: DialogPreviewKey;
  onPreviewKeyChange: (key: DialogPreviewKey) => void;
  labels: Record<DialogPreviewKey, string>;
}) {
  const config = useMemo(
    () => DIALOG_PREVIEW_CONFIGS.find((item) => item.key === previewKey),
    [previewKey],
  );

  const [lastCommit, setLastCommit] =
    useState<LocationPickerCommitPayload | null>(null);

  if (!config) return null;

  return (
    <div className="flex w-full min-w-0 flex-col gap-4">
      <div className="flex w-full flex-wrap gap-2">
        {DIALOG_PREVIEW_CONFIGS.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => onPreviewKeyChange(item.key)}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-xs font-medium transition",
              previewKey === item.key
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-muted/20 text-muted-foreground hover:bg-muted/40",
            )}
          >
            {labels[item.key]}
          </button>
        ))}
      </div>
      <div className="h-[32rem] w-full overflow-hidden rounded-xl border border-border">
        <LocationPickerDialogBody
          key={previewKey}
          initialFilters={config.initialFilters}
          initialRouting={config.initialRouting}
          dateHint={config.dateHint}
          onCommit={setLastCommit}
          onClose={() => undefined}
        />
      </div>
      {lastCommit ? (
        <div className="flex min-w-0 flex-col gap-2">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Last commit
          </p>
          <CommitPreview payload={lastCommit} />
        </div>
      ) : null}
    </div>
  );
}

export function LocationPickerPage() {
  const p = useShowcasePage("location-picker");
  const [playgroundCommit, setPlaygroundCommit] =
    useState<LocationPickerCommitPayload | null>(null);
  const [previewKey, setPreviewKey] = useState<DialogPreviewKey>("filterEmpty");

  const form = useForm<FormValues>({
    defaultValues: { filters: FILTER_SELECTED, routing: {} },
  });

  const formFilters = form.watch("filters");
  const formRouting = form.watch("routing");

  useEffect(() => {
    appStore.getState().setEnv(MAP_ENV);
  }, []);

  const dialogPreviewLabels = useMemo(
    () => ({
      filterEmpty: p("dialogPreview.filterEmpty"),
      filterSelected: p("dialogPreview.filterSelected"),
      dateHint: p("dialogPreview.dateHint"),
      routingOrigin: p("dialogPreview.routingOrigin"),
      routingDestination: p("dialogPreview.routingDestination"),
      routingRoutes: p("dialogPreview.routingRoutes"),
      routingLoading: p("dialogPreview.routingLoading"),
    }),
    [p],
  );

  const triggerGallery = useMemo(
    () =>
      [
        {
          key: "triggerEmpty" as const,
          label: p("trigger.empty"),
          image: showcaseLocationPickerImages.triggerEmpty,
          committed: EMPTY_FILTERS,
        },
        {
          key: "triggerDevices" as const,
          label: p("trigger.devices"),
          image: showcaseLocationPickerImages.triggerDevices,
          committed: DEVICES_FILTERS,
        },
        {
          key: "triggerProvinces" as const,
          label: p("trigger.provinces"),
          image: showcaseLocationPickerImages.triggerProvinces,
          committed: PROVINCES_FILTERS,
        },
      ] satisfies Array<{
        key: ShowcaseLocationPickerImageKey;
        label: string;
        image: string;
        committed: LocationPickerFilters;
      }>,
    [p],
  );

  const dialogGallery = useMemo(
    () =>
      [
        {
          key: "filterMap",
          label: p("dialogGallery.filterMap"),
          image: showcaseLocationPickerImages.filterMap,
        },
        {
          key: "filterSelected",
          label: p("dialogGallery.filterSelected"),
          image: showcaseLocationPickerImages.filterSelected,
        },
        {
          key: "dateHint",
          label: p("dialogGallery.dateHint"),
          image: showcaseLocationPickerImages.dateHint,
        },
        {
          key: "routingOrigin",
          label: p("dialogGallery.routingOrigin"),
          image: showcaseLocationPickerImages.routingOrigin,
        },
        {
          key: "routingRoutes",
          label: p("dialogGallery.routingRoutes"),
          image: showcaseLocationPickerImages.routingRoutes,
        },
        {
          key: "routingLoading",
          label: p("dialogGallery.routingLoading"),
          image: showcaseLocationPickerImages.routingLoading,
        },
      ] satisfies Array<{
        key: ShowcaseLocationPickerImageKey;
        label: string;
        image: string;
      }>,
    [p],
  );

  return (
    <CatalogPageShell slug="location-picker">
      <ShowcaseSection
        title={p("interactive.title")}
        description={p("interactive.description")}
        layout="stack"
      >
        <div className="grid w-full gap-6 lg:grid-cols-2">
          <ShowcaseRow label={p("interactive.label")}>
            <PickerDemo
              committed={EMPTY_FILTERS}
              label={p("interactive.fieldLabel")}
              onCommit={setPlaygroundCommit}
            />
          </ShowcaseRow>
          <ShowcaseRow label={p("interactive.output")}>
            <CommitPreview
              payload={
                playgroundCommit ?? { filters: EMPTY_FILTERS, routing: {} }
              }
            />
          </ShowcaseRow>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("trigger.title")}
        description={p("trigger.description")}
        delay={0.05}
        layout="stack"
      >
        <div className="grid w-full gap-6 lg:grid-cols-2">
          <ShowcaseRow label={p("trigger.empty")}>
            <PickerDemo committed={EMPTY_FILTERS} />
          </ShowcaseRow>
          <ShowcaseRow label={p("trigger.sources")}>
            <PickerDemo committed={SOURCES_FILTERS} />
          </ShowcaseRow>
          <ShowcaseRow label={p("trigger.provinces")}>
            <PickerDemo committed={PROVINCES_FILTERS} />
          </ShowcaseRow>
          <ShowcaseRow label={p("trigger.roads")}>
            <PickerDemo committed={ROADS_FILTERS} />
          </ShowcaseRow>
          <ShowcaseRow label={p("trigger.devices")}>
            <PickerDemo committed={DEVICES_FILTERS} />
          </ShowcaseRow>
          <ShowcaseRow label={p("trigger.prefilled")}>
            <PickerDemo committed={FILTER_SELECTED} />
          </ShowcaseRow>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("triggerGallery.title")}
        description={p("triggerGallery.description")}
        delay={0.1}
        layout="stack"
      >
        <div className="grid w-full gap-6 md:grid-cols-2 xl:grid-cols-3">
          {triggerGallery.map((item) => (
            <ShowcaseRow key={item.key} label={item.label}>
              <StateImage src={item.image} alt={item.label} />
              <PickerDemo committed={item.committed} />
            </ShowcaseRow>
          ))}
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("triggerProps.title")}
        description={p("triggerProps.description")}
        delay={0.15}
        layout="stack"
      >
        <div className="grid w-full gap-6 md:grid-cols-2">
          <ShowcaseRow label={p("triggerProps.withLabel")}>
            <PickerDemo
              committed={DEVICES_FILTERS}
              label={p("triggerProps.fieldLabel")}
            />
          </ShowcaseRow>
          <ShowcaseRow label={p("triggerProps.customWidth")}>
            <PickerDemo committed={PROVINCES_FILTERS} width={480} />
          </ShowcaseRow>
          <ShowcaseRow label={p("triggerProps.required")}>
            <PickerDemo
              committed={EMPTY_FILTERS}
              label={p("triggerProps.fieldLabel")}
              labelContainerProps={{ required: true }}
            />
          </ShowcaseRow>
          <ShowcaseRow label={p("triggerProps.helperText")}>
            <PickerDemo
              committed={ROADS_FILTERS}
              label={p("triggerProps.fieldLabel")}
              labelContainerProps={{
                helperText: p("triggerProps.helperHint"),
              }}
            />
          </ShowcaseRow>
          <ShowcaseRow
            label={p("triggerProps.dateHint")}
            description={p("triggerProps.dateHintDescription")}
            className="md:col-span-2"
          >
            <PickerDemo
              committed={FILTER_SELECTED}
              label={p("triggerProps.fieldLabel")}
              dateHint={DATE_HINT_SAMPLE}
            />
          </ShowcaseRow>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("dialogGallery.title")}
        description={p("dialogGallery.description")}
        delay={0.2}
        layout="stack"
      >
        <div className="grid w-full gap-6 md:grid-cols-2">
          {dialogGallery.map((item) => (
            <ShowcaseRow key={item.key} label={item.label}>
              <StateImage src={item.image} alt={item.label} />
            </ShowcaseRow>
          ))}
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("dialogPreview.title")}
        description={p("dialogPreview.description")}
        delay={0.25}
        layout="stack"
      >
        <DialogPreviewPanel
          previewKey={previewKey}
          onPreviewKeyChange={setPreviewKey}
          labels={dialogPreviewLabels}
        />
      </ShowcaseSection>

      <ShowcaseSection
        title={p("formIntegration.title")}
        description={p("formIntegration.description")}
        delay={0.3}
        layout="stack"
      >
        <div className="grid w-full gap-6 lg:grid-cols-2">
          <ShowcaseRow label={p("formIntegration.field")}>
            <FormProvider {...form}>
              <LocationPicker<FormValues>
                name="filters"
                routingName="routing"
                label={p("formIntegration.fieldLabel")}
                width={TRIGGER_WIDTH}
                dateHint={DATE_HINT_SAMPLE}
              />
            </FormProvider>
          </ShowcaseRow>
          <ShowcaseRow label={p("formIntegration.output")}>
            <pre className="w-full overflow-x-auto rounded-lg border border-border bg-muted/50 p-3 text-xs">
              {JSON.stringify(
                { filters: formFilters, routing: formRouting },
                null,
                2,
              )}
            </pre>
          </ShowcaseRow>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("commitPayload.title")}
        description={p("commitPayload.description")}
        delay={0.35}
        layout="stack"
      >
        <CommitPreview payload={COMMITTED_SAMPLE} />
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
