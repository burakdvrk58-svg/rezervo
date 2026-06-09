'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, Calendar, AlertCircle, HelpCircle } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  
  // Validation states
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [loginSuccess, setLoginSuccess] = useState(false)

  const validate = (isShortcut: boolean) => {
    const newErrors: { email?: string; password?: string } = {}
    
    if (!isShortcut) {
      if (!email) {
        newErrors.email = 'E-posta adresi gereklidir.'
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        newErrors.email = 'Lütfen geçerli bir e-posta adresi girin.'
      }
    }

    if (!password) {
      newErrors.password = 'Şifre gereklidir.'
    } else if (password.length < 6) {
      newErrors.password = 'Şifre en az 6 karakter olmalıdır.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    let targetEmail = email
    const trimmedPassword = password.trim()
    let isShortcut = false

    if (trimmedPassword === 'customer123' || trimmedPassword === 'musteri123' || trimmedPassword === 'ogrenci123') {
      targetEmail = 'customer@rezervo.com'
      setEmail('customer@rezervo.com')
      isShortcut = true
    } else if (trimmedPassword === 'business123' || trimmedPassword === 'isletme123' || trimmedPassword === 'akademisyen123') {
      targetEmail = 'business@rezervo.com'
      setEmail('business@rezervo.com')
      isShortcut = true
    } else if (trimmedPassword === 'admin123' || trimmedPassword === 'yonetici123') {
      targetEmail = 'admin@rezervo.com'
      setEmail('admin@rezervo.com')
      isShortcut = true
    }

    if (validate(isShortcut)) {
      setIsLoading(true)
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: targetEmail, password: isShortcut ? trimmedPassword : password })
        })
        const data = await res.json()
        setIsLoading(false)
        if (res.ok) {
          setLoginSuccess(true)
          
          if (typeof window !== 'undefined') {
            localStorage.setItem('rezervo_logged_in', 'true')
            localStorage.setItem('rezervo_user_role', data.user.role)
            localStorage.setItem('rezervo_user_name', data.user.name)
            localStorage.setItem('rezervo_user_email', data.user.email)
            localStorage.setItem('rezervo_user_id', data.user.id)
            localStorage.setItem('rezervo_access_token', data.user.token)
            if (data.user.universityId) localStorage.setItem('rezervo_user_university_id', data.user.universityId)
            if (data.user.universityName) localStorage.setItem('rezervo_user_university_name', data.user.universityName)
          }

          setTimeout(() => {
            const role = data.user.role
            if (role === 'admin') {
              router.push('/admin')
            } else if (role === 'business') {
              router.push('/business')
            } else {
              router.push('/customer')
            }
          }, 1200)
        } else {
          setErrors((prev) => ({ ...prev, email: data.error || 'Giriş sırasında bir hata oluştu.' }))
        }
      } catch (err) {
        setIsLoading(false)
        setErrors((prev) => ({ ...prev, email: 'Bağlantı hatası oluştu.' }))
      }
    }
  }

  return (
    <div className="space-y-6">
      
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

        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Tekrar Hoş Geldiniz</h2>
        <p className="text-sm text-slate-500">Hesabınıza giriş yaparak kaldığınız yerden devam edin.</p>
      </div>

      {loginSuccess ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-6 text-center text-emerald-800"
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-bold">Giriş Başarılı!</h3>
          <p className="mt-1 text-sm text-emerald-700/80">Yönlendiriliyorsunuz...</p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">E-posta Adresi</label>
            <div className={`flex items-center gap-2.5 rounded-xl border bg-white px-3.5 py-3 transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 ${errors.email ? 'border-red-500 ring-2 ring-red-500/10' : 'border-slate-200 hover:border-slate-300'}`}>
              <Mail className="h-5 w-5 text-slate-400" />
              <input
                id="login-email"
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

          {/* Password input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-600">Şifre</label>
              <Link href="/forgot-password" className="text-xs font-semibold text-primary hover:underline">
                Şifremi Unuttum?
              </Link>
            </div>
            <div className={`flex items-center gap-2.5 rounded-xl border bg-white px-3.5 py-3 transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 ${errors.password ? 'border-red-500 ring-2 ring-red-500/10' : 'border-slate-200 hover:border-slate-300'}`}>
              <Lock className="h-5 w-5 text-slate-400" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }))
                }}
                className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="flex items-center gap-1.5 text-xs text-red-500 mt-1">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.password}
              </p>
            )}
          </div>

          {/* Remember Me */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setRememberMe(!rememberMe)}
              className="flex items-center gap-2 text-slate-600 focus:outline-none"
            >
              <div className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${rememberMe ? 'border-primary bg-primary text-white' : 'border-slate-300 bg-white'}`}>
                {rememberMe && (
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="text-xs font-medium text-slate-600 select-none">Beni Hatırla</span>
            </button>
          </div>

          {/* Submit Button */}
          <motion.button
            id="login-submit"
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-primary py-3.5 text-sm font-semibold text-white shadow-md shadow-primary/25 transition-all hover:bg-primary/95 hover:shadow-lg disabled:opacity-75"
          >
            {isLoading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <span>Giriş Yap</span>
            )}
            <span className="absolute inset-0 -translate-x-full skew-x-12 bg-white/15 transition-transform duration-700 group-hover:translate-x-full" />
          </motion.button>

          {/* Divider */}
          <div className="relative my-6 flex items-center justify-center">
            <div className="w-full border-t border-slate-200" />
            <span className="absolute bg-slate-50 px-3 text-xs font-semibold text-slate-400">veya</span>
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-3">
            {/* Google */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </motion.button>

            {/* Apple */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.2.67-2.92 1.51-.62.73-1.16 1.87-1.01 2.98 1.1.09 2.22-.58 2.94-1.43z"/>
              </svg>
              Apple
            </motion.button>
          </div>
        </form>
      )}

      {/* ── Footer ── */}
      <div className="text-center text-sm space-y-4">
        <p>
          <span className="text-slate-500">Henüz bir hesabınız yok mu? </span>
          <Link href="/register" className="font-semibold text-primary hover:underline">
            Kayıt Ol
          </Link>
        </p>

        {/* Mock Credentials Helper */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 text-left">
          <p className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <HelpCircle className="h-4 w-4 text-slate-500" />
            Hızlı Giriş Seçenekleri & Özel Şifreler
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">
            E-posta alanını doldurmadan sadece aşağıdaki şifreleri girerek de direkt ilgili panele erişebilirsiniz.
          </p>
          <div className="mt-2.5 space-y-2 text-[11px] text-slate-500 font-semibold">
            <div className="flex flex-col gap-1 bg-white rounded-lg p-2 border border-slate-100">
              <div className="flex justify-between items-center">
                <span>🎓 Öğrenci Girişi:</span>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('customer@rezervo.com')
                    setPassword('customer123')
                  }}
                  className="text-primary hover:underline font-bold"
                >
                  customer@rezervo.com
                </button>
              </div>
              <div className="text-[10px] text-slate-400 flex justify-between border-t border-dashed border-slate-100 pt-1 mt-0.5">
                <span>Özel Şifre:</span>
                <code className="text-primary bg-slate-50 px-1 rounded font-mono">customer123</code>
              </div>
            </div>
            <div className="flex flex-col gap-1 bg-white rounded-lg p-2 border border-slate-100">
              <div className="flex justify-between items-center">
                <span>🔬 Akademisyen Girişi:</span>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('business@rezervo.com')
                    setPassword('business123')
                  }}
                  className="text-primary hover:underline font-bold"
                >
                  business@rezervo.com
                </button>
              </div>
              <div className="text-[10px] text-slate-400 flex justify-between border-t border-dashed border-slate-100 pt-1 mt-0.5">
                <span>Özel Şifre:</span>
                <code className="text-primary bg-slate-50 px-1 rounded font-mono">business123</code>
              </div>
            </div>
            <div className="flex flex-col gap-1 bg-white rounded-lg p-2 border border-slate-100">
              <div className="flex justify-between items-center">
                <span>🔑 Yönetici Girişi:</span>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('admin@rezervo.com')
                    setPassword('admin123')
                  }}
                  className="text-primary hover:underline font-bold"
                >
                  admin@rezervo.com
                </button>
              </div>
              <div className="text-[10px] text-slate-400 flex justify-between border-t border-dashed border-slate-100 pt-1 mt-0.5">
                <span>Özel Şifre:</span>
                <code className="text-primary bg-slate-50 px-1 rounded font-mono">admin123</code>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
