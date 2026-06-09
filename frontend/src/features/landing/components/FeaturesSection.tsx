'use client'

import { motion } from 'framer-motion'
import { Percent, Headphones, Lock, CalendarX } from 'lucide-react'

const FEATURES = [
  {
    icon: Percent,
    title: 'En İyi Fiyat Garantisi',
    description: 'En uygun fiyatlarla rezervasyon yapın.',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: Headphones,
    title: '7/24 Destek',
    description: 'Her zaman yanınızdayız, bize ulaşın.',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    icon: Lock,
    title: 'Güvenli Altyapı',
    description: 'Kişisel bilgileriniz güvende.',
    color: 'bg-green-50 text-green-600',
  },
  {
    icon: CalendarX,
    title: 'Esnek İptal',
    description: 'Planlar değişebilir, esnek iptal seçenekleri.',
    color: 'bg-orange-50 text-orange-600',
  },
]

export function FeaturesSection() {
  return (
    <section className="border-t border-border/40 bg-white py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, description, color }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08, ease: 'easeOut' }}
              whileHover={{ y: -2 }}
              className="flex cursor-default items-start gap-4"
            >
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">{title}</h3>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
