import { useTableStore } from '@/components/compound/table/context'
import { BodyElementProps, tableDefaultState } from '@/components/compound/table/types'

export default function IndexNumber({ options }: BodyElementProps) {
  const page = useTableStore((s) => s.page)
  const rows = useTableStore((s) => s.rows)
  const { rowIndex } = options || {}
  if (rowIndex === undefined) return <></>
  const index = rowIndex + 1
  const res = index + (page || 0) * (rows || tableDefaultState.rows!)
  return <div className="dir-ltr flex h-full w-full items-center justify-center">{res}</div>
}
