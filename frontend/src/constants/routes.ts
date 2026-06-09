// ============================================================
// Application Routes
// ============================================================

export const ROUTES = {
  // Public
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  SERVICES: '/services',

  // Auth
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
    VERIFY_EMAIL: '/verify-email',
    TWO_FACTOR: '/two-factor',
  },

  // Customer Dashboard
  CUSTOMER: {
    DASHBOARD: '/customer/dashboard',
    RESERVATIONS: '/customer/reservations',
    RESERVATION_DETAIL: (id: string) => `/customer/reservations/${id}`,
    CALENDAR: '/customer/calendar',
    MESSAGES: '/customer/messages',
    NOTIFICATIONS: '/customer/notifications',
    PAYMENTS: '/customer/payments',
    FAVORITES: '/customer/favorites',
    PROFILE: '/customer/profile',
    SETTINGS: '/customer/settings',
    SECURITY: '/customer/security',
  },

  // Business Dashboard
  BUSINESS: {
    DASHBOARD: '/business/dashboard',
    RESERVATIONS: '/business/reservations',
    APPROVAL: '/business/approval',
    ROOMS: '/business/rooms',
    AVAILABILITY: '/business/availability',
    CUSTOMERS: '/business/customers',
    REVENUE: '/business/revenue',
    REPORTS: '/business/reports',
    EMPLOYEES: '/business/employees',
    NOTIFICATIONS: '/business/notifications',
    PROFILE: '/business/profile',
  },

  // Admin Dashboard
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    BUSINESSES: '/admin/businesses',
    RESERVATIONS: '/admin/reservations',
    ROLES: '/admin/roles',
    PERMISSIONS: '/admin/permissions',
    APPROVALS: '/admin/approvals',
    NOTIFICATIONS: '/admin/notifications',
    ANALYTICS: '/admin/analytics',
    AUDIT_LOGS: '/admin/audit-logs',
    SETTINGS: '/admin/settings',
  },
} as const
