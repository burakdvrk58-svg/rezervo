'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Navbar } from '@/components/common/Navbar'
import { Footer } from '@/components/common/Footer'
import {
  MapPin,
  Calendar,
  Users,
  Search,
  Star,
  ArrowUpDown,
  Sparkles,
  SlidersHorizontal,
  GraduationCap
} from 'lucide-react'

const HOTELS_DATA = [
  {
    id: 'hotel-1',
    name: 'Grand Deluxe Resort & Spa',
    location: 'Lara, Antalya',
    rating: 4.8,
    reviews: 240,
    price: '3.450 TL',
    rawPrice: 3450,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&h=350&fit=crop',
    tag: 'En Popüler',
    amenities: ['Ücretsiz Wi-Fi', 'Kahvaltı Dahil', 'Açık Havuz', 'Otopark'],
  },
  {
    id: 'hotel-2',
    name: 'Rixos Premium Suites',
    location: 'Belek, Antalya',
    rating: 4.9,
    reviews: 180,
    price: '4.800 TL',
    rawPrice: 4800,
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=500&h=350&fit=crop',
    tag: 'En Yüksek Puan',
    amenities: ['Ücretsiz Wi-Fi', 'Kahvaltı Dahil', 'Açık Havuz', 'Spa', 'Spor Salonu'],
  },
  {
    id: 'hotel-3',
    name: 'Sea View Boutique Hotel',
    location: 'Kaleiçi, Antalya',
    rating: 4.6,
    reviews: 95,
    price: '2.100 TL',
    rawPrice: 2100,
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=500&h=350&fit=crop',
    tag: 'Fiyat Performans',
    amenities: ['Ücretsiz Wi-Fi', 'Kahvaltı Dahil', 'Otopark'],
  },
]

const SCHOOL_DATA = [
  {
    name: 'Kütüphane - Grup Çalışma Odası A',
    location: 'Merkez Kütüphane (Giriş Katı)',
    rating: 4.7,
    reviews: 82,
    price: 'Ücretsiz',
    rawPrice: 0,
    image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=500&h=350&fit=crop',
    tag: 'Kütüphane Rezervasyonu',
    amenities: ['Maks 6 Kişi', 'Projeksiyon / Tahta', 'Sessiz Bölge'],
  },
  {
    id: 'school-3',
    name: 'Elif Hoca ile Birebir Soru Çözümü',
    location: 'Fizik Laboratuvarı (Kat 1)',
    rating: 4.8,
    reviews: 65,
    price: 'Ücretsiz',
    rawPrice: 0,
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=500&h=350&fit=crop',
    tag: 'Öğrenci Görüşmesi',
    amenities: ['20 Dakika', 'Soru Çözümü & Destek', 'Birebir'],
  },
]

