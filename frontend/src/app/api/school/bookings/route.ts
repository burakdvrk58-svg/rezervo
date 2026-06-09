import { NextResponse } from 'next/server'
import { readDb, writeDb } from '@/lib/db'

export async function GET() {
  try {
    const db = readDb()
    return NextResponse.json(db.bookings || [])
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read bookings' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const db = readDb()
    const newBooking = {
      id: `sch-res-${Date.now()}`,
      status: 'Onaylandı',
      statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-100',
      ...body
    }
    db.bookings = [newBooking, ...(db.bookings || [])]
    writeDb(db)
    return NextResponse.json(newBooking, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
  }
}
