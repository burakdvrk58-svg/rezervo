import { NextResponse } from 'next/server'
import { readDb, writeDb } from '@/lib/db'

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const db = readDb()
    const initialCount = db.bookings?.length || 0
    db.bookings = (db.bookings || []).filter((b: any) => b.id !== id)
    
    if (db.bookings.length === initialCount) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }
    
    writeDb(db)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete booking' }, { status: 500 })
  }
}
