'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Calendar,
  Building,
  Plane,
  Clock,
  TrendingUp,
  MapPin,
  ArrowRight,
  BellRing,
  AlertCircle
} from 'lucide-react'

const STAT_CARDS = [
  {
    label: 'Aktif Rezervasyonlar',
    value: '3 Adet',
    change: '2 Otel, 1 Uçuş',
    icon: Clock,
    color: 'from-blue-500 to-indigo-500',
  },
  {
    label: 'Yaklaşan Seyahat',
    value: '12 Haziran',
    change: 'Grand Deluxe Otel',
    icon: Calendar,
    color: 'from-emerald-500 to-teal-500',
  },
  {
    label: 'Toplam Harcama',
    value: '4.820 TL',
    change: 'Son 30 gün içinde',
    icon: TrendingUp,
    color: 'from-purple-500 to-pink-500',
  },
  {
    label: 'Okunmamış Bildirim',
    value: '2 Yeni',
    change: 'Müşteri hizmetleri yanıtı',
    icon: BellRing,
    color: 'from-rose-500 to-orange-500',
  },
]

const UPCOMING_RESERVATIONS = [
  {
    type: 'otel',
    title: 'Grand Deluxe Resort & Spa',
    location: 'Lara, Antalya',
    date: '12 - 19 Haz 2026',
    details: '7 Gece • 2 Yetişkin, 1 Çocuk',
    status: 'Onaylandı',
    statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop',
    icon: Building,
  },
  {
    type: 'ucak',
    title: 'İstanbul (IST) - Antalya (AYT)',
    location: 'Türk Hava Yolları • TK2410',
    date: '12 Haz 2026 • 10:30',
    details: 'Ekonomi Sınıfı • Koltuk 14A, 14B, 14C',
    status: 'Onaylandı',
    statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=200&h=150&fit=crop',
    icon: Plane,
  },
]

const ACTIVITIES = [
  {
    title: 'Otel rezervasyonunuz onaylandı',
    time: '1 saat önce',
    description: 'Grand Deluxe Resort Antalya rezervasyonunuz tesis tarafından onaylandı.',
    icon: Building,
    bgColor: 'bg-emerald-50 text-emerald-600',
  },
  {
    title: 'Uçuş biletiniz e-postanıza gönderildi',
    time: '3 saat önce',
    description: 'TK2410 uçuşu için QR kodlu biletleriniz e-posta adresinize iletildi.',
    icon: Plane,
    bgColor: 'bg-blue-50 text-blue-600',
  },
  {
    title: 'Araç kiralama talebiniz iptal edildi',
    time: 'Dün',
    description: 'Kendi isteğiniz doğrultusunda araç rezervasyonunuz kesintisiz iade edildi.',
    icon: AlertCircle,
    bgColor: 'bg-slate-100 text-slate-600',
  },
]

export default function CustomerDashboardPage() {
  return (
    <div className="space-y-8">
      
      {/* ── Greeting ── */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Hoş geldin, Ahmet Yılmaz 👋
          </h1>
          <p className="text-sm text-slate-500">
            Seyahat planlarınızın ve güncel rezervasyonlarınızın özeti burada.
          </p>
        </div>
        
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary/25 transition-all hover:bg-primary/95 hover:shadow-lg active:scale-98"
        >
          Yeni Rezervasyon Yap
        </Link>
      </div>

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
            
            <p className="mt-3 text-2xl font-extrabold text-slate-900">{value}</p>
            <p className="mt-1 text-[11px] font-semibold text-slate-400 group-hover:text-slate-500">{change}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Lower Dashboard Grid ── */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        
        {/* Left 2 Cols: Upcoming Bookings */}
        <div className="space-y-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Yaklaşan Rezervasyonlar</h2>
            <Link
              href="/customer/reservations"
              className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
            >
              Hepsini Gör
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {UPCOMING_RESERVATIONS.map((res, idx) => {
              const Icon = res.icon
              return (
                <motion.div
                  key={res.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.2 + idx * 0.1 }}
                  className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center"
                >
                  {/* Image */}
                  <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:h-20 sm:w-28">
                    <img
                      src={res.image}
                      alt={res.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute right-2 top-2 rounded-lg bg-white/95 p-1.5 shadow-sm sm:hidden">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-bold text-slate-900 sm:text-base">{res.title}</h3>
                      <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${res.statusColor}`}>
                        {res.status}
                      </span>
                    </div>
                    
                    <p className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      {res.location}
                    </p>

                    <p className="text-xs font-medium text-slate-400">
                      Tarih: <span className="font-semibold text-slate-700">{res.date}</span>
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Detay: <span className="font-medium text-slate-600">{res.details}</span>
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Right Col: Recent Activities */}
        <div className="space-y-5">
          <h2 className="text-lg font-bold text-slate-900">Son Aktiviteler</h2>
          
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="relative flow-root">
              <ul className="-mb-8">
                {ACTIVITIES.map((act, idx) => {
                  const Icon = act.icon
                  const isLast = idx === ACTIVITIES.length - 1
                  return (
                    <li key={idx}>
                      <div className="relative pb-8">
                        {/* Vertical line connecting nodes */}
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
                              <span className="text-[10px] text-slate-400 shrink-0">{act.time}</span>
                            </div>
                            <p className="mt-1 text-xs text-slate-500 leading-normal">
                              {act.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}
