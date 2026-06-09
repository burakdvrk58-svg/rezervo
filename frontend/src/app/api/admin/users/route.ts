import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('rezervo_access_token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Oturum açılmadı.' }, { status: 401 })
    }

    const res = await fetch('http://localhost:8081/api/users', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'Spring Boot kullanıcı listesini yükleyemedi.' }, { status: res.status })
    }

    const data = await res.json()

    // Map backend User entities to frontend format
    const mappedUsers = data.map((u: any) => {
      let roleLabel = 'customer'
      if (u.role === 'ROLE_SUPER_ADMIN') roleLabel = 'admin'
      else if (u.role === 'ROLE_ROOM_LEADER') roleLabel = 'business'

      return {
        id: String(u.id),
        name: u.fullName || u.username,
        email: u.email,
        role: roleLabel,
        status: 'aktif'
      }
    })

    return NextResponse.json(mappedUsers)
  } catch (error) {
    return NextResponse.json({ error: 'Kullanıcı listesi yüklenirken sunucu hatası.' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, role } = await request.json()

    if (!id || !role) {
      return NextResponse.json({ error: 'ID ve rol gereklidir.' }, { status: 400 })
    }

    const cookieStore = await cookies()
    const token = cookieStore.get('rezervo_access_token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Oturum açılmadı.' }, { status: 401 })
    }

    // Map frontend role to Spring Boot Role enum
    let newRole = 'ROLE_USER'
    if (role === 'admin') newRole = 'ROLE_SUPER_ADMIN'
    else if (role === 'business') newRole = 'ROLE_ROOM_LEADER'

    const res = await fetch(`http://localhost:8081/api/users/${id}/assign-role?newRole=${newRole}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'Kullanıcı rolü güncellenemedi.' }, { status: res.status })
    }

    return NextResponse.json({ id, role, status: 'aktif' }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Kullanıcı güncellenirken sunucu hatası.' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Kullanıcı kimliği (ID) gereklidir.' }, { status: 400 })
    }

    const cookieStore = await cookies()
    const token = cookieStore.get('rezervo_access_token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Oturum açılmadı.' }, { status: 401 })
    }

    const res = await fetch(`http://localhost:8081/api/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'Kullanıcı silinemedi.' }, { status: res.status })
    }

    return NextResponse.json({ success: true, message: 'Kullanıcı başarıyla silindi.' })
  } catch (error) {
    return NextResponse.json({ error: 'Kullanıcı silinirken sunucu hatası.' }, { status: 500 })
  }
}
