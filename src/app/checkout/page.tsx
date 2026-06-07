'use client'

import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Navbar } from '@/components/common/Navbar'
import { Footer } from '@/components/common/Footer'
import {
  ShieldCheck,
  CreditCard,
  Calendar,
  MapPin,
  Users,
  CheckCircle,
  ArrowLeft
} from 'lucide-react'

function CheckoutContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const hotelName = searchParams.get('hotel') || 'Grand Deluxe Resort & Spa'
  const hotelPrice = searchParams.get('price') || '3.450 TL'
  const isSchool = searchParams.get('type') === 'okul'

  // Personal Info State
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [tcNo, setTcNo] = useState('')

  // School Specific State
  const [studentNo, setStudentNo] = useState('')
  const [studentClass, setStudentClass] = useState('')

  // Payment State
  const [cardHolder, setCardHolder] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc] = useState('')

  // Form states
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [createdBookingId, setCreatedBookingId] = useState('')

  // Card formatting
  const handleCardNumberChange = (val: string) => {
    const clean = val.replace(/\D/g, '')
    const formatted = clean.match(/.{1,4}/g)?.join(' ') || clean
    setCardNumber(formatted.substring(0, 19))
  }

  const handleExpiryChange = (val: string) => {
    const clean = val.replace(/\D/g, '')
    if (clean.length <= 2) {
      setExpiry(clean)
    } else {
      setExpiry(`${clean.slice(0, 2)}/${clean.slice(2, 4)}`)
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!firstName.trim()) newErrors.firstName = 'Ad alanı gereklidir.'
    if (!lastName.trim()) newErrors.lastName = 'Soyad alanı gereklidir.'
    if (!email) {
      newErrors.email = 'E-posta gereklidir.'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Geçerli bir e-posta girin.'
    }
    if (!phone.trim()) newErrors.phone = 'Telefon gereklidir.'

    if (isSchool) {
      if (!studentNo.trim()) newErrors.studentNo = 'Öğrenci numarası gereklidir.'
      if (!studentClass.trim()) newErrors.studentClass = 'Sınıf bilgisi gereklidir.'
    } else {
      if (!tcNo.trim() || tcNo.length !== 11) newErrors.tcNo = '11 haneli T.C. No girin.'
      if (!cardHolder.trim()) newErrors.cardHolder = 'Kart sahibi alanı gereklidir.'
      if (!cardNumber || cardNumber.length < 19) newErrors.cardNumber = 'Geçerli kart numarası girin.'
      if (!expiry || expiry.length < 5) newErrors.expiry = 'Geçerli tarih girin (AA/YY).'
      if (!cvc || cvc.length < 3) newErrors.cvc = '3 haneli CVC girin.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      setIsLoading(true)
      try {
        const category = isSchool
          ? (hotelName.toLowerCase().includes('kütüphane') || hotelName.toLowerCase().includes('oda') ? 'library' : 'teacher')
          : 'hotel'

        const bookingData = {
          userId: typeof window !== 'undefined' ? (localStorage.getItem('rezervo_user_id') || 'u-customer') : 'u-customer',
          category,
          title: hotelName,
          subtitle: isSchool ? 'Kampüs Binası' : 'Lara, Antalya',
          date: isSchool ? '08 Haziran Pazartesi' : '12 - 19 Haziran 2026',
          time: isSchool ? 'Süre: 15-20 Dakika' : '7 Gece',
          details: isSchool ? 'Soru Çözümü & Grup Çalışması' : 'Standart Oda • 2 Yetişkin, 1 Çocuk',
          image: category === 'library'
            ? 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=300&h=200&fit=crop'
            : category === 'teacher'
            ? 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=300&h=200&fit=crop'
            : 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=300&h=200&fit=crop',
          price: isSchool ? 'Ücretsiz' : hotelPrice
        }

        const res = await fetch('/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookingData),
        })

        if (!res.ok) {
          throw new Error('Rezervasyon kaydedilemedi.')
        }

        const data = await res.json()
        setCreatedBookingId(data.id)
        setShowSuccessModal(true)
      } catch (err) {
        setErrors((prev) => ({ ...prev, submit: 'Rezervasyon tamamlanırken bir hata oluştu. Lütfen tekrar deneyin.' }))
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          
          {/* Back link */}
          <div className="mb-6">
            <Link
              href={isSchool ? '/search?type=okul' : '/search'}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Sonuçlara Geri Dön
            </Link>
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl mb-8">
            {isSchool ? 'Okul Randevu Onay Ekranı' : 'Rezervasyon Ödeme Sayfası'}
          </h1>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            
            {/* Left 2 Cols: Checkout Form details */}
            <div className="space-y-6 lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Personal details */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                  <h2 className="text-base font-bold text-slate-900">
                    {isSchool ? '1. Veli / İletişim Bilgileri' : '1. Misafir Bilgileri'}
                  </h2>
                  
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-slate-500">Ad</label>
                      <input
                        type="text"
                        placeholder="Ahmet"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className={`w-full rounded-xl border bg-slate-50/50 px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/10 ${errors.firstName ? 'border-red-500' : 'border-slate-200'}`}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-slate-500">Soyad</label>
                      <input
                        type="text"
                        placeholder="Yılmaz"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className={`w-full rounded-xl border bg-slate-50/50 px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/10 ${errors.lastName ? 'border-red-500' : 'border-slate-200'}`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-[11px] font-semibold text-slate-500">E-posta</label>
                      <input
                        type="email"
                        placeholder="ahmet.yilmaz@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full rounded-xl border bg-slate-50/50 px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/10 ${errors.email ? 'border-red-500' : 'border-slate-200'}`}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-slate-500">Telefon</label>
                      <input
                        type="text"
                        placeholder="0555 123 45 67"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={`w-full rounded-xl border bg-slate-50/50 px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/10 ${errors.phone ? 'border-red-500' : 'border-slate-200'}`}
                      />
                    </div>
                  </div>

                  {!isSchool && (
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-slate-500">T.C. Kimlik No</label>
                      <input
                        type="text"
                        placeholder="11 Haneli T.C. No"
                        value={tcNo}
                        onChange={(e) => setTcNo(e.target.value.replace(/\D/g, '').slice(0, 11))}
                        className={`w-full rounded-xl border bg-slate-50/50 px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/10 ${errors.tcNo ? 'border-red-500' : 'border-slate-200'}`}
                      />
                    </div>
                  )}
                </div>

                {/* School Specific Info */}
                {isSchool && (
                  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                    <h2 className="text-base font-bold text-slate-900">2. Öğrenci Bilgileri</h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold text-slate-500">Öğrenci Numarası</label>
                        <input
                          type="text"
                          placeholder="Örn: 1420"
                          value={studentNo}
                          onChange={(e) => setStudentNo(e.target.value)}
                          className={`w-full rounded-xl border bg-slate-50/50 px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/10 ${errors.studentNo ? 'border-red-500' : 'border-slate-200'}`}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold text-slate-500">Sınıfı & Şubesi</label>
                        <input
                          type="text"
                          placeholder="Örn: 11-A"
                          value={studentClass}
                          onChange={(e) => setStudentClass(e.target.value)}
                          className={`w-full rounded-xl border bg-slate-50/50 px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/10 ${errors.studentClass ? 'border-red-500' : 'border-slate-200'}`}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Payment details / School Alert info */}
                {isSchool ? (
                  <div className="rounded-3xl border border-emerald-200 bg-emerald-50/50 p-6 space-y-3">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-emerald-600" />
                      <h3 className="text-sm font-bold text-emerald-800">Ücretsiz Kampüs Hizmeti</h3>
                    </div>
                    <p className="text-xs text-emerald-700 leading-relaxed">
                      Bu işlem kütüphane grup çalışma odası rezervasyonu ya da veli-öğretmen bülten görüşmesi kapsamında olup tamamen ücretsizdir. Herhangi bir ödeme veya kart bilgisi talep edilmemektedir.
                    </p>
                  </div>
                ) : (
                  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-base font-bold text-slate-900">2. Ödeme Bilgileri</h2>
                      <ShieldCheck className="h-5 w-5 text-emerald-500" />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-slate-500">Kart Üzerindeki İsim</label>
                      <input
                        type="text"
                        placeholder="AHMET YILMAZ"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                        className={`w-full rounded-xl border bg-slate-50/50 px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/10 ${errors.cardHolder ? 'border-red-500' : 'border-slate-200'}`}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-slate-500">Kart Numarası</label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="0000 0000 0000 0000"
                          value={cardNumber}
                          onChange={(e) => handleCardNumberChange(e.target.value)}
                          className={`w-full rounded-xl border bg-slate-50/50 py-2.5 pl-10 pr-4 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/10 ${errors.cardNumber ? 'border-red-500' : 'border-slate-200'}`}
                        />
                        <CreditCard className="absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold text-slate-500">Son Kullanma Tarihi</label>
                        <input
                          type="text"
                          placeholder="AA/YY"
                          value={expiry}
                          onChange={(e) => handleExpiryChange(e.target.value)}
                          className={`w-full rounded-xl border bg-slate-50/50 px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/10 ${errors.expiry ? 'border-red-500' : 'border-slate-200'}`}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold text-slate-500">CVC</label>
                        <input
                          type="text"
                          placeholder="123"
                          value={cvc}
                          onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
                          className={`w-full rounded-xl border bg-slate-50/50 px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/10 ${errors.cvc ? 'border-red-500' : 'border-slate-200'}`}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {errors.submit && (
                  <p className="text-xs text-red-500 font-bold text-center mb-3">
                    {errors.submit}
                  </p>
                )}

                {/* CTA Action button */}
                <motion.button
                  id="checkout-submit"
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-primary py-4 text-sm font-bold text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30"
                >
                  {isLoading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <span>{isSchool ? 'Rezervasyonu Onayla' : 'Ödemeyi Tamamla ve Rezervasyonu Bitir'}</span>
                  )}
                  <span className="absolute inset-0 -translate-x-full skew-x-12 bg-white/15 transition-transform duration-700 group-hover:translate-x-full" />
                </motion.button>

              </form>
            </div>

            {/* Right 1 Col: Summary Sidebar info */}
            <div className="space-y-5 lg:col-span-1">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900">Randevu Özeti</h3>
                
                {/* Details list */}
                <div className="text-xs leading-relaxed text-slate-600 space-y-2 border-b border-slate-100 pb-4">
                  <p className="font-extrabold text-slate-800 text-sm">{hotelName}</p>
                  <p className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    {isSchool ? 'Kampüs Binası' : 'Lara, Antalya'}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    {isSchool ? '08 Haziran Pazartesi' : '12 - 19 Haziran (7 Gece)'}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-slate-400" />
                    {isSchool ? 'Süre: 15-20 Dakika' : '2 Yetişkin, 1 Çocuk'}
                  </p>
                </div>

                {/* Price break */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">{isSchool ? 'Eğitim Bedeli' : 'Konaklama Bedeli'}</span>
                    <span className="font-semibold text-slate-800">{isSchool ? 'Ücretsiz' : hotelPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Vergiler & Harçlar</span>
                    <span className="font-semibold text-slate-800">Dahil</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-100 pt-3 text-sm font-extrabold text-slate-950">
                    <span>Toplam Tutar</span>
                    <span>{isSchool ? '0 TL' : hotelPrice}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* ── Success Overlay Modal ── */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl text-center"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-4">
                <CheckCircle className="h-8 w-8" />
              </div>
              
              <h3 className="text-xl font-extrabold text-slate-950">
                {isSchool ? 'Randevu Onaylandı!' : 'Rezervasyonunuz Alındı!'}
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                {isSchool ? 'Randevunuz sisteme işlendi. Görüşme / oda onay kodu oluşturuldu.' : 'Ödemeniz başarıyla doğrulandı. Rezervasyon detaylarınız ve barkodunuz oluşturuldu.'}
              </p>

              <div className="my-5 rounded-2xl bg-slate-50 p-4 text-left text-xs font-semibold text-slate-600 space-y-1.5">
                <p>İşlem: <span className="font-bold text-slate-900">{hotelName}</span></p>
                <p>Harcama Tutarı: <span className="font-bold text-slate-900">{isSchool ? '0 TL' : hotelPrice}</span></p>
                <p>Onay Kodu: <span className="font-bold text-slate-900">{createdBookingId || 'RZV-SCHOOL7'}</span></p>
              </div>

              <button
                onClick={() => router.push('/customer/reservations')}
                className="w-full rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
              >
                Rezervasyonlarıma Git
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  )
}
