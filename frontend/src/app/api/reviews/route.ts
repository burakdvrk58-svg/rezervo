import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8081'


export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const academicianId = searchParams.get('academicianId')

    if (!academicianId) {
      return NextResponse.json({ error: 'Akademisyen ID gereklidir.' }, { status: 400 })
    }

    const cookieStore = await cookies()
    const token = cookieStore.get('rezervo_access_token')?.value

    const headers: Record<string, string> = {}
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const res = await fetch(`${BACKEND_URL}/api/reviews?academicianId=${academicianId}`, { headers })

    if (!res.ok) {
      return NextResponse.json({ error: 'Spring Boot değerlendirmeleri yükleyemedi.' }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Değerlendirmeler alınırken hata oluştu.' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const cookieStore = await cookies()
    const token = cookieStore.get('rezervo_access_token')?.value

    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const res = await fetch(`${BACKEND_URL}/api/reviews`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'Değerlendirme oluşturulamadı.' }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Değerlendirme oluşturulurken hata oluştu.' }, { status: 500 })
  }
}
