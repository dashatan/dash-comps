import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Select } from "@/components/common/inputs/select";
import type { TableData } from "@/components/compound/table/types";
import { queryKeys } from "@/core/query-keys";
import {
  fleetRepository,
  tableStateToListParams,
  trackerRepository,
} from "@/infrastructure/http/repositories";
import {
  TrackerMapShell,
  toLegacyEvents,
} from "@/features/tracker/components/tracker-map-shell";
import { useLogisticsT } from "@/i18n/provider";
import { PageHeader } from "@/shared/page-header";
import Loading from "@/components/common/loading";

const VEHICLE_LIST_STATE: TableData = {
  page: 0,
  rows: 100,
  offset: 0,
  limit: 100,
  first: 0,
  selected: [],
  selectAll: false,
  filters: { status: "active" },
  expandedRows: {},
  showFilter: false,
  showFilterChips: false,
};

export function PlaybackTrackerPage() {
  const t = useLogisticsT();
  const [vehicleId, setVehicleId] = useState(1);
  const listParams = tableStateToListParams(VEHICLE_LIST_STATE);

  const vehiclesQuery = useQuery({
    queryKey: queryKeys.fleet.vehicles(listParams),
    queryFn: () => fleetRepository.listVehicles(listParams),
  });

  const playbackQuery = useQuery({
    queryKey: queryKeys.tracker.playback(vehicleId),
    queryFn: () => trackerRepository.getPlaybackEvents(vehicleId),
    enabled: vehicleId > 0,
  });

  const vehicleOptions = useMemo(
    () =>
      (vehiclesQuery.data?.items ?? []).map((vehicle) => ({
        value: String(vehicle.id),
        label: `${vehicle.plate} (#${vehicle.id})`,
      })),
    [vehiclesQuery.data?.items],
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <PageHeader
        title={t("tracker.playback.title")}
        subtitle={t("tracker.playback.subtitle")}
        breadcrumbLabel={t("tracker.playback.title")}
      />

      <div className="max-w-sm">
        <Select.Single
          label={t("fleet.columns.plate")}
          value={String(vehicleId)}
          onChange={(value) => setVehicleId(Number(value))}
          options={vehicleOptions}
        />
      </div>

      {playbackQuery.isLoading && !playbackQuery.data ? (
        <div className="flex flex-1 items-center justify-center p-12">
          <Loading label={t("common.loading")} />
        </div>
      ) : null}

      {playbackQuery.isError ? (
        <div className="text-sm text-destructive">
          {playbackQuery.error instanceof Error
            ? playbackQuery.error.message
            : "Failed to load playback"}
        </div>
      ) : null}

      {playbackQuery.data ? (
        <TrackerMapShell events={toLegacyEvents(playbackQuery.data)} />
      ) : null}
    </div>
  );
}
