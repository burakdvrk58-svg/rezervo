import { NextResponse } from 'next/server'
import { readDb } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Lütfen e-posta ve şifre alanlarını doldurun.' },
        { status: 400 }
      )
    }

    const db = readDb()
    const users = db.users || []

    // Find matching user (case insensitive email, exact password match)
    const user = users.find(
      (u: any) =>
        u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )

    if (!user) {
      return NextResponse.json(
        { error: 'E-posta adresi veya şifre hatalı.' },
        { status: 401 }
      )
    }

    if (user.status === 'pasif') {
      return NextResponse.json(
        { error: 'Hesabınız askıya alınmıştır. Lütfen yönetici ile iletişime geçin.' },
        { status: 403 }
      )
    }

    // Return user details without password
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(
      { success: true, user: userWithoutPassword },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Giriş sırasında bir sunucu hatası oluştu.' },
      { status: 500 }
    )
  }
}
