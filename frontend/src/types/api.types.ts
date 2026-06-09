// ============================================================
// API Response Types
// ============================================================

export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
  statusCode: number
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
  message: string
  success: boolean
}

export interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface ApiError {
  message: string
  statusCode: number
  errors?: Record<string, string[]>
}

export type SortOrder = 'asc' | 'desc'

export interface QueryParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: SortOrder
  [key: string]: string | number | boolean | undefined
}
