"use client";

import { memo, type ReactNode } from "react";
import { ArrowLeft, Clock, Routing, Video } from "iconsax-reactjs";
import { cn, useLanguage } from "@/lib";
import Chip from "@/components/common/chips/chip";
import { Divider } from "@/components/common/divider";
import TextInput from "@/components/common/inputs/text";
import Button from "@/components/common/buttons";
import { useLocationPickerStore } from "@/components/compound/location-picker/context";

export type RoutingSidebarProps = {
  onConfirm: () => void;
};

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  if (minutes === 0) return `${remainder}s`;
  return `${minutes}m ${remainder}s`;
}

function RouteMetric({
  value,
  prefix,
  className,
}: {
  value?: number;
  prefix?: ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("dir-ltr inline-flex items-center gap-1", className)}>
      {prefix ? <span>{prefix}</span> : null}
      <span>{(value ?? 0).toLocaleString()}</span>
    </span>
  );
}

function RoutingSidebarComponent({ onConfirm }: RoutingSidebarProps) {
  const { t } = useLanguage();
  const { routing, setRouting, setDraftField } = useLocationPickerStore();
  const ol = routing.originLatLng;
  const dl = routing.destinationLatLng;
  const addingOrigin = routing.addingOrigin;
  const addingDestination = routing.addingDestination;
  const routes = routing.routes;
  const selectedRoute = routing.selectedRoute;

  function getOrigin() {
    setRouting({
      addingOrigin: !addingOrigin,
      addingDestination: false,
    });
  }

  function getDestination() {
    setRouting({
      addingDestination: !addingDestination,
      addingOrigin: false,
    });
  }

  return (
    <div className="flex h-full flex-1 flex-col">
      <div className="flex w-full flex-col overflow-auto p-2">
        <div className="flex flex-1 gap-1">
          <div className="flex flex-1 flex-col gap-4 pe-4">
            <div className="flex items-center gap-2">
              <div className="border-warning flex size-5 min-w-5 items-center justify-center rounded-full border-2">
                {addingOrigin && (
                  <div className="bg-warning size-2 min-h-2 min-w-2 rounded-full" />
                )}
              </div>
              <div className="w-full cursor-pointer" onClick={getOrigin}>
                <TextInput
                  label={t("common.selectOrigin")}
                  value={ol?.map((coord: number) => coord.toFixed(2)).join(" , ")}
                  disabled
                  className="pointer-events-none cursor-pointer text-sm font-semibold"
                  status={addingOrigin ? "warning" : undefined}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="border-primary flex size-5 min-w-5 items-center justify-center rounded-lg border-2">
                {addingDestination && (
                  <div className="bg-primary size-2 min-h-2 min-w-2 rounded-full" />
                )}
              </div>
              <div className="w-full cursor-pointer" onClick={getDestination}>
                <TextInput
                  label={t("common.selectDestination")}
                  value={dl?.map((coord: number) => coord.toFixed(2)).join(" , ")}
                  disabled
                  className="pointer-events-none cursor-pointer text-sm font-semibold"
                  status={addingDestination ? "primary" : undefined}
                />
              </div>
            </div>
          </div>
        </div>
        <Divider />
        <div className="flex flex-col gap-4">
          {routes?.map(
            ({
              distance,
              duration,
              index,
              title,
              destinationName,
              originName,
              devices,
            }) => (
              <div
                key={index}
                className={cn(
                  "hover:bg-primary/10 bg-card flex cursor-pointer gap-4 rounded-lg border px-4 py-2 transition-all",
                  {
                    "border-primary/50 bg-primary/10 hover:bg-primary/20":
                      selectedRoute === index,
                  },
                )}
                onClick={() => {
                  const isSelected = selectedRoute === index;
                  setRouting({
                    selectedRoute: isSelected ? undefined : index,
                  });
                  setDraftField("devices", isSelected ? undefined : devices);
                }}
              >
                <div className="flex flex-col gap-3">
                  <div className="text-foreground flex items-center gap-2 text-sm font-semibold">
                    <div>{title}</div>
                  </div>
                  <div className="text-foreground/80 flex flex-wrap items-center gap-2 text-xs font-semibold text-nowrap">
                    <Chip label={originName} />
                    <ArrowLeft size={20} />
                    <Chip label={destinationName} />
                  </div>
                  <div className="text-foreground/50 mt-4 flex items-center gap-3 text-xs font-semibold">
                    <div className="flex items-center">
                      <Routing size={21} />
                      <RouteMetric
                        className="mt-px"
                        value={distance < 1000 ? distance : distance / 1000}
                        prefix={
                          distance < 1000
                            ? t("locationPicker.meter")
                            : t("locationPicker.kilometer")
                        }
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={17} />
                      <span className="mt-1">{formatDuration(duration)}</span>
                    </div>
                    <div className="flex items-center">
                      <Video size={22} />
                      <RouteMetric
                        className="mt-px"
                        value={devices?.length}
                        prefix={t("common.device")}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ),
          )}
        </div>
      </div>
      <div className="sticky bottom-0 left-0 mt-auto flex h-14 w-full items-center px-4">
        <Button label={t("common.ok")} className="w-32" onClick={onConfirm} />
      </div>
    </div>
  );
}

export default memo(RoutingSidebarComponent);
