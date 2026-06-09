'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  Monitor,
  PhoneOff,
  MessageSquare,
  FileText,
  Paperclip,
  Users,
  Settings,
  Volume2,
  Send
} from 'lucide-react'

export default function MeetingRoomPage() {
  const router = useRouter()
  const params = useParams()
  const meetingId = params.id as string

  const [micActive, setMicActive] = useState(true)
  const [videoActive, setVideoActive] = useState(true)
  const [screenSharing, setScreenSharing] = useState(false)
  const [activeTab, setActiveTab] = useState<'notes' | 'files' | 'chat'>('notes')
  
  // Local stream state
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const [streamError, setStreamError] = useState(false)
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null)

  // Shared Notes & Files states (Mock)
  const [notes, setNotes] = useState(
    `# Akademik Danışmanlık Toplantı Notları\nTarih: ${new Date().toLocaleDateString('tr-TR')}\n\nGörüşülen Konular:\n- \n\nAlınan Kararlar / Sonraki Adımlar:\n- `
  )
  const [files, setFiles] = useState<any[]>([
    { name: 'tez_taslagi_v2.pdf', size: '2.4 MB', sender: 'Öğrenci', time: '12:04' }
  ])
  const [chatMessages, setChatMessages] = useState<any[]>([
    { sender: 'Sistem', text: 'Toplantı odasına katıldınız.', time: 'Şimdi', isSystem: true }
  ])
  const [chatInput, setChatInput] = useState('')

  // User details (Retrieved from local storage)
  const [userRole, setUserRole] = useState('')
  const [userName, setUserName] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUserRole(localStorage.getItem('rezervo_user_role') || 'customer')
      setUserName(localStorage.getItem('rezervo_user_name') || 'Kullanıcı')
    }
  }, [])

  // Request camera access on mount
  useEffect(() => {
    async function startCamera() {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: 640, height: 480 },
            audio: true
          })
          setMediaStream(stream)
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream
          }
        } else {
          setStreamError(true)
        }
      } catch (err) {
        console.error('Camera access error:', err)
        setStreamError(true)
      }
    }

    if (videoActive) {
      startCamera()
    } else {
      stopCamera()
    }

    return () => {
      stopCamera()
    }
  }, [videoActive])

  function stopCamera() {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop())
      setMediaStream(null)
    }
  }

  const toggleMic = () => {
    if (mediaStream) {
      mediaStream.getAudioTracks().forEach((track) => {
        track.enabled = !micActive
      })
    }
    setMicActive(!micActive)
  }

  const toggleVideo = () => {
    setVideoActive(!videoActive)
  }

  const toggleScreenShare = () => {
    if (!screenSharing) {
      alert('Ekran paylaşımı simülasyonu başlatıldı!')
    }
    setScreenSharing(!screenSharing)
  }

  const handleLeaveCall = () => {
    stopCamera()
    if (userRole === 'business') {
      router.push('/business/requests')
    } else {
      router.push('/customer/reservations')
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const newFile = {
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
      sender: userRole === 'business' ? 'Danışman' : 'Öğrenci',
      time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    }
    setFiles((prev) => [...prev, newFile])
    setChatMessages((p) => [...p, { sender: 'Sistem', text: `Yeni dosya yüklendi: ${file.name}`, time: 'Şimdi', isSystem: true }])
  }

  const sendChatMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim()) return
    const newMsg = {
      sender: userName,
      text: chatInput,
      time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      isSystem: false
    }
    setChatMessages((prev) => [...prev, newMsg])
    setChatInput('')
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0b0f19] text-slate-100 font-sans">
      
      {/* ── Top Bar Header ── */}
      <header className="flex h-16 items-center justify-between border-b border-slate-800 bg-[#0f172a] px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-bold text-sm">
            R
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
              Akademik Danışmanlık Odası
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 animate-pulse">
                Canlı Görüşme
              </span>
            </h1>
            <p className="text-[10px] text-slate-400 font-medium">Oda Kodu: {meetingId}</p>
          </div>
        </div>

        {/* Meeting metrics / users */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 rounded-lg bg-slate-800/60 px-3 py-1.5 text-xs font-semibold text-slate-300">
            <Users className="h-4 w-4 text-slate-400" />
            <span>2 Katılımcı</span>
          </div>
        </div>
      </header>

      {/* ── Core Workspace (Video + Sidebar) ── */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* ── Video Grid ── */}
        <div className="flex-1 p-6 flex flex-col items-center justify-center">
          <div className="grid w-full h-full max-w-5xl grid-cols-1 md:grid-cols-2 gap-6 items-center justify-center">
            
            {/* 1. Local Video Feed */}
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-slate-800 bg-[#161e31] shadow-2xl flex items-center justify-center">
              {videoActive && !streamError ? (
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="h-full w-full object-cover scale-x-[-1]"
                />
              ) : (
                <div className="text-center p-4">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-800 text-slate-400 mb-3 border border-slate-700">
                    <VideoOff className="h-8 w-8" />
                  </div>
                  <p className="text-xs font-bold text-slate-400">Kameranız Kapalı</p>
                </div>
              )}
              <span className="absolute bottom-4 left-4 rounded-lg bg-slate-900/80 px-3 py-1.5 text-xs font-bold text-white border border-slate-700 shadow flex items-center gap-1.5">
                {!micActive && <MicOff className="h-3 w-3 text-red-500" />}
                {userName} (Siz)
              </span>
            </div>

            {/* 2. Advisor / Partner Video Feed */}
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-slate-800 bg-[#161e31] shadow-2xl flex items-center justify-center">
              {/* Partner Avatar Falling back to nice graphic */}
              <div className="text-center p-4 flex flex-col items-center">
                <div className="relative h-24 w-24 overflow-hidden rounded-full border border-slate-700 mb-4 bg-slate-800 shadow-xl">
                  <img
                    src={
                      userRole === 'business'
                        ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces'
                        : 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=faces'
                    }
                    alt="Katılımcı"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 border-2 border-primary rounded-full animate-ping opacity-35" />
                </div>
                <h4 className="text-sm font-bold text-white">
                  {userRole === 'business' ? 'Ahmet Yılmaz (Öğrenci)' : 'Prof. Dr. Albert Ali Salah (Danışman)'}
                </h4>
                <div className="flex items-center gap-1 mt-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] text-slate-400 font-bold">Ses Bağlantısı Aktif</span>
                </div>
                {/* Simulated Audio Wave Visualizer */}
                <div className="flex items-end gap-1 mt-4 h-4">
                  {[1, 2, 3, 4, 5, 4, 3, 2, 1, 2, 3].map((_, idx) => (
                    <motion.div
                      key={idx}
                      animate={{ height: [4, 16, 4] }}
                      transition={{ duration: 1 + idx * 0.1, repeat: Infinity, ease: 'easeInOut' }}
                      className="w-1 rounded-full bg-primary"
                    />
                  ))}
                </div>
              </div>

              <span className="absolute bottom-4 left-4 rounded-lg bg-slate-900/80 px-3 py-1.5 text-xs font-bold text-white border border-slate-700 shadow flex items-center gap-1.5">
                <Volume2 className="h-3 w-3 text-emerald-400" />
                {userRole === 'business' ? 'Ahmet Yılmaz' : 'Prof. Dr. Albert Ali Salah'}
              </span>
            </div>

          </div>
        </div>

        {/* ── Interactive Sidebar ── */}
        <aside className="w-96 border-l border-slate-800 bg-[#0f172a] flex flex-col justify-between">
          
          {/* Header tabs */}
          <div className="flex border-b border-slate-800">
            <button
              onClick={() => setActiveTab('notes')}
              className={`flex-1 py-3 text-xs font-bold border-b-2 flex items-center justify-center gap-2 transition-all ${
                activeTab === 'notes' ? 'border-primary text-primary bg-slate-800/30' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="h-4 w-4" />
              Notlar
            </button>
            <button
              onClick={() => setActiveTab('files')}
              className={`flex-1 py-3 text-xs font-bold border-b-2 flex items-center justify-center gap-2 transition-all ${
                activeTab === 'files' ? 'border-primary text-primary bg-slate-800/30' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Paperclip className="h-4 w-4" />
              Dosyalar
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-3 text-xs font-bold border-b-2 flex items-center justify-center gap-2 transition-all ${
                activeTab === 'chat' ? 'border-primary text-primary bg-slate-800/30' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <MessageSquare className="h-4 w-4" />
              Sohbet
            </button>
          </div>

          {/* Panel Contents */}
          <div className="flex-1 overflow-y-auto p-5">
            {activeTab === 'notes' && (
              <div className="space-y-4 h-full flex flex-col">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Ortak Çalışma Notları</span>
                  <span className="text-[9px] rounded bg-slate-800 px-1.5 py-0.5 text-slate-400">Otomatik Kayıt</span>
                </div>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="flex-1 w-full rounded-xl border border-slate-800 bg-[#0b0f19] p-4 text-xs leading-relaxed text-slate-300 focus:border-primary focus:outline-none resize-none min-h-[300px]"
                />
              </div>
            )}

            {activeTab === 'files' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Toplantı Dosyaları</span>
                </div>
                
                {/* File Upload Zone */}
                <label className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-800 hover:border-primary bg-[#0b0f19] py-6 px-4 text-center cursor-pointer transition-all hover:bg-slate-900/30">
                  <Paperclip className="h-6 w-6 text-slate-500 mb-2" />
                  <span className="text-xs font-bold text-slate-300">Dosya Ekleyin veya Sürükleyin</span>
                  <span className="text-[10px] text-slate-500 mt-1">PDF, Word, Kod dosyaları (Maks 10MB)</span>
                  <input type="file" onChange={handleFileUpload} className="hidden" />
                </label>

                {/* File list */}
                <div className="space-y-2.5 mt-4">
                  {files.map((file, idx) => (
                    <div key={idx} className="flex items-center gap-3 rounded-xl border border-slate-800 bg-[#0b0f19] p-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-800 text-primary">
                        <FileText className="h-4.5 w-4.5" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <span className="block truncate text-xs font-bold text-slate-200">{file.name}</span>
                        <span className="text-[9px] text-slate-500 font-medium block mt-0.5">
                          {file.size} • {file.sender} tarafından • {file.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'chat' && (
              <div className="flex flex-col h-full justify-between">
                {/* Chat Message feed */}
                <div className="space-y-3 flex-1 overflow-y-auto mb-4 pr-1">
                  {chatMessages.map((msg, idx) => {
                    if (msg.isSystem) {
                      return (
                        <div key={idx} className="text-center my-2">
                          <span className="inline-block rounded-full bg-slate-800/60 px-3 py-1 text-[9px] font-bold text-slate-400">
                            {msg.text}
                          </span>
                        </div>
                      )
                    }
                    const isMe = msg.sender === userName
                    return (
                      <div key={idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                        <span className="text-[9px] text-slate-500 font-bold mb-0.5">{msg.sender}</span>
                        <div className={`rounded-xl px-3 py-2 text-xs leading-normal max-w-[240px] ${
                          isMe ? 'bg-primary text-white rounded-br-none' : 'bg-slate-850 text-slate-200 border border-slate-800 rounded-bl-none'
                        }`}>
                          <p>{msg.text}</p>
                          <span className="text-[8px] text-slate-400 block text-right mt-1 font-medium">{msg.time}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Message input */}
                <form onSubmit={sendChatMessage} className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Mesaj yazın..."
                    className="flex-1 rounded-xl border border-slate-800 bg-[#0b0f19] px-3.5 py-2.5 text-xs font-semibold text-slate-300 placeholder:text-slate-500 focus:border-primary focus:outline-none"
                  />
                  <button type="submit" className="rounded-xl bg-primary p-2.5 text-white hover:bg-primary/95 cursor-pointer">
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </div>
            )}
          </div>
        </aside>

      </div>

      {/* ── Bottom Call Actions Controller ── */}
      <footer className="flex h-20 items-center justify-between bg-[#0f172a] border-t border-slate-800 px-8">
        
        {/* Left indicators */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
          <Volume2 className="h-4 w-4 text-primary" />
          <span>Hoparlör: Sistem Çıkışı (Bağlı)</span>
        </div>

        {/* Center controllers */}
        <div className="flex items-center gap-4">
          {/* Audio toggle */}
          <button
            onClick={toggleMic}
            className={`flex h-11 w-11 items-center justify-center rounded-full border transition-all ${
              micActive
                ? 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white'
                : 'border-red-500/30 bg-red-600/10 text-red-500 hover:bg-red-600/25'
            }`}
            title={micActive ? 'Sesi Sessize Al' : 'Sesi Aç'}
          >
            {micActive ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </button>

          {/* Video camera toggle */}
          <button
            onClick={toggleVideo}
            className={`flex h-11 w-11 items-center justify-center rounded-full border transition-all ${
              videoActive
                ? 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white'
                : 'border-red-500/30 bg-red-600/10 text-red-500 hover:bg-red-600/25'
            }`}
            title={videoActive ? 'Kamerayı Kapat' : 'Kamerayı Aç'}
          >
            {videoActive ? <VideoIcon className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
          </button>

          {/* Screen sharing */}
          <button
            onClick={toggleScreenShare}
            className={`flex h-11 w-11 items-center justify-center rounded-full border transition-all ${
              screenSharing
                ? 'border-emerald-500/30 bg-emerald-600/10 text-emerald-500 hover:bg-emerald-600/20'
                : 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white'
            }`}
            title="Ekranı Paylaş"
          >
            <Monitor className="h-5 w-5" />
          </button>

          {/* Red End Call button */}
          <button
            onClick={handleLeaveCall}
            className="flex h-11 w-28 items-center justify-center gap-1.5 rounded-full bg-red-600 text-white font-bold text-xs shadow-lg shadow-red-600/20 transition-all hover:bg-red-700 active:scale-95 cursor-pointer"
            title="Görüşmeyi Sonlandır"
          >
            <PhoneOff className="h-4.5 w-4.5" />
            Ayrıl
          </button>
        </div>

        {/* Right tools */}
        <div className="flex items-center gap-2">
          <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200">
            <Settings className="h-5 w-5" />
          </button>
        </div>

      </footer>

    </div>
  )
}
