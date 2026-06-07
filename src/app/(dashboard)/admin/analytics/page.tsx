'use client'

import { useState, useEffect } from 'react'
import {
  TrendingUp,
  Users,
  Activity,
  ArrowUpRight,
  Server,
  Cpu,
  HardDrive,
  Database,
  Calendar
} from 'lucide-react'

const SERVER_NODES = [
  { name: 'TR-A1-Istanbul (Ana Düğüm)', role: 'Web Server / Gateway', load: '12%', status: 'Aktif', latency: '12ms' },
  { name: 'TR-DB-Istanbul (Veri Tabanı)', role: 'Postgres Replica / Cache', load: '24%', status: 'Aktif', latency: '4ms' },
  { name: 'EU-B1-Frankfurt (Yedekleme)', role: 'File Storage / Assets', load: '8%', status: 'Aktif', latency: '34ms' }
]

export default function AdminAnalyticsPage() {
  useEffect(() => {
    document.title = 'Sistem Analitiği | Rezervo'
  }, [])

  const [activeNode, setActiveNode] = useState<number | null>(null)

  return (
    <div className="space-y-8 pb-12">
      {/* ── Header ── */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Sistem Analitiği
          </h1>
          <p className="text-sm text-slate-500">
            Rezervo platformunun genel işlem hacmi, API yükü, kullanıcı yayılımı ve sunucu performansı.
          </p>
        </div>
      </div>

      {/* ── Metric Cards ── */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* Transaction Volume */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">İşlem Hacmi</span>
            <div className="rounded-lg bg-emerald-50 p-1.5 text-emerald-600">
              <TrendingUp className="h-4.5 w-4.5" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-black text-slate-900">842.500 TL</p>
          <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-emerald-600">
            <ArrowUpRight className="h-3.5 w-3.5" />
            <span>%18.2</span>
            <span className="text-slate-400 font-semibold ml-0.5">geçen aya göre</span>
          </div>
        </div>

        {/* Total Users */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Kayıtlı Kullanıcı</span>
            <div className="rounded-lg bg-blue-50 p-1.5 text-blue-600">
              <Users className="h-4.5 w-4.5" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-black text-slate-900">12.450</p>
          <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-emerald-600">
            <ArrowUpRight className="h-3.5 w-3.5" />
            <span>%4.8</span>
            <span className="text-slate-400 font-semibold ml-0.5">bu hafta yeni</span>
          </div>
        </div>

        {/* API Requests */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">API İstek Yükü</span>
            <div className="rounded-lg bg-purple-50 p-1.5 text-purple-600">
              <Activity className="h-4.5 w-4.5" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-black text-slate-900">3.5M / Gün</p>
          <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-emerald-600">
            <ArrowUpRight className="h-3.5 w-3.5" />
            <span>%14.1</span>
            <span className="text-slate-400 font-semibold ml-0.5">geçen aya göre</span>
          </div>
        </div>

        {/* System Uptime */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Çalışma Süresi</span>
            <div className="rounded-lg bg-orange-50 p-1.5 text-orange-600">
              <Server className="h-4.5 w-4.5" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-black text-slate-900">99.99%</p>
          <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-emerald-600">
            <span>Kararlı</span>
            <span className="text-slate-400 font-semibold ml-0.5">kesintisiz aktif</span>
          </div>
        </div>

      </div>

      {/* ── Main Charts Grid ── */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        
        {/* Line Chart: Transaction Volume */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-black text-slate-900">Finansal İşlem Hacmi Eğrisi</h3>
            <span className="text-xs text-slate-400 font-bold flex items-center gap-1">
              <Calendar className="h-4 w-4" /> 2026 İlk Yarı Raporu
            </span>
          </div>

          {/* Area Line Chart SVG */}
          <div className="h-64 w-full relative">
            <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              <line x1="0" y1="50" x2="500" y2="50" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="0" y1="100" x2="500" y2="100" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="0" y1="150" x2="500" y2="150" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4 4" />

              {/* Area path */}
              <path
                d="M 10 180 C 100 160, 200 140, 300 100 S 400 40, 490 20 L 490 180 Z"
                fill="url(#areaGrad)"
              />

              {/* Main Line path */}
              <path
                d="M 10 180 C 100 160, 200 140, 300 100 S 400 40, 490 20"
                fill="none"
                stroke="#2563EB"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Key points */}
              <circle cx="10" cy="180" r="4.5" fill="#3B82F6" stroke="white" strokeWidth="1.5" />
              <circle cx="150" cy="150" r="4.5" fill="#3B82F6" stroke="white" strokeWidth="1.5" />
              <circle cx="300" cy="100" r="4.5" fill="#3B82F6" stroke="white" strokeWidth="1.5" />
              <circle cx="490" cy="20" r="5" fill="#1D4ED8" stroke="white" strokeWidth="2" />
            </svg>

            {/* Labels under graph */}
            <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mt-2 px-1">
              <span>Oca (380k)</span>
              <span>Mar (510k)</span>
              <span>May (842k)</span>
              <span>Haz (980k)</span>
            </div>
          </div>
        </div>

        {/* User Distribution */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <h3 className="text-base font-black text-slate-900">Kullanıcı Dağılımı</h3>
          
          <div className="relative flex items-center justify-center h-48">
            <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#F1F5F9" strokeWidth="3.5" />
              {/* Müşteri: 80% */}
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#3B82F6" strokeWidth="3.8" strokeDasharray="80 20" strokeDashoffset="0" />
              {/* İşletme Sahibi: 18% */}
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#A855F7" strokeWidth="3.8" strokeDasharray="18 82" strokeDashoffset="-80" />
              {/* Admin: 2% */}
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#F59E0B" strokeWidth="3.8" strokeDasharray="2 98" strokeDashoffset="-98" />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-lg font-black text-slate-900">12.450</span>
              <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Aktif Üye</span>
            </div>
          </div>

          {/* Legends */}
          <div className="space-y-2 text-xs font-semibold">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-500">
                <span className="h-3 w-3 rounded bg-blue-500 block" />
                Müşteriler
              </span>
              <span className="text-slate-800 font-bold">~10.000</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-500">
                <span className="h-3 w-3 rounded bg-purple-500 block" />
                İşletme Sahipleri
              </span>
              <span className="text-slate-800 font-bold">2.250</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-500">
                <span className="h-3 w-3 rounded bg-amber-500 block" />
                Sistem Yöneticileri
              </span>
              <span className="text-slate-800 font-bold">200</span>
            </div>
          </div>
        </div>

      </div>

      {/* ── Sunucu Düğümleri ve Sağlığı ── */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <h3 className="text-base font-black text-slate-900">Sunucu Düğümleri & CPU Yükleri</h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {SERVER_NODES.map((node, idx) => (
            <div
              key={idx}
              onClick={() => setActiveNode(activeNode === idx ? null : idx)}
              className="group cursor-pointer rounded-2xl border border-slate-200 p-4 hover:border-primary/50 transition-all hover:shadow-sm"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                  <div className="rounded-xl bg-slate-50 p-2 text-slate-500 group-hover:text-primary group-hover:bg-blue-50/50">
                    {idx === 1 ? <Database className="h-4.5 w-4.5" /> : idx === 2 ? <HardDrive className="h-4.5 w-4.5" /> : <Cpu className="h-4.5 w-4.5" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{node.name}</h4>
                    <p className="text-[10px] text-slate-400">{node.role}</p>
                  </div>
                </div>
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </div>

              <div className="mt-4 flex justify-between items-center text-[10px] font-semibold text-slate-400">
                <span>CPU Yükü: <strong className="text-slate-800">{node.load}</strong></span>
                <span>Gecikme: <strong className="text-slate-800">{node.latency}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
