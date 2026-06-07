'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Calendar,
  Clock,
  Check,
  X,
  ClipboardList,
  ArrowRight,
  Settings
} from 'lucide-react'

export default function BusinessDashboardPage() {
  const [list, setList] = useState<any[]>([])
  const [academician, setAcademician] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  const userEmail = typeof window !== 'undefined' ? (localStorage.getItem('rezervo_user_email') || 'business@rezervo.com') : 'business@rezervo.com'
  const userName = typeof window !== 'undefined' ? (localStorage.getItem('rezervo_user_name') || 'Prof. Dr. Albert Ali Salah') : 'Prof. Dr. Albert Ali Salah'

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true)
        // 1. Fetch academician info
        const acadRes = await fetch('/api/academicians')
        let currentAcad: any = null
        if (acadRes.ok) {
          const acadData = await acadRes.json()
          currentAcad = acadData.academicians.find(
            (a: any) => a.email === userEmail || a.name === userName
          ) || acadData.academicians[0]
          setAcademician(currentAcad)
        }

        // 2. Fetch bookings
        const res = await fetch('/api/business/requests')
        if (res.ok) {
          const data = await res.json()
          const filtered = data.filter((b: any) => {
            if (b.category !== 'teacher' && b.category !== 'library') return false
            if (currentAcad) {
              return b.academicianId === currentAcad.id
            }
            return b.academicianEmail === userEmail || b.academicianName?.includes(userName)
          })
          setList(filtered)
        }
      } catch (err) {
        console.error('Veri yuklenemedi:', err)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
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
          prev.map((item) => {
            if (item.id === id) {
              const statusColor = newStatus === 'Onaylandı' 
                ? 'text-emerald-700 bg-emerald-50 border-emerald-100'
                : 'text-red-700 bg-red-50 border-red-100'
              return { ...item, status: newStatus, statusColor }
            }
            return item
          })
        )
      }
    } catch (err) {
      console.error('Failed to update request:', err)
    }
  }

  // Stats
  const totalCount = list.length
  const pendingRequests = list.filter((r) => r.status === 'Beklemede')
  const approvedCount = list.filter((r) => r.status === 'Onaylandı').length
  const slotsCount = academician?.slots?.length || 0

  const STAT_CARDS = [
    {
      label: 'Toplam Randevu',
      value: `${totalCount} Adet`,
      change: 'Dönem boyu alınan randevular',
      icon: ClipboardList,
      color: 'from-blue-500 to-indigo-500',
    },
    {
      label: 'Onay Bekleyen',
      value: `${pendingRequests.length} İstek`,
      change: 'Hızlı onay bekleniyor',
      icon: Calendar,
      color: 'from-amber-500 to-orange-500',
    },
    {
      label: 'Onaylanan Görüşmeler',
      value: `${approvedCount} Adet`,
      change: 'Gerçekleşecek toplantılar',
      icon: Check,
      color: 'from-emerald-500 to-teal-500',
    },
    {
      label: 'Aktif Görüşme Saatleri',
      value: `${slotsCount} Slot`,
      change: 'Tanımlanmış müsait saatler',
      icon: Clock,
      color: 'from-purple-500 to-pink-500',
    },
  ]

  return (
    <div className="space-y-8">

      {/* ── Greeting ── */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Hoş geldiniz, {academician?.name || userName} 👋
          </h1>
          <p className="text-sm text-slate-500">
            {academician ? `${academician.department}` : 'Akademisyen Paneli'} • Güncel randevu talepleri ve müsaitlik özeti.
          </p>
        </div>

        <Link
          href="/business/requests"
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary/25 transition-all hover:bg-primary/95 hover:shadow-lg active:scale-98"
        >
          <Settings className="h-4.5 w-4.5" />
          Müsaitlik Ayarlarına Git
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
                {pendingRequests.slice(0, 3).map((req, idx) => (
                  <motion.div
                    key={req.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 + idx * 0.1 }}
                    className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 overflow-hidden rounded-full bg-slate-100 shrink-0 flex items-center justify-center font-bold text-slate-600 text-xs border border-slate-200">
                        {req.studentName ? req.studentName.split(' ').map((n: string) => n[0]).join('') : 'Ö'}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{req.studentName}</h4>
                        <p className="text-xs text-slate-500 font-medium">{req.details}</p>
                        <p className="text-[11px] text-slate-400">Tarih: <span className="font-semibold text-slate-600">{req.date} • {req.time}</span></p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-3 sm:border-t-0 sm:pt-0 gap-4">
                      <div className="text-left sm:text-right">
                        <p className="text-[10px] text-slate-400 uppercase font-semibold">Öğrenci No</p>
                        <p className="text-sm font-extrabold text-slate-955">{req.studentNo}</p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAction(req.id, 'Reddedildi')}
                          className="rounded-xl border border-red-200 bg-white p-2.5 text-red-600 hover:bg-red-50 cursor-pointer"
                          title="Reddet"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleAction(req.id, 'Onaylandı')}
                          className="flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 cursor-pointer"
                        >
                          <Check className="h-4 w-4" />
                          Onayla
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {pendingRequests.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-12 text-center text-slate-500">
                    <Check className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                    <h3 className="text-base font-bold text-slate-700">Bekleyen İstek Yok</h3>
                    <p className="text-xs text-slate-400 mt-1">Onayınızı bekleyen herhangi bir görüşme isteği bulunmuyor.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Mini Info Widget */}
            <div className="space-y-6">
              {/* Akademisyen Profil Kartı */}
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-slate-900">Profil Bilgileri</h2>

                {academician && (
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                    <div className="relative h-40 overflow-hidden rounded-xl bg-slate-100">
                      <img
                        src={academician.avatar}
                        alt={academician.name}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-3 left-3 text-white">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-200">{academician.title}</p>
                        <h3 className="text-base font-bold">{academician.name}</h3>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-center">
                      <div className="rounded-xl bg-slate-50 p-3">
                        <p className="text-base font-extrabold text-slate-800">{slotsCount}</p>
                        <p className="text-[10px] font-semibold text-slate-400 uppercase mt-0.5">Aktif Saat Slotu</p>
                      </div>
                      <div className="rounded-xl bg-slate-50 p-3">
                        <p className="text-base font-extrabold text-slate-800">{academician.rating} / 5.0</p>
                        <p className="text-[10px] font-semibold text-slate-400 uppercase mt-0.5">Geri Bildirim</p>
                      </div>
                    </div>

                    <div className="text-xs leading-relaxed text-slate-500 space-y-2 border-t border-slate-100 pt-3">
                      <p>🎓 <strong>Bölüm:</strong> {academician.department}</p>
                      <p>📧 <strong>E-posta:</strong> {academician.email}</p>
                      <p>🔬 <strong>Uzmanlık:</strong> {academician.tag}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Günlük Yoğunluk Analizi */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Görüşme Yoğunluğu</h3>
                </div>
                
                <div className="flex items-end justify-between h-20 pt-4 px-2">
                  {[
                    { day: 'Pzt', val: 60 },
                    { day: 'Sal', val: 40 },
                    { day: 'Çar', val: 75 },
                    { day: 'Per', val: 50 },
                    { day: 'Cum', val: 90 },
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center flex-1 group">
                      <div className="w-4 bg-slate-100 rounded-t h-12 relative flex items-end">
                        <div
                          style={{ height: `${item.val}%` }}
                          className="w-full rounded-t bg-primary transition-all group-hover:bg-primary/80"
                        />
                      </div>
                      <span className="text-[9px] font-bold text-slate-400 mt-1">{item.day}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </>
      )}

    </div>
  )
}
