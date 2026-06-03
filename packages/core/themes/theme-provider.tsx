'use client'

import { SUPPORTED_THEMES } from '../language/utils'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

export function ThemeProvider({ children, theme }: { children: React.ReactNode; theme: string }) {
  return (
    <NextThemesProvider defaultTheme={theme} attribute='class' storageKey='theme' enableSystem disableTransitionOnChange themes={SUPPORTED_THEMES}>
      {children}
    </NextThemesProvider>
  )
}
