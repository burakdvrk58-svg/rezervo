'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, User } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Ana Sayfa', href: '/' },
  { label: 'Hizmetler', href: '/#services' },
  { label: 'Rezervasyonlarım', href: '/customer/reservations' },
  { label: 'Hakkımızda', href: '/#about' },
  { label: 'İletişim', href: '/#contact' },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState('')

  useEffect(() => {
    const checkSession = () => {
      const loggedIn = localStorage.getItem('rezervo_logged_in') === 'true'
      const role = localStorage.getItem('rezervo_user_role') || ''
      setIsLoggedIn(loggedIn)
      setUserRole(role)
    }

    checkSession()
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('rezervo_logged_in')
    localStorage.removeItem('rezervo_user_role')
    setIsLoggedIn(false)
    setUserRole('')
  }

  const getDashboardLink = () => {
    if (userRole === 'admin') return { label: 'Yönetici Paneli', href: '/admin' }
    if (userRole === 'business') return { label: 'Akademisyen Paneli', href: '/business' }
    return { label: 'Öğrenci Paneli', href: '/customer' }
  }

  const dashboard = getDashboardLink()

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-border/50 bg-white/95 shadow-sm backdrop-blur-md'
          : 'border-b border-transparent bg-white/80 backdrop-blur-sm'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* ── Logo ── */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-sm shadow-primary/30">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className="text-base font-bold leading-none text-foreground">Rezervo</p>
            <p className="text-[10px] leading-none text-muted-foreground mt-0.5">Rezervasyon Sisteminiz</p>
          </div>
        </Link>

        {/* ── Desktop Nav ── */}
        <nav className="hidden items-center gap-0.5 md:flex">
          {NAV_LINKS.map(({ label, href }) => {
            const isActive = href === '/'
            return (
              <Link
                key={href}
                href={href}
                className={`relative px-4 py-2 text-sm font-medium transition-colors hover:text-primary ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {label}
                {isActive && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-primary"
                  />
                )}
              </Link>
            )
          })}
        </nav>

        {/* ── Auth Buttons ── */}
        <div className="hidden items-center gap-2 md:flex">
          {isLoggedIn ? (
            <>
              <Link
                href={dashboard.href}
                className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold text-primary transition-all hover:bg-primary/5"
              >
                <User className="h-4 w-4" />
                {dashboard.label}
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 transition-all hover:bg-red-50 hover:border-red-100 active:scale-95 cursor-pointer"
              >
                Çıkış Yap
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium text-foreground/70 transition-all hover:bg-muted hover:text-foreground"
              >
                <User className="h-4 w-4" />
                Giriş Yap
              </Link>
              <Link
                href="/register"
                className="group relative overflow-hidden rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary/30 transition-all hover:shadow-md hover:shadow-primary/40 active:scale-95"
              >
                <span className="relative z-10">Kayıt Ol</span>
                {/* Shine effect */}
                <span className="absolute inset-0 -translate-x-full skew-x-12 bg-white/20 transition-transform duration-500 group-hover:translate-x-full" />
              </Link>
            </>
          )}
        </div>

        {/* ── Mobile Toggle ── */}
        <button
          id="mobile-menu-toggle"
          aria-label="Menüyü aç/kapat"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-border bg-white px-4 md:hidden"
          >
            <nav className="flex flex-col gap-1 py-3">
              {NAV_LINKS.map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
                  onClick={() => setMobileOpen(false)}
                >
                  {label}
                </Link>
              ))}
              <hr className="my-2 border-border" />
              {isLoggedIn ? (
                <>
                  <Link
                    href={dashboard.href}
                    className="rounded-lg px-3 py-2.5 text-sm font-semibold text-primary hover:bg-primary/5"
                    onClick={() => setMobileOpen(false)}
                  >
                    {dashboard.label}
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout()
                      setMobileOpen(false)
                    }}
                    className="mt-1 rounded-xl bg-red-50 text-red-600 border border-red-100 px-3 py-2.5 text-center text-sm font-semibold hover:bg-red-100 transition-colors w-full cursor-pointer"
                  >
                    Çıkış Yap
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
                    onClick={() => setMobileOpen(false)}
                  >
                    Giriş Yap
                  </Link>
                  <Link
                    href="/register"
                    className="mt-1 rounded-xl bg-primary px-3 py-2.5 text-center text-sm font-semibold text-white"
                    onClick={() => setMobileOpen(false)}
                  >
                    Kayıt Ol
                  </Link>
                </>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
