'use client'

import { motion } from 'framer-motion'
import { Users, Building, ShieldCheck, Heart } from 'lucide-react'

const STATS = [
  {
    icon: Users,
    number: '12.000+',
    label: 'Aktif Kullanıcı',
    description: 'Bizi tercih eden mutlu kullanıcılar.',
    gradient: 'from-blue-500 to-indigo-500',
  },
  {
    icon: Building,
    number: '500+',
    label: 'Seçkin İş Ortağı',
    description: 'Güvenilir otel, acente ve kurumlar.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: ShieldCheck,
    number: '150K+',
    label: 'Güvenli Rezervasyon',
    description: 'Başarıyla tamamlanan işlemler.',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Heart,
    number: '%99.9',
    label: 'Müşteri Memnuniyeti',
    description: 'Kullanıcı geri bildirim skoru.',
    gradient: 'from-rose-500 to-amber-500',
  },
]

export function StatsSection() {
  return (
    <section className="relative overflow-hidden bg-slate-900 py-16 text-white lg:py-20">
      {/* Background patterns */}
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div className="absolute -left-1/4 -top-1/4 h-[500px] w-[500px] rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute -bottom-1/4 -right-1/4 h-[500px] w-[500px] rounded-full bg-blue-500/20 blur-3xl" />
        {/* Subtle grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map(({ icon: Icon, number, label, description, gradient }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ scale: 1.03 }}
              className="group relative flex flex-col items-center text-center sm:items-start sm:text-left rounded-3xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-sm transition-all hover:border-white/10 hover:bg-white/[0.04]"
            >
              {/* Icon Container */}
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} shadow-lg shadow-black/10`}>
                <Icon className="h-6 w-6 text-white" />
              </div>

              {/* Number */}
              <h3 className="mt-5 text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                {number}
              </h3>

              {/* Label */}
              <p className="mt-2 text-sm font-semibold text-slate-200">
                {label}
              </p>

              {/* Description */}
              <p className="mt-1 text-xs text-slate-400">
                {description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
