'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Download
} from 'lucide-react'

const FALLBACK_MONTHLY_DATA = [
  { month: 'Oca', revenue: 85000, bookings: 95, occupancy: 68 },
  { month: 'Şub', revenue: 92000, bookings: 102, occupancy: 72 },
  { month: 'Mar', revenue: 108000, bookings: 120, occupancy: 78 },
  { month: 'Nis', revenue: 115000, bookings: 128, occupancy: 82 },
  { month: 'May', revenue: 128450, bookings: 142, occupancy: 84 },
  { month: 'Haz', revenue: 145000, bookings: 160, occupancy: 92 }
]

const FALLBACK_ROOM_PERFORMANCE = [
  { name: 'Grup Çalışma Odası 1', bookings: 68, revenue: '48.960 TL', occupancy: '%89' },
  { name: 'Bireysel Çalışma Kabini A', bookings: 14, revenue: '9.950 TL', occupancy: '%78' },
  { name: 'Seminer ve Toplantı Odası', bookings: 42, revenue: '28.140 TL', occupancy: '%85' },
  { name: 'Derslik 101', bookings: 18, revenue: '41.400 TL', occupancy: '%62' }
]

export default function BusinessAnalyticsPage() {
  const [timeframe, setTimeframe] = useState<'30' | '6' | '12'>('6')
  const [hoveredBar, setHoveredBar] = useState<number | null>(null)
  const [analytics, setAnalytics] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    document.title = 'Gelir & Analitik Raporu | Rezervo'
    
    async function fetchAnalytics() {
      try {
        const res = await fetch('/api/analytics')
        if (res.ok) {
          const data = await res.json()
          setAnalytics(data)
        }
      } catch (err) {
        console.error('Failed to load live analytics:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  const monthlyData = analytics?.monthlyData || FALLBACK_MONTHLY_DATA
  const roomPerformance = analytics?.roomPerformance || FALLBACK_ROOM_PERFORMANCE
  
  const totalRevenueText = analytics?.totalRevenue 
    ? `${analytics.totalRevenue.toLocaleString('tr-TR')} TL` 
    : '128.450 TL'
  const avgOccupancyText = analytics?.avgOccupancy 
    ? `%${analytics.avgOccupancy}` 
    : '%84'
  const totalBookingsText = analytics?.totalBookings 
    ? `${analytics.totalBookings} Adet` 
    : '142 Adet'
  const avgDailyRateText = analytics?.avgDailyRate 
    ? `${analytics.avgDailyRate.toLocaleString('tr-TR')} TL` 
    : '904 TL'

  const maxRevenue = Math.max(...monthlyData.map((d: any) => d.revenue))

  return (
    <div className="space-y-8 pb-12">
      {/* ── Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Gelir & Analitik Raporu
          </h1>
          <p className="text-sm text-slate-500">
            Tesisinizin doluluk oranları, gelir kırılımları ve performans istatistikleri.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm">
            <Filter className="h-4 w-4" />
            Filtrele
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white hover:bg-primary/95 shadow-md shadow-primary/20">
            <Download className="h-4 w-4" />
            Raporu İndir
          </button>
        </div>
      </div>

      {/* ── Timeframe selector ── */}
      <div className="flex justify-between items-center border-b border-slate-100 pb-4">
        <div className="flex gap-1 bg-slate-100 rounded-xl p-0.5">
          <button
            onClick={() => setTimeframe('30')}
            className={`rounded-lg px-4 py-2 text-xs font-bold transition-all ${
              timeframe === '30' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Son 30 Gün
          </button>
          <button
            onClick={() => setTimeframe('6')}
            className={`rounded-lg px-4 py-2 text-xs font-bold transition-all ${
              timeframe === '6' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Son 6 Ay
          </button>
          <button
            onClick={() => setTimeframe('12')}
            className={`rounded-lg px-4 py-2 text-xs font-bold transition-all ${
              timeframe === '12' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Son 1 Yıl
          </button>
        </div>
        <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          Veri Güncelleme: Canlı (MySQL)
        </span>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : (
        <>
          {/* ── Metric Cards ── */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* Revenue */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider">Toplam Brüt Gelir</span>
                <div className="rounded-lg bg-emerald-50 p-1.5 text-emerald-600">
                  <DollarSign className="h-4.5 w-4.5" />
                </div>
              </div>
              <p className="mt-3 text-2xl font-black text-slate-900">{totalRevenueText}</p>
              <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                <ArrowUpRight className="h-3.5 w-3.5" />
                <span>%12.4</span>
                <span className="text-slate-400 font-semibold ml-0.5">geçen aya göre</span>
              </div>
            </div>

            {/* Occupancy */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider">Ortalama Doluluk</span>
                <div className="rounded-lg bg-blue-50 p-1.5 text-blue-600">
                  <BarChart3 className="h-4.5 w-4.5" />
                </div>
              </div>
              <p className="mt-3 text-2xl font-black text-slate-900">{avgOccupancyText}</p>
              <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                <ArrowUpRight className="h-3.5 w-3.5" />
                <span>%3.2</span>
                <span className="text-slate-400 font-semibold ml-0.5">geçen aya göre</span>
              </div>
            </div>

            {/* Bookings */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider">Rezervasyon Sayısı</span>
                <div className="rounded-lg bg-purple-50 p-1.5 text-purple-600">
                  <Users className="h-4.5 w-4.5" />
                </div>
              </div>
              <p className="mt-3 text-2xl font-black text-slate-900">{totalBookingsText}</p>
              <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                <ArrowUpRight className="h-3.5 w-3.5" />
                <span>%8.6</span>
                <span className="text-slate-400 font-semibold ml-0.5">geçen aya göre</span>
              </div>
            </div>

            {/* Average Daily Rate */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider">Ort. Günlük Fiyat</span>
                <div className="rounded-lg bg-orange-50 p-1.5 text-orange-600">
                  <TrendingUp className="h-4.5 w-4.5" />
                </div>
              </div>
              <p className="mt-3 text-2xl font-black text-slate-900">{avgDailyRateText}</p>
              <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-red-600">
                <ArrowDownRight className="h-3.5 w-3.5" />
                <span>%1.5</span>
                <span className="text-slate-400 font-semibold ml-0.5">geçen aya göre</span>
              </div>
            </div>
          </div>

          {/* ── Main Charts Grid ── */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Bar Chart: Monthly Revenue */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-black text-slate-900">Aylık Gelir Dağılımı (TL)</h3>
                <span className="text-xs text-slate-400">Son 6 Ay Değerleri</span>
              </div>

              {/* SVG Bar Chart with interactivity */}
              <div className="relative h-64 w-full flex items-end justify-between px-2 pt-8">
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none border-b border-slate-100 text-[10px] text-slate-400 pb-6">
                  <div className="border-t border-dashed border-slate-100 w-full pt-1">150.000 TL</div>
                  <div className="border-t border-dashed border-slate-100 w-full pt-1">100.000 TL</div>
                  <div className="border-t border-dashed border-slate-100 w-full pt-1">50.000 TL</div>
                  <div className="w-full pt-1" />
                </div>

                {monthlyData.map((d: any, idx: number) => {
                  const heightPct = maxRevenue > 0 ? (d.revenue / maxRevenue) * 100 : 0
                  const isHovered = hoveredBar === idx
                  return (
                    <div
                      key={d.month}
                      className="relative flex flex-col items-center flex-1 group"
                      onMouseEnter={() => setHoveredBar(idx)}
                      onMouseLeave={() => setHoveredBar(null)}
                    >
                      {/* Tooltip */}
                      <AnimatePresence>
                        {isHovered && (
                          <motion.div
                            initial={{ opacity: 0, y: 5, scale: 0.95 }}
                            animate={{ opacity: 1, y: -4, scale: 1 }}
                            exit={{ opacity: 0, y: 5, scale: 0.95 }}
                            className="absolute bottom-full z-10 rounded-lg bg-slate-900 px-2.5 py-1.5 text-[10px] font-bold text-white shadow-md mb-1.5 pointer-events-none whitespace-nowrap"
                          >
                            {d.revenue.toLocaleString('tr-TR')} TL
                            <br />
                            <span className="text-slate-400 font-semibold">{d.bookings} Rezervasyon</span>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Bar block */}
                      <div className="w-8 sm:w-12 bg-slate-100 rounded-t-lg overflow-hidden h-44 relative flex items-end">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${heightPct}%` }}
                          transition={{ duration: 0.6, ease: 'easeOut' }}
                          className={`w-full rounded-t-lg bg-gradient-to-t ${
                            isHovered ? 'from-primary to-blue-400' : 'from-indigo-600 to-indigo-400'
                          }`}
                        />
                      </div>

                      <span className="text-xs font-bold text-slate-500 mt-2 block">{d.month}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Donut Chart: Booking Channels */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
              <h3 className="text-base font-black text-slate-900">Rezervasyon Kanalları</h3>
              
              <div className="relative flex items-center justify-center h-48">
                <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#F1F5F9" strokeWidth="3.5" />
                  <circle
                    cx="18"
                    cy="18"
                    r="15.915"
                    fill="none"
                    stroke="#2563EB"
                    strokeWidth="3.8"
                    strokeDasharray="45 55"
                    strokeDashoffset="0"
                    className="transition-all duration-300 hover:stroke-[4.5px]"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="15.915"
                    fill="none"
                    stroke="#A855F7"
                    strokeWidth="3.8"
                    strokeDasharray="35 65"
                    strokeDashoffset="-45"
                    className="transition-all duration-300 hover:stroke-[4.5px]"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="15.915"
                    fill="none"
                    stroke="#E2E8F0"
                    strokeWidth="3.8"
                    strokeDasharray="20 80"
                    strokeDashoffset="-80"
                    className="transition-all duration-300 hover:stroke-[4.5px]"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-xl font-black text-slate-900">
                    {analytics?.totalBookings || 142}
                  </span>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Toplam</span>
                </div>
              </div>

              {/* Legends */}
              <div className="space-y-2 text-xs font-semibold">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-slate-500">
                    <span className="h-3 w-3 rounded bg-blue-600 block" />
                    Direkt Rezervasyonlar
                  </span>
                  <span className="text-slate-800 font-bold">%45</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-slate-500">
                    <span className="h-3 w-3 rounded bg-purple-500 block" />
                    Rezervo Mobil
                  </span>
                  <span className="text-slate-800 font-bold">%35</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-slate-500">
                    <span className="h-3 w-3 rounded bg-slate-300 block" />
                    Acenteler & Ortaklar
                  </span>
                  <span className="text-slate-800 font-bold">%20</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Table: Room Performance ── */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-base font-black text-slate-900">Oda Tiplerine / Hizmetlere Göre Performans</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-500">
                <thead className="bg-slate-50 text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3 rounded-l-xl">Oda Tipi / Hizmet</th>
                    <th className="px-4 py-3">Rezervasyon Sayısı</th>
                    <th className="px-4 py-3">Ortalama Doluluk</th>
                    <th className="px-4 py-3 rounded-r-xl text-right">Simüle Edilen Değer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold">
                  {roomPerformance.map((room: any) => (
                    <tr key={room.name} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3.5 font-bold text-slate-900">{room.name}</td>
                      <td className="px-4 py-3.5">{room.bookings} Adet</td>
                      <td className="px-4 py-3.5">{room.occupancy}</td>
                      <td className="px-4 py-3.5 text-right font-black text-slate-900">{room.revenue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
