import BasicTextInput from '@/components/common/inputs/text/basic'
import { cn, useLanguage } from '@/lib'
import { SearchNormal1 } from 'iconsax-reactjs'

export type TableSearchBoxProps = {
  className?: string
  value?: string
  onChange?: (val: string) => void
}

export function TableSearchBox({ className, onChange, value }: TableSearchBoxProps) {
  const { t } = useLanguage()
  return (
    <div className={cn('border-input-border bg-input text-foreground/70 flex h-14 w-60 items-center overflow-hidden rounded-md border-2 ps-2 pe-4', className)}>
      <BasicTextInput
        className='placeholder:text-foreground/70 text-foreground/70'
        placeholder={t('common.search') + '...'}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
      <SearchNormal1 className='text-sidebar-icon size-5' />
    </div>
  )
}
