'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Users,
  Building2,
  TrendingUp,
  Activity,
  ArrowRight,
  Server
} from 'lucide-react'

const STAT_CARDS = [
  {
    label: 'Toplam Kullanıcı',
    value: '12.450',
    change: 'Son 7 günde +350 yeni üye',
    icon: Users,
    color: 'from-blue-500 to-indigo-500',
  },
  {
    label: 'Aktif İşletmeler',
    value: '512 Tesis',
    change: '480 Otel, 32 Acente',
    icon: Building2,
    color: 'from-emerald-500 to-teal-500',
  },
  {
    label: 'Toplam İşlem Hacmi',
    value: '842.500 TL',
    change: 'Bu ay toplam rezervasyon',
    icon: TrendingUp,
    color: 'from-purple-500 to-pink-500',
  },
  {
    label: 'Sistem Sağlığı / Çalışma',
    value: '99.9%',
    change: 'Tüm servisler aktif',
    icon: Activity,
    color: 'from-rose-500 to-orange-500',
  },
]

const SYSTEM_LOGS_PREVIEW = [
  {
    event: 'Yeni işletme kaydı başvurusu',
    detail: 'Hilton DoubleTree, Bodrum sisteme katılmak için başvurdu.',
    time: '5 dakika önce',
    type: 'info',
  },
  {
    event: 'API Hız Sınırı Uyarısı',
    detail: 'IP 192.168.1.103 tarafından yoğun istek tespit edildi.',
    time: '20 dakika önce',
    type: 'warn',
  },
  {
    event: 'Ödeme Servisi Güncellemesi',
    detail: 'Iyzico API bağlantıları başarıyla test edildi.',
    time: '2 saat önce',
    type: 'success',
  },
]

const PENDING_BUSINESSES = [
  {
    name: 'Bodrum Bay Beach Hotel',
    owner: 'Arda Gök',
    email: 'info@bodrumbaybeach.com',
    status: 'İnceleniyor',
  },
  {
    name: 'Ankara VIP Rent A Car',
    owner: 'Selin Şen',
    email: 'selin@ankaravip.com',
    status: 'İnceleniyor',
  },
]

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">

      {/* ── Greeting ── */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Hoş geldiniz, Can Ertekin 👋
          </h1>
          <p className="text-sm text-slate-500">
            Rezervo sisteminin genel durumu, kullanıcı istatistikleri ve sunucu parametreleri.
          </p>
        </div>
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

      {/* ── Admin Dashboard Grid ── */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

        {/* Left Columns: System Logs & Applications */}
        <div className="space-y-6 lg:col-span-2">
          
          {/* Applications list */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Bekleyen İşletme Başvuruları</h2>
              <Link
                href="/admin/businesses"
                className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
              >
                Tümünü Yönet
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {PENDING_BUSINESSES.map((bus, idx) => (
                <motion.div
                  key={bus.name}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + idx * 0.1 }}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3"
                >
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{bus.name}</h3>
                    <p className="text-xs text-slate-400">Yetkili: <span className="font-semibold text-slate-600">{bus.owner}</span></p>
                    <p className="text-[11px] text-slate-400">{bus.email}</p>
                  </div>
                  
                  <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-3">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                      {bus.status}
                    </span>
                    <button
                      onClick={() => alert(`${bus.name} başvurusu onaylandı.`)}
                      className="rounded-xl bg-primary px-3 py-1.5 text-[11px] font-bold text-white hover:bg-primary/95"
                    >
                      Onayla
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* System logs */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Son Sistem Olayları</h2>
            
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
              {SYSTEM_LOGS_PREVIEW.map((log, idx) => (
                <div key={idx} className="flex gap-3 text-xs leading-normal">
                  <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${
                    log.type === 'warn' ? 'bg-red-50 text-red-600' : log.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-600'
                  }`}>
                    <Server className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <p className="font-bold text-slate-800">{log.event}</p>
                      <span className="text-[10px] text-slate-400">{log.time}</span>
                    </div>
                    <p className="text-slate-500 mt-0.5">{log.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Server Parameters details & Load Chart */}
        <div className="space-y-6">
          {/* Sunucu Bilgileri */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Sunucu Bilgileri</h2>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-semibold uppercase tracking-wider">CPU Kullanımı</span>
                <span className="font-bold text-slate-800">12%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full w-[12%] bg-primary" />
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-semibold uppercase tracking-wider">Bellek Kullanımı</span>
                <span className="font-bold text-slate-800">42%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full w-[42%] bg-purple-500" />
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-semibold uppercase tracking-wider">Disk Depolama</span>
                <span className="font-bold text-slate-800">68%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full w-[68%] bg-amber-500" />
              </div>

              <div className="border-t border-slate-100 pt-4 text-xs text-slate-500 space-y-2">
                <p>🟢 <strong>Sunucu Durumu:</strong> Aktif</p>
                <p>🌎 <strong>Lokasyon:</strong> İstanbul / Türkiye</p>
                <p>🛡️ <strong>SSL Sertifikası:</strong> Geçerli (Kalan gün: 320)</p>
              </div>
            </div>
          </div>

          {/* Haftalık İşlem Yükü */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Haftalık Platform Yükü</h3>
              <Link href="/admin/analytics" className="text-[10px] font-bold text-primary hover:underline">
                Sistem Analitiği
              </Link>
            </div>
            
            <div className="flex items-end justify-between h-20 pt-4 px-2">
              {[
                { day: 'Pzt', val: 62 },
                { day: 'Sal', val: 68 },
                { day: 'Çar', val: 72 },
                { day: 'Per', val: 65 },
                { day: 'Cum', val: 84 },
                { day: 'Cmt', val: 90 },
                { day: 'Paz', val: 86 }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center flex-1 group">
                  <div className="w-4 bg-slate-100 rounded-t h-12 relative flex items-end">
                    <div
                      style={{ height: `${item.val}%` }}
                      className="w-full rounded-t bg-purple-600 transition-all group-hover:bg-primary"
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
