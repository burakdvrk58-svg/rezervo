import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params
    const cookieStore = await cookies()
    const token = cookieStore.get('rezervo_access_token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Oturum açılmadı.' }, { status: 401 })
    }

    // Extract numeric ID
    const id = rawId.replace('res-', '').replace('sch-res-', '')

    const res = await fetch(`http://localhost:8081/api/reservations/${id}/reject`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'Rezervasyon iptal edilemedi.' }, { status: res.status })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete booking' }, { status: 500 })
  }
}
