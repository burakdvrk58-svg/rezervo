'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ClipboardList,
  Calendar,
  AlertCircle,
  CheckCircle2,
  XCircle
} from 'lucide-react'



type FilterStatus = 'all' | 'Beklemede' | 'Onaylandı' | 'Reddedilenler'

export default function BusinessRequestsPage() {
  const [list, setList] = useState<any[]>([])
  const [filter, setFilter] = useState<FilterStatus>('all')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch('/api/business/requests')
        if (res.ok) {
          const data = await res.json()
          // Only show commercial (hotel, flight, car) bookings for business dashboard requests
          const commercial = data.filter(
            (b: any) => b.category !== 'teacher' && b.category !== 'library'
          )
          setList(commercial)
        }
      } catch (err) {
        console.error('Failed to fetch requests:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchRequests()
  }, [])

  const handleAction = async (id: string, newStatus: 'Onaylandı' | 'Reddedildi') => {
    const action = newStatus === 'Onaylandı' ? 'approve' : 'reject'
    try {
      const res = await fetch('/api/business/requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action })
      })
      if (res.ok) {
        setList((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
        )
      }
    } catch (err) {
      console.error('Failed to update request:', err)
    }
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
        {isLoading ? (
          <div className="flex h-48 items-center justify-center rounded-2xl border border-slate-200 bg-white p-5">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <>
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
                      <img src={req.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces'} alt={req.user || 'Ahmet Yılmaz'} className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900">{req.user || 'Ahmet Yılmaz'}</h3>
                      <p className="text-xs text-slate-400 font-medium">{req.email || 'customer@rezervo.com'}</p>
                    </div>
                  </div>

                  {/* Service details */}
                  <div className="flex-1 space-y-1 md:border-l md:border-slate-100 md:pl-5">
                    <h4 className="text-sm font-bold text-slate-800">{req.service || req.title}</h4>
                    <p className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      Tarih: <span className="font-semibold text-slate-600">{req.dateRange || (req.time ? `${req.date} (${req.time})` : req.date)}</span>
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
                      <p className="text-lg font-black text-slate-900">{req.amount || req.price || 'Ücretsiz'}</p>
                    </div>

                    {req.status === 'Beklemede' && (
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleAction(req.id, 'Reddedildi')}
                          className="inline-flex items-center justify-center gap-1 rounded-xl border border-red-200 bg-white px-3 py-2.5 text-xs font-bold text-red-600 shadow-sm transition-colors hover:bg-red-50 cursor-pointer"
                        >
                          Reddet
                        </button>
                        <button
                          onClick={() => handleAction(req.id, 'Onaylandı')}
                          className="inline-flex items-center justify-center gap-1 rounded-xl bg-emerald-600 px-3 py-2.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-emerald-700 cursor-pointer"
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
          </>
        )}
      </div>

    </div>
  )
}
