import { NextResponse } from 'next/server'
import { readDb, writeDb } from '@/lib/db'

export async function GET() {
  try {
    const db = readDb()
    return NextResponse.json(db.bookings || [])
  } catch (error) {
    return NextResponse.json(
      { error: 'Rezervasyon istekleri okunurken hata oluştu.' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, action } = await request.json()

    if (!id || !action) {
      return NextResponse.json(
        { error: 'Kimlik (ID) ve işlem (action) gereklidir.' },
        { status: 400 }
      )
    }

    const db = readDb()
    const bookings = db.bookings || []
    const index = bookings.findIndex((b: any) => b.id === id)

    if (index === -1) {
      return NextResponse.json(
        { error: 'Rezervasyon bulunamadı.' },
        { status: 404 }
      )
    }

    if (action === 'approve') {
      bookings[index].status = 'Onaylandı'
      bookings[index].statusColor = 'text-emerald-700 bg-emerald-50 border-emerald-100'
    } else if (action === 'reject') {
      bookings[index].status = 'Reddedildi'
      bookings[index].statusColor = 'text-red-700 bg-red-50 border-red-100'
    } else {
      return NextResponse.json(
        { error: 'Geçersiz işlem.' },
        { status: 400 }
      )
    }

    db.bookings = bookings
    writeDb(db)

    return NextResponse.json(bookings[index], { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Rezervasyon güncellenirken sunucu hatası oluştu.' },
      { status: 500 }
    )
  }
}
