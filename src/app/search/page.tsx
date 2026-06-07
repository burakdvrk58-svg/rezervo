'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Navbar } from '@/components/common/Navbar'
import { Footer } from '@/components/common/Footer'
import {
  Search,
  Star,
  ArrowRight,
  BookOpen
} from 'lucide-react'

function SearchContent() {
  const [universities, setUniversities] = useState<any[]>([])
  const [academicians, setAcademicians] = useState<any[]>([])
  const [bookings, setBookings] = useState<any[]>([])
  
  const [selectedUnivId, setSelectedUnivId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDept, setSelectedDept] = useState<string>('all')
  const [minRating, setMinRating] = useState<number | null>(null)
  
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadData() {
      try {
        const acadRes = await fetch('/api/academicians')
        if (!acadRes.ok) throw new Error('Veriler yüklenemedi.')
        const acadData = await acadRes.json()
        setUniversities(acadData.universities || [])
        setAcademicians(acadData.academicians || [])

        // Fetch bookings to calculate real-time available slots
        const bookingsRes = await fetch('/api/bookings')
        if (bookingsRes.ok) {
          const bookingsData = await bookingsRes.json()
          setBookings(bookingsData)
        }
      } catch (err) {
        setError('Bilgiler yüklenirken bir hata oluştu.')
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  // Filter academicians based on selection and searches
  const filteredAcademicians = academicians.filter((acad) => {
    if (selectedUnivId && acad.universityId !== selectedUnivId) return false
    
    const matchesSearch =
      acad.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acad.department.toLowerCase().includes(searchQuery.toLowerCase())
    if (!matchesSearch) return false

    if (selectedDept !== 'all' && acad.department !== selectedDept) return false
    if (minRating && acad.rating < minRating) return false

    return true
  })

  // Get list of unique departments for the selected university
  const departments = Array.from(
    new Set(
      academicians
        .filter((a) => !selectedUnivId || a.universityId === selectedUnivId)
        .map((a) => a.department)
    )
  )

  const selectedUniv = universities.find((u) => u.id === selectedUnivId)

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {isLoading ? (
            <div className="flex h-96 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center text-red-800">
              <p className="font-bold">{error}</p>
            </div>
          ) : (
            <div className="space-y-8">
              
              {/* ── Step 1: Select University ── */}
              <AnimatePresence mode="wait">
                {!selectedUnivId ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <div className="text-center space-y-2 max-w-2xl mx-auto">
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">Aşama 1 / 2</span>
                      <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Üniversite Seçimi Yapın</h2>
                      <p className="text-sm text-slate-500">
                        Görüşmek istediğiniz akademisyenin bağlı olduğu üniversiteyi seçerek müsaitlik takvimlerine erişin.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto pt-4">
                      {universities.map((univ) => (
                        <motion.button
                          key={univ.id}
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedUnivId(univ.id)}
                          className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-sm transition-all hover:shadow-md hover:border-primary/50 group"
                        >
                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-2xl group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                            {univ.logo}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-slate-900 truncate group-hover:text-primary transition-colors">{univ.name}</h3>
                            <p className="text-xs text-slate-400 mt-0.5">{univ.shortName} • Akademisyen Listesi</p>
                          </div>
                          <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  
                  /* ── Step 2: Select Academician ── */
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                  >
                    {/* Header */}
                    <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3.5">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-2xl text-primary">
                          {selectedUniv?.logo}
                        </div>
                        <div>
                          <h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl">
                            {selectedUniv?.name}
                          </h1>
                          <p className="text-xs text-slate-400 font-semibold mt-0.5">
                            Akademisyen & Görüşme Saatleri Listesi
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedUnivId(null)
                          setSelectedDept('all')
                          setSearchQuery('')
                        }}
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        Üniversiteyi Değiştir
                      </button>
                    </div>

                    {/* Main search layout */}
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                      
                      {/* Sidebar Filters */}
                      <div className="space-y-6 lg:col-span-1">
                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
                          
                          {/* Search */}
                          <div className="space-y-1.5">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Akademisyen Ara</h4>
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                              <input
                                type="text"
                                placeholder="İsim veya bölüm..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-4 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/10"
                              />
                            </div>
                          </div>

                          {/* Departments filter */}
                          <div className="space-y-3 border-t border-slate-100 pt-5">
                            <div className="flex justify-between items-center">
                              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Bölümler</h4>
                              {selectedDept !== 'all' && (
                                <button
                                  onClick={() => setSelectedDept('all')}
                                  className="text-[10px] font-bold text-primary hover:underline"
                                >
                                  Temizle
                                </button>
                              )}
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <button
                                onClick={() => setSelectedDept('all')}
                                className={`text-left rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all ${
                                  selectedDept === 'all' ? 'bg-primary/5 text-primary font-bold' : 'text-slate-600 hover:bg-slate-50'
                                }`}
                              >
                                Tüm Bölümler
                              </button>
                              {departments.map((dept: any) => (
                                <button
                                  key={dept}
                                  onClick={() => setSelectedDept(dept)}
                                  className={`text-left rounded-lg px-2.5 py-1.5 text-xs font-semibold truncate transition-all ${
                                    selectedDept === dept ? 'bg-primary/5 text-primary font-bold' : 'text-slate-600 hover:bg-slate-50'
                                  }`}
                                >
                                  {dept}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Rating filter */}
                          <div className="space-y-3 border-t border-slate-100 pt-5">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Değerlendirme</h4>
                            <div className="space-y-2">
                              {[4.8, 4.5].map((val) => (
                                <label key={val} className="flex items-center gap-2.5 text-xs font-semibold text-slate-600 cursor-pointer select-none">
                                  <input
                                    type="radio"
                                    name="rating-filter"
                                    checked={minRating === val}
                                    onChange={() => setMinRating(val)}
                                    className="h-4.5 w-4.5 border-slate-300 text-primary focus:ring-primary/20"
                                  />
                                  <span className="flex items-center gap-1">
                                    {val}+ Yıldız
                                  </span>
                                </label>
                              ))}
                              {minRating && (
                                <button
                                  onClick={() => setMinRating(null)}
                                  className="text-[10px] font-bold text-red-500 hover:underline pt-1 block"
                                >
                                  Filtreyi Kaldır
                                </button>
                              )}
                            </div>
                          </div>

                        </div>
                      </div>

                      {/* Academicians list */}
                      <div className="space-y-4 lg:col-span-3">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                          <p className="text-xs font-bold text-slate-500">
                            {filteredAcademicians.length} akademisyen listeleniyor
                          </p>
                        </div>

                        <div className="space-y-5">
                          {filteredAcademicians.map((acad) => {
                            // Calculate availability live from bookings database
                            const activeBookings = bookings.filter(
                              (b: any) =>
                                b.academicianId === acad.id &&
                                b.status !== 'İptal Edildi' &&
                                b.status !== 'Reddedildi'
                            )
                            const totalSlots = acad.slots?.length || 0
                            const bookedCount = activeBookings.length
                            const availableCount = Math.max(0, totalSlots - bookedCount)
                            const availabilityPercent = totalSlots > 0 ? (availableCount / totalSlots) * 100 : 0

                            return (
                              <motion.div
                                key={acad.id}
                                layout
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md md:flex-row md:items-center gap-5"
                              >
                                {/* Avatar */}
                                <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-slate-100 mx-auto md:mx-0">
                                  <img
                                    src={acad.avatar}
                                    alt={acad.name}
                                    className="h-full w-full object-cover"
                                  />
                                </div>

                                {/* Body details */}
                                <div className="flex-1 space-y-2.5 text-center md:text-left min-w-0">
                                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs font-semibold">
                                    <span className="rounded-lg bg-slate-100 border border-slate-200 px-2 py-0.5 text-[10px] text-slate-500">
                                      {acad.department}
                                    </span>
                                    <div className="flex items-center gap-0.5 text-amber-500 shrink-0">
                                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                      <span>{acad.rating}</span>
                                    </div>
                                    <span className="text-slate-400">({acad.reviews} görüşme)</span>
                                  </div>

                                  <div>
                                    <h3 className="text-lg font-extrabold text-slate-900 leading-snug">{acad.name}</h3>
                                    <p className="text-xs text-slate-400 mt-0.5">{acad.tag}</p>
                                  </div>

                                  {/* Availability Progress Bar */}
                                  <div className="space-y-1 max-w-sm mx-auto md:mx-0">
                                    <div className="flex justify-between text-[10px] font-bold">
                                      <span className="text-slate-400">Görüşme Müsaitliği</span>
                                      <span className={availableCount > 0 ? 'text-emerald-600' : 'text-rose-500'}>
                                        {availableCount === 0 ? 'Dolu' : `${availableCount} / ${totalSlots} Slot Müsait`}
                                      </span>
                                    </div>
                                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                                      <div
                                        style={{ width: `${availabilityPercent}%` }}
                                        className={`h-full transition-all duration-500 ${
                                          availableCount === 0
                                            ? 'bg-rose-500'
                                            : availableCount < 3
                                            ? 'bg-amber-500'
                                            : 'bg-emerald-500'
                                        }`}
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* Selection Action */}
                                <div className="flex flex-col items-center shrink-0 border-t border-slate-100 pt-4 md:border-t-0 md:pt-0">
                                  <Link
                                    href={`/checkout?academicianId=${acad.id}&university=${encodeURIComponent(selectedUniv?.name || '')}`}
                                    className="w-full md:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-5 py-3 text-xs font-bold text-white shadow-sm shadow-primary/20 hover:bg-primary/95 hover:shadow-md transition-all active:scale-97 cursor-pointer"
                                  >
                                    Seç ve Randevu Al
                                    <ArrowRight className="h-4 w-4" />
                                  </Link>
                                </div>
                              </motion.div>
                            )
                          })}

                          {filteredAcademicians.length === 0 && (
                            <div className="rounded-3xl border border-dashed border-slate-300 bg-white py-12 text-center text-slate-500">
                              <BookOpen className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                              <h3 className="text-base font-bold text-slate-700">Akademisyen Bulunamadı</h3>
                              <p className="text-xs text-slate-400 mt-1">Arama kriterlerinize veya filtrelere uyan akademisyen kaydı bulunamadı.</p>
                            </div>
                          )}
                        </div>
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}
