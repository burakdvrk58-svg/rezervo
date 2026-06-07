'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ClipboardList,
  Calendar,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  Check,
  Settings,
  BookOpen
} from 'lucide-react'

type FilterStatus = 'all' | 'Beklemede' | 'Onaylandı' | 'Reddedildi'

const ALL_STANDARD_SLOTS = [
  '09:00 - 09:15', '09:15 - 09:30', '09:30 - 09:45', '09:45 - 10:00',
  '10:00 - 10:15', '10:15 - 10:30', '10:30 - 10:45', '10:45 - 11:00',
  '11:00 - 11:15', '11:15 - 11:30', '11:30 - 11:45', '11:45 - 12:00',
  '13:00 - 13:15', '13:15 - 13:30', '13:30 - 13:45', '13:45 - 14:00',
  '14:00 - 14:15', '14:15 - 14:30', '14:30 - 14:45', '14:45 - 15:00',
  '15:00 - 15:15', '15:15 - 15:30', '15:30 - 15:45', '15:45 - 16:00',
  '16:00 - 16:15', '16:15 - 16:30', '16:30 - 16:45', '16:45 - 17:00'
]

export default function BusinessRequestsPage() {
  const [list, setList] = useState<any[]>([])
  const [filter, setFilter] = useState<FilterStatus>('all')
  const [isLoading, setIsLoading] = useState(true)
  
  // Academician info
  const [academician, setAcademician] = useState<any>(null)
  const [academicianSlots, setAcademicianSlots] = useState<string[]>([])
  const [isUpdatingSlots, setIsUpdatingSlots] = useState(false)
  const [slotSuccessMsg, setSlotSuccessMsg] = useState('')

  // Date selector for status bar
  const [selectedDate, setSelectedDate] = useState('08 Haziran Pazartesi')

  const userEmail = typeof window !== 'undefined' ? (localStorage.getItem('rezervo_user_email') || 'business@rezervo.com') : 'business@rezervo.com'
  const userName = typeof window !== 'undefined' ? (localStorage.getItem('rezervo_user_name') || 'Prof. Dr. Albert Ali Salah') : 'Prof. Dr. Albert Ali Salah'

  // Fetch initial data
  const fetchData = async () => {
    try {
      setIsLoading(true)
      // 1. Fetch academicians
      const acadRes = await fetch('/api/academicians')
      let currentAcad: any = null
      if (acadRes.ok) {
        const acadData = await acadRes.json()
        currentAcad = acadData.academicians.find(
          (a: any) => a.email === userEmail || a.name === userName
        ) || acadData.academicians[0] // Fallback to first if not found
        setAcademician(currentAcad)
        setAcademicianSlots(currentAcad?.slots || [])
      }

      // 2. Fetch requests (bookings)
      const res = await fetch('/api/business/requests')
      if (res.ok) {
        const data = await res.json()
        // Filter bookings belonging to this academician
        const filteredBookings = data.filter((b: any) => {
          // Check if category is teacher
          if (b.category !== 'teacher' && b.category !== 'library') return false
          if (currentAcad) {
            return b.academicianId === currentAcad.id
          }
          return b.academicianEmail === userEmail || b.academicianName?.includes(userName)
        })
        setList(filteredBookings)
      }
    } catch (err) {
      console.error('Failed to fetch requests:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    document.title = 'Yönetim Paneli | Rezervo'
    fetchData()
  }, [])

  const handleAction = async (id: string, newStatus: 'Onaylandı' | 'Reddedildi') => {
    const action = newStatus === 'Onaylandı' ? 'approve' : 'reject'
    try {
      const res = await fetch('/api/business/requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action })
      })
      if (res.ok) {
        setList((prev) =>
          prev.map((item) => {
            if (item.id === id) {
              const statusColor = newStatus === 'Onaylandı' 
                ? 'text-emerald-700 bg-emerald-50 border-emerald-100'
                : 'text-red-700 bg-red-50 border-red-100'
              return { ...item, status: newStatus, statusColor }
            }
            return item
          })
        )
      }
    } catch (err) {
      console.error('Failed to update request:', err)
    }
  }

  // Toggle Slot in academician slots
  const handleToggleSlot = async (slotStr: string) => {
    if (!academician) return
    let newSlots = [...academicianSlots]
    if (newSlots.includes(slotStr)) {
      newSlots = newSlots.filter(s => s !== slotStr)
    } else {
      newSlots.push(slotStr)
    }
    // Sort slots logically (simple string sort works since they are HH:MM)
    newSlots.sort()
    
    setAcademicianSlots(newSlots)
    
    // Auto-save slot updates
    setIsUpdatingSlots(true)
    setSlotSuccessMsg('')
    try {
      const res = await fetch('/api/academicians', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: academician.id, slots: newSlots })
      })
      if (res.ok) {
        setSlotSuccessMsg('Müsaitlik saatleriniz başarıyla güncellendi.')
        setTimeout(() => setSlotSuccessMsg(''), 3000)
      }
    } catch (err) {
      console.error('Müsaitlik güncellenemedi:', err)
    } finally {
      setIsUpdatingSlots(false)
    }
  }

  const filteredList = list.filter((item) => {
    if (filter === 'all') return true
    return item.status === filter
  })

  // Availability statistics for selected date
  const slotsForSelectedDate = academicianSlots
  const bookingsForSelectedDate = list.filter(
    (b) => b.date === selectedDate && (b.status === 'Onaylandı' || b.status === 'Beklemede')
  )
  const bookedCount = bookingsForSelectedDate.length
  const totalCount = slotsForSelectedDate.length
  const freeCount = totalCount - bookedCount
  const fillPercentage = totalCount > 0 ? Math.round((bookedCount / totalCount) * 100) : 0

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Danışmanlık Görüşme İstekleri
          </h1>
          <p className="text-sm text-slate-500">
            {academician ? `${academician.name} (${academician.department})` : 'Akademisyen Paneli'} • Öğrencilerden gelen randevu taleplerini yönetin ve müsaitlik saatlerinizi güncelleyin.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left 2 Columns: Appointments Manager */}
        <div className="lg:col-span-2 space-y-6">
          {/* ── Filters & Tabs ── */}
          <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-px">
            {[
              { id: 'all', label: 'Tüm İstekler' },
              { id: 'Beklemede', label: 'Bekleyenler' },
              { id: 'Onaylandı', label: 'Onaylananlar' },
              { id: 'Reddedildi', label: 'Reddedilenler' },
            ].map(({ id, label }) => {
              const isActive = filter === id
              return (
                <button
                  key={id}
                  onClick={() => setFilter(id as FilterStatus)}
                  className={`relative px-4 pb-3.5 pt-1.5 text-sm font-semibold transition-all focus:outline-none ${
                    isActive ? 'text-primary' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {label}
                  {isActive && (
                    <motion.span
                      layoutId="req-filter-underline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-primary"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </button>
              )
            })}
          </div>

          {/* ── Appointments List ── */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="flex h-48 items-center justify-center rounded-2xl border border-slate-200 bg-white p-5">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            ) : (
              <>
                <AnimatePresence mode="popLayout">
                  {filteredList.map((req) => (
                    <motion.div
                      key={req.id}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.35 }}
                      className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md md:flex-row md:items-center"
                    >
                      {/* Student Details */}
                      <div className="flex items-center gap-4 shrink-0">
                        <div className="h-12 w-12 overflow-hidden rounded-full bg-slate-100 shrink-0 ring-2 ring-slate-100 flex items-center justify-center font-bold text-slate-600 text-sm">
                          {req.studentName ? req.studentName.split(' ').map((n: string) => n[0]).join('') : 'Ö'}
                        </div>
                        <div>
                          <h3 className="text-base font-extrabold text-slate-900">{req.studentName || 'Ahmet Yılmaz'}</h3>
                          <p className="text-xs text-slate-400 font-medium">Öğrenci No: {req.studentNo || '1420'}</p>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">{req.studentEmail || 'customer@rezervo.com'}</p>
                        </div>
                      </div>

                      {/* Request Details */}
                      <div className="flex-1 space-y-1.5 md:border-l md:border-slate-100 md:pl-5">
                        <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                          <BookOpen className="h-4 w-4 text-primary shrink-0" />
                          <span>{req.details || 'Görüşme Talebi'}</span>
                        </h4>
                        
                        <p className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          Tarih: <span className="font-semibold text-slate-700">{req.date}</span>
                        </p>
                        
                        <p className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Clock className="h-3.5 w-3.5 text-slate-400" />
                          Saat: <span className="font-bold text-primary">{req.time}</span>
                        </p>

                        {req.notes && (
                          <div className="mt-2 text-xs bg-slate-50 rounded-xl p-2.5 border border-slate-100 text-slate-600 italic leading-relaxed">
                            <span className="font-bold not-italic text-slate-700 block text-[10px] uppercase mb-0.5">Öğrenci Notu:</span>
                            "{req.notes}"
                          </div>
                        )}

                        <div className="flex items-center gap-2 mt-2 pt-1 border-t border-slate-50">
                          <span className="text-[10px] text-slate-400 uppercase font-semibold">Durum:</span>
                          <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold ${
                            req.status === 'Beklemede'
                              ? 'text-amber-700 bg-amber-50 border-amber-100'
                              : req.status === 'Onaylandı'
                              ? 'text-emerald-700 bg-emerald-50 border-emerald-100'
                              : 'text-red-700 bg-red-50 border-red-100'
                          }`}>
                            {req.status === 'Beklemede' && <AlertCircle className="h-3 w-3" />}
                            {req.status === 'Onaylandı' && <CheckCircle2 className="h-3 w-3" />}
                            {req.status === 'Reddedildi' && <XCircle className="h-3 w-3" />}
                            {req.status}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-row items-center justify-end border-t border-slate-100 pt-4 md:flex-col md:items-end md:justify-center md:border-t-0 md:pt-0 gap-2 shrink-0">
                        {req.status === 'Beklemede' && (
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => handleAction(req.id, 'Reddedildi')}
                              className="inline-flex items-center justify-center gap-1 rounded-xl border border-red-200 bg-white px-3 py-2 text-xs font-bold text-red-600 shadow-sm transition-colors hover:bg-red-50 cursor-pointer"
                            >
                              Reddet
                            </button>
                            <button
                              onClick={() => handleAction(req.id, 'Onaylandı')}
                              className="inline-flex items-center justify-center gap-1 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white shadow-sm transition-colors hover:bg-emerald-700 cursor-pointer"
                            >
                              Onayla
                            </button>
                          </div>
                        )}
                        {req.status === 'Onaylandı' && (
                          <button
                            onClick={() => handleAction(req.id, 'Reddedildi')}
                            className="inline-flex items-center justify-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-500 transition-colors hover:bg-slate-50 hover:text-red-600 cursor-pointer"
                          >
                            Görüşmeyi İptal Et
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {filteredList.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-12 text-center text-slate-500">
                    <ClipboardList className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                    <h3 className="text-base font-bold text-slate-700">İstek Bulunmuyor</h3>
                    <p className="text-xs text-slate-400 mt-1">Seçtiğiniz filtreye uygun görüşme randevusu bulunmuyor.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Right 1 Column: Availability Manager & Live Availability Status Bar */}
        <div className="space-y-6 lg:col-span-1">
          {/* Live Availability Status Bar Panel */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
              <AlertCircle className="h-5 w-5 text-primary" />
              Müsaitlik Durum Çubuğu
            </h3>

            {/* Date Picker for Status */}
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-slate-400 uppercase">Tarih Seçimi</label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: '08 Haziran Pazartesi', label: '08 Haz Paz' },
                  { id: '10 Haziran Çarşamba', label: '10 Haz Çar' },
                ].map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setSelectedDate(d.id)}
                    className={`rounded-lg border px-2 py-1.5 text-center text-[10px] font-bold transition-all ${
                      selectedDate === d.id
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Progress Bar */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-500">Slot Doluluk Oranı</span>
                <span className="text-primary">{fillPercentage}%</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${fillPercentage}%` }}
                  className="h-full bg-primary rounded-full"
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-semibold pt-1">
                <div className="bg-slate-50 p-2 rounded-xl">
                  <span className="text-slate-400 block text-[9px] uppercase">Toplam</span>
                  <span className="text-slate-800 font-extrabold">{totalCount} Slot</span>
                </div>
                <div className="bg-emerald-50 p-2 rounded-xl">
                  <span className="text-emerald-500 block text-[9px] uppercase">Müsait</span>
                  <span className="text-emerald-700 font-extrabold">{freeCount}</span>
                </div>
                <div className="bg-amber-50 p-2 rounded-xl">
                  <span className="text-amber-500 block text-[9px] uppercase">Dolu</span>
                  <span className="text-amber-700 font-extrabold">{bookedCount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Availability Slot Manager */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                <Settings className="h-5 w-5 text-primary" />
                Müsaitlik Tanımlama
              </h3>
              {isUpdatingSlots && (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              )}
            </div>
            
            <p className="text-xs text-slate-400 leading-normal">
              Öğrencilerin sizden randevu alabileceği 15'er dakikalık görüşme saat dilimlerini seçin veya kaldırın.
            </p>

            <AnimatePresence>
              {slotSuccessMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-50 border border-emerald-100 p-2.5 text-[11px] font-bold text-emerald-700"
                >
                  <Check className="h-3.5 w-3.5 shrink-0" />
                  <span>{slotSuccessMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Scrollable container for slots */}
            <div className="max-h-[380px] overflow-y-auto pr-1 space-y-1.5 scrollbar-thin">
              {ALL_STANDARD_SLOTS.map((slot) => {
                const isActive = academicianSlots.includes(slot)
                return (
                  <button
                    key={slot}
                    onClick={() => handleToggleSlot(slot)}
                    type="button"
                    className={`flex w-full items-center justify-between rounded-xl border p-2.5 text-xs font-bold transition-all ${
                      isActive
                        ? 'border-primary bg-primary/5 text-primary shadow-sm'
                        : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Clock className={`h-4 w-4 ${isActive ? 'text-primary' : 'text-slate-400'}`} />
                      <span>{slot}</span>
                    </div>
                    <div className={`h-5 w-5 rounded-md border flex items-center justify-center transition-colors ${
                      isActive ? 'border-primary bg-primary text-white' : 'border-slate-300 bg-white'
                    }`}>
                      {isActive && <Check className="h-3 w-3 stroke-[3]" />}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
