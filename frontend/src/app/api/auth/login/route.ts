import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Lütfen e-posta ve şifre alanlarını doldurun.' },
        { status: 400 }
      )
    }

    // Connect to Java Spring Boot Auth API
    const res = await fetch('http://localhost:8081/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: email,
        password: password
      })
    })

    if (!res.ok) {
      const errorText = await res.text()
      return NextResponse.json(
        { error: errorText || 'E-posta adresi veya şifre hatalı.' },
        { status: res.status }
      )
    }

    const token = await res.text()

    // Decode JWT payload (format: header.payload.signature)
    try {
      const payloadBase64 = token.split('.')[1]
      const payloadJson = Buffer.from(payloadBase64, 'base64').toString('utf-8')
      const payload = JSON.parse(payloadJson)

      // Role mapping: ROLE_SUPER_ADMIN -> admin, ROLE_ROOM_LEADER -> business, ROLE_USER -> customer
      let role = 'customer'
      if (payload.role === 'ROLE_SUPER_ADMIN') role = 'admin'
      else if (payload.role === 'ROLE_ROOM_LEADER') role = 'business'

      // Map seeded user names or clean up username if no fullName claim is present
      let displayName = payload.fullName || payload.sub || email
      if (!payload.fullName) {
        if (payload.sub === 'customer') {
          displayName = 'Ahmet Yılmaz'
        } else if (payload.sub === 'business') {
          displayName = 'Prof. Dr. Albert Ali Salah'
        } else if (payload.sub === 'admin') {
          displayName = 'Can Ertekin'
        } else {
          // Capitalize first letter of username digits-removed as a generic fallback
          const cleanName = (payload.sub || '').replace(/[0-9]/g, '')
          if (cleanName) {
            displayName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1)
          }
        }
      }

      const userWithoutPassword = {
        id: payload.sub || email,
        name: displayName,
        email: email,
        role: role,
        token: token
      }

      const response = NextResponse.json(
        { success: true, user: userWithoutPassword },
        { status: 200 }
      )

      response.cookies.set('rezervo_access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 // 24 hours
      })

      return response
    } catch (e) {
      return NextResponse.json(
        { error: 'JWT token çözümlenemedi.' },
        { status: 500 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Giriş sırasında bir sunucu hatası oluştu.' },
      { status: 500 }
    )
  }
}
