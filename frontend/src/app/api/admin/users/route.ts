import { NextResponse } from 'next/server'
import { readDb, writeDb } from '@/lib/db'

export async function GET() {
  try {
    const db = readDb()
    // Exclude passwords for safety before returning
    const safeUsers = (db.users || []).map(({ password: _, ...u }: any) => u)
    return NextResponse.json(safeUsers)
  } catch (error) {
    return NextResponse.json(
      { error: 'Kullanıcı listesi okunurken hata oluştu.' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status, role } = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: 'Kullanıcı kimliği (ID) gereklidir.' },
        { status: 400 }
      )
    }

    const db = readDb()
    const users = db.users || []
    const index = users.findIndex((u: any) => u.id === id)

    if (index === -1) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı.' },
        { status: 404 }
      )
    }

    if (status !== undefined) {
      users[index].status = status
    }

    if (role !== undefined) {
      users[index].role = role
    }

    db.users = users
    writeDb(db)

    const { password: _, ...updatedUser } = users[index]
    return NextResponse.json(updatedUser, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Kullanıcı güncellenirken sunucu hatası oluştu.' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Kullanıcı kimliği (ID) gereklidir.' },
        { status: 400 }
      )
    }

    const db = readDb()
    const users = db.users || []
    const filteredUsers = users.filter((u: any) => u.id !== id)

    if (users.length === filteredUsers.length) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı.' },
        { status: 404 }
      )
    }

    db.users = filteredUsers
    writeDb(db)

    return NextResponse.json({ success: true, message: 'Kullanıcı başarıyla silindi.' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Kullanıcı silinirken sunucu hatası oluştu.' },
      { status: 500 }
    )
  }
}
