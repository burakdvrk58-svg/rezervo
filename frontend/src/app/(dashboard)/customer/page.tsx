'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'

export default function CustomerDashboardPage() {
  const [bookings, setBookings] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  const userName = typeof window !== 'undefined' ? (localStorage.getItem('rezervo_user_name') || 'Ahmet Yılmaz') : 'Ahmet Yılmaz'
  const userId = typeof window !== 'undefined' ? (localStorage.getItem('rezervo_user_id') || 'u-student') : 'u-student'

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(`/api/bookings?userId=${userId}`)
        if (res.ok) {
          const data = await res.json()
          setBookings(data)
        }
      } catch (err) {
        console.error('Veriler yüklenemedi:', err)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [userId])

  // Stats calculation
  const totalBookings = bookings.length
  const approvedBookings = bookings.filter((b) => b.status === 'Onaylandı').length
  const pendingBookings = bookings.filter((b) => b.status === 'Beklemede').length
  
  // Find next appointment (simple sort by date/time, but since dates are string, let's take the first non-cancelled one)
  const upcomingList = bookings.filter((b) => b.status === 'Onaylandı' || b.status === 'Beklemede')
  const nextBooking = upcomingList[0]

  const STAT_CARDS = [
    {
      label: 'Toplam Randevu',
      value: `${totalBookings} Adet`,
      change: 'Akademik Danışmanlık',
      icon: BookOpen,
      color: 'from-blue-500 to-indigo-500',
    },
    {
      label: 'Onaylanan Görüşmeler',
      value: `${approvedBookings} Adet`,
      change: 'Gerçekleşecek toplantılar',
      icon: CheckCircle2,
      color: 'from-emerald-500 to-teal-500',
    },
    {
      label: 'Bekleyen İstekler',
      value: `${pendingBookings} Adet`,
      change: 'Onay bekleyen randevular',
      icon: Clock,
      color: 'from-amber-500 to-orange-500',
    },
    {
      label: 'Yaklaşan Görüşme',
      value: nextBooking ? nextBooking.time : 'Yok',
      change: nextBooking ? nextBooking.date : 'Yakın zamanda randevu yok',
      icon: Calendar,
      color: 'from-purple-500 to-pink-500',
    },
  ]

  const recentActivities = bookings.slice(0, 3).map((b) => {
    let title = ''
    let bgColor = ''
    let icon = BookOpen

    if (b.status === 'Onaylandı') {
      title = 'Randevunuz onaylandı'
      bgColor = 'bg-emerald-50 text-emerald-600'
      icon = CheckCircle2
    } else if (b.status === 'Beklemede') {
      title = 'Yeni görüşme talebi gönderildi'
      bgColor = 'bg-blue-50 text-blue-600'
      icon = Clock
    } else {
      title = 'Randevunuz iptal edildi'
      bgColor = 'bg-red-50 text-red-600'
      icon = AlertCircle
    }

    return {
      title,
      time: b.date,
      description: `${b.academicianName} ile ${b.time} slotundaki görüşmeniz.`,
      icon,
      bgColor
    }
  })

  return (
    <div className="space-y-8">
      
      {/* ── Greeting ── */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Hoş geldin, {userName} 👋
          </h1>
          <p className="text-sm text-slate-500">
            Akademik danışmanlık görüşmelerinizin ve güncel randevularınızın özeti burada.
          </p>
        </div>
        
        <Link
          href="/search"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary/25 transition-all hover:bg-primary/95 hover:shadow-lg active:scale-98"
        >
          Yeni Görüşme Ayarla
        </Link>
      </div>

      {isLoading ? (
        <div className="flex h-48 items-center justify-center rounded-2xl border border-slate-200 bg-white p-5">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : (
        <>
          {/* ── Stats Row ── */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STAT_CARDS.map(({ label, value, change, icon: Icon, color }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                whileHover={{ y: -3 }}
                className="group rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">{label}</span>
                  <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${color} text-white shadow-md shadow-black/5`}>
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                </div>
                
                <p className="mt-3 text-2xl font-extrabold text-slate-900 truncate">{value}</p>
                <p className="mt-1 text-[11px] font-semibold text-slate-400 group-hover:text-slate-500 truncate">{change}</p>
              </motion.div>
            ))}
          </div>

          {/* ── Lower Dashboard Grid ── */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            
            {/* Left 2 Cols: Upcoming Bookings */}
            <div className="space-y-5 lg:col-span-2">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">Yaklaşan Görüşmeler</h2>
                <Link
                  href="/customer/reservations"
                  className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                >
                  Hepsini Gör
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="space-y-4">
                {upcomingList.slice(0, 3).map((res, idx) => {
                  return (
                    <motion.div
                      key={res.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, delay: 0.2 + idx * 0.1 }}
                      className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center"
                    >
                      {/* Image / Avatar */}
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100 mx-auto sm:mx-0">
                        <img
                          src={res.image}
                          alt={res.academicianName}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 space-y-1 text-center sm:text-left">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <h3 className="text-sm font-bold text-slate-900 sm:text-base">{res.title}</h3>
                          <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                            res.status === 'Onaylandı'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                              : 'bg-amber-50 text-amber-700 border-amber-100'
                          }`}>
                            {res.status}
                          </span>
                        </div>
                        
                        <p className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-medium text-slate-600">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          {res.subtitle}
                        </p>

                        <p className="text-xs font-medium text-slate-400">
                          Tarih: <span className="font-semibold text-slate-700">{res.date}</span>
                          <span className="mx-2">•</span>
                          Saat: <span className="font-bold text-primary">{res.time}</span>
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Konu: <span className="font-medium text-slate-600">{res.details}</span>
                        </p>
                      </div>
                    </motion.div>
                  )
                })}

                {upcomingList.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-12 text-center text-slate-500">
                    <BookOpen className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                    <h3 className="text-base font-bold text-slate-700">Yaklaşan Görüşme Yok</h3>
                    <p className="text-xs text-slate-400 mt-1">Şu an aktif veya bekleyen bir danışmanlık randevunuz bulunmuyor.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Col: Recent Activities */}
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-slate-900">Son Hareketler</h2>
              
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                {recentActivities.length > 0 ? (
                  <div className="relative flow-root">
                    <ul className="-mb-8">
                      {recentActivities.map((act, idx) => {
                        const Icon = act.icon
                        const isLast = idx === recentActivities.length - 1
                        return (
                          <li key={idx}>
                            <div className="relative pb-8">
                              {!isLast && (
                                <span
                                  className="absolute left-4.5 top-4.5 -ml-px h-full w-0.5 bg-slate-100"
                                  aria-hidden="true"
                                />
                              )}
                              <div className="relative flex space-x-3">
                                <div>
                                  <span className={`flex h-9 w-9 items-center justify-center rounded-xl ring-8 ring-white ${act.bgColor}`}>
                                    <Icon className="h-4.5 w-4.5" />
                                  </span>
                                </div>
                                <div className="flex-1 min-w-0 pt-0.5">
                                  <div className="flex justify-between items-center gap-2">
                                    <p className="text-xs font-bold text-slate-900">{act.title}</p>
                                  </div>
                                  <p className="mt-1 text-xs text-slate-500 leading-normal">
                                    {act.description}
                                  </p>
                                  <span className="text-[10px] text-slate-400 mt-1 block">{act.time}</span>
                                </div>
                              </div>
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 text-center py-4">Son hareket bulunmuyor.</p>
                )}
              </div>
            </div>

          </div>
        </>
      )}

    </div>
  )
}
