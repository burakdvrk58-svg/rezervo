'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus, HelpCircle } from 'lucide-react'

const FAQS = [
  {
    question: 'Nasıl görüşme randevusu alabilirim?',
    answer: 'Ana sayfadaki arama panelini veya Akademisyen Bul sayfasını kullanarak üniversite ve akademisyen seçimi yapın. Akademisyenin o güne ait uygun 15 dakikalık saat dilimlerinden birini seçip öğrenci bilgilerinizi ve görüşme konunuzu girerek kolayca randevu oluşturabilirsiniz.',
  },
  {
    question: 'Randevumu iptal edebilir miyim veya değiştirebilir miyim?',
    answer: 'Evet. Öğrenci Paneli > Görüşmelerim sekmesine giderek bekleyen veya onaylanan görüşme taleplerinizi istediğiniz zaman iptal edebilirsiniz.',
  },
  {
    question: 'Bu hizmet ücretli midir?',
    answer: 'Hayır. Üniversite içi akademik danışmanlık, tez kontrolü ve hoca görüşmeleri öğrenciler için tamamen ücretsizdir. Hiçbir aşamada kart veya ödeme bilgisi talep edilmemektedir.',
  },
  {
    question: 'Akademisyen görüşme talebimi onaylamazsa ne olur?',
    answer: 'Talebiniz ilk etapta "Beklemede" olarak oluşturulur. Akademisyen talebinizi inceleyip onayladığında sistem üzerinden durumu "Onaylandı" olarak güncellenir ve size bildirim gönderilir. Akademisyen reddederse durum "Reddedildi" olarak güncellenir ve başka bir slot seçebilirsiniz.',
  },
  {
    question: 'Herhangi bir sorun yaşarsam size nasıl ulaşabilirim?',
    answer: 'Sistemle ilgili teknik sorularınız için destek@rezervo.com adresinden teknik ekibimize, akademik randevu detayları için ise doğrudan kendi danışman hocanıza veya bölüm sekreterliğine ulaşabilirsiniz.',
  },
]

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="about" className="relative overflow-hidden bg-slate-50/50 py-20 lg:py-24">
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5"
          >
            <HelpCircle className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary">Sıkça Sorulan Sorular</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
          >
            Merak Edilen Sorular & Cevaplar
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-base text-muted-foreground"
          >
            Rezervasyon süreçleri, ödemeler, iptaller ve destek hakkında en çok sorulan soruların yanıtları.
          </motion.p>
        </div>

        {/* Faq List */}
        <div className="mt-16 space-y-4">
          {FAQS.map(({ question, answer }, idx) => {
            const isOpen = openIndex === idx
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="overflow-hidden rounded-2xl border border-border bg-white transition-all hover:border-primary/30 hover:shadow-sm"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left font-semibold text-foreground focus:outline-none sm:p-6"
                >
                  <span className="text-base sm:text-lg">{question}</span>
                  <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition-colors ${isOpen ? 'bg-primary/10 text-primary' : ''}`}>
                    {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </div>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                    >
                      <div className="border-t border-slate-50 p-5 text-sm leading-relaxed text-muted-foreground sm:px-6 sm:pb-6">
                        {answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
