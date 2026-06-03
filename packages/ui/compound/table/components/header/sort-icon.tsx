import { cn } from '@/lib'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
export interface SortIconProps {
  sorted?: boolean
  sortOrder?: 0 | 1 | -1
  onChange?: (sortOrder: number) => void
  loading?: boolean
}
export default function SortIcon({ sorted, sortOrder, onChange, loading }: SortIconProps) {
  const [order, setOrder] = useState(0)

  function handleChange(val: number) {
    if (loading) return
    let res = val
    if (order === val) res = 0
    setOrder(res)
    onChange && onChange(res)
  }

  return (
    <div className='flex h-6 w-6 flex-col items-center justify-center px-6'>
      <ChevronUp
        className={cn('-mb-1.5 h-5 w-5 scale-75', {
          '[&_*]:fill-gray-400': !sorted || sortOrder !== -1,
          '[&_*]:fill-gray-700': sorted && sortOrder == -1,
        })}
        // onClick={() => handleChange(1)}
      />
      <ChevronDown
        className={cn('-mt-1 h-5 w-5 scale-75', {
          '[&_*]:fill-gray-400': !sorted || sortOrder !== 1,
          '[&_*]:fill-gray-700': sorted && sortOrder === 1,
        })}
        // onClick={() => handleChange(1)}
      />
    </div>
  )
}
