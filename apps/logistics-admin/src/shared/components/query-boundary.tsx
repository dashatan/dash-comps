import type { ReactNode } from "react";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import Loading from "@/components/common/loading";

type QueryBoundaryProps<T> = {
  query: UseQueryOptions<T>;
  children: (data: T) => ReactNode;
  loadingLabel?: string;
};

export function QueryBoundary<T>({
  query,
  children,
  loadingLabel = "Loading…",
}: QueryBoundaryProps<T>) {
  const result = useQuery(query);

  if (result.isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center p-12">
        <Loading label={loadingLabel} />
      </div>
    );
  }

  if (result.isError) {
    return (
      <div className="flex flex-1 items-center justify-center p-12 text-sm text-destructive">
        {result.error instanceof Error
          ? result.error.message
          : "Failed to load data"}
      </div>
    );
  }

  if (result.data === undefined) {
    return null;
  }

  return <>{children(result.data)}</>;
}
