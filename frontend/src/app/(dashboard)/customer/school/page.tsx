'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GraduationCap,
  BookOpen,
  Users,
  Clock,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  QrCode,
  CalendarRange,
  BookMarked,
  XCircle,
  HelpCircle,
  Building2,
  MapPin,
  DoorOpen,
  Star,
  Sparkles
} from 'lucide-react'

// ── Types ──
type Step = 'university' | 'service' | 'booking'
type ServiceType = 'library' | 'classroom' | 'academician'

export default function SchoolPanelPage() {
  // ── Flow States ──
  const [currentStep, setCurrentStep] = useState<Step>('university')
  const [serviceType, setServiceType] = useState<ServiceType | null>(null)

  // ── Data States ──
  const [universities, setUniversities] = useState<any[]>([])
  const [selectedUniversity, setSelectedUniversity] = useState<any | null>(null)
  const [universityData, setUniversityData] = useState<any>(null)
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // ── Booking Flow States ──
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)
  const [selectedAcademician, setSelectedAcademician] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState('09 Haziran 2026')
  const [selectedTime, setSelectedTime] = useState('')
  const [agenda, setAgenda] = useState('')

  // ── UI Flow Controls ──
  const [bookingSuccess, setBookingSuccess] = useState<any>(null)
  const [showQrModal, setShowQrModal] = useState<string | null>(null)
  const [cancelTarget, setCancelTarget] = useState<string | null>(null)
  const [showToast, setShowToast] = useState<string | null>(null)

  useEffect(() => {
    document.title = 'Okul Rezervasyon Portalı | Rezervo'
  }, [])

  // ── Fetch Universities ──
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const res = await fetch('/api/school/rooms')
        if (res.ok) {
          const data = await res.json()
          setUniversities(data)
        }
      } catch (err) {
        console.error('Failed to fetch universities:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchUniversities()
  }, [])

  // ── Fetch Bookings ──
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch('/api/school/bookings')
        if (res.ok) {
          const data = await res.json()
          setBookings(data)
        }
      } catch (err) {
        console.error('Failed to fetch bookings:', err)
      }
    }
    fetchBookings()
  }, [])

  // ── Fetch University Details when selected ──
  const handleSelectUniversity = async (uni: any) => {
    setSelectedUniversity(uni)
    try {
      const res = await fetch(`/api/school/rooms?universityId=${uni.id}`)
      if (res.ok) {
        const data = await res.json()
        setUniversityData(data)
      }
    } catch (err) {
      console.error('Failed to fetch university details:', err)
    }
    setCurrentStep('service')
  }

  // ── Toast Handler ──
  const triggerToast = (msg: string) => {
    setShowToast(msg)
    setTimeout(() => setShowToast(null), 3500)
  }

  // ── Reset Form ──
  const resetForm = () => {
    setSelectedRoom(null)
    setSelectedAcademician(null)
    setSelectedTime('')
    setAgenda('')
  }

  // ── Navigate Back ──
  const goBack = () => {
    if (currentStep === 'booking') {
      setCurrentStep('service')
      resetForm()
    } else if (currentStep === 'service') {
      setCurrentStep('university')
      setSelectedUniversity(null)
      setUniversityData(null)
      setServiceType(null)
    }
  }

  // ── Handle Booking Submit ──
  const handleBookRoom = async (room: any, category: 'library' | 'classroom') => {
    if (!selectedTime) {
      alert('Lütfen bir saat dilimi seçin.')
      return
    }

    const newBooking = {
      category,
      title: room.name,
      subtitle: `${selectedUniversity?.name} • ${room.floor}`,
      date: selectedDate,
      time: selectedTime,
      details: `${agenda || 'Bireysel/Grup çalışma oturumu'} • Kapasite: ${room.capacity}`,
      image: room.image,
      universityId: selectedUniversity?.id
    }

    try {
      const res = await fetch('/api/school/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBooking)
      })
      if (res.ok) {
        const saved = await res.json()
        setBookings((prev) => [saved, ...prev])
        setBookingSuccess(saved)
        triggerToast(category === 'library'
          ? 'Kütüphane çalışma odası başarıyla rezerve edildi!'
          : 'Derslik başarıyla rezerve edildi!')
        resetForm()
      } else {
        alert('Rezervasyon oluşturulurken bir hata oluştu.')
      }
    } catch (err) {
      console.error(err)
      alert('Rezervasyon oluşturulurken bir bağlantı hatası oluştu.')
    }
  }

  const handleBookAcademician = async (academician: any) => {
    if (!selectedTime) {
      alert('Lütfen bir görüşme saati seçin.')
      return
    }

    const newBooking = {
      category: 'teacher',
      title: `${academician.name} ile Görüşme`,
      subtitle: `${selectedUniversity?.name} • ${academician.department}`,
      date: selectedDate,
      time: selectedTime,
      details: `${agenda || 'Akademik danışmanlık görüşmesi'} • ${academician.tag || ''}`,
      image: academician.avatar,
      universityId: selectedUniversity?.id
    }

    try {
      const res = await fetch('/api/school/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBooking)
      })
      if (res.ok) {
        const saved = await res.json()
        setBookings((prev) => [saved, ...prev])
        setBookingSuccess(saved)
        triggerToast('Akademisyen randevusu başarıyla oluşturuldu!')
        resetForm()
      } else {
        alert('Randevu oluşturulurken bir hata oluştu.')
      }
    } catch (err) {
      console.error(err)
      alert('Randevu oluşturulurken bir bağlantı hatası oluştu.')
    }
  }

  const handleCancelBooking = async (id: string) => {
    try {
      const res = await fetch(`/api/school/bookings/${id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        setBookings((prev) => prev.filter((b) => b.id !== id))
        setCancelTarget(null)
        triggerToast('Rezervasyon başarıyla iptal edildi.')
      } else {
        alert('Rezervasyon iptal edilirken bir hata oluştu.')
      }
    } catch (err) {
      console.error(err)
      alert('Rezervasyon iptal edilirken bir bağlantı hatası oluştu.')
    }
  }

  // ── Helper: get rooms by current service type ──
  const getRooms = () => {
    if (!universityData) return []
    if (serviceType === 'library') return universityData.libraryRooms || []
    if (serviceType === 'classroom') return universityData.classrooms || []
    return []
  }

  const getAcademicians = () => {
    if (!universityData) return []
    return universityData.academicians || []
  }

  // ── Available dates ──
  const availableDates = ['09 Haziran 2026', '10 Haziran 2026', '11 Haziran 2026', '12 Haziran 2026']
  const timeSlots = ['09:00 - 11:00', '11:00 - 13:00', '13:00 - 15:00', '15:00 - 17:00']

  // ── Breadcrumb ──
  const breadcrumbs = [
    { label: 'Üniversite Seç', step: 'university' as Step, active: true },
    { label: selectedUniversity?.shortName || 'Hizmet Seç', step: 'service' as Step, active: currentStep !== 'university' },
    { label: serviceType === 'library' ? 'Kütüphane' : serviceType === 'classroom' ? 'Derslik' : serviceType === 'academician' ? 'Akademisyen' : 'Rezervasyon', step: 'booking' as Step, active: currentStep === 'booking' }
  ]

  return (
    <div className="space-y-8 pb-12">
      {/* ── Toast Alert ── */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-20 right-6 z-50 flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3.5 shadow-lg shadow-emerald-500/10 text-emerald-800"
          >
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <span className="text-xs font-bold">{showToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Header ── */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1">
            <GraduationCap className="h-4 w-4 text-primary" />
            <span className="text-[11px] font-bold text-primary">Üniversite Portalı</span>
          </div>
          <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Kampüs Rezervasyon Merkezi
          </h1>
          <p className="text-sm text-slate-500">
            Üniversitenizi seçin, kütüphane odalarını, derslikleri veya akademisyen randevularını kolayca rezerve edin.
          </p>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm">
          {breadcrumbs.map((bc, i) => (
            <div key={i} className="flex items-center gap-2">
              {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-slate-300" />}
              <span className={`text-[10px] font-extrabold uppercase tracking-wider ${bc.active ? 'text-primary' : 'text-slate-400'}`}>
                {bc.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left 2 Columns */}
        <div className="space-y-6 lg:col-span-2">

          <AnimatePresence mode="wait">

            {/* ═══════════════════════════════════════════════ */}
            {/* STEP 1: UNIVERSITY SELECTION                   */}
            {/* ═══════════════════════════════════════════════ */}
            {currentStep === 'university' && (
              <motion.div
                key="step-university"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    Üniversitenizi Seçin
                  </h3>
                  <span className="text-xs text-slate-400">{universities.length} Üniversite</span>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    {universities.map((uni) => (
                      <motion.div
                        key={uni.id}
                        whileHover={{ y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSelectUniversity(uni)}
                        className="group cursor-pointer overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300"
                      >
                        <div className="relative h-40 w-full overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50">
                          <img
                            src={uni.image}
                            alt={uni.name}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                          <div className="absolute bottom-3 left-3 flex items-center gap-2">
                            <span className="text-2xl">{uni.logo}</span>
                            <div>
                              <h4 className="text-sm font-black text-white drop-shadow-md">{uni.name}</h4>
                              <p className="text-[10px] font-medium text-white/80 flex items-center gap-1">
                                <MapPin className="h-3 w-3" /> {uni.campus}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 flex items-center justify-between">
                          <div className="flex gap-3">
                            <div className="flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1">
                              <BookOpen className="h-3 w-3 text-blue-600" />
                              <span className="text-[10px] font-bold text-blue-700">{uni.libraryRoomCount} Oda</span>
                            </div>
                            <div className="flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-1">
                              <DoorOpen className="h-3 w-3 text-purple-600" />
                              <span className="text-[10px] font-bold text-purple-700">{uni.classroomCount} Derslik</span>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* ═══════════════════════════════════════════════ */}
            {/* STEP 2: SERVICE SELECTION                      */}
            {/* ═══════════════════════════════════════════════ */}
            {currentStep === 'service' && (
              <motion.div
                key="step-service"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                {/* Selected University Banner */}
                {selectedUniversity && (
                  <div className="flex items-center justify-between rounded-2xl border border-primary/15 bg-gradient-to-r from-primary/5 to-blue-50/50 p-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{selectedUniversity.logo}</span>
                      <div>
                        <h4 className="text-sm font-black text-slate-900">{selectedUniversity.name}</h4>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {selectedUniversity.campus}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={goBack}
                      className="text-xs font-bold text-slate-500 hover:text-slate-700 bg-white border border-slate-200 rounded-lg px-3 py-1.5 flex items-center gap-1"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" /> Değiştir
                    </button>
                  </div>
                )}

                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-amber-500" />
                  Ne Yapmak İstersiniz?
                </h3>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                  {/* Library Card */}
                  <motion.div
                    whileHover={{ y: -6, scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setServiceType('library')
                      setCurrentStep('booking')
                    }}
                    className="group cursor-pointer rounded-3xl border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-white p-6 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 text-center space-y-4"
                  >
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 group-hover:bg-blue-200 transition-colors">
                      <BookOpen className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900">Kütüphane Odası</h4>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">Sessiz çalışma odaları, grup çalışma alanları ve proje odaları</p>
                    </div>
                    <div className="flex items-center justify-center gap-1 text-xs font-bold text-blue-600">
                      {universityData?.libraryRooms?.length || 0} Oda Mevcut
                      <ChevronRight className="h-3.5 w-3.5" />
                    </div>
                  </motion.div>

                  {/* Classroom Card */}
                  <motion.div
                    whileHover={{ y: -6, scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setServiceType('classroom')
                      setCurrentStep('booking')
                    }}
                    className="group cursor-pointer rounded-3xl border-2 border-purple-100 bg-gradient-to-br from-purple-50 to-white p-6 shadow-sm hover:shadow-xl hover:border-purple-300 transition-all duration-300 text-center space-y-4"
                  >
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 group-hover:bg-purple-200 transition-colors">
                      <DoorOpen className="h-8 w-8 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900">Derslik Rezervasyonu</h4>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">Amfiler, seminer salonları, laboratuvarlar ve derslikler</p>
                    </div>
                    <div className="flex items-center justify-center gap-1 text-xs font-bold text-purple-600">
                      {universityData?.classrooms?.length || 0} Derslik Mevcut
                      <ChevronRight className="h-3.5 w-3.5" />
                    </div>
                  </motion.div>

                  {/* Academician Card */}
                  <motion.div
                    whileHover={{ y: -6, scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setServiceType('academician')
                      setCurrentStep('booking')
                    }}
                    className="group cursor-pointer rounded-3xl border-2 border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-6 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300 text-center space-y-4"
                  >
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 group-hover:bg-emerald-200 transition-colors">
                      <Users className="h-8 w-8 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900">Akademisyen Randevusu</h4>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">Ofis saati, tez danışmanlığı ve akademik görüşme</p>
                    </div>
                    <div className="flex items-center justify-center gap-1 text-xs font-bold text-emerald-600">
                      {universityData?.academicians?.length || 0} Akademisyen
                      <ChevronRight className="h-3.5 w-3.5" />
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* ═══════════════════════════════════════════════ */}
            {/* STEP 3: BOOKING                                */}
            {/* ═══════════════════════════════════════════════ */}
            {currentStep === 'booking' && (
              <motion.div
                key="step-booking"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                {/* University + Service Banner */}
                <div className="flex items-center justify-between rounded-2xl border border-primary/15 bg-gradient-to-r from-primary/5 to-blue-50/50 p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{selectedUniversity?.logo}</span>
                    <div>
                      <h4 className="text-sm font-black text-slate-900">{selectedUniversity?.name}</h4>
                      <p className="text-xs text-slate-500">
                        {serviceType === 'library' && '📚 Kütüphane Çalışma Odaları'}
                        {serviceType === 'classroom' && '🏫 Derslik Rezervasyonu'}
                        {serviceType === 'academician' && '👨‍🏫 Akademisyen Randevusu'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={goBack}
                    className="text-xs font-bold text-slate-500 hover:text-slate-700 bg-white border border-slate-200 rounded-lg px-3 py-1.5 flex items-center gap-1"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" /> Geri Dön
                  </button>
                </div>

                {/* ── Library / Classroom Booking ── */}
                {(serviceType === 'library' || serviceType === 'classroom') && (
                  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
                    {!selectedRoom ? (
                      /* Room Selection */
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-base font-black text-slate-900">
                            1. {serviceType === 'library' ? 'Çalışma Odası' : 'Derslik'} Seçimi
                          </h3>
                          <span className="text-xs text-slate-400">{getRooms().length} seçenek</span>
                        </div>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                          {getRooms().map((room: any) => (
                            <div
                              key={room.id}
                              onClick={() => setSelectedRoom(room.id)}
                              className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white hover:border-primary/50 transition-all hover:shadow-md"
                            >
                              <div className="relative h-36 w-full bg-slate-50">
                                <img src={room.image} alt={room.name} className="h-full w-full object-cover group-hover:scale-103 transition-transform duration-500" />
                                <span className="absolute right-3 top-3 rounded-lg bg-white/95 px-2.5 py-1 text-xs font-bold text-slate-800 shadow-sm flex items-center gap-1">
                                  <Star className="h-3 w-3 text-amber-500 fill-amber-500" /> {room.rating}
                                </span>
                                {room.type && (
                                  <span className={`absolute left-3 top-3 rounded-lg px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${
                                    room.type === 'silent' ? 'bg-blue-500 text-white' :
                                    room.type === 'group' ? 'bg-emerald-500 text-white' :
                                    room.type === 'project' ? 'bg-amber-500 text-white' :
                                    room.type === 'lecture' ? 'bg-indigo-500 text-white' :
                                    room.type === 'seminar' ? 'bg-pink-500 text-white' :
                                    room.type === 'lab' ? 'bg-orange-500 text-white' :
                                    'bg-slate-500 text-white'
                                  }`}>
                                    {room.type === 'silent' ? 'Sessiz' :
                                     room.type === 'group' ? 'Grup' :
                                     room.type === 'project' ? 'Proje' :
                                     room.type === 'lecture' ? 'Derslik' :
                                     room.type === 'seminar' ? 'Seminer' :
                                     room.type === 'lab' ? 'Laboratuvar' :
                                     room.type}
                                  </span>
                                )}
                              </div>
                              <div className="p-4 space-y-2">
                                <div className="flex justify-between items-center">
                                  <h4 className="text-sm font-black text-slate-800 group-hover:text-primary transition-colors">{room.name}</h4>
                                  <span className="text-[11px] font-bold text-slate-500 bg-slate-100 rounded-full px-2 py-0.5">{room.capacity}</span>
                                </div>
                                <p className="text-xs text-slate-400 leading-normal">{room.description}</p>
                                <p className="text-[10px] text-slate-400 font-medium">📍 {room.floor}</p>

                                <div className="flex justify-end pt-2 border-t border-slate-50">
                                  <span className="text-xs font-bold text-primary flex items-center gap-1">
                                    Seç ve Planla <ChevronRight className="h-3.5 w-3.5" />
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {getRooms().length === 0 && (
                          <div className="rounded-2xl border border-dashed border-slate-300 py-10 text-center text-slate-500 bg-white">
                            <HelpCircle className="mx-auto h-10 w-10 text-slate-300 mb-2.5" />
                            <h4 className="text-xs font-bold text-slate-700">
                              {serviceType === 'library' ? 'Kütüphane odası' : 'Derslik'} bulunamadı
                            </h4>
                            <p className="text-[10px] text-slate-400 mt-1">Bu üniversite için henüz oda tanımlanmamış.</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Time & Details Selection */
                      <div className="space-y-5">
                        {/* Selected room preview */}
                        {(() => {
                          const rooms = getRooms()
                          const room = rooms.find((r: any) => r.id === selectedRoom)
                          if (!room) return null
                          return (
                            <div className="flex items-center justify-between rounded-2xl border border-primary/20 bg-primary/4 p-4">
                              <div className="flex items-center gap-3">
                                <div className="h-12 w-12 overflow-hidden rounded-xl bg-slate-100 shrink-0">
                                  <img src={room.image} alt={room.name} className="h-full w-full object-cover" />
                                </div>
                                <div>
                                  <h4 className="text-sm font-black text-slate-900">{room.name}</h4>
                                  <p className="text-xs text-slate-500">📍 {room.floor} • Max: {room.capacity}</p>
                                </div>
                              </div>
                              <button
                                onClick={() => setSelectedRoom(null)}
                                className="text-xs font-bold text-slate-500 hover:text-slate-700 bg-white border border-slate-200 rounded-lg px-2.5 py-1"
                              >
                                Değiştir
                              </button>
                            </div>
                          )
                        })()}

                        {/* Date Picker */}
                        <div className="space-y-2">
                          <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                            <CalendarRange className="h-4 w-4 text-slate-400" />
                            Rezervasyon Tarihi
                          </label>
                          <div className="flex gap-2 overflow-x-auto pb-1">
                            {availableDates.map((dt) => {
                              const isSelected = selectedDate === dt
                              return (
                                <button
                                  key={dt}
                                  onClick={() => setSelectedDate(dt)}
                                  className={`shrink-0 rounded-xl px-4 py-2.5 text-xs font-extrabold border transition-all ${
                                    isSelected
                                      ? 'bg-primary border-primary text-white'
                                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                  }`}
                                >
                                  {dt.split(' ')[0]} {dt.split(' ')[1].substring(0, 3)}
                                </button>
                              )
                            })}
                          </div>
                        </div>

                        {/* Time Slots */}
                        <div className="space-y-2">
                          <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                            <Clock className="h-4 w-4 text-slate-400" />
                            Saat Dilimi
                          </label>
                          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                            {timeSlots.map((slot) => {
                              const isSelected = selectedTime === slot
                              return (
                                <button
                                  key={slot}
                                  onClick={() => setSelectedTime(slot)}
                                  className={`rounded-xl py-3 text-xs font-bold text-center border transition-all ${
                                    isSelected
                                      ? 'bg-primary border-primary text-white shadow-sm shadow-primary/20'
                                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                                  }`}
                                >
                                  {slot}
                                </button>
                              )
                            })}
                          </div>
                        </div>

                        {/* Notes */}
                        <div className="space-y-2">
                          <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Açıklama / Çalışma Konusu (İsteğe Bağlı)</label>
                          <textarea
                            placeholder="Örn: Final projesi sunum çalışması yapacağız."
                            value={agenda}
                            onChange={(e) => setAgenda(e.target.value)}
                            rows={3}
                            className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
                          />
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-3 border-t border-slate-100">
                          <button
                            onClick={() => setSelectedRoom(null)}
                            className="w-1/3 rounded-xl border border-slate-200 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50"
                          >
                            Geri Dön
                          </button>
                          <button
                            onClick={() => {
                              const rooms = getRooms()
                              const room = rooms.find((r: any) => r.id === selectedRoom)
                              if (room) handleBookRoom(room, serviceType as 'library' | 'classroom')
                            }}
                            className="w-2/3 rounded-xl bg-primary py-3 text-xs font-bold text-white shadow-md shadow-primary/20 hover:bg-primary/95 transition-all"
                          >
                            Rezervasyonu Tamamla (Ücretsiz)
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ── Academician Booking ── */}
                {serviceType === 'academician' && (
                  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
                    {!selectedAcademician ? (
                      /* Academician Selection */
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-base font-black text-slate-900">1. Akademisyen Seçimi</h3>
                          <span className="text-xs text-slate-400">{getAcademicians().length} akademisyen</span>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          {getAcademicians().map((acad: any) => {
                            const hasSlots = acad.slots && acad.slots.length > 0
                            return (
                              <div
                                key={acad.id}
                                onClick={() => hasSlots && setSelectedAcademician(acad.id)}
                                className={`group flex items-center justify-between rounded-2xl border p-4 transition-all ${
                                  hasSlots
                                    ? 'cursor-pointer border-slate-200 hover:border-primary/50 hover:bg-slate-50/50 hover:shadow-sm'
                                    : 'border-slate-100 bg-slate-50/40 opacity-60 cursor-not-allowed'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className="relative h-11 w-11 overflow-hidden rounded-full bg-slate-100">
                                    <img src={acad.avatar} alt={acad.name} className="h-full w-full object-cover" />
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-black text-slate-900">{acad.name}</h4>
                                    <p className="text-xs text-slate-400">{acad.department}</p>
                                    <span className="text-[10px] text-amber-500 font-bold">⭐ {acad.rating} ({acad.reviews} yorum)</span>
                                  </div>
                                </div>

                                <div className="text-right">
                                  <span className={`inline-block rounded-full px-2 py-0.5 text-[9px] font-bold ${
                                    hasSlots ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                                  }`}>
                                    {hasSlots ? 'Müsait' : 'Meşgul'}
                                  </span>
                                  {hasSlots && (
                                    <ChevronRight className="h-4 w-4 text-slate-400 ml-auto mt-2 group-hover:text-primary transition-colors" />
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>

                        {getAcademicians().length === 0 && (
                          <div className="rounded-2xl border border-dashed border-slate-300 py-10 text-center text-slate-500 bg-white">
                            <HelpCircle className="mx-auto h-10 w-10 text-slate-300 mb-2.5" />
                            <h4 className="text-xs font-bold text-slate-700">Akademisyen bulunamadı</h4>
                            <p className="text-[10px] text-slate-400 mt-1">Bu üniversite için kayıtlı akademisyen yok.</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Academician Time & Details */
                      <div className="space-y-5">
                        {/* Selected academician preview */}
                        {(() => {
                          const acads = getAcademicians()
                          const acad = acads.find((a: any) => a.id === selectedAcademician)
                          if (!acad) return null
                          return (
                            <>
                              <div className="flex items-center justify-between rounded-2xl border border-primary/20 bg-primary/4 p-4">
                                <div className="flex items-center gap-3">
                                  <div className="h-11 w-11 overflow-hidden rounded-full bg-slate-100 shrink-0">
                                    <img src={acad.avatar} alt={acad.name} className="h-full w-full object-cover" />
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-black text-slate-900">{acad.name}</h4>
                                    <p className="text-xs text-slate-500">{acad.department} • {acad.tag}</p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => setSelectedAcademician(null)}
                                  className="text-xs font-bold text-slate-500 hover:text-slate-700 bg-white border border-slate-200 rounded-lg px-2.5 py-1"
                                >
                                  Değiştir
                                </button>
                              </div>

                              {/* Date */}
                              <div className="space-y-2">
                                <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                                  <CalendarRange className="h-4 w-4 text-slate-400" />
                                  Randevu Tarihi
                                </label>
                                <div className="flex gap-2 overflow-x-auto pb-1">
                                  {availableDates.map((dt) => {
                                    const isSelected = selectedDate === dt
                                    return (
                                      <button
                                        key={dt}
                                        onClick={() => setSelectedDate(dt)}
                                        className={`shrink-0 rounded-xl px-4 py-2.5 text-xs font-extrabold border transition-all ${
                                          isSelected
                                            ? 'bg-primary border-primary text-white shadow-sm shadow-primary/20'
                                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                        }`}
                                      >
                                        {dt}
                                      </button>
                                    )
                                  })}
                                </div>
                              </div>

                              {/* Time slots from academician */}
                              <div className="space-y-2">
                                <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                                  <Clock className="h-4 w-4 text-slate-400" />
                                  Randevu Saati
                                </label>
                                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                                  {acad.slots.map((slot: string) => {
                                    const isSelected = selectedTime === slot
                                    return (
                                      <button
                                        key={slot}
                                        onClick={() => setSelectedTime(slot)}
                                        className={`rounded-xl py-3 text-xs font-bold text-center border transition-all ${
                                          isSelected
                                            ? 'bg-primary border-primary text-white shadow-sm'
                                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                                        }`}
                                      >
                                        {slot}
                                      </button>
                                    )
                                  })}
                                </div>
                              </div>

                              {/* Topic */}
                              <div className="space-y-2">
                                <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Görüşme Konusu / Notlar</label>
                                <textarea
                                  placeholder="Örn: Bitirme projesi hakkında danışmanlık almak istiyorum."
                                  value={agenda}
                                  onChange={(e) => setAgenda(e.target.value)}
                                  rows={3}
                                  className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
                                />
                              </div>

                              {/* Actions */}
                              <div className="flex gap-3 pt-3 border-t border-slate-100">
                                <button
                                  onClick={() => setSelectedAcademician(null)}
                                  className="w-1/3 rounded-xl border border-slate-200 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50"
                                >
                                  Geri Dön
                                </button>
                                <button
                                  onClick={() => handleBookAcademician(acad)}
                                  className="w-2/3 rounded-xl bg-primary py-3 text-xs font-bold text-white shadow-md shadow-primary/20 hover:bg-primary/95 transition-all"
                                >
                                  Randevu Al (Ücretsiz)
                                </button>
                              </div>
                            </>
                          )
                        })()}
                      </div>
                    )}
                  </div>
                )}

                {/* Success Overlay */}
                <AnimatePresence>
                  {bookingSuccess && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="rounded-3xl border border-emerald-200 bg-emerald-50/50 p-6 shadow-sm flex flex-col items-center text-center space-y-4"
                    >
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                        <CheckCircle2 className="h-7 w-7" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">Rezervasyonunuz Onaylandı!</h3>
                        <p className="text-xs text-slate-500 mt-1">
                          {selectedUniversity?.name} veri tabanına işlendi. İşleminiz tamamen ücretsizdir.
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-white p-4 max-w-sm w-full text-left text-xs space-y-1">
                        <p className="text-slate-400">Rezervasyon: <span className="font-extrabold text-slate-800">{bookingSuccess.title}</span></p>
                        <p className="text-slate-400">Detay: <span className="font-semibold text-slate-700">{bookingSuccess.subtitle}</span></p>
                        <p className="text-slate-400">Tarih / Saat: <span className="font-extrabold text-slate-800">{bookingSuccess.date} • {bookingSuccess.time}</span></p>
                      </div>

                      <div className="flex gap-2 w-full max-w-xs">
                        <button
                          onClick={() => setShowQrModal(bookingSuccess.id)}
                          className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1"
                        >
                          <QrCode className="h-4 w-4" /> Bilet / QR Gör
                        </button>
                        <button
                          onClick={() => {
                            setBookingSuccess(null)
                            setCurrentStep('service')
                            resetForm()
                          }}
                          className="flex-1 rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white hover:bg-slate-800"
                        >
                          Yeni Rezervasyon
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* ── Right Column: Active Bookings List ── */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-950 flex items-center gap-1.5">
              <BookMarked className="h-5 w-5 text-slate-500" />
              Aktif Randevularım
            </h3>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
              {bookings.length} Kayıt
            </span>
          </div>

          <div className="space-y-4">
            {bookings.map((booking) => (
              <motion.div
                key={booking.id}
                layout
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3"
              >
                <div className="flex gap-3">
                  <div className="h-14 w-20 overflow-hidden rounded-xl bg-slate-50 shrink-0">
                    <img src={booking.image} alt={booking.title} className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className={`inline-block rounded px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider mb-1 ${
                      booking.category === 'teacher'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        : booking.category === 'classroom'
                        ? 'bg-purple-50 text-purple-700 border border-purple-100'
                        : 'bg-blue-50 text-blue-700 border border-blue-100'
                    }`}>
                      {booking.category === 'teacher' ? 'Akademisyen' : booking.category === 'classroom' ? 'Derslik' : 'Kütüphane'}
                    </span>
                    <h4 className="truncate text-xs font-black text-slate-900">{booking.title}</h4>
                    <p className="truncate text-[10px] text-slate-500">📍 {booking.subtitle}</p>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-[10px] text-slate-400">
                  <div>
                    <span className="font-semibold text-slate-700">{booking.date}</span>
                    <span className="mx-1">•</span>
                    <span className="font-bold text-slate-950">{booking.time}</span>
                  </div>

                  <div className="flex gap-1.5">
                    <button
                      onClick={() => setShowQrModal(booking.id)}
                      className="rounded-lg border border-slate-200 bg-white p-1.5 hover:bg-slate-50"
                      title="Giriş Kodu (QR)"
                    >
                      <QrCode className="h-3.5 w-3.5 text-slate-500" />
                    </button>
                    <button
                      onClick={() => setCancelTarget(booking.id)}
                      className="rounded-lg border border-red-100 bg-white px-2 py-1.5 text-red-600 hover:bg-red-50 font-bold"
                    >
                      İptal
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}

            {bookings.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-300 py-10 text-center text-slate-500 bg-white">
                <HelpCircle className="mx-auto h-10 w-10 text-slate-300 mb-2.5" />
                <h4 className="text-xs font-bold text-slate-700">Aktif Randevunuz Yok</h4>
                <p className="text-[10px] text-slate-400 mt-1">Üniversite seçerek kütüphane, derslik veya akademisyen randevusu oluşturun.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── QR Code Ticket Modal ── */}
      <AnimatePresence>
        {showQrModal && (
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
              <h3 className="text-lg font-bold text-slate-900">Kampüs Geçiş Biletiniz</h3>
              <p className="text-xs text-slate-500 mt-1">Girişte veya kütüphane kapısında barkodu okutun.</p>

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

              <div className="rounded-xl bg-slate-50 p-3 text-left text-xs font-semibold text-slate-600">
                <p>Geçiş Kodu: <span className="font-bold text-slate-900">SCH-{showQrModal.toUpperCase()}</span></p>
                <p className="mt-1">Üniversite: <span className="font-bold text-slate-900">{selectedUniversity?.name || 'Kampüs'}</span></p>
                <p className="mt-1">Durum: <span className="font-bold text-emerald-600">Onaylı Aktif Geçiş</span></p>
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
              <h3 className="text-lg font-bold text-slate-900">Rezervasyonu İptal Et?</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Bu randevu kaydını iptal etmek istediğinizden emin misiniz? Bu işlem geri alınamaz ve ilgili oda/akademisyen tekrar müsait durumuna geçer.
              </p>

              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => setCancelTarget(null)}
                  className="w-1/2 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Vazgeç
                </button>
                <button
                  onClick={() => handleCancelBooking(cancelTarget)}
                  className="w-1/2 rounded-xl bg-red-600 py-3 text-sm font-semibold text-white hover:bg-red-700"
                >
                  Evet, İptal Et
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
