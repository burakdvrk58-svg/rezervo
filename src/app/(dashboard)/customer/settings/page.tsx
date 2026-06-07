'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Mail, Phone, BookOpen, Save, CheckCircle } from 'lucide-react'

export default function CustomerSettingsPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [studentNo, setStudentNo] = useState('')
  
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

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
    </div>
  )
}
