// ============================================================
// Notification Types
// ============================================================

export type NotificationType =
  | 'reservation_approved'
  | 'reservation_rejected'
  | 'reservation_pending'
  | 'reservation_cancelled'
  | 'payment_success'
  | 'payment_failed'
  | 'system'
  | 'message'

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  isRead: boolean
  data?: Record<string, unknown>
  createdAt: string
}

export interface NotificationState {
  items: Notification[]
  unreadCount: number
  isLoading: boolean
}
