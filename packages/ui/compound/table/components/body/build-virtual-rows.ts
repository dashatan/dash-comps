export type TableVirtualRow =
  | {
      kind: 'row'
      item: Record<string, unknown>
      dataIndex: number
      expanded: boolean
    }
  | { kind: 'expansion'; item: Record<string, unknown>; dataIndex: number }

type BuildVirtualRowsArgs = {
  data?: Record<string, unknown>[]
  dataKey?: string | number
  expandedRows?: Record<string | number, boolean>
  expandOnNewRow?: boolean
  hasExpansionTemplate?: boolean
  loading?: boolean
}

export function buildVirtualRows({
  data,
  dataKey,
  expandedRows,
  expandOnNewRow,
  hasExpansionTemplate,
  loading,
}: BuildVirtualRowsArgs): TableVirtualRow[] {
  if (!data?.length) return []

  const rows: TableVirtualRow[] = []

  data.forEach((item, dataIndex) => {
    const expanded = isRowExpanded(item, dataKey, expandedRows, loading)
    rows.push({ kind: 'row', item, dataIndex, expanded })

    if (!expandOnNewRow || !hasExpansionTemplate || !dataKey) return

    const itemKey = item[dataKey as string] as string | number | undefined
    if (itemKey !== undefined && expandedRows?.[itemKey]) {
      rows.push({ kind: 'expansion', item, dataIndex })
    }
  })

  return rows
}

function isRowExpanded(
  item: Record<string, unknown>,
  dataKey: string | number | undefined,
  expandedRows: Record<string | number, boolean> | undefined,
  loading?: boolean,
): boolean {
  const itemKey = getItemDataKey(item, dataKey)
  return !!itemKey && !!expandedRows?.[itemKey] && !loading
}

export function getItemDataKey(
  item: Record<string, unknown>,
  dataKey?: string | number,
): string | number | undefined {
  if (!dataKey) return undefined
  return item[dataKey as string] as string | number | undefined
}
