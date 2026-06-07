import { NextResponse } from 'next/server'
import { readDb, writeDb } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const category = searchParams.get('category')

    const db = readDb()
    let bookings = db.bookings || []

    if (userId) {
      bookings = bookings.filter((b: any) => b.userId === userId)
    }

    if (category) {
      bookings = bookings.filter((b: any) => b.category === category)
    }

    return NextResponse.json(bookings)
  } catch (error) {
    return NextResponse.json(
      { error: 'Rezervasyonlar listelenirken hata oluştu.' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const db = readDb()

    // Determine default status: school portals are auto-approved, others are pending
    const isSchool = body.category === 'library' || body.category === 'teacher'
    const status = isSchool ? 'Onaylandı' : 'Beklemede'
    const statusColor = isSchool 
      ? 'text-emerald-700 bg-emerald-50 border-emerald-100'
      : 'text-amber-700 bg-amber-50 border-amber-100'

    const newBooking = {
      id: body.id || `res-${Date.now()}`,
      userId: body.userId || 'u-customer',
      status,
      statusColor,
      ...body
    }

    db.bookings = [newBooking, ...(db.bookings || [])]
    writeDb(db)

    return NextResponse.json(newBooking, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Rezervasyon oluşturulurken sunucu hatası oluştu.' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Rezervasyon kimliği (ID) gereklidir.' },
        { status: 400 }
      )
    }

    const db = readDb()
    const bookings = db.bookings || []
    const filteredBookings = bookings.filter((b: any) => b.id !== id)

    if (bookings.length === filteredBookings.length) {
      return NextResponse.json(
        { error: 'Rezervasyon bulunamadı.' },
        { status: 404 }
      )
    }

    db.bookings = filteredBookings
    writeDb(db)

    return NextResponse.json({ success: true, message: 'Rezervasyon iptal edildi.' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Rezervasyon silinirken sunucu hatası oluştu.' },
      { status: 500 }
    )
  }
}
