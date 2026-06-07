import { NextResponse } from 'next/server'
import { readDb, writeDb } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const { name, email, password, universityId, universityName } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Lütfen tüm alanları doldurun.' },
        { status: 400 }
      )
    }

    const db = readDb()
    const users = db.users || []

    // Check if user already exists
    const userExists = users.some(
      (u: any) => u.email.toLowerCase() === email.toLowerCase()
    )
    if (userExists) {
      return NextResponse.json(
        { error: 'Bu e-posta adresi zaten kullanımda.' },
        { status: 400 }
      )
    }

    // Create new user object
    const newUser = {
      id: `u-${Date.now()}`,
      name,
      email: email.toLowerCase(),
      password, // In a production app, use bcrypt to hash passwords
      role: 'customer',
      status: 'aktif',
      universityId: universityId || 'univ-1',
      universityName: universityName || 'Boğaziçi Üniversitesi'
    }

    db.users = [...users, newUser]
    writeDb(db)

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
