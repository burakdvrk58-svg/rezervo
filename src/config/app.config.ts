// ============================================================
// Application Configuration
// ============================================================

export const APP_CONFIG = {
  name: process.env.NEXT_PUBLIC_APP_NAME ?? 'Rezervo',
  url: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
  env: process.env.NEXT_PUBLIC_APP_ENV ?? 'development',
  description: 'Tüm rezervasyon ihtiyaçlarınız için hızlı, kolay ve güvenilir bir sistem.',

  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1',
    timeout: Number(process.env.NEXT_PUBLIC_API_TIMEOUT ?? 30000),
  },

  features: {
    analytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
    notifications: process.env.NEXT_PUBLIC_ENABLE_NOTIFICATIONS === 'true',
    darkMode: process.env.NEXT_PUBLIC_ENABLE_DARK_MODE === 'true',
  },

  pagination: {
    defaultLimit: 10,
    limitOptions: [10, 25, 50, 100],
  },

  theme: {
    defaultTheme: 'light' as 'light' | 'dark' | 'system',
    storageKey: 'rezervo-theme',
  },
} as const

export type AppConfig = typeof APP_CONFIG
