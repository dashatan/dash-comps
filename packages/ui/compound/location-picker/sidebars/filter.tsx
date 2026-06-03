"use client";

import { memo } from "react";
import { Info } from "lucide-react";
import useResources from "@/features/resources/utils/useResources";
import { formatPersianDate, formatPersianTime, useLanguage } from "@/lib";
import Button from "@/components/common/buttons";
import { Select } from "@/components/common/inputs/select";
import { useLocationPickerStore } from "@/components/compound/location-picker/context";
import { LocationPickerDateHint } from "@/components/compound/location-picker/types";

const EMPTY_SELECTION: number[] = [];

export type FilterSidebarProps = {
  dateHint?: LocationPickerDateHint;
  onConfirm: () => void;
};

function FilterSidebarComponent({ dateHint, onConfirm }: FilterSidebarProps) {
  const { t } = useLanguage();
  const { draft, filteredData, setDraftField } = useLocationPickerStore();
  const { provinces, roads, devices } = filteredData;
  const { sourcesNested } = useResources();
  const { date, deviceDateRange } = dateHint ?? {};

  return (
    <div className="flex-full flex flex-col">
      <div className="flex-full w-full overflow-auto p-4">
        <div className="flex flex-col gap-6">
          <Select.MultiTree
            label={t("plate.searchSources")}
            options={sourcesNested || []}
            loading={!sourcesNested}
            selected={draft.sources ?? EMPTY_SELECTION}
            onChange={(value) => setDraftField("sources", value as number[])}
            filter
          />
          <Select.Multi
            label={t("locationPicker.selectProvinces")}
            options={provinces?.map((x) => ({ label: x.name, value: x.id })) || []}
            loading={!provinces}
            value={draft.provinces ?? EMPTY_SELECTION}
            onChange={(value) => setDraftField("provinces", value as number[])}
            filter
          />
          <Select.Multi
            label={t("locationPicker.selectRoads")}
            options={roads?.map((x) => ({ label: x.name, value: x.id })) || []}
            loading={!roads}
            value={draft.roads ?? EMPTY_SELECTION}
            onChange={(value) => setDraftField("roads", value as number[])}
            filter
          />
          <Select.Multi
            label={t("locationPicker.selectDevices")}
            options={devices?.map((x) => ({ label: x.name, value: x.id })) || []}
            loading={!devices}
            value={draft.devices ?? EMPTY_SELECTION}
            onChange={(value) => setDraftField("devices", value as number[])}
            filter
          />
        </div>
      </div>

      {deviceDateRange === "custom" && date && (
        <div className="mt-4 flex items-start gap-1 px-4">
          <Info className="text-error -mt-1 scale-[0.8]" />
          <div className="flex flex-wrap items-center gap-1 text-xs whitespace-nowrap">
            {t("locationPicker.camerasFromDate")}
            <div className="text-primary">
              <span>{formatPersianDate(date[0])}</span>
              {t("common.time")}
              <span>{formatPersianTime(date[0])}</span>
            </div>
            {t("common.to")}
            <div className="text-primary">
              <span>{formatPersianDate(date[1])}</span>
              {t("common.time")}
              <span>{formatPersianTime(date[1])}</span>
            </div>
            {t("locationPicker.registeredTraffic")}
          </div>
        </div>
      )}

      <div className="sticky bottom-0 left-0 flex h-14 w-full items-center px-4">
        <Button label={t("common.ok")} className="w-32" onClick={onConfirm} />
      </div>
    </div>
  );
}

export default memo(FilterSidebarComponent);
