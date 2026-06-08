'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar,
  Star,
  Bell,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Clock,
  Search,
  CheckCircle,
  Menu,
  X
} from 'lucide-react'
import Link from 'next/link'

// ── TYPES & CONFIG ──
interface FeatureCard {
  id: number
  title: string
  subtitle: string
  description: string
  gradient: string
  textColor: string
  featureBadge: string
  imageComponent: React.ReactNode
}

interface TestimonialCard {
  id: number
  name: string
  role: string
  university: string
  rating: number
  comment: string
  image: string
  bgGradient: string
}

export default function HugoPreviewPage() {
  const [activeTab, setActiveTab] = useState<'student' | 'academician'>('student')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [hoveredCase, setHoveredCase] = useState<number | null>(null)

  // ── DUMMY DATA ──
  const features: FeatureCard[] = [
    {
      id: 1,
      featureBadge: 'Hızlı & Esnek',
      title: 'Akıllı Haftalık Takvim',
      subtitle: 'Öğrenci ve Akademisyenler için Dinamik Slot Yönetimi',
      description: 'Gelişmiş 7 günlük date-grid yapısı sayesinde akademisyenler uygun saatlerini belirler, öğrenciler ise tek tıkla boş slotları rezerve eder. Çakışmalar sistem tarafından otomatik olarak engellenir.',
      gradient: 'from-[#052e16] to-[#022c22]',
      textColor: 'text-emerald-400',
      imageComponent: (
        <div className="relative w-full h-full min-h-[260px] flex items-center justify-center p-4">
          <div className="w-full max-w-[340px] glass rounded-2xl p-5 border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-xl bg-black/40">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-2xl rounded-full" />
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Pazartesi Takvimi
              </span>
              <span className="text-[10px] text-slate-400">7 Slot Aktif</span>
            </div>
            <div className="space-y-2.5">
              {[
                { time: '09:00 - 09:30', status: 'Dolu', student: 'Can Yılmaz', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
                { time: '10:00 - 10:30', status: 'Rezerve', student: 'Zeynep Kaya', bg: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
                { time: '11:00 - 11:30', status: 'Boş', student: 'Müsait', bg: 'bg-white/5 text-slate-300 border-white/5' },
              ].map((slot, i) => (
                <div key={i} className={`flex items-center justify-between p-3 rounded-xl border text-xs ${slot.bg}`}>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="font-medium">{slot.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] opacity-60">{slot.student}</span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-black/30">{slot.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      featureBadge: 'Kalite & Güven',
      title: '5 Yıldızlı Akademik Değerlendirme',
      subtitle: 'Karşılıklı Geri Bildirim ve Değerlendirme Sistemi',
      description: 'Tamamlanan her danışmanlık seansı sonrasında öğrenciler, akademisyenleri 1-5 yıldız arasında puanlayabilir ve yorum bırakabilir. Akademisyen profillerinde puan ortalaması anlık olarak güncellenir.',
      gradient: 'from-[#1e1b4b] to-[#311042]',
      textColor: 'text-indigo-400',
      imageComponent: (
        <div className="relative w-full h-full min-h-[260px] flex items-center justify-center p-4">
          <div className="w-full max-w-[340px] glass rounded-2xl p-5 border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-xl bg-black/40">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-2xl rounded-full" />
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-sm">
                AD
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Doç. Dr. Ahmet Demir</h4>
                <p className="text-[10px] text-slate-400">Bilgisayar Mühendisliği Bölümü</p>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 mb-3 text-center">
              <div className="text-2xl font-bold text-white mb-1">4.9</div>
              <div className="flex justify-center gap-1 mb-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-[9px] text-slate-400">Toplam 48 Öğrenci Değerlendirmesi</p>
            </div>
            <div className="space-y-1.5 text-[10px]">
              <div className="bg-white/5 rounded-lg p-2 text-slate-300">
                &quot;Tez konum hakkında çok yardımcı oldu, mükemmel bir danışman.&quot;
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      featureBadge: 'Gerçek Zamanlı',
      title: 'Canlı Bildirim Merkezi',
      subtitle: 'Tarayıcılar Arası Eşzamanlı Bildirim Akışı',
      description: 'LocalStorage Event Listener teknolojisi ile sekmeler veya tarayıcılar arasında sayfa yenilemeye gerek kalmadan yeni randevular, onaylar ve iptaller anında tüm ekranlarınızda senkronize edilir.',
      gradient: 'from-[#1e293b] to-[#0f172a]',
      textColor: 'text-blue-400',
      imageComponent: (
        <div className="relative w-full h-full min-h-[260px] flex items-center justify-center p-4">
          <div className="w-full max-w-[340px] glass rounded-2xl p-5 border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-xl bg-black/40">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-2xl rounded-full" />
            <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
              <span className="text-xs font-semibold text-white flex items-center gap-2">
                <Bell className="w-3.5 h-3.5 text-blue-400 animate-bounce" /> Bildirimler
              </span>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-medium">Yeni</span>
            </div>
            <div className="space-y-2">
              <div className="flex gap-2.5 items-start bg-blue-500/5 border border-blue-500/20 rounded-xl p-3 text-xs">
                <CheckCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-200">Görüşme Talebi Onaylandı</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Prof. Dr. Elif Yılmaz görüşme isteğinizi onayladı.</p>
                  <span className="text-[9px] text-blue-400/70 mt-1 block">Şimdi</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ]

  const testimonials: TestimonialCard[] = [
    {
      id: 1,
      name: 'Dr. Öğr. Üyesi Berk Arslan',
      role: 'Akademisyen / Danışman',
      university: 'İTÜ',
      rating: 5,
      comment: 'Rezervo sayesinde öğrencilerimle olan görüşmelerimi planlamak bir kabus olmaktan çıktı. Boş saatlerimi bir kez belirliyorum, öğrenciler kendi isteklerine göre takvimden seçiyor.',
      image: 'BA',
      bgGradient: 'from-blue-600/20 to-purple-600/10'
    },
    {
      id: 2,
      name: 'Melis Şen',
      role: 'Yazılım Mühendisliği Öğrencisi',
      university: 'ODTÜ',
      rating: 5,
      comment: 'Tez danışmanıma ulaşmak ve randevu almak için saatlerce e-posta atmama gerek kalmıyor. Rezervo üzerinden akademisyenin profiline girip takviminden anında yerimi rezerve ediyorum.',
      image: 'MŞ',
      bgGradient: 'from-emerald-600/20 to-teal-600/10'
    },
    {
      id: 3,
      name: 'Doç. Dr. Seda Korkmaz',
      role: 'Akademisyen / Dekan Yrd.',
      university: 'Boğaziçi Üniversitesi',
      rating: 5,
      comment: 'Öğrenci puanlama ve geri bildirim sistemi sayesinde her dönem sonunda danışmanlık hizmetlerimizin kalitesini analiz edebiliyoruz. Raporlama aracı şahane.',
      image: 'SK',
      bgGradient: 'from-pink-600/20 to-rose-600/10'
    }
  ]

  return (
    <div className="relative min-h-screen bg-black text-slate-300 font-sans selection:bg-white/20 selection:text-white overflow-x-hidden">
      
      {/* ── AMBIENT BACKGROUND GLOWS (Hugo style) ── */}
      <div className="absolute top-[-200px] left-[-10%] w-[50%] h-[600px] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute top-[-150px] right-[-10%] w-[50%] h-[600px] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute top-[40%] left-[20%] w-[40%] h-[500px] bg-emerald-500/5 rounded-full blur-[130px] pointer-events-none z-0" />
      <div className="absolute bottom-[10%] right-[-5%] w-[45%] h-[600px] bg-rose-500/5 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* ── GRID PATTERN OVERLAY ── */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0" />

      {/* ── HEADER (Hugo Navigation) ── */}
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-white/5 backdrop-blur-[15px] bg-black/45">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Sparkles className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-bold text-white text-lg tracking-tight">rezervo</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#features" className="text-slate-400 hover:text-white transition-colors">Özellikler</a>
            <a href="#demo" className="text-slate-400 hover:text-white transition-colors">3D Önizleme</a>
            <a href="#testimonials" className="text-slate-400 hover:text-white transition-colors">Başarı Hikayeleri</a>
            <a href="#faq" className="text-slate-400 hover:text-white transition-colors">S.S.S.</a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors">
              Giriş Yap
            </Link>
            <Link href="/register" className="px-5 py-2.5 text-sm font-semibold rounded-lg bg-white text-black hover:bg-slate-200 transition-all duration-200 shadow-lg shadow-white/5">
              Ücretsiz Başla
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-18 left-0 right-0 bg-black/95 border-b border-white/10 p-6 flex flex-col gap-4 md:hidden backdrop-blur-xl"
            >
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-slate-400 hover:text-white py-2">Özellikler</a>
              <a href="#demo" onClick={() => setMobileMenuOpen(false)} className="text-slate-400 hover:text-white py-2">3D Önizleme</a>
              <a href="#testimonials" onClick={() => setMobileMenuOpen(false)} className="text-slate-400 hover:text-white py-2">Başarı Hikayeleri</a>
              <Link href="/login" className="text-center py-3 text-slate-300 border border-white/10 rounded-lg">Giriş Yap</Link>
              <Link href="/register" className="text-center py-3 bg-white text-black font-semibold rounded-lg">Ücretsiz Başla</Link>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── HERO SECTION ── */}
      <section className="relative pt-36 pb-24 md:pt-48 md:pb-32 z-10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Hero Text */}
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-blue-400 animate-pulse" />
              <span className="text-xs font-semibold text-slate-200">Tamamen Akademik Odaklı Tasarım</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1]">
              Akademik Danışmanlığı
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
                Yeniden Keşfedin.
              </span>
            </h1>

            <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
              Rezervo, üniversite öğrencilerinin danışman hocaları ile saniyeler içinde seans rezerve etmesini sağlayan, 3D vizyonlu ve canlı bildirim destekli yeni nesil akademik randevu portalıdır.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link href="/register" className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-500 transition-all duration-200 shadow-xl shadow-blue-600/20 group">
                Hemen Başlayın <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#demo" className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold transition-all duration-200 backdrop-blur-sm">
                3D Deneyimi Gör
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-white/5">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <CheckCircle className="w-4 h-4 text-emerald-400" /> Kurulum Gerektirmez
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <CheckCircle className="w-4 h-4 text-emerald-400" /> Ücretsiz Kullanım
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <CheckCircle className="w-4 h-4 text-emerald-400" /> Mobil Uyumlu
              </div>
            </div>
          </div>

          {/* Right Hero: Gorgeous 3D Isometric Card Simulation */}
          <div className="lg:col-span-5 relative flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-[420px] aspect-[4/5] perspective-1000">
              
              {/* Floating decorative elements */}
              <div className="absolute top-[-5%] left-[-5%] w-20 h-20 bg-blue-600/10 blur-xl rounded-full" />
              <div className="absolute bottom-[10%] right-[-5%] w-28 h-28 bg-purple-600/10 blur-xl rounded-full" />

              {/* Base Interactive Card Grid (3D rotated looking card) */}
              <div className="w-full h-full rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-950/90 p-6 shadow-2xl backdrop-blur-2xl relative overflow-hidden flex flex-col justify-between transform rotate-y-[-10deg] rotate-x-[12deg] hover:rotate-y-[0deg] hover:rotate-x-[0deg] transition-all duration-700 ease-out">
                
                {/* Header info */}
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Rezervo Dashboard</span>
                  </div>
                  <span className="text-[10px] text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full font-semibold">
                    Akademisyen Modu
                  </span>
                </div>

                {/* Main 3D Card Content Simulation */}
                <div className="space-y-4 my-auto">
                  <div className="glass rounded-2xl p-4 border border-white/15 shadow-lg relative bg-white/5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-400" />
                        <span className="text-xs font-semibold text-white">Aktif Görüşmeler</span>
                      </div>
                      <span className="text-[9px] text-slate-400 font-mono">Bugün</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center bg-black/30 border border-white/5 rounded-xl p-2.5 text-[11px]">
                        <div>
                          <p className="font-semibold text-white">Can Özkan</p>
                          <p className="text-[9px] text-slate-500">Bitirme Projesi Danışmanlığı</p>
                        </div>
                        <span className="text-[9px] px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-400 border border-blue-500/30">
                          14:30
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Rating Card Overlay */}
                  <div className="flex gap-4">
                    <div className="flex-1 glass rounded-2xl p-4 border border-white/15 shadow-lg bg-white/5 flex flex-col justify-between">
                      <div className="text-[10px] text-slate-400 uppercase">Öğrenci Puanı</div>
                      <div className="text-xl font-bold text-white mt-1">4.92 / 5.0</div>
                      <div className="flex gap-0.5 mt-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex-1 glass rounded-2xl p-4 border border-white/15 shadow-lg bg-white/5 flex flex-col justify-between">
                      <div className="text-[10px] text-slate-400 uppercase">Bu Ayki Seans</div>
                      <div className="text-xl font-bold text-white mt-1">112 Saat</div>
                      <span className="text-[9px] text-emerald-400 flex items-center gap-1 font-medium mt-1">
                        +14% Geçen aya göre
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom decorative logo */}
                <div className="mt-6 border-t border-white/5 pt-4 flex justify-between items-center text-[10px] text-slate-500">
                  <span>Sürüm 2.4 (HTML/CSS 3D)</span>
                  <span>Boğaziçi, İTÜ, ODTÜ uyumlu</span>
                </div>

              </div>

              {/* Floating Star Badge */}
              <div className="absolute top-[20%] right-[-10%] glass rounded-2xl p-3 border border-white/15 shadow-2xl backdrop-blur-xl bg-black/60 flex items-center gap-2 transform translate-z-10 animate-bounce duration-[3s]">
                <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/25 flex items-center justify-center">
                  <Star className="w-4.5 h-4.5 fill-amber-400 text-amber-400" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-white">4.9 Puanlama</div>
                  <div className="text-[9px] text-slate-400">Danışman Değerlendirme</div>
                </div>
              </div>

              {/* Floating Notification Badge */}
              <div className="absolute bottom-[15%] left-[-12%] glass rounded-2xl p-3 border border-white/15 shadow-2xl backdrop-blur-xl bg-black/60 flex items-center gap-2.5 transform translate-z-20">
                <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-400">
                  <Bell className="w-4 h-4 animate-swing" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-white">Yeni Bildirim</div>
                  <div className="text-[9px] text-slate-400">Anında Sekmeler Arası Eşleşti</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ── INTERACTIVE 3D PLATFORM PREVIEW (Hugo style Tabs) ── */}
      <section id="demo" className="py-24 border-t border-white/5 relative z-10 bg-slate-950/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Her İki Arayüzde de Kusursuz Deneyim
            </h2>
            <p className="text-slate-400 text-base">
              Öğrenciler ve akademisyenler için özel olarak kurgulanmış şık, modern ve hızlı panellerle randevuları yönetin.
            </p>
            
            {/* Interactive Selector Tabs */}
            <div className="inline-flex p-1 bg-white/5 border border-white/10 rounded-xl mt-4">
              <button
                onClick={() => setActiveTab('student')}
                className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === 'student' ? 'bg-white text-black shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                Öğrenci Paneli
              </button>
              <button
                onClick={() => setActiveTab('academician')}
                className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === 'academician' ? 'bg-white text-black shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                Akademisyen Paneli
              </button>
            </div>
          </div>

          {/* Interactive Screen Preview */}
          <div className="glass rounded-3xl border border-white/10 overflow-hidden shadow-2xl relative bg-black/60 backdrop-blur-2xl">
            
            {/* Window Chrome */}
            <div className="h-12 border-b border-white/5 bg-white/5 px-6 flex items-center justify-between">
              <div className="flex gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/60" />
                <span className="w-3 h-3 rounded-full bg-amber-500/60" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/60" />
              </div>
              <span className="text-[11px] font-mono text-slate-500">rezervo.com/dashboard/{activeTab}</span>
              <div className="w-4.5" />
            </div>

            {/* Screen Content */}
            <div className="p-6 md:p-8 min-h-[400px] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-5 space-y-6">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                  {activeTab === 'student' ? 'ÖĞRENCİ PORTALI' : 'AKADEMİSYEN PORTALI'}
                </span>
                
                <h3 className="text-2xl md:text-3xl font-bold text-white">
                  {activeTab === 'student' 
                    ? 'Size En Uygun Danışmanı Bulun ve Randevu Oluşturun' 
                    : 'Görüşme İsteklerini Kolayca Yönetin ve Raporlayın'}
                </h3>
                
                <p className="text-slate-400 text-sm leading-relaxed">
                  {activeTab === 'student'
                    ? 'Üniversite seçimi yapın, akademisyenlerin puanlarını ve yorumlarını karşılaştırın. Haftalık takvim üzerinden dilediğiniz saati seçip anında rezervasyonunuzu tamamlayın.'
                    : 'Gelen randevu isteklerini listeleyin, onaylayın veya iptal edin. Toplam danışmanlık saati, aylık seans analitikleri ve öğrenci yorum puanlamalarına tek bir ekrandan ulaşın.'}
                </p>

                <ul className="space-y-3">
                  {(activeTab === 'student' 
                    ? ['Akademisyenleri puana ve alana göre filtreleme', 'Dinamik 7 günlük takvimden slot seçme', 'Görüşme sonrasında danışmana yıldız ve yorum verme']
                    : ['Tek tıkla randevu onaylama / iptal etme', 'Çalışma takvimini dinamik saatlerle güncelleme', 'Detaylı aylık danışmanlık analiz raporları']
                  ).map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-xs text-slate-300 font-medium">
                      <span className="w-5 h-5 rounded-full bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-400 shrink-0">
                        <CheckCircle className="w-3.5 h-3.5" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Visual UI Demonstration inside screen */}
              <div className="lg:col-span-7 bg-white/3 border border-white/5 rounded-2xl p-6 min-h-[340px] flex flex-col justify-between relative overflow-hidden bg-black/40">
                <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-indigo-500/10 blur-3xl rounded-full" />
                
                {activeTab === 'student' ? (
                  // Student UI Simulation
                  <div className="space-y-5">
                    <div className="flex justify-between items-center border-b border-white/5 pb-4">
                      <div className="flex gap-2 items-center bg-white/5 rounded-lg px-3 py-1.5 border border-white/10 text-xs">
                        <Search className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-slate-300">Boğaziçi Üniversitesi</span>
                      </div>
                      <span className="text-xs text-slate-400">14 Akademisyen Listelendi</span>
                    </div>

                    <div className="space-y-3">
                      {[
                        { name: 'Prof. Dr. Seda Korkmaz', rating: 4.9, role: 'Yapay Zeka Lab Direktörü' },
                        { name: 'Dr. Öğr. Üyesi Berk Arslan', rating: 4.8, role: 'Bilgisayar Ağları ve Güvenlik' }
                      ].map((adv, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                          <div>
                            <h4 className="text-xs font-semibold text-white">{adv.name}</h4>
                            <p className="text-[10px] text-slate-400 mt-0.5">{adv.role}</p>
                            <div className="flex items-center gap-1.5 mt-2">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              <span className="text-[11px] font-bold text-white">{adv.rating}</span>
                              <span className="text-[9px] text-slate-500">(32 yorum)</span>
                            </div>
                          </div>
                          <button className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-[10px] font-semibold hover:bg-blue-500 transition-colors">
                            Randevu Al
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  // Academician UI Simulation
                  <div className="space-y-5">
                    <div className="flex justify-between items-center border-b border-white/5 pb-4">
                      <span className="text-xs font-bold text-white">Gelen Randevu İstekleri</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 font-semibold">2 Bekleyen</span>
                    </div>

                    <div className="space-y-3">
                      {[
                        { student: 'Ahmet Yılmaz', type: 'Tez Danışmanlığı', time: '14 Haz 2026, 10:30' },
                        { student: 'Selin Demir', type: 'Ders Seçimi İntibakı', time: '15 Haz 2026, 11:30' }
                      ].map((req, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                          <div>
                            <div className="text-xs font-semibold text-white">{req.student}</div>
                            <div className="text-[9px] text-slate-400 mt-0.5">{req.type}</div>
                            <div className="text-[9px] text-blue-400 mt-1">{req.time}</div>
                          </div>
                          <div className="flex gap-2">
                            <button className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-semibold hover:bg-emerald-500/20 transition-colors">
                              Onayla
                            </button>
                            <button className="px-2.5 py-1.5 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-[10px] font-semibold hover:bg-destructive/20 transition-colors">
                              Reddet
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ── STACKING CARDS (Hugo style Sticky Cards Stack) ── */}
      <section id="features" className="py-24 relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full">
            Detaylı İnceleme
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white">
            Rezervo&apos;yu Benzersiz Kılan Özellikler
          </h2>
          <p className="text-slate-400 text-base">
            Akademik randevu takibini hızlandırmak ve kullanıcıları memnun etmek amacıyla özel olarak tasarlandı.
          </p>
        </div>

        {/* Sticky Cards Stack */}
        <div className="space-y-24 relative">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="sticky top-[12vh] w-full"
              style={{ zIndex: feature.id }}
            >
              <div className={`w-full rounded-3xl bg-gradient-to-br ${feature.gradient} border border-white/10 p-6 md:p-10 shadow-2xl relative overflow-hidden min-h-[380px] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center`}>
                
                {/* Decorative glowing sphere inside card */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 blur-3xl rounded-full pointer-events-none" />

                {/* Card Text Content */}
                <div className="lg:col-span-7 space-y-5">
                  <span className={`text-xs font-bold uppercase tracking-wider ${feature.textColor}`}>
                    {feature.featureBadge}
                  </span>
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                    {feature.title}
                  </h3>
                  <p className="text-slate-200 text-sm md:text-base font-semibold leading-relaxed">
                    {feature.subtitle}
                  </p>
                  <p className="text-slate-400 text-sm leading-relaxed max-w-xl">
                    {feature.description}
                  </p>
                  
                  <div className="pt-2">
                    <Link href="/register" className="inline-flex items-center gap-2 text-xs font-semibold text-white hover:underline">
                      Hemen Keşfet <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Card Visual Content */}
                <div className="lg:col-span-5 flex items-center justify-center bg-black/20 border border-white/5 rounded-2xl overflow-hidden shadow-inner">
                  {feature.imageComponent}
                </div>

              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── EXPANDABLE TESTIMONIALS (Hugo style flex-grow layout) ── */}
      <section id="testimonials" className="py-24 border-t border-white/5 relative z-10 bg-slate-950/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
              Kullanıcı Deneyimleri
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Kullanıcılarımız Rezervo Hakkında Ne Diyor?
            </h2>
            <p className="text-slate-400 text-base">
              Binlerce danışmanlık randevusunun rezerve edildiği Rezervo hakkında gerçek geri bildirimler.
            </p>
          </div>

          {/* Interactive Expandable Flex Row Grid */}
          <div className="flex flex-col lg:flex-row gap-6 h-auto lg:h-[450px]">
            {testimonials.map((test) => {
              const isHovered = hoveredCase === test.id
              const isAnyHovered = hoveredCase !== null

              return (
                <div
                  key={test.id}
                  onMouseEnter={() => setHoveredCase(test.id)}
                  onMouseLeave={() => setHoveredCase(null)}
                  className={`relative flex flex-col justify-between rounded-3xl border border-white/10 bg-gradient-to-br ${test.bgGradient} p-8 overflow-hidden shadow-xl transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] cursor-pointer
                    ${isHovered ? 'lg:flex-[2.2] bg-white/8' : isAnyHovered ? 'lg:flex-[0.8] opacity-40' : 'lg:flex-1 bg-white/3'}`}
                >
                  
                  {/* Quote & Stars */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                        {test.university}
                      </span>
                    </div>

                    <p className={`text-slate-200 leading-relaxed transition-all duration-300 ${isHovered ? 'text-base md:text-lg font-medium' : 'text-xs md:text-sm'}`}>
                      &quot;{test.comment}&quot;
                    </p>
                  </div>

                  {/* Author Information */}
                  <div className="flex items-center gap-3 mt-6 border-t border-white/5 pt-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center font-bold text-white text-sm shrink-0">
                      {test.image}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{test.name}</h4>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">{test.role}</p>
                    </div>
                  </div>

                </div>
              )
            })}
          </div>

        </div>
      </section>

      {/* ── FAQ SECTION ── */}
      <section id="faq" className="py-24 border-t border-white/5 relative z-10">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl font-bold text-white">Sıkça Sorulan Sorular</h2>
            <p className="text-slate-400 text-sm">Akademik danışmanlık randevu sistemi hakkında bilmek istedikleriniz.</p>
          </div>

          <div className="space-y-4">
            {[
              { q: 'Sistemi kullanmak ücretli midir?', a: 'Hayır, Rezervo öğrenciler ve akademisyenler için tamamen ücretsizdir. Akademisyenler slot ekleyebilir, öğrenciler ise diledikleri gibi randevu alabilir.' },
              { q: 'Canlı bildirimler nasıl çalışır?', a: 'Sistemimiz LocalStorage olay dinleyicileri kullanarak tüm açık tarayıcı sekmelerinizi senkronize eder. Randevu durumunuz değiştiğinde anında ekranınızda güncellenir.' },
              { q: 'Üniversitem listede yoksa ne yapmalıyım?', a: 'Kayıt esnasında üniversite dropdown menümüzden tercih yapabilirsiniz. Yeni üniversiteler ve akademisyen listeleri düzenli olarak sisteme eklenmektedir.' },
              { q: 'Rezervasyon sonrasında nasıl puanlama yaparım?', a: 'Seansınız tamamlandıktan sonra öğrenci panelinizde randevularınız kısmından akademisyene 1-5 yıldız arası not verebilir ve görüşlerinizi yazabilirsiniz.' }
            ].map((faq, idx) => (
              <div key={idx} className="glass rounded-2xl border border-white/5 p-6 bg-white/3">
                <h4 className="text-sm font-bold text-white mb-2">{faq.q}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 py-12 relative z-10 bg-black">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-white text-base tracking-tight">rezervo</span>
          </div>

          <p className="text-[11px] text-slate-500">
            &copy; 2026 Rezervo Inc. Tüm Hakları Saklıdır. Hugo.ai stilinde modern tasarım konsepti.
          </p>

          <div className="flex gap-4 text-xs">
            <Link href="/" className="text-slate-400 hover:text-white transition-colors">Ana Sayfa</Link>
            <a href="#features" className="text-slate-400 hover:text-white transition-colors">Özellikler</a>
            <a href="#demo" className="text-slate-400 hover:text-white transition-colors">3D Önizleme</a>
          </div>
        </div>
      </footer>

    </div>
  )
}
