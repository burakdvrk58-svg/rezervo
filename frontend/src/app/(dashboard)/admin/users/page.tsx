'use client'

import { useState, useEffect } from 'react'
import {
  Users,
  Search,
  UserCheck,
  UserX,
  ChevronDown
} from 'lucide-react'



type FilterRole = 'all' | 'Müşteri' | 'İşletme Sahibi' | 'Yönetici'

const ROLE_MAP: Record<string, string> = {
  'admin': 'Yönetici',
  'business': 'İşletme Sahibi',
  'customer': 'Müşteri',
  'Yönetici': 'admin',
  'İşletme Sahibi': 'business',
  'Müşteri': 'customer'
}

export default function AdminUsersPage() {
  const [list, setList] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<FilterRole>('all')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/admin/users')
        if (res.ok) {
          const data = await res.json()
          setList(data)
        }
      } catch (err) {
        console.error('Failed to fetch users:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchUsers()
  }, [])

  const toggleStatus = async (id: string) => {
    const user = list.find((u) => u.id === id)
    if (!user) return
    const nextStatus = user.status === 'aktif' ? 'pasif' : 'aktif'
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: nextStatus })
      })
      if (res.ok) {
        setList((prev) =>
          prev.map((u) => (u.id === id ? { ...u, status: nextStatus } : u))
        )
      }
    } catch (err) {
      console.error('Failed to update status:', err)
    }
  }

  const changeRole = async (id: string) => {
    const dbRoleCycle: Record<string, string> = {
      'admin': 'customer',
      'business': 'admin',
      'customer': 'business'
    }
    const user = list.find((u) => u.id === id)
    if (!user) return
    const nextDbRole = dbRoleCycle[user.role] || 'customer'
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, role: nextDbRole })
      })
      if (res.ok) {
        setList((prev) =>
          prev.map((u) => (u.id === id ? { ...u, role: nextDbRole } : u))
        )
      }
    } catch (err) {
      console.error('Failed to update role:', err)
    }
  }

  const filteredList = list.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    const uiRole = ROLE_MAP[u.role] || 'Müşteri'
    const matchesFilter = roleFilter === 'all' || uiRole === roleFilter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          Kullanıcı Yönetimi
        </h1>
        <p className="text-sm text-slate-500">
          Rezervo platformundaki kullanıcıların listesi, rolleri, güvenlik durumları ve hesap detayları.
        </p>
      </div>

      {/* ── Filters & Search bar ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="İsim veya e-posta ile ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
          />
        </div>

        {/* Role Filters tab */}
        <div className="flex flex-wrap gap-1.5 rounded-xl border border-slate-200 bg-white p-1">
          {([
            { id: 'all', label: 'Tümü' },
            { id: 'Müşteri', label: 'Müşteri' },
            { id: 'İşletme Sahibi', label: 'İşletme' },
            { id: 'Yönetici', label: 'Yönetici' },
          ] as const).map(({ id, label }) => {
            const isActive = roleFilter === id
            return (
              <button
                key={id}
                onClick={() => setRoleFilter(id as FilterRole)}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                  isActive ? 'bg-primary text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>

      </div>

      {/* ── Users Table list ── */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {isLoading ? (
          <div className="flex h-48 items-center justify-center bg-white p-5">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm text-slate-500">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-6 py-4">Kullanıcı</th>
                  <th className="px-6 py-4">Rolü</th>
                  <th className="px-6 py-4">Durumu</th>
                  <th className="px-6 py-4">Kayıt Tarihi</th>
                  <th className="px-6 py-4 text-right">Aksiyonlar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredList.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50">
                    
                    {/* User details */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 overflow-hidden rounded-full bg-slate-100 shrink-0">
                          <img src={user.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces'} alt={user.name} className="h-full w-full object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{user.name}</p>
                          <p className="text-xs text-slate-400 font-medium">{user.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => changeRole(user.id)}
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold transition-all hover:bg-slate-100 cursor-pointer ${
                          ROLE_MAP[user.role] === 'Yönetici' ? 'text-purple-600 bg-purple-50' : ROLE_MAP[user.role] === 'İşletme Sahibi' ? 'text-blue-600 bg-blue-50' : 'text-slate-600 bg-slate-50'
                        }`}
                        title="Tıkla ve Rolü Değiştir"
                      >
                        {ROLE_MAP[user.role] || 'Müşteri'}
                        <ChevronDown className="h-3 w-3 opacity-60" />
                      </button>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold ${
                        user.status === 'aktif' ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'
                      }`}>
                        {user.status === 'aktif' ? 'Aktif' : 'Askıda'}
                      </span>
                    </td>

                    {/* Date joined */}
                    <td className="px-6 py-4 text-xs font-semibold text-slate-400">
                      {user.joined || '01.06.2026'}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => toggleStatus(user.id)}
                        className={`inline-flex items-center gap-1 rounded-xl border px-3 py-2 text-xs font-bold shadow-sm transition-colors cursor-pointer ${
                          user.status === 'aktif' ? 'border-red-200 text-red-600 bg-white hover:bg-red-50' : 'border-emerald-200 text-emerald-600 bg-white hover:bg-emerald-50'
                        }`}
                      >
                        {user.status === 'aktif' ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                        <span>{user.status === 'aktif' ? 'Askıya Al' : 'Aktifleştir'}</span>
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!isLoading && filteredList.length === 0 && (
          <div className="py-12 text-center text-slate-500">
            <Users className="mx-auto h-12 w-12 text-slate-300 mb-3" />
            <h3 className="text-base font-bold text-slate-700">Kullanıcı Bulunamadı</h3>
            <p className="text-xs text-slate-400 mt-1">Arama teriminize veya filtrenize uygun kayıt bulunmuyor.</p>
          </div>
        )}
      </div>

    </div>
  )
}
