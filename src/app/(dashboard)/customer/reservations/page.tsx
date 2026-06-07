'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Building2,
  Plane,
  Car,
  Ticket,
  MapPin,
  Calendar,
  Layers,
  Info,
  QrCode,
  XCircle,
  CheckCircle2,
  GraduationCap
} from 'lucide-react'

const TABS = [
  { id: 'all', label: 'Tümü', icon: Layers },
  { id: 'otel', label: 'Oteller', icon: Building2 },
  { id: 'ucak', label: 'Uçuşlar', icon: Plane },
  { id: 'arac', label: 'Araç Kiralama', icon: Car },
  { id: 'etkinlik', label: 'Etkinlikler', icon: Ticket },
  { id: 'okul', label: 'Okul', icon: GraduationCap },
] as const

type TabId = (typeof TABS)[number]['id']

const RESERVATIONS = [
  {
    id: 'res-1',
    type: 'otel',
    title: 'Grand Deluxe Resort & Spa',
    subtitle: 'Lara, Antalya',
    dateRange: '12 - 19 Haziran 2026',
    price: '3.450 TL',
    status: 'Onaylandı',
    statusColor: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    details: '7 Gece • Standart Deniz Manzaralı Oda • Yarım Pansiyon • 2 Yetişkin, 1 Çocuk',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop',
  },
  {
    id: 'res-2',
    type: 'ucak',
    title: 'İstanbul (IST) - Antalya (AYT)',
    subtitle: 'Türk Hava Yolları • TK2410',
    dateRange: '12 Haziran 2026 • 10:30',
    price: '850 TL',
    status: 'Onaylandı',
    statusColor: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    details: 'Ekonomi Sınıfı • Koltuk 14A, 14B, 14C • 20kg Bagaj Hakkı',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=200&h=150&fit=crop',
  },
  {
    id: 'res-3',
    type: 'arac',
    title: 'Renault Megane (Otomatik)',
    subtitle: 'Enterprise Rent-A-Car',
    dateRange: '12 - 19 Haziran 2026',
    price: '1.200 TL',
    status: 'İptal Edildi',
    statusColor: 'text-slate-500 bg-slate-50 border-slate-200',
    details: 'Dizel • 7 Gün Kiralama • Antalya Havalimanı Teslim Alma/Etme',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=200&h=150&fit=crop',
  },
  {
    id: 'res-4',
    type: 'etkinlik',
    title: 'Antalya Açıkhava Konserleri: Tarkan',
    subtitle: 'Antalya Açıkhava Tiyatrosu',
    dateRange: '15 Haziran 2026 • 21:00',
    price: '520 TL',
    status: 'Onaylandı',
    statusColor: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    details: 'Protokol A Blok • Sıra 4, Koltuk 12, 13',
    image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=200&h=150&fit=crop',
  },
  {
    id: 'res-5',
    type: 'okul',
    title: 'Ahmet Hoca ile Veli Görüşmesi',
    subtitle: 'Matematik Zümre Odası (Kat 2)',
    dateRange: '08 Haziran 2026 • 09:30',
    price: 'Ücretsiz',
    status: 'Onaylandı',
    statusColor: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    details: 'Matematik Dersi Yazılı Sınav Değerlendirmesi • Öğrenci No: 1420',
    image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=200&h=150&fit=crop',
  },
]

