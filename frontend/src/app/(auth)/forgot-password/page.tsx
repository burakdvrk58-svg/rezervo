'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, Calendar, AlertCircle, ArrowLeft } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<{ email?: string }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [resetSent, setResetSent] = useState(false)

  const validate = () => {
    const newErrors: { email?: string } = {}
    if (!email) {
      newErrors.email = 'E-posta adresi gereklidir.'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Lütfen geçerli bir e-posta adresi girin.'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      setIsLoading(true)
      // Simulate API request
      setTimeout(() => {
        setIsLoading(false)
        setResetSent(true)
      }, 1500)
    }
  }

  return (
    <div className="space-y-6">

      {/* ── Back to Login ── */}
      <div>
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Giriş Sayfasına Dön
        </Link>
      </div>

      {/* ── Header ── */}
      <div className="flex flex-col space-y-2 text-center lg:text-left">
        {/* Mobile-only logo */}
        <div className="flex justify-center lg:hidden mb-4">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-sm shadow-primary/30">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-base font-bold leading-none text-slate-900">Rezervo</p>
              <p className="text-[10px] leading-none text-slate-500 mt-0.5">Rezervasyon Sisteminiz</p>
            </div>
          </Link>
        </div>

        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Şifrenizi mi Unuttunuz?</h2>
        <p className="text-sm text-slate-500">
          E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.
        </p>
      </div>

      {resetSent ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-6 text-center text-emerald-800"
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4">
            <Mail className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold">E-posta Gönderildi!</h3>
          <p className="mt-1.5 text-sm text-emerald-700/80">
            Şifre sıfırlama yönergelerini içeren bir bağlantı <strong>{email}</strong> adresine başarıyla gönderildi. Lütfen spam kutunuzu da kontrol edin.
          </p>
          <button
            onClick={() => setResetSent(false)}
            className="mt-4 text-xs font-semibold text-primary hover:underline"
          >
            Farklı bir e-posta adresi dene
          </button>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">E-posta Adresi</label>
            <div className={`flex items-center gap-2.5 rounded-xl border bg-white px-3.5 py-3 transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 ${errors.email ? 'border-red-500 ring-2 ring-red-500/10' : 'border-slate-200 hover:border-slate-300'}`}>
              <Mail className="h-5 w-5 text-slate-400" />
              <input
                id="reset-email"
                type="email"
                placeholder="ornek@alan.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }))
                }}
                className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
              />
            </div>
            {errors.email && (
              <p className="flex items-center gap-1.5 text-xs text-red-500 mt-1">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <motion.button
            id="reset-submit"
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-primary py-3.5 text-sm font-semibold text-white shadow-md shadow-primary/25 transition-all hover:bg-primary/95 hover:shadow-lg disabled:opacity-75"
          >
            {isLoading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <span>Sıfırlama Bağlantısı Gönder</span>
            )}
            <span className="absolute inset-0 -translate-x-full skew-x-12 bg-white/15 transition-transform duration-700 group-hover:translate-x-full" />
          </motion.button>

        </form>
      )}

    </div>
  )
}
