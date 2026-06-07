'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { HelpCircle, ArrowLeft, Home, Compass } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-900 px-4 text-center">
      
      {/* ── Background Gradients & Grid ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/4 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 h-[300px] w-[300px] rounded-full bg-purple-500/10 blur-2xl" />
        
        {/* Soft grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35" />
      </div>

      {/* ── Content Container ── */}
      <div className="relative z-10 max-w-md space-y-6">
        
        {/* Floating 404 Illustration */}
        <div className="relative flex justify-center">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            className="relative flex h-32 w-32 items-center justify-center rounded-3xl bg-slate-800/80 shadow-2xl ring-1 ring-white/10"
          >
            <Compass className="h-16 w-16 text-primary" />
            
            {/* Orbiting dots */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}
              className="absolute inset-0 rounded-full border border-dashed border-slate-700 pointer-events-none"
            />
          </motion.div>

          <span className="absolute -right-4 -top-2 flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-xs font-black text-white shadow-lg shadow-primary/30">
            404
          </span>
        </div>

        {/* Text Details */}
        <div className="space-y-3">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Aradığınız Yol Bulunamadı
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            Aradığınız sayfa silinmiş, adı değiştirilmiş veya geçici olarak erişilemez durumda olabilir. Lütfen adresi kontrol edin veya ana sayfaya dönün.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:justify-center">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-5 py-3 text-xs font-bold text-slate-300 transition-colors hover:bg-slate-700/80"
          >
            <ArrowLeft className="h-4 w-4" />
            Geri Dön
          </button>
          
          <Link
            href="/"
            className="group relative overflow-hidden inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-6 py-3 text-xs font-bold text-white shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/35"
          >
            <Home className="h-4 w-4" />
            Ana Sayfa
            {/* Shine */}
            <span className="absolute inset-0 -translate-x-full skew-x-12 bg-white/20 transition-transform duration-500 group-hover:translate-x-full" />
          </Link>
        </div>

        {/* Help Center Shortcut */}
        <div className="border-t border-slate-800/80 pt-6">
          <Link
            href="/iletisim"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white"
          >
            <HelpCircle className="h-4 w-4 text-slate-500" />
            Yardım Merkezine Bağlanın
          </Link>
        </div>

      </div>
      
    </div>
  )
}
