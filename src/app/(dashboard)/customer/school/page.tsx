'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GraduationCap,
  BookOpen,
  Users,
  Clock,
  ChevronRight,
  CheckCircle2,
  QrCode,
  CalendarRange,
  BookMarked,
  XCircle,
  HelpCircle
} from 'lucide-react'

// Mock Data
const TEACHERS = [
  {
    id: 't-1',
    name: 'Ahmet Yılmaz',
    subject: 'Matematik Öğretmeni',
    department: 'Sayısal Bölümler',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&h=120&fit=crop&crop=faces',
    rating: '4.9',
    status: 'Müsait',
    slots: ['09:30', '10:45', '14:00', '15:15']
  },
  {
    id: 't-2',
    name: 'Elif Kaya',
    subject: 'Fizik Öğretmeni',
    department: 'Sayısal Bölümler',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=faces',
    rating: '4.8',
    status: 'Müsait',
    slots: ['11:00', '13:30', '14:45']
  },
  {
    id: 't-3',
    name: 'Zeynep Çelik',
    subject: 'Kimya Öğretmeni',
    department: 'Sayısal Bölümler',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&crop=faces',
    rating: '5.0',
    status: 'Meşgul',
    slots: []
  },
  {
    id: 't-4',
    name: 'Ömer Demir',
    subject: 'Tarih Öğretmeni',
    department: 'Sözel Bölümler',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=faces',
    rating: '4.7',
    status: 'Müsait',
    slots: ['09:00', '10:00', '11:15', '16:00']
  }
]

const LIBRARY_ROOMS = [
  {
    id: 'r-1',
    name: 'Oda 101 (Grup Çalışma)',
    capacity: '6-8 Kişi',
    description: 'Akıllı tahta, projeksiyon ve beyaz tahta donanımlı.',
    floor: 'Kat 1, Doğu Kanadı',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=300&h=200&fit=crop',
    rating: '4.9',
    type: 'group'
  },
  {
    id: 'r-2',
    name: 'Oda 102 (Bireysel Sessiz)',
    capacity: '1 Kişi',
    description: 'Ergonomik çalışma sandalyesi, bireysel priz ve sessiz kabin.',
    floor: 'Kat 1, Batı Kanadı',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=300&h=200&fit=crop',
    rating: '4.7',
    type: 'silent'
  },
  {
    id: 'r-3',
    name: 'Proje & Tasarım Odası',
    capacity: '4-6 Kişi',
    description: 'Yüksek performanslı bilgisayarlar ve geniş çizim masaları.',
    floor: 'Kat 2, Orta Alan',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=300&h=200&fit=crop',
    rating: '4.8',
    type: 'project'
  }
]