function SearchContent() {
  const searchParams = useSearchParams()
  const isSchool = searchParams.get('type') === 'okul'
  
  const initialData = isSchool ? SCHOOL_DATA : HOTELS_DATA
  const [hotels, setHotels] = useState(initialData)
  const [sortBy, setSortBy] = useState<'rating' | 'price-asc' | 'price-desc'>('rating')
  
  // Sidebar filters state
  const [wifiFilter, setWifiFilter] = useState(false)
  const [breakfastFilter, setBreakfastFilter] = useState(false)
  const [minRating, setMinRating] = useState<number | null>(null)

  // Sync data when search params change
  useState(() => {
    setHotels(initialData)
  })

  const handleSort = (sort: 'rating' | 'price-asc' | 'price-desc') => {
    setSortBy(sort)
    let sorted = [...hotels]
    if (sort === 'rating') {
      sorted.sort((a, b) => b.rating - a.rating)
    } else if (sort === 'price-asc') {
      sorted.sort((a, b) => a.rawPrice - b.rawPrice)
    } else if (sort === 'price-desc') {
      sorted.sort((a, b) => b.rawPrice - a.rawPrice)
    }
    setHotels(sorted)
  }

  const filteredHotels = hotels.filter((h) => {
    if (wifiFilter && !h.amenities.includes('Ücretsiz Wi-Fi') && !h.amenities.includes('Birebir')) return false
    if (breakfastFilter && !h.amenities.includes('Kahvaltı Dahil') && !h.amenities.includes('15 Dakika')) return false
    if (minRating && h.rating < minRating) return false
    return true
  })

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* ── Search Summary Header ── */}
          <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl">
                {isSchool ? 'Okul & Kütüphane Rezervasyonları' : 'Antalya Otelleri'}
              </h1>
              <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold text-slate-400">
                {isSchool ? (
                  <>
                    <GraduationCap className="h-3.5 w-3.5 text-primary" />
                    <span>Merkez Kampüs Lisesi</span>
                    <span>•</span>
                    <Calendar className="h-3.5 w-3.5 text-primary" />
                    <span>08 Haziran Pazartesi</span>
                    <span>•</span>
                    <Users className="h-3.5 w-3.5 text-primary" />
                    <span>Öğrenci No: 1420</span>
                  </>
                ) : (
                  <>
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    <span>Antalya, Türkiye</span>
                    <span>•</span>
                    <Calendar className="h-3.5 w-3.5 text-primary" />
                    <span>12 - 19 Haziran (7 Gece)</span>
                    <span>•</span>
                    <Users className="h-3.5 w-3.5 text-primary" />
                    <span>2 Yetişkin, 1 Çocuk</span>
                  </>
                )}
              </p>
            </div>
            
            <div className="flex gap-2">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-50"
              >
                Aramayı Düzenle
              </Link>
            </div>
          </div>

          {/* ── Main Layout ── */}
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-4">
            
            {/* ── Filter Sidebar (Desktop) ── */}
            <div className="space-y-6 lg:col-span-1">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <SlidersHorizontal className="h-4 w-4 text-primary" />
                    Filtreler
                  </h3>
                  <button
                    onClick={() => {
                      setWifiFilter(false)
                      setBreakfastFilter(false)
                      setMinRating(null)
                    }}
                    className="text-[11px] font-semibold text-primary hover:underline"
                  >
                    Temizle
                  </button>
                </div>

                {/* Popular amenities */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {isSchool ? 'Seçenekler' : 'Popüler Özellikler'}
                  </h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-600 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={wifiFilter}
                        onChange={(e) => setWifiFilter(e.target.checked)}
                        className="h-4.5 w-4.5 rounded border-slate-300 text-primary focus:ring-primary/20"
                      />
                      <span>{isSchool ? 'Sadece Bireysel' : 'Ücretsiz Wi-Fi'}</span>
                    </label>
                    <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-600 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={breakfastFilter}
                        onChange={(e) => setBreakfastFilter(e.target.checked)}
                        className="h-4.5 w-4.5 rounded border-slate-300 text-primary focus:ring-primary/20"
                      />
                      <span>{isSchool ? 'Kısa Süreli (< 20dk)' : 'Kahvaltı Dahil'}</span>
                    </label>
                  </div>
                </div>

                {/* Rating filter */}
                <div className="space-y-3 border-t border-slate-100 pt-5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Puan Filtresi</h4>
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
                          {val}+ Memnuniyet
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Results Container ── */}
            <div className="space-y-4 lg:col-span-3">
              
              {/* Sorting Bar */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <p className="text-xs font-bold text-slate-500">
                  {filteredHotels.length} kayıt listeleniyor
                </p>
                
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => handleSort(e.target.value as any)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/10"
                  >
                    <option value="rating">En Yüksek Puan</option>
                    {!isSchool && (
                      <>
                        <option value="price-asc">En Düşük Fiyat</option>
                        <option value="price-desc">En Yüksek Fiyat</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              {/* Cards Grid */}
              <div className="space-y-6">
                {filteredHotels.map((h) => (
                  <motion.div
                    key={h.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md md:flex-row md:items-stretch"
                  >
                    {/* Thumbnail Image */}
                    <div className="relative h-48 w-full shrink-0 md:h-auto md:w-64">
                      <img
                        src={h.image}
                        alt={h.name}
                        className="h-full w-full object-cover"
                      />
                      {h.tag && (
                        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-lg bg-primary px-2.5 py-1 text-[10px] font-bold text-white shadow-md">
                          <Sparkles className="h-3 w-3" />
                          {h.tag}
                        </span>
                      )}
                    </div>

                    {/* Body details */}
                    <div className="flex flex-1 flex-col justify-between p-5 md:p-6">
                      <div className="space-y-2">
                        {/* Rating row */}
                        <div className="flex items-center gap-1.5 text-xs font-semibold">
                          <div className="flex items-center gap-0.5 text-amber-500">
                            <Star className="h-4.5 w-4.5 fill-amber-400 text-amber-400" />
                            <span>{h.rating}</span>
                          </div>
                          <span className="text-slate-400">({h.reviews} Geri Bildirim)</span>
                        </div>

                        {/* Name & Location */}
                        <h3 className="text-lg font-bold text-slate-900">{h.name}</h3>
                        <p className="flex items-center gap-1 text-xs font-medium text-slate-500">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          {h.location}
                        </p>

                        {/* Amenities Row */}
                        <div className="flex flex-wrap gap-2 pt-2">
                          {h.amenities.map((amenity) => (
                            <span key={amenity} className="rounded-lg bg-slate-50 border border-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600">
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Pricing & CTA */}
                      <div className="mt-6 flex items-end justify-between border-t border-slate-100 pt-4">
                        <div>
                          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                            {isSchool ? 'Hizmet Bedeli' : '7 Gece Toplam'}
                          </p>
                          <p className="text-xl font-black text-slate-900">{h.price}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            {isSchool ? 'Okul içi ücretsiz' : 'Vergiler Dahildir'}
                          </p>
                        </div>

                        <Link
                          href={`/checkout?hotel=${encodeURIComponent(h.name)}&price=${encodeURIComponent(h.price)}&type=${isSchool ? 'okul' : 'otel'}`}
                          className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-xs font-bold text-white shadow-sm shadow-primary/20 transition-all hover:bg-primary/95 hover:shadow-md active:scale-98"
                        >
                          Seç ve Devam Et
                        </Link>
                      </div>
                    </div>

                  </motion.div>
                ))}

                {filteredHotels.length === 0 && (
                  <div className="rounded-3xl border border-dashed border-slate-300 bg-white py-12 text-center text-slate-500">
                    <Search className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                    <h3 className="text-base font-bold text-slate-700">Sonuç Bulunamadı</h3>
                    <p className="text-xs text-slate-400 mt-1">Belirlediğiniz filtrelere uygun okul/kütüphane rezervasyon kaydı bulunmuyor.</p>
                  </div>
                )}
            </div>

          </div>

        </div>
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
