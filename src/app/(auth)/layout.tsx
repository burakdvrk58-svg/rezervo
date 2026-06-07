'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, Sparkles } from 'lucide-react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      
      {/* ── Left Banner (Desktop Only) ── */}
      <div className="relative hidden w-1/2 overflow-hidden bg-slate-900 text-white lg:block">
        {/* Background shapes & glows */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-10 -top-10 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
        </div>

        {/* Content */}
        <div className="relative flex h-full flex-col justify-between p-12">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-sm shadow-primary/30">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-lg font-bold leading-none text-white">Rezervo</p>
              <p className="text-[11px] leading-none text-slate-400 mt-0.5">Rezervasyon Sisteminiz</p>
            </div>
          </Link>

          {/* Slogan */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold backdrop-blur-sm"
            >
              <Sparkles className="h-3.5 w-3.5 text-blue-300" />
              <span>Güvenli & Hızlı Giriş Altyapısı</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl font-extrabold leading-tight tracking-tight"
            >
              Rezervasyonlarınızı
              <br />
              Tek Bir Yerden Yönetin.
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-md text-base leading-relaxed text-slate-300"
            >
              Otel, uçak, araç ve etkinlik biletlerinizi Rezervo ile kolayca takip edin, işlemlerinizi tek tıkla tamamlayın.
            </motion.p>
          </div>

          {/* Footer Info */}
          <div className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} Rezervo. Tüm Hakları Saklıdır.
          </div>
        </div>
      </div>

      {/* ── Right Content Panel ── */}
      <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:w-1/2 lg:px-8">
        <div className="mx-auto w-full max-w-md">
          {children}
        </div>
      </div>

    </div>
  )
}
