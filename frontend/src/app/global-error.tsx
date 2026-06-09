'use client'

import { AlertTriangle, RotateCcw } from 'lucide-react'

export default function GlobalError({
  reset,
}: {
  reset: () => void
}) {
  return (
    <html lang="tr" className="h-full">
      <body className="flex h-full flex-col items-center justify-center bg-slate-900 px-4 text-center font-sans antialiased">
        <div className="max-w-md space-y-6">
          <div className="flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-red-500/10 text-red-500">
              <AlertTriangle className="h-10 w-10 animate-pulse" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              Ciddi Bir Hata Oluştu
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              Uygulama yüklenirken kritik bir hata meydana geldi. Sayfayı yenileyerek sistemi tekrar çalıştırmayı deneyebilirsiniz.
            </p>
          </div>

          <div className="flex justify-center pt-2">
            <button
              onClick={() => reset()}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-red-600 px-6 py-3 text-xs font-bold text-white shadow-lg transition-all hover:bg-red-700"
            >
              <RotateCcw className="h-4 w-4" />
              Sistemi Yeniden Başlat
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
