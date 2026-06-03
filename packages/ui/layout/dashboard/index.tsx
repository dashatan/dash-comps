'use client'

import Sidebar from './sidebar'
import DashboardHeader from './header'
import { MenuItem, SIDEBAR_WIDTH_COLLAPSED, SIDEBAR_WIDTH, MIN_SCREEN_WIDTH } from './types'
import useDashboardSignals from '@/components/layout/dashboard/context/useDashboardSignals'
export type DashboardLayoutProps = {
  children: React.ReactNode
  menuItems: MenuItem[]
  footer: React.ReactNode
}

export default function DashboardLayout({ children, menuItems, footer }: DashboardLayoutProps) {
  const { expand } = useDashboardSignals()
  const width = expand ? SIDEBAR_WIDTH : SIDEBAR_WIDTH_COLLAPSED

  return (
    <main className='flex size-full h-screen overflow-y-auto'>
      <div className='mobile:hidden sticky start-0 top-0'>
        <Sidebar menuItems={menuItems} footer={footer} width={width} />
      </div>
      <div id='content' className='flex flex-1 flex-col' style={{ width: `calc(100% - ${width}px)`, minWidth: MIN_SCREEN_WIDTH }}>
        <DashboardHeader />
        <div className='flex flex-1 flex-col' aria-label='Dashboard content'>
          {children}
        </div>
      </div>
    </main>
  )
}
