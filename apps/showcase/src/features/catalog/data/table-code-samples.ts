export const TABLE_BASIC_USAGE_CODE = `import { useCallback, useState } from "react";
import Table, {
  TableCellTextField,
  type ChangeTag,
  type ColumnProps,
  type TableData,
} from "@/components/compound/table";

const columns: ColumnProps[] = [
  {
    field: "name",
    header: "Name",
    sortable: true,
    filter: true,
    filterElementType: "text",
    body: (row) => (
      <TableCellTextField value={row.name} justify="start" />
    ),
  },
  // ...more columns
];

export function UsersTable() {
  const [tableState, setTableState] = useState<TableData>({
    page: 0,
    rows: 15,
  });

  const handleTableChange = useCallback(
    (data: TableData, tag: ChangeTag) => {
      setTableState(data);
      if (tag === "filter" || tag === "pagination" || tag === "sort") {
        fetchUsers(data); // your API call
      }
    },
    [],
  );

  return (
    <Table
      columns={columns}
      data={rows}
      totalRecords={total}
      dataKey="id"
      showActionHeader
      showActionFilters
      onTableChange={handleTableChange}
    />
  );
}`;
