import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Lütfen tüm alanları doldurun.' },
        { status: 400 }
      )
    }

    // Generate a unique username from the name
    const usernameClean = name.toLowerCase().replace(/[^a-z0-9]/g, '')
    const username = usernameClean + Math.floor(100 + Math.random() * 900)

    // Send request to Java Spring Boot Register API
    const res = await fetch('http://localhost:8081/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        fullName: name,
        email,
        password
      })
    })

    if (!res.ok) {
      const errorText = await res.text()
      return NextResponse.json(
        { error: errorText || 'Kayıt sırasında bir hata oluştu.' },
        { status: res.status }
      )
    }

    return NextResponse.json(
      { success: true, message: 'Kayıt başarıyla oluşturuldu.' },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Kayıt sırasında bir sunucu hatası oluştu.' },
      { status: 500 }
    )
  }
}
