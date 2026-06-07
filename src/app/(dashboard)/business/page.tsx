'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Calendar,
  TrendingUp,
  Building,
  ArrowRight,
  ClipboardList,
  Check,
  X,
  Plus
} from 'lucide-react'

const STAT_CARDS = [
  {
    label: 'Toplam Rezervasyon',
    value: '142 Adet',
    change: 'Bu ay +28 yeni kayıt',
    icon: ClipboardList,
    color: 'from-blue-500 to-indigo-500',
  },
  {
    label: 'Onay Bekleyen',
    value: '8 Talep',
    change: 'Hızlı aksiyon gerekiyor',
    icon: Calendar,
    color: 'from-amber-500 to-orange-500',
  },
  {
    label: 'Bu Ayki Gelir',
    value: '128.450 TL',
    change: 'Geçen aya göre %12 artış',
    icon: TrendingUp,
    color: 'from-emerald-500 to-teal-500',
  },
  {
    label: 'Tesis Doluluk Oranı',
    value: '%84',
    change: 'Gelecek 7 gün tahmini',
    icon: Building,
    color: 'from-purple-500 to-pink-500',
  },
]

const PENDING_REQUESTS = [
  {
    id: 'req-1',
    user: 'Can Yılmaz',
    service: 'Grand Deluxe Resort - Deluxe Standart Oda',
    date: '15 - 22 Haziran (7 Gece)',
    amount: '4.900 TL',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces',
  },
  {
    id: 'req-2',
    user: 'Elif Kaya',
    service: 'Grand Deluxe Resort - Kral Dairesi',
    date: '18 - 20 Haziran (2 Gece)',
    amount: '6.200 TL',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces',
  },
]

export default function BusinessDashboardPage() {
  return (
    <div className="space-y-8">

      {/* ── Greeting ── */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Hoş geldiniz, Mehmet Demir 👋
          </h1>
          <p className="text-sm text-slate-500">
            Grand Deluxe Resort & Spa tesisinizin rezervasyon ve doluluk özeti.
          </p>
        </div>

        <button
          onClick={() => alert('Yeni hizmet ekleme özelliği yakında aktif olacaktır.')}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary/25 transition-all hover:bg-primary/95 hover:shadow-lg active:scale-98"
        >
          <Plus className="h-4.5 w-4.5" />
          Yeni Oda / Hizmet Ekle
        </button>
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

      {/* ── Business Content Grid ── */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

        {/* Left Column: Pending Approvals list */}
        <div className="space-y-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Onay Bekleyen İstekler</h2>
            <Link
              href="/business/requests"
              className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
            >
              Tüm İstekleri Gör
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {PENDING_REQUESTS.map((req, idx) => (
              <motion.div
                key={req.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + idx * 0.1 }}
                className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 overflow-hidden rounded-full bg-slate-100 shrink-0">
                    <img src={req.avatar} alt={req.user} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{req.user}</h4>
                    <p className="text-xs text-slate-500">{req.service}</p>
                    <p className="text-[11px] text-slate-400">Tarih: <span className="font-semibold text-slate-600">{req.date}</span></p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-3 sm:border-t-0 sm:pt-0 gap-4">
                  <div className="text-left sm:text-right">
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Tutar</p>
                    <p className="text-base font-extrabold text-slate-950">{req.amount}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => alert(`${req.user} adlı kullanıcının rezervasyon isteği reddedildi.`)}
                      className="rounded-xl border border-red-200 bg-white p-2.5 text-red-600 hover:bg-red-50"
                      title="Reddet"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => alert(`${req.user} adlı kullanıcının rezervasyon isteği onaylandı.`)}
                      className="flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-2.5 text-xs font-bold text-white hover:bg-emerald-700"
                    >
                      <Check className="h-4 w-4" />
                      Onayla
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Column: Mini Info Widget & Occupancy Chart */}
        <div className="space-y-6">
          {/* Tesis Bilgileri */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Tesis Bilgileri</h2>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
              <div className="relative h-40 overflow-hidden rounded-xl bg-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop"
                  alt="Grand Deluxe Resort"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
                <div className="absolute bottom-3 left-3 text-white">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-200">Kategori: Otel</p>
                  <h3 className="text-base font-bold">Grand Deluxe Resort & Spa</h3>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-lg font-extrabold text-slate-800">42</p>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase mt-0.5">Toplam Oda</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-lg font-extrabold text-slate-800">6</p>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase mt-0.5">Oda Tipi</p>
                </div>
              </div>

              <div className="text-xs leading-relaxed text-slate-500 space-y-2 border-t border-slate-100 pt-3">
                <p>📍 <strong>Adres:</strong> Lara Cd. No:45, Antalya</p>
                <p>📞 <strong>Telefon:</strong> 0242 123 45 67</p>
                <p>⭐ <strong>Puan:</strong> 4.8 / 5.0 (240 Yorum)</p>
              </div>
            </div>
          </div>

          {/* Haftalık Doluluk Analizi */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Haftalık Doluluk Analizi</h3>
              <Link href="/business/analytics" className="text-[10px] font-bold text-primary hover:underline">
                Rapor Detayı
              </Link>
            </div>
            
            <div className="flex items-end justify-between h-20 pt-4 px-2">
              {[
                { day: 'Pzt', val: 78 },
                { day: 'Sal', val: 82 },
                { day: 'Çar', val: 80 },
                { day: 'Per', val: 85 },
                { day: 'Cum', val: 92 },
                { day: 'Cmt', val: 94 },
                { day: 'Paz', val: 88 }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center flex-1 group">
                  <div className="w-4 bg-slate-100 rounded-t h-12 relative flex items-end">
                    <div
                      style={{ height: `${item.val}%` }}
                      className="w-full rounded-t bg-indigo-600 transition-all group-hover:bg-primary"
                    />
                  </div>
                  <span className="text-[9px] font-bold text-slate-400 mt-1">{item.day}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  )
}
