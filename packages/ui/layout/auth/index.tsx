'use client'

import ThemeToggle from '@/components/layout/dashboard/header/theme-toggle'
import './styles.css'
import { ReactNode } from 'react'

type AuthLayoutProps = {
  children: ReactNode
}

const AuthLayout = {
  Root: ({ children }: AuthLayoutProps) => {
    return (
      <div className='bg-background text-foreground auth-animation flex size-full overflow-hidden'>
        {children}
      </div>
    )
  },
  Content: ({ children }: { children: ReactNode }) => {
    return (
      <div className='bg-background text-foreground laptop:max-w-1/3 flex w-full max-w-full min-w-96 flex-col px-4'>
        <div className='flex gap-2 p-4'>
          <ThemeToggle />
        </div>
        <div className='flex flex-1 items-center justify-center'>{children}</div>
      </div>
    )
  },
  Background: ({ children }: { children: ReactNode }) => {
    return <div className='relative flex-1 overflow-hidden'>{children}</div>
  },
}

export default AuthLayout
