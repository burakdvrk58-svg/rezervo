'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Sparkles, Send } from 'lucide-react'

export function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 5000)
    }
  }

  return (
    <section className="relative overflow-hidden bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-primary to-blue-600 px-6 py-12 shadow-2xl shadow-primary/20 sm:px-12 sm:py-16 md:px-16"
        >
          {/* Background circles */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-blue-400/20 blur-2xl" />
          </div>

          <div className="relative mx-auto max-w-3xl text-center">
            {/* Sparkles top */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                <Sparkles className="h-3 w-3" />
                Duyuruları Kaçırmayın
              </div>
            </div>

            <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Akademik Takvim & Müsaitlik Bildirimleri
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-blue-100">
              Bültenimize abone olarak üniversitenizdeki yeni akademisyenlerden, açılan ek danışmanlık slotlarından ve önemli dönem takvimi duyurularından ilk siz haberdar olun!
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mx-auto mt-10 max-w-md">
              <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:rounded-2xl sm:bg-white/10 sm:p-1.5 sm:backdrop-blur-md">
                <div className="relative flex flex-1 items-center rounded-2xl bg-white sm:bg-transparent">
                  <Mail className="absolute left-4 h-5 w-5 text-muted-foreground sm:text-blue-100" />
                  <input
                    type="email"
                    required
                    placeholder="E-posta adresiniz"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent py-4 pl-12 pr-4 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none sm:py-3 sm:text-white sm:placeholder:text-blue-200/80"
                  />
                </div>
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-4 text-sm font-bold text-primary shadow-lg shadow-black/5 transition-all hover:bg-slate-50 hover:shadow-xl active:scale-95 sm:py-3"
                >
                  <Send className="h-4 w-4" />
                  Abone Ol
                </button>
              </div>
            </form>

            {/* Success message */}
            {subscribed && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-sm font-semibold text-emerald-200"
              >
                Tebrikler! Bültenimize başarıyla abone oldunuz.
              </motion.p>
            )}

            <p className="mt-4 text-xs text-blue-200/80">
              İstediğiniz zaman abonelikten çıkabilirsiniz. Bilgileriniz KVKK kapsamında korunmaktadır.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
