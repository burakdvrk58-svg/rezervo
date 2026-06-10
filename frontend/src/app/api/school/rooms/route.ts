import { NextResponse } from 'next/server'
import { readDb } from '@/lib/db'
import { cookies } from 'next/headers'
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8081'


export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const universityId = searchParams.get('universityId')

    const db = readDb()
    const cookieStore = await cookies()
    const token = cookieStore.get('rezervo_access_token')?.value

    // Fetch live rooms from Spring Boot
    let sqlRooms: any[] = []
    if (token) {
      try {
        const roomsRes = await fetch(`${BACKEND_URL}/api/rooms`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (roomsRes.ok) {
          sqlRooms = await roomsRes.json()
        }
      } catch (err) {
        console.error('Failed to fetch rooms from Spring Boot:', err)
      }
    }

    if (universityId) {
      const university = db.universities?.find((u: any) => u.id === universityId)
      if (!university) {
        return NextResponse.json({ error: 'Üniversite bulunamadı' }, { status: 404 })
      }

      // Map Spring Boot rooms to library rooms and classrooms
      const sqlUnivLibraryRooms = sqlRooms.filter((r: any) => 
        (r.name.toLowerCase().includes('çalışma') || r.name.toLowerCase().includes('kabin') || r.name.toLowerCase().includes('sessiz') || r.name.toLowerCase().includes('oda')) &&
        r.name.includes(`[${university.shortName}]`)
      ).map((r: any) => ({
        id: `lr-sql-${r.id}`,
        sqlId: r.id,
        name: r.name.replace(`[${university.shortName}] `, '').replace(`[${university.shortName}]`, ''),
        capacity: `${r.capacity} Kişi`,
        description: r.description,
        floor: 'Kat 1',
        image: r.name.toLowerCase().includes('grup') 
          ? 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=300&h=200&fit=crop'
          : 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=300&h=200&fit=crop',
        rating: '4.9',
        type: r.name.toLowerCase().includes('sessiz') || r.name.toLowerCase().includes('bireysel') ? 'silent' : 'group'
      }))

      const libraryRooms = [...(university.libraryRooms || []), ...sqlUnivLibraryRooms]

      const sqlUnivClassrooms = sqlRooms.filter((r: any) => 
        (r.name.toLowerCase().includes('derslik') || r.name.toLowerCase().includes('seminer') || r.name.toLowerCase().includes('salon')) &&
        r.name.includes(`[${university.shortName}]`)
      ).map((r: any) => ({
        id: `cr-sql-${r.id}`,
        sqlId: r.id,
        name: r.name.replace(`[${university.shortName}] `, '').replace(`[${university.shortName}]`, ''),
        capacity: `${r.capacity} Kişi`,
        description: r.description,
        floor: 'Kat 1',
        image: r.name.toLowerCase().includes('seminer')
          ? 'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=300&h=200&fit=crop'
          : 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=300&h=200&fit=crop',
        rating: '4.8',
        type: r.name.toLowerCase().includes('seminer') ? 'seminar' : 'lecture'
      }))

      const classrooms = [...(university.classrooms || []), ...sqlUnivClassrooms]

      return NextResponse.json({
        university: {
          id: university.id,
          name: university.name,
          shortName: university.shortName,
          campus: university.campus,
          logo: university.logo,
          image: university.image
        },
        libraryRooms,
        classrooms,
        academicians: (db.academicians || []).filter((a: any) => a.universityId === universityId)
      })
    }

    // Return all universities summary
    const universities = (db.universities || []).map((u: any) => ({
      id: u.id,
      name: u.name,
      shortName: u.shortName,
      campus: u.campus,
      logo: u.logo,
      image: u.image,
      libraryRoomCount: (u.libraryRooms?.length || 0) + sqlRooms.filter((r: any) => 
        (r.name.toLowerCase().includes('çalışma') || r.name.toLowerCase().includes('kabin') || r.name.toLowerCase().includes('sessiz') || r.name.toLowerCase().includes('oda')) &&
        r.name.includes(`[${u.shortName}]`)
      ).length,
      classroomCount: (u.classrooms?.length || 0) + sqlRooms.filter((r: any) => 
        (r.name.toLowerCase().includes('derslik') || r.name.toLowerCase().includes('seminer') || r.name.toLowerCase().includes('salon')) &&
        r.name.includes(`[${u.shortName}]`)
      ).length
    }))

    return NextResponse.json(universities)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read rooms data' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { name, description, capacity, startHour, endHour, universityShortName } = await request.json()

    if (!name || !capacity || !startHour || !endHour || !universityShortName) {
      return NextResponse.json({ error: 'Eksik parametreler.' }, { status: 400 })
    }

    const cookieStore = await cookies()
    const token = cookieStore.get('rezervo_access_token')?.value

    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    // Prefix name with [universityShortName] to scope it
    const prefixedName = `[${universityShortName}] ${name}`

    const res = await fetch(`${BACKEND_URL}/api/rooms`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name: prefixedName,
        description,
        capacity: Number(capacity),
        startHour,
        endHour
      })
    })

    if (!res.ok) {
      const errorText = await res.text()
      return NextResponse.json({ error: errorText || 'Oda eklenemedi.' }, { status: res.status })
    }

    const savedRoom = await res.json()
    return NextResponse.json(savedRoom)
  } catch (error: any) {
    return NextResponse.json({ error: 'Oda ekleme hatası: ' + error.message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Oda kimliği (id) gereklidir.' }, { status: 400 })
    }

    const cookieStore = await cookies()
    const token = cookieStore.get('rezervo_access_token')?.value

    const headers: Record<string, string> = {}
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const res = await fetch(`${BACKEND_URL}/api/rooms/${id}`, {
      method: 'DELETE',
      headers
    })

    if (!res.ok) {
      const errorText = await res.text()
      return NextResponse.json({ error: errorText || 'Oda silinemedi.' }, { status: res.status })
    }

    return NextResponse.json({ success: true, message: 'Oda silindi.' })
  } catch (error: any) {
    return NextResponse.json({ error: 'Oda silme hatası: ' + error.message }, { status: 500 })
  }
}
