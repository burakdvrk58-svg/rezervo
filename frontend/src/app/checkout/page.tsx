'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Navbar } from '@/components/common/Navbar'
import { Footer } from '@/components/common/Footer'
import {
  ShieldCheck,
  Calendar,
  MapPin,
  Users,
  CheckCircle,
  ArrowLeft,
  Clock,
  BookOpen
} from 'lucide-react'

const TOPICS = [
  'Tez Danışmanlığı',
  'Sınav / Not İtirazı',
  'Proje Danışmanlığı',
  'Ders Kaydı / Müfredat Onayı',
  'Birebir Soru Çözümü & Destek',
  'Kariyer & Staj Danışmanlığı'
]

const getNext7Days = () => {
  const dates = []
  const today = new Date()
  for (let i = 0; i < 7; i++) {
    const d = new Date()
    d.setDate(today.getDate() + i)
    const id = d.toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', weekday: 'long' })
    const label = d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', weekday: 'short' })
    dates.push({ id, label })
  }
  return dates
}

function CheckoutContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const academicianId = searchParams.get('academicianId') || 'acad-1'
  const universityParam = searchParams.get('university') || 'Boğaziçi Üniversitesi'

  // Data states
  const [academician, setAcademician] = useState<any>(null)
  const [existingBookings, setExistingBookings] = useState<any[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)

  // Personal Info State (populated from localStorage)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [studentNo, setStudentNo] = useState('')
  const [selectedTopic, setSelectedTopic] = useState(TOPICS[0])
  const [notes, setNotes] = useState('')
  
  // Slot selection state
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [dateOptions, setDateOptions] = useState<{ id: string; label: string }[]>([])

  // Form states
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [createdBookingId, setCreatedBookingId] = useState('')

  useEffect(() => {
    async function loadBookingData() {
      try {
        // Fetch academician details
        const acadRes = await fetch('/api/academicians')
        if (acadRes.ok) {
          const data = await acadRes.json()
          const found = data.academicians.find((a: any) => a.id === academicianId)
          setAcademician(found)
        }

        // Fetch existing bookings to block already-taken slots
        const bookingsRes = await fetch('/api/bookings')
        if (bookingsRes.ok) {
          const bookingsData = await bookingsRes.json()
          setExistingBookings(bookingsData)
        }

        // Load student session defaults
        if (typeof window !== 'undefined') {
          const nameParts = (localStorage.getItem('rezervo_user_name') || 'Ahmet Yılmaz').split(' ')
          setFirstName(nameParts[0] || '')
          setLastName(nameParts.slice(1).join(' ') || '')
          setEmail(localStorage.getItem('rezervo_user_email') || 'customer@rezervo.com')
          setStudentNo('1420') // Mock student ID
          setPhone(localStorage.getItem('rezervo_user_phone') || '0555 123 45 67')
        }

        const dates = getNext7Days()
        setDateOptions(dates)
        setSelectedDate(dates[0].id)
      } catch (err) {
        console.error('Veri yükleme hatası:', err)
      } finally {
        setIsLoadingData(false)
      }
    }

    loadBookingData()
  }, [academicianId])

  // Get slots that are already booked for this academician and date
  const bookedSlots = existingBookings
    .filter(
      (b: any) =>
        b.academicianId === academicianId &&
        b.date === selectedDate &&
        b.status !== 'İptal Edildi' &&
        b.status !== 'Reddedildi'
    )
    .map((b: any) => b.time)

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!firstName.trim()) newErrors.firstName = 'Ad alanı gereklidir.'
    if (!lastName.trim()) newErrors.lastName = 'Soyad alanı gereklidir.'
    if (!email) {
      newErrors.email = 'E-posta gereklidir.'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Geçerli bir e-posta girin.'
    }
    if (!phone.trim()) newErrors.phone = 'Telefon gereklidir.'
    if (!studentNo.trim()) newErrors.studentNo = 'Öğrenci numarası gereklidir.'
    if (!selectedSlot) newErrors.slot = 'Lütfen görüşmek istediğiniz saat slotunu seçin.'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const addNotification = (title: string, desc: string, role: string) => {
    if (typeof window !== 'undefined') {
      const current = JSON.parse(localStorage.getItem('rezervo_notifications') || '[]')
      const newNotif = {
        id: `notif-${Date.now()}`,
        title,
        desc,
        time: 'Şimdi',
        unread: true,
        role
      }
      localStorage.setItem('rezervo_notifications', JSON.stringify([newNotif, ...current]))
      window.dispatchEvent(new Event('storage'))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      setIsLoadingSubmit(true)
      try {
        const studentId = typeof window !== 'undefined' ? (localStorage.getItem('rezervo_user_id') || 'u-student') : 'u-student'
        const category = academician?.department?.toLowerCase()?.includes('kütüphane') ? 'library' : 'teacher'

        const bookingData = {
          userId: studentId,
          studentName: `${firstName} ${lastName}`,
          studentNo: studentNo,
          studentEmail: email,
          category,
          academicianId: academician?.id,
          academicianName: academician?.name,
          universityId: academician?.universityId,
          universityName: universityParam,
          title: `${academician?.name || 'Akademisyen'} ile Görüşme`,
          subtitle: universityParam,
          date: selectedDate,
          time: selectedSlot,
          details: `${selectedTopic} • Öğrenci No: ${studentNo}`,
          notes: notes,
          image: academician?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
          price: 'Ücretsiz'
        }

        const res = await fetch('/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookingData),
        })

        if (!res.ok) {
          throw new Error('Randevu oluşturulamadı.')
        }

        const data = await res.json()
        setCreatedBookingId(data.id)
        
        // Add notification for academician
        addNotification(
          'Yeni Görüşme Talebi',
          `${firstName} ${lastName} yeni bir danışmanlık randevusu talebi gönderdi.`,
          'business'
        )

        setShowSuccessModal(true)
      } catch (err) {
        setErrors((prev) => ({ ...prev, submit: 'Randevu onaylanırken hata oluştu. Lütfen tekrar deneyin.' }))
      } finally {
        setIsLoadingSubmit(false)
      }
    }
  }

  if (isLoadingData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!academician) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Navbar />
        <main className="flex-1 py-12 text-center">
          <h2 className="text-xl font-bold text-slate-700">Akademisyen bulunamadı.</h2>
          <Link href="/search" className="mt-4 inline-block text-primary font-bold hover:underline">
            Geri dön ve tekrar ara
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          
          {/* Back Link */}
          <div className="mb-6">
            <Link
              href="/search"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Akademisyen Listesine Geri Dön
            </Link>
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl mb-8">
            Akademik Danışmanlık Randevu Formu
          </h1>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            
            {/* Left 2 Cols: Form details */}
            <div className="space-y-6 lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* 1. Date & 15-Minute Slot Selection */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                    <Clock className="h-5 w-5 text-primary" />
                    1. Görüşme Tarihi & Saat Dilimi Seçimi
                  </h2>

                  {/* Dynamic 7-Day Date Selector Tabs */}
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                    {dateOptions.map((d) => (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => {
                          setSelectedDate(d.id)
                          setSelectedSlot(null) // Reset slot on date change
                        }}
                        className={`rounded-xl border py-2.5 px-4 text-center text-xs font-bold transition-all shrink-0 ${
                          selectedDate === d.id
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>

                  {/* Slot Selection Grid */}
                  <div className="space-y-2 pt-2">
                    <label className="text-[11px] font-semibold text-slate-500">
                      Müsait Görüşme Saatleri (15 Dakika)
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {academician.slots?.map((slot: string) => {
                        const isBooked = bookedSlots.includes(slot)
                        const isSelected = selectedSlot === slot

                        return (
                          <button
                            key={slot}
                            type="button"
                            disabled={isBooked}
                            onClick={() => {
                              setSelectedSlot(slot)
                              if (errors.slot) setErrors((prev) => ({ ...prev, slot: '' }))
                            }}
                            className={`rounded-xl border py-2.5 px-2 text-center text-[11px] font-bold transition-all ${
                              isBooked
                                ? 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed line-through'
                                : isSelected
                                ? 'border-primary bg-primary text-white shadow-sm'
                                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50'
                            }`}
                          >
                            {slot}
                            {isBooked && ' (Dolu)'}
                          </button>
                        )
                      })}
                    </div>
                    {errors.slot && (
                      <p className="text-xs text-red-500 font-bold mt-1">{errors.slot}</p>
                    )}
                  </div>
                </div>
                
                {/* 2. Personal student info */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                    <BookOpen className="h-5 w-5 text-primary" />
                    2. Öğrenci & Görüşme Konusu Bilgileri
                  </h2>
                  
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-slate-500">Öğrenci Adı</label>
                      <input
                        type="text"
                        placeholder="Ahmet"
                        value={firstName}
                        onChange={(e) => {
                          setFirstName(e.target.value)
                          if (errors.firstName) setErrors((prev) => ({ ...prev, firstName: '' }))
                        }}
                        className={`w-full rounded-xl border bg-slate-50/50 px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/10 ${errors.firstName ? 'border-red-500' : 'border-slate-200'}`}
                      />
                      {errors.firstName && (
                        <p className="text-[10px] text-red-500 font-bold mt-0.5">{errors.firstName}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-slate-500">Öğrenci Soyadı</label>
                      <input
                        type="text"
                        placeholder="Yılmaz"
                        value={lastName}
                        onChange={(e) => {
                          setLastName(e.target.value)
                          if (errors.lastName) setErrors((prev) => ({ ...prev, lastName: '' }))
                        }}
                        className={`w-full rounded-xl border bg-slate-50/50 px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/10 ${errors.lastName ? 'border-red-500' : 'border-slate-200'}`}
                      />
                      {errors.lastName && (
                        <p className="text-[10px] text-red-500 font-bold mt-0.5">{errors.lastName}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-[11px] font-semibold text-slate-500">E-posta Adresi</label>
                      <input
                        type="email"
                        placeholder="ahmet.yilmaz@gmail.com"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value)
                          if (errors.email) setErrors((prev) => ({ ...prev, email: '' }))
                        }}
                        className={`w-full rounded-xl border bg-slate-50/50 px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/10 ${errors.email ? 'border-red-500' : 'border-slate-200'}`}
                      />
                      {errors.email && (
                        <p className="text-[10px] text-red-500 font-bold mt-0.5">{errors.email}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-slate-500">Telefon</label>
                      <input
                        type="text"
                        placeholder="0555 123 45 67"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value)
                          if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }))
                        }}
                        className={`w-full rounded-xl border bg-slate-50/50 px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/10 ${errors.phone ? 'border-red-500' : 'border-slate-200'}`}
                      />
                      {errors.phone && (
                        <p className="text-[10px] text-red-500 font-bold mt-0.5">{errors.phone}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-slate-500">Öğrenci Numarası</label>
                      <input
                        type="text"
                        placeholder="Örn: 1420"
                        value={studentNo}
                        onChange={(e) => {
                          setStudentNo(e.target.value)
                          if (errors.studentNo) setErrors((prev) => ({ ...prev, studentNo: '' }))
                        }}
                        className={`w-full rounded-xl border bg-slate-50/50 px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/10 ${errors.studentNo ? 'border-red-500' : 'border-slate-200'}`}
                      />
                      {errors.studentNo && (
                        <p className="text-[10px] text-red-500 font-bold mt-0.5">{errors.studentNo}</p>
                      )}
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-[11px] font-semibold text-slate-500">Görüşme Konusu</label>
                      <select
                        value={selectedTopic}
                        onChange={(e) => setSelectedTopic(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/10"
                      >
                        {TOPICS.map((topic) => (
                          <option key={topic} value={topic}>{topic}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-500">Görüşme Notları / Açıklama</label>
                    <textarea
                      placeholder="Görüşme öncesi akademisyene iletmek istediğiniz detayları buraya yazın..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/10"
                    />
                  </div>
                </div>

                <div className="rounded-3xl border border-emerald-200 bg-emerald-50/50 p-6 space-y-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-emerald-600" />
                    <h3 className="text-sm font-bold text-emerald-800">Tamamen Ücretsiz Hizmet</h3>
                  </div>
                  <p className="text-xs text-emerald-700 leading-relaxed">
                    Bu sistem üniversite içi akademik danışmanlık hizmeti kapsamında olup öğrenciler için tamamen ücretsizdir. Herhangi bir kart bilgisi veya ödeme talep edilmemektedir.
                  </p>
                </div>

                {errors.submit && (
                  <p className="text-xs text-red-500 font-bold text-center">
                    {errors.submit}
                  </p>
                )}

                {/* CTA Action button */}
                <motion.button
                  id="checkout-submit"
                  type="submit"
                  disabled={isLoadingSubmit}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-primary py-4 text-sm font-bold text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 disabled:opacity-70"
                >
                  {isLoadingSubmit ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <span>Danışmanlık Randevusunu Tamamla</span>
                  )}
                  <span className="absolute inset-0 -translate-x-full skew-x-12 bg-white/15 transition-transform duration-700 group-hover:translate-x-full" />
                </motion.button>

              </form>
            </div>

            {/* Right 1 Col: Summary Sidebar info */}
            <div className="space-y-5 lg:col-span-1">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900">Randevu Özeti</h3>
                
                {/* Details list */}
                <div className="text-xs leading-relaxed text-slate-600 space-y-2.5 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 overflow-hidden rounded-lg bg-slate-100 shrink-0">
                      <img src={academician.avatar} alt={academician.name} className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <p className="font-extrabold text-slate-800 text-sm">{academician.name}</p>
                      <p className="text-[10px] text-slate-400 font-semibold">{academician.department}</p>
                    </div>
                  </div>
                  <p className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    {universityParam}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    {selectedDate}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    Saat: <span className="font-bold text-slate-800">{selectedSlot || 'Seçilmedi'}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-slate-400" />
                    Süre: 15 Dakika (Birebir Danışmanlık)
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Danışmanlık Bedeli</span>
                    <span className="font-bold text-emerald-600">Ücretsiz</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-100 pt-3 text-sm font-extrabold text-slate-905">
                    <span>Toplam Tutar</span>
                    <span className="text-emerald-600">0 TL</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* ── Success Overlay Modal ── */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl text-center"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-4">
                <CheckCircle className="h-8 w-8" />
              </div>
              
              <h3 className="text-xl font-extrabold text-slate-955">
                Randevunuz Alındı!
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Akademik danışmanlık görüşme talebiniz sisteme başarıyla kaydedildi. Detaylar ve barkodunuz oluşturuldu.
              </p>

              <div className="my-5 rounded-2xl bg-slate-50 p-4 text-left text-xs font-semibold text-slate-600 space-y-1.5">
                <p>Akademisyen: <span className="font-bold text-slate-900">{academician.name}</span></p>
                <p>Konu: <span className="font-bold text-slate-900">{selectedTopic}</span></p>
                <p>Tarih & Saat: <span className="font-bold text-slate-900">{selectedDate} ({selectedSlot})</span></p>
                <p>Onay Kodu: <span className="font-bold text-slate-900">{createdBookingId}</span></p>
              </div>

              <button
                onClick={() => router.push('/customer/reservations')}
                className="w-full rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
              >
                Görüşmelerime Git
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  )
}
