import { cn } from '@/lib'
import BasicTextInput from '@/components/common/inputs/text/basic'
import { Loader2, Search, X } from 'lucide-react'
import { useRef } from 'react'

export type SelectBoxFilterProps = {
  label?: string
  className?: string
  placeholder?: string
  onClose?: () => void
  onSearch?: (val: string) => void
  loading?: boolean
  searchText?: string
}

export default function SelectBoxFilter(props: SelectBoxFilterProps) {
  const { className, onSearch, placeholder, loading, searchText } = props
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSearchChange = (value: string) => {
    onSearch?.(value)
  }

  const handleClear = () => {
    onSearch?.(undefined)
    inputRef.current?.focus()
  }

  return (
    <div id='filter' className={cn('flex w-full cursor-default gap-2 border-b', className)}>
      <div className={cn('flex h-12 w-full items-center gap-0 rounded-lg px-2')}>
        <div className='flex h-6 w-6 max-w-6 items-center justify-center'>
          {loading ? (
            <Loader2 className='animate-spin' />
          ) : searchText ? (
            <X size={18} onClick={handleClear} className='cursor-pointer' />
          ) : (
            <Search size={18} onClick={() => inputRef.current?.focus()} />
          )}
        </div>
        <BasicTextInput
          ref={inputRef}
          autoFocus
          placeholder={placeholder}
          className='pr-2'
          onChange={(e) => handleSearchChange(e.target.value)}
          value={searchText}
        />
      </div>
    </div>
  )
}
