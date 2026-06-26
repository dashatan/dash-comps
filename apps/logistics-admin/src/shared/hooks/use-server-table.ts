import { useCallback, useMemo, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ChangeTag, TableData } from "@/components/compound/table/types";
import type { ListParams, Paginated } from "@dash/logistics-contracts";
import { tableStateToListParams } from "@/infrastructure/http/repositories";

const INITIAL_TABLE_STATE: TableData = {
  page: 0,
  rows: 15,
  offset: 0,
  limit: 15,
  first: 0,
  selected: [],
  selectAll: false,
  filters: {},
  expandedRows: {},
  showFilter: false,
  showFilterChips: false,
};

type UseServerTableOptions<T> = {
  queryKey: (params: ListParams) => readonly unknown[];
  fetchPage: (params: ListParams) => Promise<Paginated<T>>;
};

export function useServerTable<T>({
  queryKey,
  fetchPage,
}: UseServerTableOptions<T>) {
  const [tableState, setTableState] = useState<TableData>(INITIAL_TABLE_STATE);
  const listParams = useMemo(
    () => tableStateToListParams(tableState),
    [tableState],
  );

  const query = useQuery({
    queryKey: queryKey(listParams),
    queryFn: () => fetchPage(listParams),
    placeholderData: keepPreviousData,
  });

  const handleTableChange = useCallback(
    (data: TableData | Record<string, string>, _tag: ChangeTag) => {
      setTableState(data as TableData);
    },
    [],
  );

  return {
    tableState,
    listParams,
    pageData: query.data?.items ?? [],
    total: query.data?.total ?? 0,
    loading: query.isFetching,
    handleTableChange,
    query,
  };
}
