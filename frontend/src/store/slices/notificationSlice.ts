import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { NotificationState, Notification } from '@/types/notification.types'

const initialState: NotificationState = {
  items: [],
  unreadCount: 0,
  isLoading: false,
}

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.items = action.payload
      state.unreadCount = action.payload.filter((n) => !n.isRead).length
    },
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.items.unshift(action.payload)
      if (!action.payload.isRead) {
        state.unreadCount += 1
      }
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.items.find((n) => n.id === action.payload)
      if (notification && !notification.isRead) {
        notification.isRead = true
        state.unreadCount = Math.max(0, state.unreadCount - 1)
      }
    },
    markAllAsRead: (state) => {
      state.items.forEach((n) => {
        n.isRead = true
      })
      state.unreadCount = 0
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      const index = state.items.findIndex((n) => n.id === action.payload)
      if (index !== -1) {
        if (!state.items[index].isRead) {
          state.unreadCount = Math.max(0, state.unreadCount - 1)
        }
        state.items.splice(index, 1)
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
  },
})

export const {
  setNotifications,
  addNotification,
  markAsRead,
  markAllAsRead,
  removeNotification,
  setLoading,
} = notificationSlice.actions
export default notificationSlice.reducer
