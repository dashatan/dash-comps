import useDashboardSignals from '@/components/layout/dashboard/context/useDashboardSignals'
import { Breadcrumbs } from '@/components/layout/dashboard/types'
import { useEffect } from 'react'

export default function useBreadcrumbs(breadcrumbs: Breadcrumbs, dependencyList = []) {
  const { setBreadcrumbs } = useDashboardSignals()
  useEffect(() => {
    setBreadcrumbs(breadcrumbs)
    return () => {
      setBreadcrumbs(null)
    }
  }, dependencyList)
}
