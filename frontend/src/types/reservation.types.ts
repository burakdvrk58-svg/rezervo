// ============================================================
// Reservation Types
// ============================================================

export type ReservationType = 'hotel' | 'flight' | 'car' | 'activity'

export type ReservationStatus =
  | 'pending'
  | 'confirmed'
  | 'cancelled'
  | 'completed'
  | 'rejected'
  | 'expired'

export type PaymentStatus = 'unpaid' | 'paid' | 'refunded' | 'partial'

export interface Reservation {
  id: string
  reservationNumber: string
  type: ReservationType
  status: ReservationStatus
  paymentStatus: PaymentStatus
  customerId: string
  businessId: string
  roomId?: string
  checkIn: string
  checkOut: string
  guestCount: GuestCount
  totalPrice: number
  currency: string
  notes?: string
  qrCode?: string
  createdAt: string
  updatedAt: string
}

export interface GuestCount {
  adults: number
  children: number
  infants?: number
}

export interface ReservationSearchParams {
  destination?: string
  checkIn?: string
  checkOut?: string
  guestCount?: GuestCount
  type?: ReservationType
  minPrice?: number
  maxPrice?: number
}

export interface Room {
  id: string
  businessId: string
  name: string
  type: string
  capacity: number
  price: number
  currency: string
  amenities: string[]
  images: string[]
  isAvailable: boolean
  status: 'active' | 'inactive' | 'maintenance'
}

export interface ApprovalAction {
  reservationId: string
  action: 'approve' | 'reject'
  reason?: string
}
