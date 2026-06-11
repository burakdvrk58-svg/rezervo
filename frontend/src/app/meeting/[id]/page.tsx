'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
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

  const jitsiApiRef = useRef<any>(null)

  // Initialize Jitsi Meet
  useEffect(() => {
    if (!meetingId || !userName) return

    const script = document.createElement('script')
    script.src = 'https://meet.jit.si/external_api.js'
    script.async = true
    script.onload = () => {
      const domain = 'meet.jit.si'
      const options = {
        roomName: `rezervo-meeting-${meetingId}`,
        width: '100%',
        height: '100%',
        parentNode: document.querySelector('#jitsi-container'),
        userInfo: {
          displayName: userName
        },
        configOverwrite: {
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          disableDeepLinking: true,
          prejoinPageEnabled: false
        },
        interfaceConfigOverwrite: {
          TILE_VIEW_MAX_COLUMNS: 2,
          MOBILE_APP_PROMO: false
        }
      }
      const api = new (window as any).JitsiMeetExternalAPI(domain, options)
      jitsiApiRef.current = api

      api.addEventListener('videoConferenceLeft', () => {
        handleLeaveCall()
      })
    }

    document.body.appendChild(script)

    return () => {
      if (jitsiApiRef.current) {
        jitsiApiRef.current.dispose()
      }
      document.body.removeChild(script)
    }
  }, [meetingId, userName])

  const toggleMic = () => {
    if (jitsiApiRef.current) {
      jitsiApiRef.current.executeCommand('toggleAudio')
    }
    setMicActive(!micActive)
  }

  const toggleVideo = () => {
    if (jitsiApiRef.current) {
      jitsiApiRef.current.executeCommand('toggleVideo')
    }
    setVideoActive(!videoActive)
  }

  const toggleScreenShare = () => {
    if (jitsiApiRef.current) {
      jitsiApiRef.current.executeCommand('toggleShareScreen')
    }
    setScreenSharing(!screenSharing)
  }

  const handleLeaveCall = () => {
    if (jitsiApiRef.current) {
      jitsiApiRef.current.executeCommand('hangup')
    }
    if (userRole === 'business') {
      router.push('/business/requests')
    } else {
      router.push('/customer/reservations')
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    try {
      setChatMessages((p) => [...p, { sender: 'Sistem', text: `Dosya yükleniyor: ${file.name}...`, time: 'Şimdi', isSystem: true }])
      
      const res = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData
      })
      if (!res.ok) {
        throw new Error('Dosya yükleme başarısız.')
      }
      const data = await res.json()
      
      const newFile = {
        name: data.fileName || file.name,
        size: data.fileSize || ((file.size / (1024 * 1024)).toFixed(1) + ' MB'),
        url: data.url,
        sender: userRole === 'business' ? 'Danışman' : 'Öğrenci',
        time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
      }
      setFiles((prev) => [...prev, newFile])
      setChatMessages((p) => [...p, { sender: 'Sistem', text: `Yeni dosya yüklendi: ${file.name}`, time: 'Şimdi', isSystem: true }])
    } catch (err: any) {
      setChatMessages((p) => [...p, { sender: 'Sistem', text: `Dosya yüklenirken hata oluştu: ${err.message}`, time: 'Şimdi', isSystem: true }])
    }
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
          <div className="w-full h-full max-w-5xl rounded-2xl overflow-hidden border border-slate-800 bg-[#161e31] shadow-2xl">
            <div id="jitsi-container" className="w-full h-full" />
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
                        <a
                          href={file.url ? `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8081'}${file.url}` : '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block truncate text-xs font-bold text-slate-200 hover:text-primary transition-all"
                        >
                          {file.name}
                        </a>
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
