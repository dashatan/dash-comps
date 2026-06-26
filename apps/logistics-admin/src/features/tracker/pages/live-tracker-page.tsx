import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/core/query-keys";
import { trackerRepository } from "@/infrastructure/http/repositories";
import {
  TrackerMapShell,
  toLegacyEvents,
} from "@/features/tracker/components/tracker-map-shell";
import { useLogisticsT } from "@/i18n/provider";
import { PageHeader } from "@/shared/page-header";
import Loading from "@/components/common/loading";

export function LiveTrackerPage() {
  const t = useLogisticsT();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: queryKeys.tracker.live,
    queryFn: () => trackerRepository.getLiveEvents(),
    refetchInterval: 30_000,
  });

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <PageHeader
        title={t("tracker.live.title")}
        subtitle={t("tracker.live.subtitle")}
        breadcrumbLabel={t("tracker.live.title")}
      />
      {isLoading && !data ? (
        <div className="flex flex-1 items-center justify-center p-12">
          <Loading label={t("common.loading")} />
        </div>
      ) : null}
      {isError ? (
        <div className="text-sm text-destructive">
          {error instanceof Error ? error.message : "Failed to load live map"}
        </div>
      ) : null}
      {data ? (
        <TrackerMapShell events={toLegacyEvents(data)} loadOsrmRoute={false} />
      ) : null}
    </div>
  );
}
