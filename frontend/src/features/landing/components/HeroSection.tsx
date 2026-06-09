'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Clock, ShieldCheck, CheckCircle, Sparkles } from 'lucide-react'
import { SearchWidget } from './SearchWidget'

const FEATURE_BADGES = [
  { icon: Clock, label: 'Hızlı ve Kolay' },
  { icon: ShieldCheck, label: 'Güvenli Ödeme' },
  { icon: CheckCircle, label: 'Anında Onay' },
]

const fadeUpProps = (delay: number = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: 'easeOut' as const, delay },
})

export function HeroSection() {
  return (
    <section className="relative min-h-[580px] lg:min-h-[660px] flex items-center overflow-hidden py-16 lg:py-24 bg-slate-950">
      {/* ── Background Image & Overlay ── */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-bg.png"
          alt="Lüks Resort Manzarası"
          fill
          priority
          className="object-cover object-center opacity-65"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl space-y-7">

          {/* Top label */}
          <motion.div
            {...fadeUpProps(0)}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-sm"
          >
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            <span className="text-xs font-semibold text-slate-200">Türkiye&apos;nin #1 Rezervasyon Platformu</span>
          </motion.div>

          {/* Heading */}
          <motion.div {...fadeUpProps(0.1)} className="space-y-3">
            <h1 className="text-[2.8rem] font-extrabold leading-[1.15] tracking-tight text-white lg:text-5xl">
              Akademik Randevunuzu
              <br />
              <span className="relative text-blue-400">
                kolayca alın
                {/* Underline decoration */}
                <svg className="absolute -bottom-1 left-0 w-full" height="6" viewBox="0 0 300 6" fill="none" preserveAspectRatio="none">
                  <path d="M0 3 Q75 6 150 3 Q225 0 300 3" stroke="#60A5FA" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.8" />
                </svg>
              </span>
            </h1>
            <p className="max-w-md text-base leading-relaxed text-slate-300">
              Üniversite danışmanlık görüşmeleri ve akademisyen randevuları için hızlı ve güvenilir yönetim sistemi.
            </p>
          </motion.div>

          {/* Feature Badges */}
          <motion.div {...fadeUpProps(0.2)} className="flex flex-wrap gap-2.5">
            {FEATURE_BADGES.map(({ icon: Icon, label }) => (
              <motion.div
                key={label}
                whileHover={{ scale: 1.04, y: -1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className="flex cursor-default items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 shadow-sm backdrop-blur-sm"
              >
                <Icon className="h-4 w-4 text-blue-400" />
                {label}
              </motion.div>
            ))}
          </motion.div>

          {/* Search Widget */}
          <motion.div {...fadeUpProps(0.3)}>
            <SearchWidget />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
