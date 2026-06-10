'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Trash2, 
  Building2, 
  Sparkles, 
  Users, 
  BookOpen, 
  Info,
  GraduationCap
} from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'

interface University {
  id: string
  name: string
  shortName: string
  campus: string
  logo: string
}

interface Room {
  id: string
  sqlId?: number
  name: string
  capacity: string
  description: string
  floor: string
  rating: string
  type: string
}

export default function AdminRoomsPage() {
  const [universities, setUniversities] = useState<University[]>([])
  const [selectedUnivId, setSelectedUnivId] = useState<string>('')
  const [libraryRooms, setLibraryRooms] = useState<Room[]>([])
  const [classrooms, setClassrooms] = useState<Room[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  // Form states
  const [roomType, setRoomType] = useState<'library' | 'classroom'>('library')
  const [name, setName] = useState('')
  const [capacity, setCapacity] = useState('4')
  const [description, setDescription] = useState('')
  const [startHour, setStartHour] = useState('09:00')
  const [endHour, setEndHour] = useState('17:00')

  useEffect(() => {
    document.title = 'Okul & Oda Yönetimi | Yönetici Paneli'
    fetchUniversities()
  }, [])

  useEffect(() => {
    if (selectedUnivId) {
      fetchRooms(selectedUnivId)
    }
  }, [selectedUnivId])

  const fetchUniversities = async () => {
    try {
      const res = await fetch('/api/school/rooms')
      if (res.ok) {
        const data = await res.json()
        setUniversities(data)
        if (data.length > 0) {
          setSelectedUnivId(data[0].id)
        }
      }
    } catch (err) {
      toast.error('Üniversiteler yüklenirken bir hata oluştu.')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchRooms = async (univId: string) => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/school/rooms?universityId=${univId}`)
      if (res.ok) {
        const data = await res.json()
        setLibraryRooms(data.libraryRooms || [])
        setClassrooms(data.classrooms || [])
      }
    } catch (err) {
      toast.error('Odalar yüklenirken bir hata oluştu.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    const selectedUniv = universities.find(u => u.id === selectedUnivId)
    if (!selectedUniv) return

    // Enforce keyword matching based on room type
    let finalName = name
    if (roomType === 'library') {
      if (!name.toLowerCase().includes('çalışma') && !name.toLowerCase().includes('sessiz') && !name.toLowerCase().includes('kabin')) {
        finalName = name + ' Çalışma Odası'
      }
    } else {
      if (!name.toLowerCase().includes('derslik') && !name.toLowerCase().includes('seminer') && !name.toLowerCase().includes('salon')) {
        finalName = 'Derslik ' + name
      }
    }

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/school/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: finalName,
          description,
          capacity: Number(capacity),
          startHour: startHour + ':00',
          endHour: endHour + ':00',
          universityShortName: selectedUniv.shortName
        })
      })

      if (res.ok) {
        toast.success('Oda başarıyla eklendi ve MySQL veritabanına kaydedildi.')
        setName('')
        setDescription('')
        fetchRooms(selectedUnivId)
      } else {
        const errData = await res.json()
        toast.error(errData.error || 'Oda eklenemedi.')
      }
    } catch (err: any) {
      toast.error('Oda ekleme sırasında hata oluştu: ' + err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteRoom = async (sqlId: number, roomName: string) => {
    if (!confirm(`"${roomName}" odasını ve odaya ait tüm randevu kayıtlarını kalıcı olarak silmek istediğinize emin misiniz?`)) {
      return
    }

    try {
      const res = await fetch(`/api/school/rooms?id=${sqlId}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        toast.success('Oda ve ilişkili tüm kayıtlar MySQL veritabanından başarıyla silindi.')
        fetchRooms(selectedUnivId)
      } else {
        const errData = await res.json()
        toast.error(errData.error || 'Oda silinemedi.')
      }
    } catch (err: any) {
      toast.error('Oda silinirken hata oluştu: ' + err.message)
    }
  }

  const activeUniv = universities.find(u => u.id === selectedUnivId)

  return (
    <div className="space-y-8 pb-12">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl flex items-center gap-2">
            <Building2 className="h-8 w-8 text-primary" />
            Okul & Oda Yönetimi
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Üniversitelere ait kütüphane çalışma odalarını ve derslikleri MySQL üzerinde ekleyin, düzenleyin ve silin.
          </p>
        </div>

        {/* University Selector Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Aktif Üniversite:</label>
          <select
            value={selectedUnivId}
            onChange={(e) => setSelectedUnivId(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-800 focus:border-primary focus:outline-none"
          >
            {universities.map((univ) => (
              <option key={univ.id} value={univ.id}>
                {univ.logo} {univ.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        
        {/* ── Left Side: List Rooms (Classrooms & Library Rooms) ── */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Library Rooms Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-indigo-500" />
                Kütüphane Çalışma Odaları
                <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-600">
                  {libraryRooms.length} Oda
                </span>
              </h2>
            </div>

            {isLoading ? (
              <div className="flex h-24 items-center justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : libraryRooms.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {libraryRooms.map((room) => {
                  const isSqlBacked = room.id.includes('-sql-')
                  return (
                    <motion.div
                      key={room.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="rounded-2xl border border-slate-200/60 bg-white p-4.5 shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-xs font-bold text-slate-950 flex items-center gap-1.5">
                            {room.name}
                          </h3>
                          <span className={`text-[9px] rounded-full px-2 py-0.5 font-bold ${
                            isSqlBacked ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {isSqlBacked ? 'Canlı SQL' : 'Mock/Varsayılan'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 font-semibold flex items-center gap-1">
                          <Users className="h-3.5 w-3.5 text-slate-400" />
                          Kapasite: {room.capacity}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                          {room.description}
                        </p>
                      </div>

                      {/* Delete Action (only for SQL-backed rooms) */}
                      <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-4">
                        <span className="text-[9px] font-bold text-slate-400 uppercase">Kütüphane</span>
                        {isSqlBacked && room.sqlId && (
                          <button
                            onClick={() => handleDeleteRoom(room.sqlId!, room.name)}
                            className="rounded-lg p-1.5 text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors"
                            title="Odayı Sil"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-10 border border-dashed border-slate-200 rounded-2xl text-slate-400">
                Bu okula ait henüz kütüphane odası eklenmemiş.
              </div>
            )}
          </div>

          {/* Classrooms Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-emerald-500" />
                Derslikler & Seminer Salonları
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                  {classrooms.length} Derslik
                </span>
              </h2>
            </div>

            {isLoading ? (
              <div className="flex h-24 items-center justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : classrooms.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {classrooms.map((room) => {
                  const isSqlBacked = room.id.includes('-sql-')
                  return (
                    <motion.div
                      key={room.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="rounded-2xl border border-slate-200/60 bg-white p-4.5 shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-xs font-bold text-slate-950 flex items-center gap-1.5">
                            {room.name}
                          </h3>
                          <span className={`text-[9px] rounded-full px-2 py-0.5 font-bold ${
                            isSqlBacked ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {isSqlBacked ? 'Canlı SQL' : 'Mock/Varsayılan'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 font-semibold flex items-center gap-1">
                          <Users className="h-3.5 w-3.5 text-slate-400" />
                          Kapasite: {room.capacity}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                          {room.description}
                        </p>
                      </div>

                      {/* Delete Action (only for SQL-backed rooms) */}
                      <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-4">
                        <span className="text-[9px] font-bold text-slate-400 uppercase">Derslik</span>
                        {isSqlBacked && room.sqlId && (
                          <button
                            onClick={() => handleDeleteRoom(room.sqlId!, room.name)}
                            className="rounded-lg p-1.5 text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors"
                            title="Dersliği Sil"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-10 border border-dashed border-slate-200 rounded-2xl text-slate-400">
                Bu okula ait henüz derslik eklenmemiş.
              </div>
            )}
          </div>

        </div>

        {/* ── Right Side: Add New Room Form ── */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5 uppercase tracking-wide">
              <Plus className="h-5 w-5 text-primary" />
              Yeni Oda Ekle
            </h2>
            <p className="text-xs text-slate-500 leading-normal">
              Eklenen odalar doğrudan Spring Boot <strong>rooms</strong> tablosuna yazılır ve seçili üniversitenin okul portalında listelenir.
            </p>

            <form onSubmit={handleAddRoom} className="space-y-4 pt-2">
              
              {/* Type Switcher */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Oda Tipi</label>
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-150">
                  <button
                    type="button"
                    onClick={() => setRoomType('library')}
                    className={`rounded-lg py-1.5 text-xs font-bold transition-all ${
                      roomType === 'library'
                        ? 'bg-white text-primary shadow-sm border border-slate-200/50'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Kütüphane Odası
                  </button>
                  <button
                    type="button"
                    onClick={() => setRoomType('classroom')}
                    className={`rounded-lg py-1.5 text-xs font-bold transition-all ${
                      roomType === 'classroom'
                        ? 'bg-white text-primary shadow-sm border border-slate-200/50'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Derslik / Sınıf
                  </button>
                </div>
              </div>

              {/* Name */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Oda / Sınıf Adı</label>
                <input
                  type="text"
                  required
                  placeholder={roomType === 'library' ? 'Örn: Bireysel Sessiz Oda 4' : 'Örn: Derslik B-204'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:border-primary focus:outline-none"
                />
              </div>

              {/* Capacity */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kapasite (Kişi Sayısı)</label>
                <select
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:border-primary focus:outline-none"
                >
                  <option value="1">1 Kişilik (Bireysel)</option>
                  <option value="2">2 Kişilik</option>
                  <option value="4">4 Kişilik (Küçük Grup)</option>
                  <option value="6">6 Kişilik (Çalışma Grubu)</option>
                  <option value="12">12 Kişilik (Seminer Odası)</option>
                  <option value="30">30 Kişilik (Sınıf/Derslik)</option>
                  <option value="50">50 Kişilik (Büyük Amfi)</option>
                </select>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Açıklama</label>
                <textarea
                  placeholder="Oda olanakları, priz, akıllı tahta, klimalı vb."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:border-primary focus:outline-none min-h-[70px] resize-none"
                />
              </div>

              {/* Operating Hours */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Başlangıç Saati</label>
                  <select
                    value={startHour}
                    onChange={(e) => setStartHour(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:border-primary"
                  >
                    {['08:00', '09:00', '10:00', '11:00', '12:00', '13:00'].map(h => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Bitiş Saati</label>
                  <select
                    value={endHour}
                    onChange={(e) => setEndHour(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:border-primary"
                  >
                    {['16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'].map(h => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-primary py-3 text-xs font-extrabold text-white hover:bg-primary/95 transition-all shadow-md shadow-primary/10 flex items-center justify-center gap-1.5"
              >
                {isSubmitting ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    MySQL'e Kaydet
                  </>
                )}
              </button>

            </form>
          </div>

          {/* Info card */}
          <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-5 text-xs text-blue-800 space-y-2.5">
            <p className="flex items-center gap-1.5 font-bold">
              <Info className="h-4.5 w-4.5 text-blue-600" />
              Önemli Bilgi
            </p>
            <p className="leading-relaxed font-semibold">
              Eklenen odalar, Next.js proxy API'si aracılığıyla Spring Boot veritabanında oluşturulurken adının önüne otomatik olarak 
              <strong><code>{` [${activeUniv?.shortName || 'OKUL'}] `}</code></strong> etiketi eklenir. 
              Böylece oda sadece o üniversitenin kütüphane veya derslik arama ekranında görünür.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
