import { ColumnProps, TableProps } from '../../types'
import TD from './TD'
import { cn } from '@/lib'
import { getFrozenGroupIndices } from '../../utils/frozen-columns'
import { getItemDataKey, type TableVirtualRow } from './build-virtual-rows'

type RenderRowContentArgs = Pick<
  TableProps,
  'dataKey' | 'rowExpansionTemplate' | 'expandOnNewRow' | 'TDProps' | 'columnHover' | 'draggable'
> & {
  virtualRow: TableVirtualRow
  columns?: ColumnProps[]
  loading?: boolean
  expanded?: boolean
  hoveredColumnIndex?: number | null
  onColumnHover?: (index: number | null) => void
}

export function renderRowContent({
  virtualRow,
  columns,
  rowExpansionTemplate,
  expandOnNewRow,
  loading,
  expanded,
  TDProps,
  columnHover,
  hoveredColumnIndex,
  onColumnHover,
  draggable,
}: RenderRowContentArgs) {
  const { item, dataIndex, kind } = virtualRow

  if (kind === 'expansion' && rowExpansionTemplate) {
    return (
      <td className="border-b border-table-border" colSpan={columns?.length}>
        {rowExpansionTemplate(item)}
      </td>
    )
  }

  if (expanded && rowExpansionTemplate && !expandOnNewRow) {
    const { start: startFrozen, end: endFrozen } = getFrozenGroupIndices(columns ?? [])
    const startFrozenSet = new Set(startFrozen)
    const endFrozenSet = new Set(endFrozen)

    const startExcludeCols = columns?.filter((col, i) => col.excludeExpand && startFrozenSet.has(i))
    const endExcludeCols = columns?.filter((col, i) => col.excludeExpand && endFrozenSet.has(i))
    const leftExcludeCols = columns?.filter((x) => x.excludeExpand?.pos === 'left')
    const normalCols = columns?.filter((col) => !col.frozen && !col.excludeExpand)

    const renderExcludeCol = (col: ColumnProps) => {
      const colIndex = columns?.findIndex((c) => c === col) ?? 0
      return (
        <TD
          {...TDProps}
          key={`${col.field ?? colIndex}-${dataIndex}`}
          index={colIndex}
          col={col}
          data={item}
          rowIndex={dataIndex}
          loading={loading}
          className={{
            td: cn('align-top', TDProps?.className?.td),
            content: TDProps?.className?.content,
          }}
          columnHover={columnHover}
          hoveredColumnIndex={hoveredColumnIndex}
          onColumnHover={onColumnHover}
          draggable={draggable}
        />
      )
    }

    return (
      <>
        {(startExcludeCols ?? []).map(renderExcludeCol)}
        <td className="border-b border-table-border p-0 align-top" colSpan={normalCols?.length}>
          {rowExpansionTemplate(item)}
        </td>
        {(endExcludeCols ?? []).map(renderExcludeCol)}
        {(leftExcludeCols ?? []).map(renderExcludeCol)}
      </>
    )
  }

  return (
    <>
      {columns?.map((col, colIndex) => (
        <TD
          {...TDProps}
          key={`${colIndex}${dataIndex}`}
          index={colIndex}
          col={col}
          data={item}
          rowIndex={dataIndex}
          loading={loading}
          className={TDProps?.className}
          columnHover={columnHover}
          hoveredColumnIndex={hoveredColumnIndex}
          onColumnHover={onColumnHover}
          draggable={draggable}
        />
      ))}
    </>
  )
}

export function isRowExpanded(
  item: Record<string, unknown>,
  dataKey: string | number | undefined,
  expandedRows: Record<string | number, boolean> | undefined,
  loading?: boolean,
): boolean {
  const itemDataKey = getItemDataKey(item, dataKey)
  return !!itemDataKey && !!expandedRows?.[itemDataKey] && !loading
}
