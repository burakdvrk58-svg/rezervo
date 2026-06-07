'use client'

import Link from 'next/link'
import { Calendar, Mail, Phone, MapPin } from 'lucide-react'

const QUICK_LINKS = [
  { label: 'Ana Sayfa', href: '/' },
  { label: 'Hizmetler', href: '/#services' },
  { label: 'Rezervasyonlarım', href: '/customer/reservations' },
  { label: 'Hakkımızda', href: '/#about' },
  { label: 'İletişim', href: '/#contact' },
]

const SERVICES = [
  { label: 'Otel Konaklama', href: '/hizmetler/otel' },
  { label: 'Uçak Biletleri', href: '/hizmetler/ucak' },
  { label: 'Araç Kiralama', href: '/hizmetler/arac' },
  { label: 'Etkinlik & Konser', href: '/hizmetler/etkinlik' },
]

const LEGAL_LINKS = [
  { label: 'Kullanım Koşulları', href: '/legal/terms' },
  { label: 'Gizlilik Politikası', href: '/legal/privacy' },
  { label: 'KVKK Metni', href: '/legal/kvkk' },
  { label: 'Çerez Politikası', href: '/legal/cookies' },
]

const SOCIAL_LINKS = [
  {
    href: 'https://twitter.com',
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    href: 'https://instagram.com',
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
      </svg>
    ),
  },
  {
    href: 'https://linkedin.com',
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
        <rect x="2" y="9" width="4" height="12"/>
        <circle cx="4" cy="4" r="2"/>
      </svg>
    ),
  },
  {
    href: 'https://facebook.com',
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
      </svg>
    ),
  },
]

export function Footer() {
  return (
    <footer id="contact" className="border-t border-border bg-slate-900 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Col */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-sm shadow-primary/30">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-lg font-bold leading-none text-white">Rezervo</p>
                <p className="text-[11px] leading-none text-slate-400 mt-0.5">Rezervasyon Sisteminiz</p>
              </div>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              Rezervo, tatil ve iş seyahatleriniz için konaklamadan uçak biletine, araç kiralamadan etkinlik biletlerine kadar her şeyi tek bir yerden güvenle yönetmenizi sağlar.
            </p>
            {/* Social Links */}
            <div className="mt-6 flex gap-3.5">
              {SOCIAL_LINKS.map(({ icon, href }, idx) => (
                <a
                  key={idx}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 text-slate-400 transition-colors hover:bg-primary hover:text-white"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">Hızlı Menü</h3>
            <ul className="mt-4 space-y-2.5">
              {QUICK_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-sm transition-colors hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">Hizmetlerimiz</h3>
            <ul className="mt-4 space-y-2.5">
              {SERVICES.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-sm transition-colors hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">İletişim</h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start gap-2.5 text-sm">
                <MapPin className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                <span>Levent, Büyükdere Cd. No:123, 34394 Şişli/İstanbul</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm">
                <Phone className="h-4 w-4 shrink-0 text-primary" />
                <a href="tel:08501234567" className="transition-colors hover:text-white">0850 123 45 67</a>
              </li>
              <li className="flex items-center gap-2.5 text-sm">
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                <a href="mailto:destek@rezervo.com" className="transition-colors hover:text-white">destek@rezervo.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-slate-800 pt-8 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} Rezervo. Tüm Hakları Saklıdır.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {LEGAL_LINKS.map(({ label, href }) => (
              <Link key={href} href={href} className="text-xs transition-colors hover:text-slate-200">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
