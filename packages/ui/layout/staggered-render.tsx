'use client'

import { useEffect, useState } from 'react'

/**
 * Hook for staggered/priority-based rendering
 * Components load in batches with delays to improve performance
 */
export function useStaggeredRender(priority: number, delay: number = 0) {
  const [shouldRender, setShouldRender] = useState(priority === 1)
  const timeout = delay || priority * 300

  useEffect(() => {
    if (priority === 1) {
      // Priority 1 loads immediately
      setShouldRender(true)
      return
    }

    // Other priorities load after their delay
    const timer = setTimeout(() => {
      setShouldRender(true)
    }, timeout)

    return () => clearTimeout(timer)
  }, [priority, timeout])

  return shouldRender
}

/**
 * Component wrapper for staggered rendering
 */
interface StaggeredRenderProps {
  children: React.ReactNode
  priority: number
  delay?: number
  fallback?: React.ReactNode
}

export function StaggeredRender({ children, priority, delay = 0, fallback = null }: StaggeredRenderProps) {
  const shouldRender = useStaggeredRender(priority, delay)
  return <>{shouldRender ? children : fallback}</>
}
