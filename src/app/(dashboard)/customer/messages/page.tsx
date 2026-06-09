'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Search, MessageSquare, Paperclip, MoreVertical } from 'lucide-react'

export default function CustomerMessagesPage() {
  const [contacts, setContacts] = useState<any[]>([])
  const [activeContact, setActiveContact] = useState<any | null>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [inputText, setInputText] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  
  const chatEndRef = useRef<HTMLDivElement>(null)
  const pollIntervalRef = useRef<any>(null)

  const studentId = typeof window !== 'undefined' ? (localStorage.getItem('rezervo_user_id') || 'u-student') : 'u-student'

  const fetchContactsAndMessages = async (selectFirst = false) => {
    try {
      const res = await fetch(`/api/messages?userId=${studentId}`)
      if (res.ok) {
        const data = await res.json()
        setContacts(data.contacts || [])
        
        if (selectFirst && data.contacts?.length > 0 && !activeContact) {
          setActiveContact(data.contacts[0])
        }
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchThread = async (contactId: string) => {
    try {
      const res = await fetch(`/api/messages?userId=${studentId}&chatWith=${contactId}`)
      if (res.ok) {
        const data = await res.json()
        setMessages(data)
      }
    } catch (err) {
      console.error('Failed to fetch thread:', err)
    }
  }

  // Load contacts and select first contact on mount
  useEffect(() => {
    document.title = 'Mesajlarım | Rezervo'
    fetchContactsAndMessages(true)
  }, [])

  // Poll current thread and contact list for new messages
  useEffect(() => {
    if (activeContact) {
      fetchThread(activeContact.id)
      
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current)
      
      pollIntervalRef.current = setInterval(() => {
        fetchThread(activeContact.id)
        fetchContactsAndMessages(false)
      }, 5000)
    }

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current)
    }
  }, [activeContact])

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim() || !activeContact || isSending) return

    const messageText = inputText
    setInputText('')
    setIsSending(true)

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: studentId,
          receiverId: activeContact.id,
          content: messageText
        })
      })

      if (res.ok) {
        const newMsg = await res.json()
        setMessages((prev) => [...prev, newMsg])
        fetchContactsAndMessages(false)
      }
    } catch (err) {
      console.error('Failed to send message:', err)
    } finally {
      setIsSending(false)
    }
  }

  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex h-[calc(100vh-8rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      
      {/* ── Contacts Sidebar ── */}
      <div className="flex w-80 shrink-0 flex-col border-r border-slate-200 bg-slate-50/50">
        {/* Search */}
        <div className="p-4 border-b border-slate-200 bg-white">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Mesajlarda ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-4 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/10"
            />
          </div>
        </div>

        {/* Contacts list */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {isLoading ? (
            <div className="flex h-32 items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : filteredContacts.length > 0 ? (
            filteredContacts.map((contact) => {
              const isActive = activeContact?.id === contact.id
              return (
                <button
                  key={contact.id}
                  onClick={() => setActiveContact(contact)}
                  className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition-all ${
                    isActive
                      ? 'bg-primary/8 text-primary shadow-sm border-l-4 border-primary'
                      : 'hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-slate-100">
                    <img
                      src={contact.avatar}
                      alt={contact.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className={`truncate text-xs font-bold ${isActive ? 'text-primary' : 'text-slate-900'}`}>
                        {contact.name}
                      </span>
                      <span className="text-[9px] text-slate-400 font-medium">{contact.lastMessageTime?.split(',')[1] || ''}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block font-medium mt-0.5 truncate">
                      {contact.role === 'business' ? 'Danışman Akademisyen' : 'Öğrenci'}
                    </span>
                    <p className={`mt-1 truncate text-xs font-semibold ${isActive ? 'text-primary/80' : 'text-slate-500'}`}>
                      {contact.lastMessage}
                    </p>
                  </div>
                </button>
              )
            })
          ) : (
            <div className="text-center py-12 text-slate-400">
              <MessageSquare className="h-8 w-8 mx-auto text-slate-300 mb-2" />
              <p className="text-xs font-semibold">Görüşme Bulunmuyor</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Active Conversation Panel ── */}
      <div className="flex flex-1 flex-col bg-slate-50/30">
        {activeContact ? (
          <>
            {/* Header bar */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 overflow-hidden rounded-full border border-slate-100">
                  <img
                    src={activeContact.avatar}
                    alt={activeContact.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">{activeContact.name}</h3>
                  <span className="text-[10px] font-semibold text-slate-400 mt-0.5 block">
                    {activeContact.email}
                  </span>
                </div>
              </div>
              <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                <MoreVertical className="h-5 w-5" />
              </button>
            </div>

            {/* Messages body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <AnimatePresence initial={false}>
                {messages.map((msg) => {
                  const isMe = msg.senderId === studentId
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-md rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-sm ${
                          isMe
                            ? 'bg-primary text-white rounded-br-none'
                            : 'bg-white text-slate-800 border border-slate-100 rounded-bl-none'
                        }`}
                      >
                        <p className="font-medium">{msg.content}</p>
                        <span className={`block text-[9px] mt-1.5 text-right font-medium ${isMe ? 'text-white/70' : 'text-slate-400'}`}>
                          {msg.timestamp}
                        </span>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
              <div ref={chatEndRef} />
            </div>

            {/* Input form */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 bg-white">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => alert('Dosya ekleme simülasyonu: Lütfen dosyayı sürükleyip görüntülü görüşme odasındaki dosya alanına atın.')}
                  className="rounded-xl p-2.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 focus:outline-none"
                  title="Dosya Ekle"
                >
                  <Paperclip className="h-5 w-5" />
                </button>
                <input
                  type="text"
                  required
                  placeholder="Mesajınızı buraya yazın..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-xs font-semibold text-slate-800 focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/10"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || isSending}
                  className="rounded-xl bg-primary p-3 text-white shadow-md shadow-primary/20 transition-all hover:bg-primary/95 active:scale-95 disabled:opacity-50 cursor-pointer"
                  title="Gönder"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center text-slate-400">
            <MessageSquare className="h-12 w-12 text-slate-200 mb-3" />
            <h3 className="text-base font-bold text-slate-700">Sohbet Seçin</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm leading-relaxed">
              Mesajlaşmaya başlamak için sol taraftaki menüden danışman akademisyeninizi seçin.
            </p>
          </div>
        )}
      </div>

    </div>
  )
}
