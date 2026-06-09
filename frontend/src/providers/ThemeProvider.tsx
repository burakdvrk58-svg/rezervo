'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { APP_CONFIG } from '@/config/app.config'

interface ThemeProviderProps {
  children: React.ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={APP_CONFIG.theme.defaultTheme}
      enableSystem
      storageKey={APP_CONFIG.theme.storageKey}
      disableTransitionOnChange={false}
    >
      {children}
    </NextThemesProvider>
  )
}
