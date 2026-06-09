'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Mail, Phone, BookOpen, Save, CheckCircle, Calendar, RefreshCw, Check } from 'lucide-react'

export default function CustomerSettingsPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [studentNo, setStudentNo] = useState('')
  
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Calendar Sync States
  const [isGoogleConnected, setIsGoogleConnected] = useState(false)
  const [isOutlookConnected, setIsOutlookConnected] = useState(false)
  const [showOAuthModal, setShowOAuthModal] = useState<'google' | 'outlook' | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [syncSettings, setSyncSettings] = useState({ autoSync: true, blockBusy: true })

  useEffect(() => {
    document.title = 'Hesap Ayarları | Rezervo'
    if (typeof window !== 'undefined') {
      setName(localStorage.getItem('rezervo_user_name') || 'Ahmet Yılmaz')
      setEmail(localStorage.getItem('rezervo_user_email') || 'customer@rezervo.com')
      setPhone(localStorage.getItem('rezervo_user_phone') || '0555 123 45 67')
      setStudentNo(localStorage.getItem('rezervo_user_studentNo') || '1420')
    }
  }, [])

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    
    // validation
    const newErrors: Record<string, string> = {}
    if (!name.trim()) newErrors.name = 'Ad Soyad gereklidir.'
    if (!email.trim()) {
      newErrors.email = 'E-posta gereklidir.'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Geçerli bir e-posta girin.'
    }
    if (!phone.trim()) newErrors.phone = 'Telefon gereklidir.'
    if (!studentNo.trim()) newErrors.studentNo = 'Öğrenci numarası gereklidir.'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    setIsSaving(true)
    
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('rezervo_user_name', name)
        localStorage.setItem('rezervo_user_email', email)
        localStorage.setItem('rezervo_user_phone', phone)
        localStorage.setItem('rezervo_user_studentNo', studentNo)
        
        // Trigger navbar & sidebar updates by dispatching storage event
        window.dispatchEvent(new Event('storage'))
      }
      setIsSaving(false)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    }, 800)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          Hesap Ayarları
        </h1>
        <p className="text-sm text-slate-500">
          Profil bilgilerinizi güncelleyin ve kişisel tercihlerinizi yönetin.
        </p>
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2.5 rounded-2xl bg-emerald-50 border border-emerald-100 p-4 text-xs font-bold text-emerald-800 shadow-sm"
          >
            <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
            <span>Profil bilgileriniz başarıyla güncellendi ve kaydedildi!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSave} className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        <div className="space-y-4">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-slate-400" />
              Ad Soyad
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (errors.name) setErrors((prev) => ({ ...prev, name: '' }))
              }}
              className={`w-full rounded-xl border bg-slate-50/50 px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/10 ${errors.name ? 'border-red-500' : 'border-slate-200'}`}
              placeholder="Ahmet Yılmaz"
            />
            {errors.name && <p className="text-[10px] text-red-500 font-bold">{errors.name}</p>}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-slate-400" />
              E-posta Adresi
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (errors.email) setErrors((prev) => ({ ...prev, email: '' }))
              }}
              className={`w-full rounded-xl border bg-slate-50/50 px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/10 ${errors.email ? 'border-red-500' : 'border-slate-200'}`}
              placeholder="ahmet.yilmaz@gmail.com"
            />
            {errors.email && <p className="text-[10px] text-red-500 font-bold">{errors.email}</p>}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Phone */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-slate-400" />
                Telefon Numarası
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value)
                  if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }))
                }}
                className={`w-full rounded-xl border bg-slate-50/50 px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/10 ${errors.phone ? 'border-red-500' : 'border-slate-200'}`}
                placeholder="0555 123 45 67"
              />
              {errors.phone && <p className="text-[10px] text-red-500 font-bold">{errors.phone}</p>}
            </div>

            {/* Student No */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-slate-400" />
                Öğrenci Numarası
              </label>
              <input
                type="text"
                value={studentNo}
                onChange={(e) => {
                  setStudentNo(e.target.value)
                  if (errors.studentNo) setErrors((prev) => ({ ...prev, studentNo: '' }))
                }}
                className={`w-full rounded-xl border bg-slate-50/50 px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/10 ${errors.studentNo ? 'border-red-500' : 'border-slate-200'}`}
                placeholder="1420"
              />
              {errors.studentNo && <p className="text-[10px] text-red-500 font-bold">{errors.studentNo}</p>}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={isSaving}
            className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-xs font-bold text-white shadow-md shadow-primary/20 hover:shadow-lg disabled:opacity-70 cursor-pointer"
          >
            {isSaving ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Değişiklikleri Kaydet</span>
              </>
            )}
          </motion.button>
        </div>
      </form>

      {/* ── Calendar Sync Panel ── */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Takvim Senkronizasyonu</h2>
            <p className="text-[11px] text-slate-500 font-medium">
              Akademik görüşmelerinizi Google veya Outlook takviminize otomatik ekleyin ve dolu saatlerinizi kapatın.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Google Connection */}
          <div className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">📅</span>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Google Calendar</span>
                  <span className="text-[10px] text-slate-400 font-medium">Google Takvim Entegrasyonu</span>
                </div>
              </div>
              {isGoogleConnected && (
                <span className="rounded-full bg-emerald-50 border border-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-700 flex items-center gap-1">
                  <Check className="h-3 w-3" />
                  Bağlandı
                </span>
              )}
            </div>
            
            <button
              type="button"
              onClick={() => {
                if (isGoogleConnected) {
                  setIsGoogleConnected(false)
                } else {
                  setShowOAuthModal('google')
                }
              }}
              className={`w-full rounded-xl py-2.5 text-xs font-bold transition-all active:scale-95 cursor-pointer ${
                isGoogleConnected
                  ? 'border border-red-200 bg-white text-red-600 hover:bg-red-50'
                  : 'bg-[#4285F4] text-white shadow shadow-blue-500/10 hover:bg-[#3574de]'
              }`}
            >
              {isGoogleConnected ? 'Bağlantıyı Kes' : 'Google Takvim\'i Bağla'}
            </button>
          </div>

          {/* Outlook Connection */}
          <div className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">📧</span>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Outlook Calendar</span>
                  <span className="text-[10px] text-slate-400 font-medium">Microsoft Outlook Entegrasyonu</span>
                </div>
              </div>
              {isOutlookConnected && (
                <span className="rounded-full bg-emerald-50 border border-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-700 flex items-center gap-1">
                  <Check className="h-3 w-3" />
                  Bağlandı
                </span>
              )}
            </div>
            
            <button
              type="button"
              onClick={() => {
                if (isOutlookConnected) {
                  setIsOutlookConnected(false)
                } else {
                  setShowOAuthModal('outlook')
                }
              }}
              className={`w-full rounded-xl py-2.5 text-xs font-bold transition-all active:scale-95 cursor-pointer ${
                isOutlookConnected
                  ? 'border border-red-200 bg-white text-red-600 hover:bg-red-50'
                  : 'bg-[#0078d4] text-white shadow shadow-blue-600/10 hover:bg-[#006cc0]'
              }`}
            >
              {isOutlookConnected ? 'Bağlantıyı Kes' : 'Outlook Takvim\'i Bağla'}
            </button>
          </div>
        </div>

        {(isGoogleConnected || isOutlookConnected) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="border-t border-slate-100 pt-5 space-y-4"
          >
            <div className="space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Entegrasyon Tercihleri</span>
              <div className="space-y-2.5">
                {/* Auto Sync Toggle */}
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Rezervasyonları Eşitle</span>
                    <span className="text-[10px] text-slate-400 font-medium">Yeni randevularınız otomatik olarak takviminize işlenir.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={syncSettings.autoSync}
                    onChange={(e) => setSyncSettings((prev) => ({ ...prev, autoSync: e.target.checked }))}
                    className="h-4.5 w-4.5 rounded border-slate-300 text-primary focus:ring-primary"
                  />
                </label>

                {/* Block Busy Toggle */}
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Dolu Saatleri Kapat</span>
                    <span className="text-[10px] text-slate-400 font-medium">Kişisel takviminizdeki meşgul saatler Rezervo'da kapatılır.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={syncSettings.blockBusy}
                    onChange={(e) => setSyncSettings((prev) => ({ ...prev, blockBusy: e.target.checked }))}
                    className="h-4.5 w-4.5 rounded border-slate-300 text-primary focus:ring-primary"
                  />
                </label>
              </div>
            </div>

            {/* Mock events feed */}
            <div className="space-y-2 bg-slate-50/50 rounded-2xl p-4 border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <RefreshCw className="h-3 w-3 animate-spin text-slate-400" />
                Aktif Takvim Etkinlikleri (Senkronize)
              </span>
              <div className="space-y-1.5 mt-2.5">
                <div className="flex justify-between items-center text-xs font-semibold bg-white p-2 rounded-xl border border-slate-100">
                  <span className="text-slate-700">🎓 Tez İlerleme Komitesi Toplantısı</span>
                  <span className="text-[10px] text-slate-400">10:00 - 10:30 (Rezervo'da Engellendi)</span>
                </div>
                <div className="flex justify-between items-center text-xs font-semibold bg-white p-2 rounded-xl border border-slate-100">
                  <span className="text-slate-700">🔬 AI Lab Haftalık Durum Toplantısı</span>
                  <span className="text-[10px] text-slate-400">14:00 - 15:00 (Rezervo'da Engellendi)</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* ── OAuth Login Simulation Modal ── */}
      <AnimatePresence>
        {showOAuthModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowOAuthModal(null)}
              className="absolute inset-0 bg-black"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl text-center border border-slate-100"
            >
              <div className="flex justify-center mb-4 text-2xl">
                {showOAuthModal === 'google' ? '📅' : '📧'}
              </div>
              <h3 className="text-base font-bold text-slate-900">
                {showOAuthModal === 'google' ? 'Google Account Authorization' : 'Microsoft Account Authorization'}
              </h3>
              <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                Rezervo'nun takviminizi görüntülemesine, yeni randevular eklemesine ve meşgul zamanlarınızı eşitlemesine izin vermek üzeresiniz.
              </p>

              <div className="my-5 rounded-2xl bg-slate-50 p-3.5 text-left text-[10px] font-semibold text-slate-600 space-y-1.5 border border-slate-100">
                <p className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  Takvim etkinliklerini listeleme ve okuma
                </p>
                <p className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  Yeni randevuları takvime kaydetme
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowOAuthModal(null)}
                  disabled={isConnecting}
                  className="w-1/2 rounded-xl border border-slate-200 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  İptal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsConnecting(true)
                    setTimeout(() => {
                      setIsConnecting(false)
                      if (showOAuthModal === 'google') {
                        setIsGoogleConnected(true)
                      } else {
                        setIsOutlookConnected(true)
                      }
                      setShowOAuthModal(null)
                    }, 1200)
                  }}
                  disabled={isConnecting}
                  className="w-1/2 rounded-xl bg-primary py-3 text-xs font-bold text-white shadow-md shadow-primary/20 hover:bg-primary/95 flex justify-center items-center"
                >
                  {isConnecting ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    'İzin Ver ve Bağla'
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
