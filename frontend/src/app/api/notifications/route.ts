import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8081'


export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'Kullanıcı kimliği (userId) gereklidir.' }, { status: 400 })
    }

    const cookieStore = await cookies()
    const token = cookieStore.get('rezervo_access_token')?.value

    const headers: Record<string, string> = {}
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const res = await fetch(`${BACKEND_URL}/api/notifications?userId=${userId}`, { headers })

    if (!res.ok) {
      return NextResponse.json({ error: 'Spring Boot bildirimleri yükleyemedi.' }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Bildirimler alınırken hata oluştu.' }, { status: 500 })
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

    const res = await fetch(`${BACKEND_URL}/api/notifications`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'Bildirim oluşturulamadı.' }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Bildirim oluşturulurken hata oluştu.' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
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

    const res = await fetch(`${BACKEND_URL}/api/notifications`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(body)
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'Bildirimler güncellenemedi.' }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Bildirimler güncellenirken hata oluştu.' }, { status: 500 })
  }
}
