import { NextResponse } from 'next/server'
import { readDb, writeDb } from '@/lib/db'

export async function GET() {
  try {
    const db = readDb()
    return NextResponse.json({
      universities: db.universities || [],
      academicians: db.academicians || []
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Akademisyen bilgileri alınırken hata oluştu.' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const { id, slots } = await request.json()

    if (!id || !Array.isArray(slots)) {
      return NextResponse.json(
        { error: 'Kimlik (ID) ve slot listesi gereklidir.' },
        { status: 400 }
      )
    }

    const db = readDb()
    const index = db.academicians.findIndex((a: any) => a.id === id)

    if (index === -1) {
      return NextResponse.json(
        { error: 'Akademisyen bulunamadı.' },
        { status: 404 }
      )
    }

    db.academicians[index].slots = slots
    writeDb(db)

    return NextResponse.json({ success: true, academician: db.academicians[index] })
  } catch (error) {
    return NextResponse.json(
      { error: 'Müsaitlik saatleri güncellenirken hata oluştu.' },
      { status: 500 }
    )
  }
}

