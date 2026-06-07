'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Layers,
  Info,
  QrCode,
  XCircle,
  CheckCircle2,
  GraduationCap,
  MapPin,
  Calendar,
  Clock,
  AlertCircle
} from 'lucide-react'

const TABS = [
  { id: 'all', label: 'Tüm Görüşmeler', icon: Layers },
  { id: 'Onaylandı', label: 'Onaylananlar', icon: CheckCircle2 },
  { id: 'Beklemede', label: 'Bekleyenler', icon: Clock },
  { id: 'Tamamlandı', label: 'Tamamlananlar', icon: CheckCircle2 },
  { id: 'İptal Edildi', label: 'İptal Edilenler', icon: XCircle },
] as const

type TabId = (typeof TABS)[number]['id']

export default function ReservationsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('all')
  const [showQrModal, setShowQrModal] = useState<string | null>(null)
  const [cancelTarget, setCancelTarget] = useState<string | null>(null)
  
  // Review states
  const [reviewTarget, setReviewTarget] = useState<any | null>(null)
  const [selectedStars, setSelectedStars] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)

  const [list, setList] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const userName = typeof window !== 'undefined' ? (localStorage.getItem('rezervo_user_name') || 'Ahmet Yılmaz') : 'Ahmet Yılmaz'

  async function fetchBookings() {
    try {
      const userId = typeof window !== 'undefined' ? (localStorage.getItem('rezervo_user_id') || 'u-student') : 'u-student'
      const res = await fetch(`/api/bookings?userId=${userId}`)
      if (!res.ok) throw new Error('Randevular yüklenemedi.')
      const data = await res.json()
      setList(data)
    } catch (err) {
      setError('Görüşme kayıtları yüklenirken bir hata oluştu.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    document.title = 'Görüşmelerim | Rezervo'
    fetchBookings()
  }, [])

  const filteredList = list.filter((item) => activeTab === 'all' || item.status === activeTab)

  const handleCancelReservation = async (id: string) => {
    try {
      const res = await fetch(`/api/bookings?id=${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('İptal işlemi başarısız.')
      
      // Re-fetch to sync
      await fetchBookings()
    } catch (err) {
      alert('Randevu iptal edilirken bir hata oluştu.')
    } finally {
      setCancelTarget(null)
    }
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reviewTarget) return

    setIsSubmittingReview(true)
    try {
      const res = await fetch('/api/academicians', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          academicianId: reviewTarget.academicianId,
          rating: selectedStars,
          reviewText: reviewComment,
          studentName: userName,
          bookingId: reviewTarget.id
        })
      })
      if (res.ok) {
        setReviewTarget(null)
        setSelectedStars(5)
        setReviewComment('')
        await fetchBookings()
      } else {
        alert('Değerlendirme gönderilemedi.')
      }
    } catch (err) {
      console.error(err)
      alert('Hata oluştu.')
    } finally {
      setIsSubmittingReview(false)
    }
  }

  const selectedQrBooking = list.find((b) => b.id === showQrModal)

  return (
    <div className="space-y-6">
      
      {/* ── Header ── */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Akademik Görüşmelerim
          </h1>
          <p className="text-sm text-slate-500">
            Akademisyenlerle yaptığınız veya yapacağınız randevulu danışmanlık görüşmeleri.
          </p>
        </div>
      </div>

      {/* ── Tabs Grid ── */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-px">
        {TABS.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`relative flex items-center gap-2 px-4 pb-3.5 pt-1.5 text-sm font-semibold transition-all focus:outline-none ${
                isActive ? 'text-primary' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="h-4.5 w-4.5" />
              <span>{label}</span>
              {isActive && (
                <motion.span
                  layoutId="res-tabs-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-primary"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          )
        })}
      </div>

      {/* ── Reservations List ── */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex h-48 items-center justify-center rounded-2xl border border-slate-200 bg-white p-5">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center text-red-800">
            <p className="font-bold">{error}</p>
          </div>
        ) : (
          <>
            <AnimatePresence mode="popLayout">
              {filteredList.map((res) => (
                <motion.div
                  key={res.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35 }}
                  className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md md:flex-row md:items-center"
                >
                  {/* Thumbnail */}
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100 mx-auto md:mx-0">
                    <img
                      src={res.image}
                      alt={res.academicianName}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Core Details */}
                  <div className="flex-1 space-y-1 text-center md:text-left">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-3 gap-y-1.5">
                      <h3 className="text-base font-extrabold text-slate-900 sm:text-lg">
                        {res.title}
                      </h3>
                      <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                        res.status === 'Onaylandı'
                          ? 'text-emerald-700 bg-emerald-50 border-emerald-100'
                          : res.status === 'Beklemede'
                          ? 'text-amber-700 bg-amber-50 border-amber-100'
                          : res.status === 'Tamamlandı'
                          ? 'text-blue-700 bg-blue-50 border-blue-100'
                          : 'text-slate-500 bg-slate-50 border-slate-200'
                      }`}>
                        {res.status === 'Onaylandı' ? (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        ) : res.status === 'Beklemede' ? (
                          <AlertCircle className="h-3.5 w-3.5" />
                        ) : res.status === 'Tamamlandı' ? (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        ) : (
                          <XCircle className="h-3.5 w-3.5" />
                        )}
                        {res.status}
                      </span>
                    </div>

                    <p className="flex items-center justify-center md:justify-start gap-1.5 text-xs font-medium text-slate-500">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      {res.subtitle}
                    </p>

                    <p className="flex items-center justify-center md:justify-start gap-1.5 text-xs text-slate-400">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      Tarih: <span className="font-semibold text-slate-700">{res.date}</span>
                      <span className="text-slate-300">•</span>
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      Saat Slotu: <span className="font-bold text-primary">{res.time}</span>
                    </p>

                    <p className="flex items-center justify-center md:justify-start gap-1.5 text-xs leading-normal text-slate-400">
                      <Info className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                      <span>{res.details}</span>
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-row items-center justify-center border-t border-slate-100 pt-4 md:flex-col md:items-end md:justify-center md:border-t-0 md:pt-0 gap-3 shrink-0">
                    {(res.status === 'Onaylandı' || res.status === 'Beklemede') && (
                      <div className="flex items-center gap-2">
                        {res.status === 'Onaylandı' && !res.reviewed && (
                          <button
                            onClick={() => setReviewTarget(res)}
                            className="inline-flex items-center justify-center gap-1 rounded-xl bg-amber-500 px-3.5 py-2.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-amber-600 cursor-pointer"
                          >
                            Değerlendir
                          </button>
                        )}
                        
                        <button
                          onClick={() => setShowQrModal(res.id)}
                          className="inline-flex items-center justify-center gap-1 rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-bold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 cursor-pointer"
                          title="Giriş Geçiş Kartı / QR"
                        >
                          <QrCode className="h-4.5 w-4.5 text-slate-500" />
                          <span className="hidden sm:inline">QR Kod</span>
                        </button>
                        
                        <button
                          onClick={() => setCancelTarget(res.id)}
                          className="inline-flex items-center justify-center gap-1 rounded-xl border border-red-200 bg-white px-3 py-2.5 text-xs font-bold text-red-600 shadow-sm transition-colors hover:bg-red-50 cursor-pointer"
                        >
                          İptal Et
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredList.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-12 text-center text-slate-500">
                <GraduationCap className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                <h3 className="text-base font-bold text-slate-700">Görüşme Bulunmuyor</h3>
                <p className="text-xs text-slate-400 mt-1">Seçtiğiniz filtreye uygun danışmanlık görüşmesi kaydı bulunmuyor.</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── QR Code Advisor Ticket Modal ── */}
      <AnimatePresence>
        {showQrModal && selectedQrBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowQrModal(null)}
              className="absolute inset-0 bg-black"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl text-center"
            >
              <h3 className="text-lg font-bold text-slate-900">Görüşme Giriş Kartı</h3>
              <p className="text-xs text-slate-500 mt-1">Ofis girişinde veya bina güvenliğinde bu kodu görevliye gösterin.</p>
              
              {/* QR Render mock */}
              <div className="mx-auto my-6 flex h-48 w-48 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-inner">
                <svg className="h-full w-full text-slate-800" viewBox="0 0 100 100" fill="currentColor">
                  <rect x="10" y="10" width="20" height="20" />
                  <rect x="15" y="15" width="10" height="10" fill="white" />
                  <rect x="70" y="10" width="20" height="20" />
                  <rect x="75" y="15" width="10" height="10" fill="white" />
                  <rect x="10" y="70" width="20" height="20" />
                  <rect x="15" y="75" width="10" height="10" fill="white" />
                  <rect x="40" y="10" width="10" height="10" />
                  <rect x="50" y="20" width="10" height="10" />
                  <rect x="40" y="40" width="20" height="20" />
                  <rect x="10" y="45" width="10" height="10" />
                  <rect x="70" y="45" width="10" height="15" />
                  <rect x="70" y="70" width="15" height="10" />
                  <rect x="45" y="75" width="10" height="15" />
                </svg>
              </div>

              <div className="rounded-xl bg-slate-50 p-3 text-left text-xs font-semibold text-slate-600 space-y-1">
                <p>Onay Kodu: <span className="font-bold text-slate-900">{selectedQrBooking.id}</span></p>
                <p>Danışman: <span className="font-bold text-slate-900">{selectedQrBooking.academicianName}</span></p>
                <p>Öğrenci: <span className="font-bold text-slate-900">{userName} ({selectedQrBooking.studentNo})</span></p>
                <p>Tarih & Saat: <span className="font-bold text-slate-900">{selectedQrBooking.date} • {selectedQrBooking.time}</span></p>
              </div>

              <button
                onClick={() => setShowQrModal(null)}
                className="mt-5 w-full rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
              >
                Kapat
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Cancel Confirmation Modal ── */}
      <AnimatePresence>
        {cancelTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setCancelTarget(null)}
              className="absolute inset-0 bg-black"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl text-center"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600 mb-4">
                <XCircle className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Randevuyu İptal Et?</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Bu akademik danışmanlık randevusunu iptal etmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
              </p>

              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => setCancelTarget(null)}
                  className="w-1/2 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Vazgeç
                </button>
                <button
                  onClick={() => handleCancelReservation(cancelTarget)}
                  className="w-1/2 rounded-xl bg-red-600 py-3 text-sm font-semibold text-white hover:bg-red-700"
                >
                  Evet, İptal Et
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Review & Rating Advisor Modal ── */}
      <AnimatePresence>
        {reviewTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setReviewTarget(null)}
              className="absolute inset-0 bg-black"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl text-center"
            >
              <h3 className="text-lg font-bold text-slate-900">Görüşmeyi Değerlendir</h3>
              <p className="text-xs text-slate-500 mt-1">
                {reviewTarget.academicianName} ile olan danışmanlık görüşmenizi değerlendirin.
              </p>

              <form onSubmit={handleSubmitReview} className="mt-5 space-y-4 text-left">
                {/* Stars select */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 block text-center">Puan Verin</label>
                  <div className="flex justify-center gap-1.5 py-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setSelectedStars(star)}
                        className="text-2xl focus:outline-none transition-transform active:scale-125"
                      >
                        <span className={star <= selectedStars ? 'text-amber-400' : 'text-slate-200'}>★</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment area */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500">Görüş ve Değerlendirmeniz</label>
                  <textarea
                    required
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    rows={3}
                    placeholder="Bu görüşme hakkında deneyiminizi yazın..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/10"
                  />
                </div>

                <div className="flex gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setReviewTarget(null)}
                    className="w-1/2 rounded-xl border border-slate-200 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    Vazgeç
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="w-1/2 rounded-xl bg-amber-500 py-3 text-xs font-bold text-white hover:bg-amber-600 disabled:opacity-75 flex justify-center items-center"
                  >
                    {isSubmittingReview ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      'Gönder'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}
