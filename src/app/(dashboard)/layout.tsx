'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar,
  LayoutDashboard,
  Clock,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  User,
  LogOut,
  ChevronRight,
  ClipboardList,
  BarChart3,
  Users,
  CheckCheck,
  MessageSquare
} from 'lucide-react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  
  const [userName, setUserName] = useState('')

  useEffect(() => {
    const loadUser = () => {
      if (typeof window !== 'undefined') {
        setUserName(localStorage.getItem('rezervo_user_name') || '')
      }
    }
    loadUser()
    window.addEventListener('storage', loadUser)
    return () => window.removeEventListener('storage', loadUser)
  }, [])

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('rezervo_logged_in')
      localStorage.removeItem('rezervo_user_role')
    }
  }

  // Notification local state
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Randevu Onaylandı', desc: 'Prof. Dr. Albert Ali Salah randevunuzu onayladı.', time: '1s önce', unread: true },
    { id: 2, title: 'Yeni İstek', desc: 'Bir öğrenci görüşme talebi gönderdi.', time: '3s önce', unread: true },
    { id: 3, title: 'Güncelleme', desc: 'Randevu takviminiz güncellendi.', time: 'Dün', unread: false },
  ])

  const unreadCount = notifications.filter((n) => n.unread).length

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))
  }

  const getSettingsHref = () => {
    if (pathname?.startsWith('/business')) return '/business/settings'
    if (pathname?.startsWith('/admin')) return '/admin/settings'
    return '/customer/settings'
  }

  // Dynamic role info extraction based on the URL prefix
  const getRoleInfo = () => {
    if (pathname?.startsWith('/business')) {
      return {
        roleLabel: 'Akademisyen Paneli',
        userRole: 'Akademisyen',
        userDisplayName: userName || 'Prof. Dr. Albert Ali Salah',
        userAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=faces',
        menuItems: [
          { label: 'Genel Bakış', href: '/business', icon: LayoutDashboard },
          { label: 'Görüşme İstekleri', href: '/business/requests', icon: ClipboardList },
          { label: 'Akademik Analitik', href: '/business/analytics', icon: BarChart3 },
          { label: 'Hesap Ayarları', href: '/business/settings', icon: Settings },
        ]
      }
    }

    if (pathname?.startsWith('/admin')) {
      return {
        roleLabel: 'Yönetici Paneli',
        userRole: 'Sistem Yöneticisi',
        userDisplayName: userName || 'Can Ertekin',
        userAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=faces',
        menuItems: [
          { label: 'Genel Bakış', href: '/admin', icon: LayoutDashboard },
          { label: 'Kullanıcı Yönetimi', href: '/admin/users', icon: Users },
          { label: 'Sistem Analitiği', href: '/admin/analytics', icon: BarChart3 },
          { label: 'Sistem Ayarları', href: '/admin/settings', icon: Settings },
        ]
      }
    }

    // Default to customer role
    return {
      roleLabel: 'Öğrenci Paneli',
      userRole: 'Öğrenci',
      userDisplayName: userName || 'Ahmet Yılmaz',
      userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
      menuItems: [
        { label: 'Genel Bakış', href: '/customer', icon: LayoutDashboard },
        { label: 'Görüşmelerim', href: '/customer/reservations', icon: Clock },
        { label: 'Akademisyen Bul', href: '/search', icon: Search },
        { label: 'Hesap Ayarları', href: '/customer/settings', icon: Settings },
      ]
    }
  }

  const { roleLabel, userRole, userDisplayName, userAvatar, menuItems } = getRoleInfo()

  return (
    <div className="flex min-h-screen bg-slate-50/50">

      {/* ── Desktop Sidebar ── */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-slate-200 bg-white lg:block">
        <div className="flex h-full flex-col justify-between p-5">
          {/* Logo */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2.5 px-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-sm shadow-primary/30">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-base font-bold leading-none text-slate-900 font-sans tracking-tight">Rezervo</p>
                <p className="text-[10px] leading-none text-slate-500 mt-0.5">{roleLabel}</p>
              </div>
            </Link>

            {/* Menu Links */}
            <nav role="navigation" aria-label="Ana Menü" className="space-y-1">
              {menuItems.map(({ label, href, icon: Icon }) => {
                const isActive = pathname === href
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                      isActive
                        ? 'text-primary'
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="sidebar-active"
                        className="absolute inset-0 rounded-xl bg-primary/8"
                      />
                    )}
                    <Icon className={`h-4.5 w-4.5 transition-colors ${isActive ? 'text-primary' : 'text-slate-400 group-hover:text-slate-600'}`} />
                    <span className="relative z-10">{label}</span>
                    <ChevronRight className={`ml-auto h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100 ${isActive ? 'text-primary' : 'text-slate-400'}`} />
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* User Profile Card */}
          <div className="border-t border-slate-100 pt-4">
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
              <div className="relative h-9 w-9 overflow-hidden rounded-full bg-slate-200">
                <img
                  src={userAvatar}
                  alt={userDisplayName}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-bold text-slate-900">{userDisplayName}</p>
                <p className="truncate text-[11px] text-slate-500">{userRole}</p>
              </div>
              <Link
                href="/login"
                onClick={handleLogout}
                title="Çıkış Yap"
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200/50 hover:text-slate-600"
              >
                <LogOut className="h-4.5 w-4.5" />
              </Link>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Mobile Sidebar Drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black lg:hidden"
            />
            {/* Drawer */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 top-0 left-0 z-50 w-64 border-r border-slate-200 bg-white p-5 lg:hidden"
            >
              <div className="flex h-full flex-col justify-between">
                <div className="space-y-6">
                  {/* Top Bar Logo & Close button */}
                  <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
                        <Calendar className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-base font-bold leading-none text-slate-900">Rezervo</p>
                        <p className="text-[10px] leading-none text-slate-500 mt-0.5">{roleLabel}</p>
                      </div>
                    </Link>
                    <button
                      onClick={() => setMobileOpen(false)}
                      className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Menu Links */}
                  <nav role="navigation" aria-label="Mobil Menü" className="space-y-1">
                    {menuItems.map(({ label, href, icon: Icon }) => {
                      const isActive = pathname === href
                      return (
                        <Link
                          key={href}
                          href={href}
                          onClick={() => setMobileOpen(false)}
                          className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                            isActive
                              ? 'bg-primary/8 text-primary'
                              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                          }`}
                        >
                          <Icon className={`h-4.5 w-4.5 ${isActive ? 'text-primary' : 'text-slate-400'}`} />
                          <span>{label}</span>
                        </Link>
                      )
                    })}
                  </nav>
                </div>

                {/* Profile Card */}
                <div className="border-t border-slate-100 pt-4 flex items-center gap-3 bg-slate-50 rounded-xl p-3">
                  <div className="h-9 w-9 overflow-hidden rounded-full bg-slate-200">
                    <img
                      src={userAvatar}
                      alt={userDisplayName}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="truncate text-sm font-bold text-slate-900">{userDisplayName}</p>
                    <p className="truncate text-[11px] text-slate-500">{userRole}</p>
                  </div>
                  <Link
                    href="/login"
                    onClick={handleLogout}
                    className="rounded-lg p-1.5 text-slate-400"
                  >
                    <LogOut className="h-4.5 w-4.5" />
                  </Link>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Main Content Area ── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-100 bg-white/80 px-4 backdrop-blur-md sm:px-6 lg:px-8">

          {/* Menu button & Search */}
          <div className="flex flex-1 items-center gap-4">
            <button
              id="dashboard-menu-toggle"
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Search inputs */}
            <div className="relative hidden w-80 sm:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Rezervasyonlarda ara..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-4 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/10"
              />
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-4">

            {/* Notifications button */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                {unreadCount > 0 && (
                  <span className="absolute right-1.5 top-1.5 flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
                  </span>
                )}
                <Bell className="h-5 w-5" />
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 12 }}
                      className="absolute right-0 z-20 mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl"
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                        <h3 className="text-xs font-bold text-slate-900">Bildirimler</h3>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllRead}
                            className="flex items-center gap-1 text-[10px] font-bold text-primary hover:underline"
                          >
                            <CheckCheck className="h-3 w-3" />
                            Tümünü Okundu Say
                          </button>
                        )}
                      </div>

                      <div className="mt-3 space-y-3 max-h-60 overflow-y-auto">
                        {notifications.map((n) => (
                          <div key={n.id} className="relative flex gap-3 rounded-lg p-2 hover:bg-slate-50 transition-colors">
                            {n.unread && (
                              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" />
                            )}
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                              <MessageSquare className="h-4 w-4" />
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                              <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">{n.desc}</p>
                              <span className="text-[9px] text-slate-400 mt-1 block">{n.time}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <hr className="h-6 w-px border-l border-slate-200" />

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 rounded-xl p-1.5 transition-colors hover:bg-slate-100"
              >
                <div className="h-8 w-8 overflow-hidden rounded-full bg-slate-200">
                  <img
                    src={userAvatar}
                    alt={userDisplayName}
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="hidden text-sm font-semibold text-slate-700 sm:block">{userDisplayName}</span>
              </button>

              <AnimatePresence>
                {showProfileMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowProfileMenu(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 z-20 mt-2 w-48 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg"
                    >
                      <Link
                        href={getSettingsHref()}
                        onClick={() => setShowProfileMenu(false)}
                        className="flex w-full items-center gap-2 rounded-lg px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 text-left"
                      >
                        <User className="h-4 w-4 text-slate-400" />
                        Profilim
                      </Link>
                      <hr className="my-1 border-slate-100" />
                      <Link
                        href="/login"
                        onClick={() => {
                          setShowProfileMenu(false)
                          handleLogout()
                        }}
                        className="flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4 text-red-500" />
                        Çıkış Yap
                      </Link>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

          </div>

        </header>

        {/* Dashboard Child View */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

    </div>
  )
}
