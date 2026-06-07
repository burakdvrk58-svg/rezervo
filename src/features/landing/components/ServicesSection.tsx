'use client'

import { motion } from 'framer-motion'
import { Building2, Plane, Car, Ticket, Utensils, Sparkles, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const SERVICES = [
  {
    icon: Building2,
    title: 'Lüks Oteller & Konaklama',
    description: 'Dünya çapında binlerce otel, villa ve butik konaklama seçeneği arasından size en uygun olanı bulun.',
    tag: 'Popüler',
    color: 'from-blue-500 to-indigo-600',
    bgLight: 'bg-blue-50/50 text-blue-600',
    link: '/hizmetler/otel',
  },
  {
    icon: Plane,
    title: 'Uçak Biletleri',
    description: 'En popüler hava yollarından en uygun fiyatlı yurt içi ve yurt dışı uçuş alternatiflerini listeleyin ve karşılaştırın.',
    tag: 'En Uygun Fiyat',
    color: 'from-sky-400 to-blue-600',
    bgLight: 'bg-sky-50/50 text-sky-600',
    link: '/hizmetler/ucak',
  },
  {
    icon: Car,
    title: 'Araç Kiralama',
    description: 'Seyahatiniz süresince konforlu bir sürüş için geniş araç filomuzdan dilediğiniz aracı anında kiralayın.',
    tag: 'Hızlı Teslimat',
    color: 'from-emerald-400 to-teal-600',
    bgLight: 'bg-emerald-50/50 text-emerald-600',
    link: '/hizmetler/arac',
  },
  {
    icon: Ticket,
    title: 'Etkinlik & Konser',
    description: 'Konserler, festivaller, tiyatrolar ve yerel etkinlikler için biletinizi sıraya girmeden güvenle alın.',
    tag: 'Yeni',
    color: 'from-purple-500 to-pink-600',
    bgLight: 'bg-purple-50/50 text-purple-600',
    link: '/hizmetler/etkinlik',
  },
  {
    icon: Utensils,
    title: 'Restoran & Masa',
    description: 'Şehrin en iyi restoranlarında sıra beklemeden masanızı ayırtın, özel menülerin tadını çıkarın.',
    tag: 'Gurme',
    color: 'from-amber-500 to-orange-600',
    bgLight: 'bg-amber-50/50 text-amber-600',
    link: '/hizmetler/restoran',
  },
  {
    icon: Sparkles,
    title: 'Spa & Wellness',
    description: 'Zorlu bir haftanın ardından yenilenmek için en seçkin spa, masaj ve güzellik merkezlerinden randevunuzu alın.',
    tag: 'Özel Hizmet',
    color: 'from-rose-500 to-red-600',
    bgLight: 'bg-rose-50/50 text-rose-600',
    link: '/hizmetler/spa',
  },
]

export function ServicesSection() {
  return (
    <section id="services" className="relative overflow-hidden bg-slate-50/50 py-20 lg:py-24">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-50/40 blur-3xl" />
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
            <span className="text-xs font-semibold text-primary">Kategorilerimiz</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
          >
            Her İhtiyacınıza Uygun Rezervasyon
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-base text-muted-foreground"
          >
            Rezervo ile tek tıkla otel, uçak biletleri, araç kiralama ve çok daha fazlasını keşfedin ve saniyeler içinde rezervasyonunuzu tamamlayın.
          </motion.p>
        </div>

        {/* Services Grid */}
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map(({ icon: Icon, title, description, tag, color, bgLight, link }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border bg-white p-6 shadow-sm transition-shadow hover:shadow-xl"
            >
              {/* Top Row with Icon & Tag */}
              <div>
                <div className="flex items-center justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${bgLight} transition-colors group-hover:bg-gradient-to-br group-hover:${color} group-hover:text-white`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  {tag && (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                      {tag}
                    </span>
                  )}
                </div>

                <h3 className="mt-6 text-lg font-bold text-foreground transition-colors group-hover:text-primary">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </div>

              {/* Bottom CTA Link */}
              <div className="mt-8 border-t border-slate-50 pt-4">
                <Link
                  href={link}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition-all group-hover:gap-2"
                >
                  Şimdi Keşfet
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Decorative side border gradient */}
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${color} transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100`} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
