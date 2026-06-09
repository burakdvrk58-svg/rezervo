import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { AuthState, AuthTokens, User } from '@/types/auth.types'

const initialState: AuthState = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; tokens: AuthTokens }>) => {
      state.user = action.payload.user
      state.tokens = action.payload.tokens
      state.isAuthenticated = true
      state.error = null
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
      state.isLoading = false
    },
    logout: (state) => {
      state.user = null
      state.tokens = null
      state.isAuthenticated = false
      state.error = null
      state.isLoading = false

      if (typeof window !== 'undefined') {
        localStorage.removeItem('rezervo_access_token')
        localStorage.removeItem('rezervo_refresh_token')
      }
    },
  },
})

export const { setCredentials, updateUser, setLoading, setError, logout } = authSlice.actions
export default authSlice.reducer
