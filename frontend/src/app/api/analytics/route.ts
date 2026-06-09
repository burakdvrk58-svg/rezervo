import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('rezervo_access_token')?.value

    const headers: Record<string, string> = {}
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const res = await fetch('http://localhost:8081/api/reservations/analytics', { headers })

    if (!res.ok) {
      return NextResponse.json({ error: 'Spring Boot analitik verilerini yükleyemedi.' }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Analitik verileri alınırken hata oluştu.' }, { status: 500 })
  }
}
