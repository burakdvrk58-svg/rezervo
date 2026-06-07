'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Mail, GraduationCap, Award, Save, CheckCircle, Image } from 'lucide-react'

export default function BusinessSettingsPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [department, setDepartment] = useState('')
  const [title, setTitle] = useState('')
  const [avatar, setAvatar] = useState('')
  
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    document.title = 'Akademisyen Ayarları | Rezervo'
    if (typeof window !== 'undefined') {
      setName(localStorage.getItem('rezervo_user_name') || 'Prof. Dr. Albert Ali Salah')
      setEmail(localStorage.getItem('rezervo_user_email') || 'business@rezervo.com')
      setDepartment(localStorage.getItem('rezervo_user_department') || 'Bilgisayar Mühendisliği')
      setTitle(localStorage.getItem('rezervo_user_title') || 'Prof. Dr.')
      setAvatar(localStorage.getItem('rezervo_user_avatar') || 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=faces')
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
    if (!department.trim()) newErrors.department = 'Bölüm alanı gereklidir.'
    if (!title.trim()) newErrors.title = 'Unvan alanı gereklidir.'

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
        localStorage.setItem('rezervo_user_department', department)
        localStorage.setItem('rezervo_user_title', title)
        localStorage.setItem('rezervo_user_avatar', avatar)
        
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
          Akademisyen Profil Ayarları
        </h1>
        <p className="text-sm text-slate-500">
          Akademik profilinizi güncelleyin, unvanınızı ve danışmanlık alanlarınızı yönetin.
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
          
          {/* Avatar preview and input */}
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50/50 rounded-2xl p-4 border border-slate-100">
            <div className="h-16 w-16 overflow-hidden rounded-full bg-slate-200 border border-slate-350 shadow-inner">
              <img src={avatar} alt="Avatar önizleme" className="h-full w-full object-cover animate-fade-in" />
            </div>
            <div className="flex-1 w-full space-y-1">
              <label className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                <Image className="h-3.5 w-3.5" />
                Profil Fotoğrafı URL
              </label>
              <input
                type="text"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/10"
                placeholder="Fotoğraf URL girin..."
              />
            </div>
          </div>

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
              placeholder="Prof. Dr. Albert Ali Salah"
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
              placeholder="business@rezervo.com"
            />
            {errors.email && <p className="text-[10px] text-red-500 font-bold">{errors.email}</p>}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                <Award className="h-3.5 w-3.5 text-slate-400" />
                Unvan
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value)
                  if (errors.title) setErrors((prev) => ({ ...prev, title: '' }))
                }}
                className={`w-full rounded-xl border bg-slate-50/50 px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/10 ${errors.title ? 'border-red-500' : 'border-slate-200'}`}
                placeholder="Prof. Dr."
              />
              {errors.title && <p className="text-[10px] text-red-500 font-bold">{errors.title}</p>}
            </div>

            {/* Department */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                <GraduationCap className="h-3.5 w-3.5 text-slate-400" />
                Akademik Bölüm
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => {
                  setDepartment(e.target.value)
                  if (errors.department) setErrors((prev) => ({ ...prev, department: '' }))
                }}
                className={`w-full rounded-xl border bg-slate-50/50 px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/10 ${errors.department ? 'border-red-500' : 'border-slate-200'}`}
                placeholder="Bilgisayar Mühendisliği"
              />
              {errors.department && <p className="text-[10px] text-red-500 font-bold">{errors.department}</p>}
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
                <span>Ayarları Güncelle</span>
              </>
            )}
          </motion.button>
        </div>
      </form>
    </div>
  )
}
