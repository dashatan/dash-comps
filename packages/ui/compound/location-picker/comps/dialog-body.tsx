"use client";

import { memo, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { cn, useLanguage } from "@/lib";
import Loading from "@/components/common/loading";
import Skeleton from "@/components/common/skeleton";
import Tabs from "@/components/common/tabs/tab";
import FilterSidebar from "@/components/compound/location-picker/sidebars/filter";
import RoutingSidebar from "@/components/compound/location-picker/sidebars/routing";
import {
  LocationPickerStoreProvider,
  useLocationPickerStore,
} from "@/components/compound/location-picker/context";
import {
  LocationPickerCommitPayload,
  LocationPickerDateHint,
  LocationPickerFilters,
  LocationPickerRoutingState,
} from "@/components/compound/location-picker/types";

const FilterMap = dynamic(
  () => import("@/components/compound/location-picker/maps/filter"),
  { loading: () => <Skeleton className="size-full flex-1" />, ssr: false },
);
const RoutingMap = dynamic(
  () => import("@/components/compound/location-picker/maps/routing"),
  { loading: () => <Skeleton className="size-full flex-1" />, ssr: false },
);

type DialogBodyProps = {
  initialFilters: LocationPickerFilters;
  initialRouting?: LocationPickerRoutingState;
  dateHint?: LocationPickerDateHint;
  onCommit: (payload: LocationPickerCommitPayload) => void;
  onClose: () => void;
  contentClassName?: string;
};

function DialogInner({
  dateHint,
  onCommit,
  onClose,
  contentClassName,
}: Pick<
  DialogBodyProps,
  "dateHint" | "onCommit" | "onClose" | "contentClassName"
>) {
  const { t } = useLanguage();
  const { routing, commit } = useLocationPickerStore();
  const [activeTab, setActiveTab] = useState(0);
  const tabs = useMemo(
    () => [
      { content: t("locationPicker.tabSelectFromMap") },
      { content: t("locationPicker.tabRoutingFromMap") },
    ],
    [t],
  );

  function handleConfirm() {
    onCommit(commit());
    onClose();
  }

  return (
    <div className={cn("relative flex size-full flex-full", contentClassName)}>
      {activeTab === 1 && routing.isLoading && (
        <div
          className="absolute top-0 left-0 z-5 flex h-full w-full items-center justify-center"
          style={{ backgroundColor: "rgba(128, 128, 128, 0.3)" }}
        >
          <Loading
            className="scale-75"
            label={t("locationPicker.loadingRoutes")}
            mode="inline"
          />
        </div>
      )}
      <div
        className={cn("flex h-full w-92 flex-col rounded-br-lg border bg-card")}
      >
        <Tabs
          tabs={tabs}
          onChange={setActiveTab}
          activeTab={activeTab}
          className={{ container: "justify-center gap-1" }}
        />
        {activeTab === 0 && (
          <FilterSidebar dateHint={dateHint} onConfirm={handleConfirm} />
        )}
        {activeTab === 1 && <RoutingSidebar onConfirm={handleConfirm} />}
      </div>
      <div className="size-full flex-1">
        {activeTab === 1 ? <RoutingMap /> : <FilterMap />}
      </div>
    </div>
  );
}

function LocationPickerDialogBodyComponent(props: DialogBodyProps) {
  const { initialFilters, initialRouting, ...inner } = props;
  return (
    <LocationPickerStoreProvider
      initialFilters={initialFilters}
      initialRouting={initialRouting}
    >
      <DialogInner {...inner} />
    </LocationPickerStoreProvider>
  );
}

export const LocationPickerDialogBody = memo(LocationPickerDialogBodyComponent);
