import { NextResponse } from 'next/server'
import { readDb, writeDb } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'Kullanıcı kimliği (userId) gereklidir.' }, { status: 400 })
    }

    const db = readDb()
    const notifications = db.notifications || []
    
    // Filter by userId
    const userNotifications = notifications.filter((n: any) => n.userId === userId)

    return NextResponse.json(userNotifications)
  } catch (error) {
    return NextResponse.json({ error: 'Bildirimler alınırken hata oluştu.' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { userId, role, title, desc } = await request.json()

    if (!userId || !role || !title || !desc) {
      return NextResponse.json({ error: 'Eksik bildirim parametreleri.' }, { status: 400 })
    }

    const db = readDb()
    if (!db.notifications) db.notifications = []

    const newNotif = {
      id: 'notif-' + Math.random().toString(36).substr(2, 9),
      userId,
      role,
      title,
      desc,
      time: 'Şimdi',
      unread: true
    }

    db.notifications.unshift(newNotif)
    writeDb(db)

    return NextResponse.json(newNotif)
  } catch (error) {
    return NextResponse.json({ error: 'Bildirim oluşturulurken hata oluştu.' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, userId, role } = await request.json()

    const db = readDb()
    if (!db.notifications) db.notifications = []

    if (id) {
      // Mark specific notification as read
      db.notifications = db.notifications.map((n: any) =>
        n.id === id ? { ...n, unread: false } : n
      )
    } else if (userId && role) {
      // Mark all as read for this user
      db.notifications = db.notifications.map((n: any) =>
        n.userId === userId && n.role === role ? { ...n, unread: false } : n
      )
    } else {
      return NextResponse.json({ error: 'Kimlik veya kullanıcı/rol bilgisi gereklidir.' }, { status: 400 })
    }

    writeDb(db)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Bildirimler güncellenirken hata oluştu.' }, { status: 500 })
  }
}