export default function SchoolPanelPage() {
  const [activeSubTab, setActiveSubTab] = useState<'library' | 'teacher'>('library')
  const [bookings, setBookings] = useState<any[]>([])

  useEffect(() => {
    document.title = 'Okul Rezervasyon Portalı | Rezervo'
    
    // Fetch initial bookings from persistent database
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

  // Booking Flow States
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState('08 Haziran 2026')
  const [selectedTime, setSelectedTime] = useState('')
  const [studentId, setStudentId] = useState('')
  const [studentName, setStudentName] = useState('')
  const [agenda, setAgenda] = useState('')

  // UI Flow Controls
  const [bookingSuccess, setBookingSuccess] = useState<any>(null)
  const [showQrModal, setShowQrModal] = useState<string | null>(null)
  const [cancelTarget, setCancelTarget] = useState<string | null>(null)
  const [showToast, setShowToast] = useState<string | null>(null)

  // Filter Categories
  const [teacherDept, setTeacherDept] = useState('all')

  const filteredTeachers = TEACHERS.filter(
    (t) => teacherDept === 'all' || t.department === teacherDept
  )

  const triggerToast = (msg: string) => {
    setShowToast(msg)
    setTimeout(() => setShowToast(null), 3500)
  }

  // Handle Booking Submit
  const handleBookLibrary = async (room: any) => {
    if (!selectedTime) {
      alert('Lütfen bir saat dilimi seçin.')
      return
    }

    const newBooking = {
      category: 'library',
      title: room.name,
      subtitle: room.floor,
      date: selectedDate,
      time: selectedTime,
      details: `${agenda || 'Bireysel/Grup ders çalışma oturumu'} • Kapasite: ${room.capacity}`,
      image: room.image
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
        triggerToast('Kütüphane çalışma odası başarıyla rezerve edildi!')
        resetForm()
      } else {
        alert('Rezervasyon oluşturulurken bir hata oluştu.')
      }
    } catch (err) {
      console.error(err)
      alert('Rezervasyon oluşturulurken bir bağlantı hatası oluştu.')
    }
  }

  const handleBookTeacher = async (teacher: any) => {
    if (!selectedTime) {
      alert('Lütfen bir görüşme saati seçin.')
      return
    }
    if (!studentId || !studentName) {
      alert('Lütfen öğrenci numarasını ve adını soyadını yazın.')
      return
    }

    const newBooking = {
      category: 'teacher',
      title: `${teacher.name} ile Görüşme`,
      subtitle: `${teacher.subject} • Zümre Odası`,
      date: selectedDate,
      time: selectedTime,
      details: `${agenda || 'Gelişim ve durum değerlendirmesi'} • Öğrenci: ${studentName} (${studentId})`,
      image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=200&h=150&fit=crop'
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
        triggerToast('Öğretmen özel görüşme randevusu başarıyla oluşturuldu!')
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

  const resetForm = () => {
    setSelectedRoom(null)
    setSelectedTeacher(null)
    setSelectedTime('')
    setStudentId('')
    setStudentName('')
    setAgenda('')
  }

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
            <span className="text-[11px] font-bold text-primary">Kolej & Okul Modülü</span>
          </div>
          <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Okul Rezervasyon Portalı
          </h1>
          <p className="text-sm text-slate-500">
            Kütüphane çalışma odalarını ve öğretmen görüşmelerini tek bir panelden kolayca rezerve edin.
          </p>
        </div>

        {/* Capacity summary */}
        <div className="flex gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <div className="text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kütüphane Doluluk</span>
            <p className="text-base font-black text-slate-800 mt-0.5">%65</p>
          </div>
          <hr className="h-8 w-px border-l border-slate-200" />
          <div className="text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Öğretmenler</span>
            <p className="text-base font-black text-slate-800 mt-0.5">Müsait</p>
          </div>
        </div>
      </div>

      {/* ── Outer Panel containing Sub-panels ── */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left 2 Columns: Reservation Planner */}
        <div className="space-y-6 lg:col-span-2">
          
          {/* Custom Switch / Tab inside the Panel */}
          <div className="flex rounded-2xl bg-slate-100 p-1">
            <button
              onClick={() => {
                setActiveSubTab('library')
                resetForm()
              }}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-extrabold transition-all ${
                activeSubTab === 'library'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <BookOpen className="h-4.5 w-4.5" />
              Kütüphane Çalışma Odaları
            </button>
            <button
              onClick={() => {
                setActiveSubTab('teacher')
                resetForm()
              }}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-extrabold transition-all ${
                activeSubTab === 'teacher'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Users className="h-4.5 w-4.5" />
              Öğretmen Özel Görüşmeleri
            </button>
          </div>

          {/* Sub-panel 1: Library Study Room booking */}
          {activeSubTab === 'library' && (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
              {!selectedRoom ? (
                // Step 1: Room List selection
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-black text-slate-900">1. Çalışma Odası / Alan Seçimi</h3>
                    <span className="text-xs text-slate-400">Tarih: {selectedDate}</span>
                  </div>

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    {LIBRARY_ROOMS.map((room) => (
                      <div
                        key={room.id}
                        onClick={() => setSelectedRoom(room.id)}
                        className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white hover:border-primary/50 transition-all hover:shadow-md"
                      >
                        <div className="relative h-36 w-full bg-slate-50">
                          <img src={room.image} alt={room.name} className="h-full w-full object-cover group-hover:scale-103 transition-transform duration-500" />
                          <span className="absolute right-3 top-3 rounded-lg bg-white/95 px-2.5 py-1 text-xs font-bold text-slate-800 shadow-sm flex items-center gap-1">
                            ⭐ {room.rating}
                          </span>
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
                </div>
              ) : (
                // Step 2: Time & Details selection
                <div className="space-y-5">
                  {/* Selected room preview card */}
                  {(() => {
                    const room = LIBRARY_ROOMS.find((r) => r.id === selectedRoom)!
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

                  {/* Horizontal Date Picker */}
                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                      <CalendarRange className="h-4 w-4 text-slate-400" />
                      Rezervasyon Tarihi
                    </label>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {['08 Haziran 2026', '09 Haziran 2026', '10 Haziran 2026', '11 Haziran 2026'].map((dt) => {
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

                  {/* Time slots grid */}
                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                      <Clock className="h-4 w-4 text-slate-400" />
                      Saat Dilimi
                    </label>
                    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                      {['09:00 - 11:00', '11:00 - 13:00', '13:00 - 15:00', '15:00 - 17:00'].map((slot) => {
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

                  {/* Booking details / Notes */}
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

                  {/* Actions buttons */}
                  <div className="flex gap-3 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => setSelectedRoom(null)}
                      className="w-1/3 rounded-xl border border-slate-200 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50"
                    >
                      Geri Dön
                    </button>
                    <button
                      onClick={() => handleBookLibrary(LIBRARY_ROOMS.find((r) => r.id === selectedRoom))}
                      className="w-2/3 rounded-xl bg-primary py-3 text-xs font-bold text-white shadow-md shadow-primary/20 hover:bg-primary/95 transition-all"
                    >
                      Rezervasyonu Tamamla (Ücretsiz)
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Sub-panel 2: Teacher Meeting booking */}
          {activeSubTab === 'teacher' && (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
              {!selectedTeacher ? (
                // Step 1: Teacher list selection
                <div className="space-y-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="text-base font-black text-slate-900">1. Öğretmen Seçimi</h3>
                    
                    {/* Department filters */}
                    <div className="flex gap-1 bg-slate-100 rounded-lg p-0.5">
                      {['all', 'Sayısal Bölümler', 'Sözel Bölümler'].map((dept) => (
                        <button
                          key={dept}
                          onClick={() => setTeacherDept(dept)}
                          className={`rounded-md px-2.5 py-1 text-[10px] font-bold transition-all ${
                            teacherDept === dept
                              ? 'bg-white text-slate-800 shadow-sm'
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          {dept === 'all' ? 'Tümü' : dept.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {filteredTeachers.map((teacher) => {
                      const isAvailable = teacher.status === 'Müsait'
                      return (
                        <div
                          key={teacher.id}
                          onClick={() => isAvailable && setSelectedTeacher(teacher.id)}
                          className={`group flex items-center justify-between rounded-2xl border p-4 transition-all ${
                            isAvailable
                              ? 'cursor-pointer border-slate-200 hover:border-primary/50 hover:bg-slate-50/50 hover:shadow-sm'
                              : 'border-slate-100 bg-slate-50/40 opacity-60 cursor-not-allowed'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative h-11 w-11 overflow-hidden rounded-full bg-slate-100">
                              <img src={teacher.avatar} alt={teacher.name} className="h-full w-full object-cover" />
                            </div>
                            <div>
                              <h4 className="text-sm font-black text-slate-900">{teacher.name}</h4>
                              <p className="text-xs text-slate-400">{teacher.subject}</p>
                              <span className="text-[10px] text-amber-500 font-bold">⭐ {teacher.rating} Yorum</span>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className={`inline-block rounded-full px-2 py-0.5 text-[9px] font-bold ${
                              isAvailable ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                            }`}>
                              {teacher.status}
                            </span>
                            {isAvailable && (
                              <ChevronRight className="h-4 w-4 text-slate-400 ml-auto mt-2 group-hover:text-primary transition-colors" />
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ) : (
                // Step 2: Form & Time slot selection
                <div className="space-y-5">
                  {/* Selected teacher preview */}
                  {(() => {
                    const teacher = TEACHERS.find((t) => t.id === selectedTeacher)!
                    return (
                      <div className="flex items-center justify-between rounded-2xl border border-primary/20 bg-primary/4 p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-11 w-11 overflow-hidden rounded-full bg-slate-100 shrink-0">
                            <img src={teacher.avatar} alt={teacher.name} className="h-full w-full object-cover" />
                          </div>
                          <div>
                            <h4 className="text-sm font-black text-slate-900">{teacher.name}</h4>
                            <p className="text-xs text-slate-500">{teacher.subject}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedTeacher(null)}
                          className="text-xs font-bold text-slate-500 hover:text-slate-700 bg-white border border-slate-200 rounded-lg px-2.5 py-1"
                        >
                          Değiştir
                        </button>
                      </div>
                    )
                  })()}

                  {/* Student Credentials Form */}
                  <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Öğrenci No</label>
                      <input
                        type="text"
                        placeholder="Örn: 1420"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Öğrenci Adı Soyadı</label>
                      <input
                        type="text"
                        placeholder="Örn: Alp Demir"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
                      />
                    </div>
                  </div>

                  {/* Date Picker */}
                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                      <CalendarRange className="h-4 w-4 text-slate-400" />
                      Randevu Tarihi
                    </label>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {['08 Haziran 2026', '09 Haziran 2026', '10 Haziran 2026', '11 Haziran 2026'].map((dt) => {
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

                  {/* Time slots */}
                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                      <Clock className="h-4 w-4 text-slate-400" />
                      Randevu Saati
                    </label>
                    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                      {(() => {
                        const teacher = TEACHERS.find((t) => t.id === selectedTeacher)!
                        return teacher.slots.map((slot) => {
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
                        })
                      })()}
                    </div>
                  </div>

                  {/* Agenda/Topic */}
                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Görüşme Konusu / Notlar</label>
                    <textarea
                      placeholder="Örn: Ders başarı durumu, ödev takibi ve sınavlar hakkında bilgi."
                      value={agenda}
                      onChange={(e) => setAgenda(e.target.value)}
                      rows={3}
                      className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
                    />
                  </div>

                  {/* Actions buttons */}
                  <div className="flex gap-3 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => setSelectedTeacher(null)}
                      className="w-1/3 rounded-xl border border-slate-200 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50"
                    >
                      Geri Dön
                    </button>
                    <button
                      onClick={() => handleBookTeacher(TEACHERS.find((t) => t.id === selectedTeacher))}
                      className="w-2/3 rounded-xl bg-primary py-3 text-xs font-bold text-white shadow-md shadow-primary/20 hover:bg-primary/95 transition-all"
                    >
                      Randevu Al (Ücretsiz)
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Success Overlay after booking */}
          <AnimatePresence>
            {bookingSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="rounded-3xl border border-emerald-200 bg-emerald-50/50 p-6 shadow-sm flex flex-col items-center text-center space-y-4"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Rezervasyonunuz Onaylandı!</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Okul veri tabanına işlendi. İşleminiz tamamen ücretsizdir.
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
                    onClick={() => setBookingSuccess(null)}
                    className="flex-1 rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white hover:bg-slate-800"
                  >
                    Yeni Rezervasyon
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Right Column: Active School Bookings List */}
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
                        ? 'bg-purple-50 text-purple-700 border border-purple-100'
                        : 'bg-blue-50 text-blue-700 border border-blue-100'
                    }`}>
                      {booking.category === 'teacher' ? 'Veli-Öğretmen' : 'Kütüphane'}
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
                <p className="text-[10px] text-slate-400 mt-1">Okul kütüphane veya öğretmenler için aktif rezervasyon bulunmamaktadır.</p>
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
              <h3 className="text-lg font-bold text-slate-900">Okul Geçiş Biletiniz</h3>
              <p className="text-xs text-slate-500 mt-1">Girişte veya kütüphane kapısında barkodu okutun.</p>
              
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

              <div className="rounded-xl bg-slate-50 p-3 text-left text-xs font-semibold text-slate-600">
                <p>Geçiş Kodu: <span className="font-bold text-slate-900">SCH-{showQrModal.toUpperCase()}</span></p>
                <p className="mt-1">Kullanıcı: <span className="font-bold text-slate-900">Ahmet Yılmaz (Veli)</span></p>
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
                Bu randevu kaydını iptal etmek istediğinizden emin misiniz? Bu işlem geri alınamaz ve ilgili öğretmen/oda tekrar müsait durumuna geçer.
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
