'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Search,
  GraduationCap,
  BookOpen
} from 'lucide-react'

export function SearchWidget() {
  const router = useRouter()
  const [selectedUniv, setSelectedUniv] = useState('all')

  return (
    <div className="w-full rounded-2xl border border-border/60 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Üniversite Seçimi */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-500">Üniversite Seçimi</label>
          <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-3 transition-all focus-within:border-primary focus-within:bg-white">
            <GraduationCap className="h-5 w-5 shrink-0 text-slate-400" />
            <select
              value={selectedUniv}
              onChange={(e) => setSelectedUniv(e.target.value)}
              className="w-full bg-transparent text-sm font-semibold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="all">Tüm Üniversiteler</option>
              <option value="univ-1">Boğaziçi Üniversitesi (BOUN)</option>
              <option value="univ-2">Orta Doğu Teknik Üniversitesi (ODTÜ)</option>
              <option value="univ-3">İstanbul Teknik Üniversitesi (İTÜ)</option>
              <option value="univ-4">Koç Üniversitesi (KU)</option>
              <option value="univ-5">Bilkent Üniversitesi (BİLKENT)</option>
            </select>
          </div>
        </div>

        {/* Görüşme Türü */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-500">Görüşme Konusu</label>
          <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-3 transition-all focus-within:border-primary focus-within:bg-white">
            <BookOpen className="h-5 w-5 shrink-0 text-slate-400" />
            <select className="w-full bg-transparent text-sm font-semibold text-slate-700 focus:outline-none cursor-pointer">
              <option value="all">Tümü (Tez, Proje, Ders Onayı...)</option>
              <option value="tez">Tez Danışmanlığı</option>
              <option value="proje">Proje Danışmanlığı</option>
              <option value="ders">Ders Kaydı / Müfredat Onayı</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── CTA Button ── */}
      <motion.button
        id="search-submit"
        onClick={() => {
          if (selectedUniv !== 'all') {
            router.push(`/search?univ=${selectedUniv}`)
          } else {
            router.push('/search')
          }
        }}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        className="group relative mt-5 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-primary py-3.5 text-sm font-bold text-white shadow-md shadow-primary/25 transition-shadow hover:shadow-lg hover:shadow-primary/30 cursor-pointer"
      >
        <Search className="h-5 w-5" />
        Akademisyen Ara & Randevu Al
        <span className="absolute inset-0 -translate-x-full skew-x-12 bg-white/15 transition-transform duration-700 group-hover:translate-x-full" />
      </motion.button>
    </div>
  )
}
