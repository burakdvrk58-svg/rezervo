'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Mail, Save, CheckCircle, Shield } from 'lucide-react'

export default function AdminSettingsPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    document.title = 'Sistem Ayarları | Rezervo'
    if (typeof window !== 'undefined') {
      setName(localStorage.getItem('rezervo_user_name') || 'Can Ertekin')
      setEmail(localStorage.getItem('rezervo_user_email') || 'admin@rezervo.com')
      setMaintenanceMode(localStorage.getItem('rezervo_system_maintenance') === 'true')
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
        localStorage.setItem('rezervo_system_maintenance', String(maintenanceMode))
        
        // Trigger updates across dashboard layouts
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
          Sistem & Yönetici Ayarları
        </h1>
        <p className="text-sm text-slate-500">
          Yönetici profilinizi güncelleyin ve küresel sistem tercihlerini yapılandırın.
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
            <span>Sistem ve profil ayarları başarıyla güncellendi!</span>
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
              placeholder="Can Ertekin"
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
              placeholder="admin@rezervo.com"
            />
            {errors.email && <p className="text-[10px] text-red-500 font-bold">{errors.email}</p>}
          </div>

          {/* Global System Settings */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Shield className="h-4.5 w-4.5 text-primary" />
              Küresel Sistem Tercihleri
            </h3>

            <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 border border-slate-100">
              <div>
                <span className="text-xs font-bold text-slate-800 block">Bakım Modu (Maintenance Mode)</span>
                <span className="text-[10px] text-slate-400 font-medium">Sistemi genel kullanıcı erişimine kapatıp sadece yöneticilere açar.</span>
              </div>
              <button
                type="button"
                onClick={() => setMaintenanceMode(!maintenanceMode)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${maintenanceMode ? 'bg-primary' : 'bg-slate-200'}`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${maintenanceMode ? 'translate-x-5' : 'translate-x-0'}`}
                />
              </button>
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
                <span>Ayarları Kaydet</span>
              </>
            )}
          </motion.button>
        </div>
      </form>
    </div>
  )
}
