import ErrorAlert from '@/components/common/alert/data-error'
import LoadingAlert from '@/components/common/alert/loading'
import EmptyAlert from '@/components/common/alert/empty'
import PermissionAlert from '@/components/common/alert/permission'
import BaseAlert from '@/components/common/alert/base-alert'
import { ReactNode } from 'react'

export type AlertProps = {
  message?: string
  icon?: ReactNode
  className?: string
}

export namespace Alert {
  export const Loading = LoadingAlert
  export const Empty = EmptyAlert
  export const Error = ErrorAlert
  export const Forbidden = PermissionAlert
  export const Base = BaseAlert
}
