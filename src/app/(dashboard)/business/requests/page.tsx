'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ClipboardList,
  Calendar,
  AlertCircle,
  CheckCircle2,
  XCircle
} from 'lucide-react'

const REQUESTS = [
  {
    id: 'req-1',
    user: 'Can Yılmaz',
    email: 'can.yilmaz@gmail.com',
    service: 'Grand Deluxe Resort - Deluxe Standart Oda',
    dateRange: '15 - 22 Haziran 2026 (7 Gece)',
    amount: '4.900 TL',
    status: 'Beklemede',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces',
  },
  {
    id: 'req-2',
    user: 'Elif Kaya',
    email: 'elif.kaya@gmail.com',
    service: 'Grand Deluxe Resort - Kral Dairesi',
    dateRange: '18 - 20 Haziran 2026 (2 Gece)',
    amount: '6.200 TL',
    status: 'Beklemede',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces',
  },
  {
    id: 'req-3',
    user: 'Mustafa Demir',
    email: 'mustafa@alan.com',
    service: 'Grand Deluxe Resort - Standart Aile Odası',
    dateRange: '20 - 27 Haziran 2026 (7 Gece)',
    amount: '5.800 TL',
    status: 'Onaylandı',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces',
  },
  {
    id: 'req-4',
    user: 'Zeynep Aksoy',
    email: 'zeynep.ak@outlook.com',
    service: 'Grand Deluxe Resort - Balayı Süiti',
    dateRange: '25 - 28 Haziran 2026 (3 Gece)',
    amount: '4.200 TL',
    status: 'Reddedildi',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
  },
]

type FilterStatus = 'all' | 'Beklemede' | 'Onaylandı' | 'Reddedilenler'

export default function BusinessRequestsPage() {
  const [list, setList] = useState(REQUESTS)
  const [filter, setFilter] = useState<FilterStatus>('all')

  const handleAction = (id: string, newStatus: 'Onaylandı' | 'Reddedildi') => {
    setList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    )
  }

  const filteredList = list.filter((item) => {
    if (filter === 'all') return true
    if (filter === 'Reddedilenler') return item.status === 'Reddedildi'
    return item.status === filter
  })

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          Rezervasyon İstekleri
        </h1>
        <p className="text-sm text-slate-500">
          Müşterileriniz tarafından oluşturulan rezervasyon ve konaklama taleplerini onaylayın veya reddedin.
        </p>
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-px">
        {[
          { id: 'all', label: 'Tüm İstekler' },
          { id: 'Beklemede', label: 'Bekleyenler' },
          { id: 'Onaylandı', label: 'Onaylananlar' },
          { id: 'Reddedilenler', label: 'Reddedilenler' },
        ].map(({ id, label }) => {
          const isActive = filter === id
          return (
            <button
              key={id}
              onClick={() => setFilter(id as FilterStatus)}
              className={`relative px-4 pb-3.5 pt-1.5 text-sm font-semibold transition-all focus:outline-none ${
                isActive ? 'text-primary' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {label}
              {isActive && (
                <motion.span
                  layoutId="req-filter-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-primary"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          )
        })}
      </div>

      {/* ── List view ── */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredList.map((req) => (
            <motion.div
              key={req.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md md:flex-row md:items-center"
            >
              {/* Profile details */}
              <div className="flex items-center gap-4 shrink-0">
                <div className="h-12 w-12 overflow-hidden rounded-full bg-slate-100 shrink-0 ring-2 ring-slate-100">
                  <img src={req.avatar} alt={req.user} className="h-full w-full object-cover" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">{req.user}</h3>
                  <p className="text-xs text-slate-400 font-medium">{req.email}</p>
                </div>
              </div>

              {/* Service details */}
              <div className="flex-1 space-y-1 md:border-l md:border-slate-100 md:pl-5">
                <h4 className="text-sm font-bold text-slate-800">{req.service}</h4>
                <p className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  Tarih: <span className="font-semibold text-slate-600">{req.dateRange}</span>
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Durum:</span>
                  {req.status === 'Beklemede' && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-amber-100 bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                      <AlertCircle className="h-3 w-3" />
                      Beklemede
                    </span>
                  )}
                  {req.status === 'Onaylandı' && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                      <CheckCircle2 className="h-3 w-3" />
                      Onaylandı
                    </span>
                  )}
                  {req.status === 'Reddedildi' && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-red-100 bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-700">
                      <XCircle className="h-3 w-3" />
                      Reddedildi
                    </span>
                  )}
                </div>
              </div>

              {/* Total & Action actions */}
              <div className="flex flex-row items-center justify-between border-t border-slate-100 pt-4 md:flex-col md:items-end md:justify-center md:border-t-0 md:pt-0 gap-3">
                <div className="text-left md:text-right shrink-0">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Tutar</p>
                  <p className="text-lg font-black text-slate-900">{req.amount}</p>
                </div>

                {req.status === 'Beklemede' && (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleAction(req.id, 'Reddedildi')}
                      className="inline-flex items-center justify-center gap-1 rounded-xl border border-red-200 bg-white px-3 py-2.5 text-xs font-bold text-red-600 shadow-sm transition-colors hover:bg-red-50"
                    >
                      Reddet
                    </button>
                    <button
                      onClick={() => handleAction(req.id, 'Onaylandı')}
                      className="inline-flex items-center justify-center gap-1 rounded-xl bg-emerald-600 px-3 py-2.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-emerald-700"
                    >
                      Onayla
                    </button>
                  </div>
                )}
              </div>

            </motion.div>
          ))}
        </AnimatePresence>

        {filteredList.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-12 text-center text-slate-500">
            <ClipboardList className="mx-auto h-12 w-12 text-slate-300 mb-3" />
            <h3 className="text-base font-bold text-slate-700">İstek Bulunmuyor</h3>
            <p className="text-xs text-slate-400 mt-1">Seçtiğiniz filtreye uygun rezervasyon isteği kaydı bulunmuyor.</p>
          </div>
        )}
      </div>

    </div>
  )
}
