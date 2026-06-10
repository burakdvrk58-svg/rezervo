import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!file) {
      return NextResponse.json({ error: 'Dosya bulunamadı.' }, { status: 400 })
    }

    const cookieStore = await cookies()
    const token = cookieStore.get('rezervo_access_token')?.value

    const proxyFormData = new FormData()
    proxyFormData.append('file', file)

    const headers: Record<string, string> = {}
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const res = await fetch('http://localhost:8081/api/files/upload', {
      method: 'POST',
      headers,
      body: proxyFormData
    })

    if (!res.ok) {
      const errorText = await res.text()
      return NextResponse.json({ error: errorText || 'Dosya yüklenemedi.' }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: 'Dosya yükleme proxy hatası: ' + error.message }, { status: 500 })
  }
}
