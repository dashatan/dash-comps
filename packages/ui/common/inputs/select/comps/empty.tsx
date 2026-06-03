import { useLanguage } from '@/lib'

export default function EmptyTemplate() {
  const { t } = useLanguage()
  return (
    <div className='flex flex-col items-center justify-center'>
      <span className='text-muted-foreground my-4 text-sm font-semibold'>{t('common.noResult')}</span>
    </div>
  )
}
