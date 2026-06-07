'use client'

import { motion } from 'framer-motion'
import { Sparkles, Star, Quote } from 'lucide-react'
import Image from 'next/image'

const TESTIMONIALS = [
  {
    name: 'Ahmet Yılmaz',
    role: 'Gezgin / Yazılımcı',
    rating: 5,
    comment: 'Rezervo sayesinde tatil planlarımı yapmak inanılmaz kolaylaştı. Otel ve araç kiralamayı tek bir platformdan, sadece birkaç dakika içinde tamamladım. Arayüzü çok hızlı ve akıcı.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
  },
  {
    name: 'Buse Demir',
    role: 'İşletme Sahibi',
    rating: 5,
    comment: 'Bir iş seyahati düzenleyicisi olarak Rezervo benim kurtarıcım oldu. Müşteri desteği son derece ilgili ve 7/24 hizmet vermeleri büyük bir artı. Kesinlikle tavsiye ederim.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces',
  },
  {
    name: 'Can Kaya',
    role: 'Etkinlik Yöneticisi',
    rating: 5,
    comment: 'Konser ve tiyatro biletlerini alırken yaşadığım onay karmaşası Rezervo ile son buldu. Barkodlu biletler anında e-postama geldi ve girişte hiçbir sorun yaşamadım. Harika altyapı.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces',
  },
]

export function TestimonialsSection() {
  return (
    <section className="relative overflow-hidden bg-white py-20 lg:py-24">
      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 bottom-0 h-[400px] w-[400px] rounded-full bg-blue-50/30 blur-3xl" />
        <div className="absolute -left-40 top-0 h-[400px] w-[400px] rounded-full bg-purple-50/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary">Kullanıcı Yorumları</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
          >
            Mutlu Kullanıcılarımızın Deneyimleri
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-base text-muted-foreground"
          >
            Rezervo platformunu kullanan binlerce gezgin, tatilci ve iş ortağının gerçek yorumları.
          </motion.p>
        </div>

        {/* Testimonials Grid */}
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {TESTIMONIALS.map(({ name, role, rating, comment, avatar }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="relative flex flex-col justify-between rounded-3xl border border-border/80 bg-slate-50/50 p-8 transition-shadow hover:shadow-lg"
            >
              {/* Quote Icon Background */}
              <Quote className="absolute right-6 top-6 h-12 w-12 text-slate-200/50" />

              <div>
                {/* Rating stars */}
                <div className="flex gap-0.5">
                  {Array.from({ length: rating }).map((_, idx) => (
                    <Star key={idx} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Comment */}
                <p className="relative z-10 mt-6 text-sm italic leading-relaxed text-foreground/80">
                  &ldquo;{comment}&rdquo;
                </p>
              </div>

              {/* User details */}
              <div className="mt-8 flex items-center gap-4 border-t border-slate-100 pt-4">
                <div className="relative h-11 w-11 overflow-hidden rounded-full ring-2 ring-white shadow-sm">
                  <Image
                    src={avatar}
                    alt={name}
                    fill
                    className="object-cover"
                    unoptimized // Since using external Unsplash URL
                  />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">{name}</h4>
                  <p className="text-xs text-muted-foreground">{role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
