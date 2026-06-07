'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Building2,
  Plane,
  Car,
  Ticket,
  Search,
  MapPin,
  Calendar,
  Users,
  ChevronDown,
  GraduationCap,
  BookOpen,
  Clock
} from 'lucide-react'

const TABS = [
  { id: 'otel', label: 'Otel', icon: Building2 },
  { id: 'ucak', label: 'Uçak', icon: Plane },
  { id: 'arac', label: 'Araç', icon: Car },
  { id: 'etkinlik', label: 'Etkinlik', icon: Ticket },
  { id: 'okul', label: 'Okul', icon: GraduationCap },
] as const

type TabId = (typeof TABS)[number]['id']

export function SearchWidget() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabId>('otel')

  return (
    <div className="w-full rounded-2xl border border-border/60 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">

      {/* ── Tabs ── */}
      <div role="tablist" className="mb-5 flex gap-0.5 border-b border-border">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            id={`tab-${id}`}
            role="tab"
            aria-selected={activeTab === id}
            aria-controls={`panel-${id}`}
            onClick={() => setActiveTab(id)}
            className={`relative flex items-center gap-2 px-4 pb-3 pt-1 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 rounded-t-lg ${
              activeTab === id ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
            {activeTab === id && (
              <motion.span
                layoutId="tab-underline"
                className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-primary"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* ── Form Fields ── */}
      {activeTab === 'okul' ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* Rezervasyon Tipi */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500">Rezervasyon Tipi</label>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 transition-all">
              <GraduationCap className="h-4.5 w-4.5 shrink-0 text-slate-400" />
              <select className="w-full bg-transparent text-sm font-semibold text-slate-700 focus:outline-none">
                <option value="kutuphane">Kütüphane Çalışma Odası</option>
                <option value="ogretmen">Öğretmen Veli Görüşmesi</option>
              </select>
            </div>
          </div>

          {/* Öğretmen / Oda Seçimi */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500">Öğretmen / Oda Seçimi</label>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 transition-all">
              <BookOpen className="h-4.5 w-4.5 shrink-0 text-slate-400" />
              <select className="w-full bg-transparent text-sm font-semibold text-slate-700 focus:outline-none">
                <option value="all">Seçiniz / Tümü</option>
                <option value="ahmet">Ahmet Hoca (Matematik)</option>
                <option value="elif">Elif Hoca (Fizik)</option>
                <option value="oda1">Kütüphane - A Grubu Sessiz Oda</option>
                <option value="masa2">Kütüphane - Bireysel Çalışma Masası 4</option>
              </select>
            </div>
          </div>

          {/* Tarih */}
          <div className="group flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500">Tarih</label>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 transition-all focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10">
              <Calendar className="h-4.5 w-4.5 shrink-0 text-slate-400" />
              <input
                type="text"
                placeholder="GG.AA.YYYY"
                className="w-full bg-transparent text-sm font-semibold text-slate-700 placeholder:text-slate-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Saat Dilimi */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500">Saat Dilimi</label>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 transition-all">
              <Clock className="h-4.5 w-4.5 shrink-0 text-slate-400" />
              <select className="w-full bg-transparent text-sm font-semibold text-slate-700 focus:outline-none">
                <option value="0900">09:00 - 09:45</option>
                <option value="1000">10:00 - 10:45</option>
                <option value="1100">11:00 - 11:45</option>
                <option value="1400">14:00 - 14:45</option>
                <option value="1500">15:00 - 15:45</option>
              </select>
            </div>
          </div>

        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* Nereye */}
          <div className="group flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500">Nereye?</label>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 transition-all focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10 group-hover:border-border/80">
              <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
              <input
                id="search-destination"
                type="text"
                placeholder="Şehir, otel veya bölge"
                className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Giriş Tarihi */}
          <div className="group flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500">Giriş Tarihi</label>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 transition-all focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10 group-hover:border-border/80">
              <Calendar className="h-4 w-4 shrink-0 text-slate-400" />
              <input
                id="search-checkin"
                type="text"
                placeholder="GG.AA.YYYY"
                className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Çıkış Tarihi */}
          <div className="group flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500">Çıkış Tarihi</label>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 transition-all focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10 group-hover:border-border/80">
              <Calendar className="h-4 w-4 shrink-0 text-slate-400" />
              <input
                id="search-checkout"
                type="text"
                placeholder="GG.AA.YYYY"
                className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Misafir */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500">Misafir</label>
            <button
              id="search-guests"
              className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 text-left transition-all hover:border-primary/40 hover:bg-white"
            >
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 shrink-0 text-slate-400" />
                <span className="text-sm text-slate-600">2 Yetişkin, 1 Çocuk</span>
              </div>
              <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
            </button>
          </div>

        </div>
      )}

      {/* ── CTA Button ── */}
      <motion.button
        id="search-submit"
        onClick={() => router.push(activeTab === 'okul' ? '/search?type=okul' : '/search')}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        className="group relative mt-4 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-primary py-3 text-base font-semibold text-white shadow-md shadow-primary/25 transition-shadow hover:shadow-lg hover:shadow-primary/30"
      >
        <Search className="h-5 w-5" />
        Rezervasyon Ara
        {/* Shine sweep */}
        <span className="absolute inset-0 -translate-x-full skew-x-12 bg-white/15 transition-transform duration-700 group-hover:translate-x-full" />
      </motion.button>
    </div>
  )
}
