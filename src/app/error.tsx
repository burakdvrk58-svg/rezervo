'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RotateCcw, Home } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an analytics or reporting service
    console.error('Runtime error caught:', error)
  }, [error])

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-900 px-4 text-center">
      
      {/* ── Background Gradients & Grid ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 bottom-1/4 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-red-500/5 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35" />
      </div>

      {/* ── Content Container ── */}
      <div className="relative z-10 max-w-md space-y-6">
        
        {/* Error icon circle */}
        <div className="flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-red-500/10 shadow-2xl ring-1 ring-red-500/20 text-red-500">
            <AlertTriangle className="h-10 w-10 animate-pulse" />
          </div>
        </div>

        {/* Text Details */}
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Sistemde Hata Oluştu
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            İşleminiz gerçekleştirilirken beklenmedik bir teknik hata oluştu. Mühendislerimiz durumdan haberdar edildi. Lütfen sayfayı yenilemeyi deneyin.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:justify-center">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-red-600 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-red-600/25 transition-all hover:bg-red-700 hover:shadow-red-600/35"
          >
            <RotateCcw className="h-4 w-4" />
            Yeniden Dene
          </button>
          
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-6 py-3 text-xs font-bold text-slate-300 transition-colors hover:bg-slate-700/80"
          >
            <Home className="h-4 w-4" />
            Ana Sayfa
          </Link>
        </div>

      </div>
      
    </div>
  )
}
