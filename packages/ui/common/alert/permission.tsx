import { Lock } from 'lucide-react'
import BaseAlert from './base-alert'
import { useLanguage } from '@/lib'

export default function PermissionAlert() {
  const { t } = useLanguage()
  return (
    <BaseAlert
      icon={<Lock size={40} />}
      message={t('errors.noPermission')}
      animation='animate-flip-up'
      className='text-accent-foreground'
    />
  )
}