export default function ReservationsPage() {
  useEffect(() => {
    document.title = 'Rezervasyonlarım | Rezervo'
  }, [])

  const [activeTab, setActiveTab] = useState<TabId>('all')
  const [showQrModal, setShowQrModal] = useState<string | null>(null)
  const [cancelTarget, setCancelTarget] = useState<string | null>(null)
  
  // Local list to allow canceling items dynamically
  const [list, setList] = useState(RESERVATIONS)

  const filteredList = list.filter((item) => activeTab === 'all' || item.type === activeTab)

  const handleCancelReservation = (id: string) => {
    setList((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: 'İptal Edildi',
              statusColor: 'text-slate-500 bg-slate-50 border-slate-200',
            }
          : item
      )
    )
    setCancelTarget(null)
  }

  return (
    <div className="space-y-6">
      
      {/* ── Header ── */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Rezervasyonlarım
          </h1>
          <p className="text-sm text-slate-500">
            Mevcut, geçmiş ve iptal edilen rezervasyonlarınızın listesi.
          </p>
        </div>
      </div>

      {/* ── Tabs Grid ── */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-px">
        {TABS.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`relative flex items-center gap-2 px-4 pb-3.5 pt-1.5 text-sm font-semibold transition-all focus:outline-none ${
                isActive ? 'text-primary' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="h-4.5 w-4.5" />
              <span>{label}</span>
              {isActive && (
                <motion.span
                  layoutId="res-tabs-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-primary"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          )
        })}
      </div>

      {/* ── Reservations List ── */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredList.map((res) => (
            <motion.div
              key={res.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md md:flex-row md:items-center"
            >
              {/* Thumbnail */}
              <div className="relative h-44 w-full shrink-0 overflow-hidden rounded-xl bg-slate-100 md:h-24 md:w-36">
                <img
                  src={res.image}
                  alt={res.title}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Core Details */}
              <div className="flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                  <h3 className="text-base font-extrabold text-slate-900 sm:text-lg">{res.title}</h3>
                  <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${res.statusColor}`}>
                    {res.status === 'Onaylandı' ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                    {res.status}
                  </span>
                </div>

                <p className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  {res.subtitle}
                </p>

                <p className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  Tarih: <span className="font-semibold text-slate-700">{res.dateRange}</span>
                </p>

                <p className="flex items-start gap-1.5 text-xs leading-normal text-slate-400">
                  <Info className="h-3.5 w-3.5 shrink-0 text-slate-400 mt-0.5" />
                  <span>{res.details}</span>
                </p>
              </div>

              {/* Price & Action Actions */}
              <div className="flex flex-row items-center justify-between border-t border-slate-100 pt-4 md:flex-col md:items-end md:justify-center md:border-t-0 md:pt-0 gap-3">
                <div className="text-left md:text-right">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Tutar</p>
                  <p className="text-xl font-black text-slate-900">{res.price}</p>
                </div>

                {res.status === 'Onaylandı' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowQrModal(res.id)}
                      className="inline-flex items-center justify-center gap-1 rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-bold text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
                      title="Bilet Barkodu / QR"
                    >
                      <QrCode className="h-4.5 w-4.5 text-slate-500" />
                      <span className="hidden sm:inline">Bilet Gör</span>
                    </button>
                    
                    <button
                      onClick={() => setCancelTarget(res.id)}
                      className="inline-flex items-center justify-center gap-1 rounded-xl border border-red-200 bg-white px-3 py-2.5 text-xs font-bold text-red-600 shadow-sm transition-colors hover:bg-red-50"
                    >
                      İptal Et
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredList.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-12 text-center text-slate-500">
            <Layers className="mx-auto h-12 w-12 text-slate-300 mb-3" />
            <h3 className="text-base font-bold text-slate-700">Rezervasyon Bulunamadı</h3>
            <p className="text-xs text-slate-400 mt-1">Seçtiğiniz filtreye uygun aktif veya geçmiş rezervasyon kaydı bulunmuyor.</p>
          </div>
        )}
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
              <h3 className="text-lg font-bold text-slate-900">Dijital Rezervasyon Biletiniz</h3>
              <p className="text-xs text-slate-500 mt-1">Giriş esnasında bu QR kodunu görevliye okutun.</p>
              
              {/* QR Render mock */}
              <div className="mx-auto my-6 flex h-48 w-48 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-inner">
                <svg className="h-full w-full text-slate-800" viewBox="0 0 100 100" fill="currentColor">
                  {/* Outer boundaries */}
                  <rect x="10" y="10" width="20" height="20" />
                  <rect x="15" y="15" width="10" height="10" fill="white" />
                  <rect x="70" y="10" width="20" height="20" />
                  <rect x="75" y="15" width="10" height="10" fill="white" />
                  <rect x="10" y="70" width="20" height="20" />
                  <rect x="15" y="75" width="10" height="10" fill="white" />
                  {/* Randomized code squares */}
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
                <p>Kod: <span className="font-bold text-slate-900">RZV-{showQrModal.toUpperCase()}</span></p>
                <p className="mt-1">Kullanıcı: <span className="font-bold text-slate-900">Ahmet Yılmaz</span></p>
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
              <h3 className="text-lg font-bold text-slate-900">İptal Etmek İstiyor musunuz?</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Bu rezervasyonu iptal ettiğinizde işleminiz geri alınamaz. Kural şartlarına göre ücret iadesi yapılacaktır.
              </p>

              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => setCancelTarget(null)}
                  className="w-1/2 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Vazgeç
                </button>
                <button
                  onClick={() => handleCancelReservation(cancelTarget)}
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
