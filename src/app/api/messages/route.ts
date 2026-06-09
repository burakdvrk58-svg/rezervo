import { NextResponse } from 'next/server'
import { readDb, writeDb } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const chatWith = searchParams.get('chatWith')

    if (!userId) {
      return NextResponse.json({ error: 'Kullanıcı kimliği (userId) gereklidir.' }, { status: 400 })
    }

    const db = readDb()
    const messages = db.messages || []
    const users = db.users || []
    const bookings = db.bookings || []

    // If fetching a specific conversation thread
    if (chatWith) {
      const thread = messages.filter(
        (m: any) =>
          (m.senderId === userId && m.receiverId === chatWith) ||
          (m.senderId === chatWith && m.receiverId === userId)
      )
      return NextResponse.json(thread)
    }

    // Otherwise, return all messages and the contact list
    const userMessages = messages.filter((m: any) => m.senderId === userId || m.receiverId === userId)

    // Compile contact list
    // 1. Gather contact IDs from messages
    const contactIds = new Set<string>()
    userMessages.forEach((m: any) => {
      if (m.senderId !== userId) contactIds.add(m.senderId)
      if (m.receiverId !== userId) contactIds.add(m.receiverId)
    })

    // 2. Gather contact IDs from appointments/bookings
    const currentUser = users.find((u: any) => u.id === userId)
    if (currentUser) {
      if (currentUser.role === 'customer') {
        // Find academicians they have bookings with
        bookings.forEach((b: any) => {
          if (b.userId === userId) {
            // Find academician in users by email
            const acad = users.find((u: any) => u.email === b.studentEmail || u.id === 'u-academician') // fallback or exact match
            if (acad) contactIds.add(acad.id)
            // also map academician ID from db.academicians
            const acadUser = users.find((u: any) => u.name === b.academicianName || u.email === 'business@rezervo.com')
            if (acadUser) contactIds.add(acadUser.id)
          }
        })
      } else if (currentUser.role === 'business') {
        // Find students they have bookings with
        bookings.forEach((b: any) => {
          // Find student in users by email
          const studUser = users.find((u: any) => u.email === b.studentEmail || u.id === b.userId)
          if (studUser) contactIds.add(studUser.id)
        })
      }
    }

    // Always include standard u-student/u-academician for immediate availability in sandbox if no bookings exist
    if (currentUser?.role === 'customer') {
      contactIds.add('u-academician')
    } else if (currentUser?.role === 'business') {
      contactIds.add('u-student')
    }

    // Hydrate contacts details
    const contactList = Array.from(contactIds)
      .map((id) => {
        const u = users.find((usr: any) => usr.id === id)
        if (!u) return null
        // Find last message
        const lastMsg = [...userMessages]
          .reverse()
          .find((m: any) => m.senderId === id || m.receiverId === id)

        return {
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          avatar: u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
          lastMessage: lastMsg ? lastMsg.content : 'Henüz mesajlaşma yok.',
          lastMessageTime: lastMsg ? lastMsg.timestamp : ''
        }
      })
      .filter(Boolean)

    return NextResponse.json({
      messages: userMessages,
      contacts: contactList
    })
  } catch (error) {
    return NextResponse.json({ error: 'Mesajlar alınırken hata oluştu.' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { senderId, receiverId, content } = await request.json()

    if (!senderId || !receiverId || !content) {
      return NextResponse.json({ error: 'Eksik mesaj parametreleri.' }, { status: 400 })
    }

    const db = readDb()
    if (!db.messages) db.messages = []
    if (!db.notifications) db.notifications = []

    const sender = db.users.find((u: any) => u.id === senderId)
    const receiver = db.users.find((u: any) => u.id === receiverId)

    if (!sender || !receiver) {
      return NextResponse.json({ error: 'Gönderici veya alıcı bulunamadı.' }, { status: 404 })
    }

    const timestamp = new Date().toLocaleString('tr-TR', {
      day: 'numeric',
      month: 'long',
      weekday: 'long',
      hour: '2-digit',
      minute: '2-digit'
    })

    const newMsg = {
      id: 'msg-' + Math.random().toString(36).substr(2, 9),
      senderId,
      receiverId,
      content,
      timestamp
    }

    db.messages.push(newMsg)

    // Trigger Notification for the receiver
    const newNotif = {
      id: 'notif-' + Math.random().toString(36).substr(2, 9),
      userId: receiverId,
      role: receiver.role,
      title: 'Yeni Mesaj',
      desc: `${sender.name}: ${content.length > 40 ? content.substring(0, 37) + '...' : content}`,
      time: 'Şimdi',
      unread: true
    }
    db.notifications.unshift(newNotif)

    writeDb(db)

    return NextResponse.json(newMsg)
  } catch (error) {
    return NextResponse.json({ error: 'Mesaj gönderilirken hata oluştu.' }, { status: 500 })
  }
}
