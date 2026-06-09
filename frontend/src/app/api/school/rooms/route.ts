import { NextResponse } from 'next/server'
import { readDb } from '@/lib/db'
import { cookies } from 'next/headers'

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
        const roomsRes = await fetch('http://localhost:8081/api/rooms', {
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
      const libraryRooms = sqlRooms.length > 0 
        ? sqlRooms.filter((r: any) => r.name.toLowerCase().includes('çalışma') || r.name.toLowerCase().includes('kabin')).map((r: any) => ({
            id: `lr-1-${r.id}`,
            name: r.name,
            capacity: `${r.capacity} Kişi`,
            description: r.description,
            floor: 'Kat 1',
            image: r.name.toLowerCase().includes('grup') 
              ? 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=300&h=200&fit=crop'
              : 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=300&h=200&fit=crop',
            rating: '4.9',
            type: r.name.toLowerCase().includes('sessiz') || r.name.toLowerCase().includes('bireysel') ? 'silent' : 'group'
          }))
        : (university.libraryRooms || [])

      const classrooms = sqlRooms.length > 0
        ? sqlRooms.filter((r: any) => r.name.toLowerCase().includes('derslik') || r.name.toLowerCase().includes('seminer')).map((r: any) => ({
            id: `cr-1-${r.id}`,
            name: r.name,
            capacity: `${r.capacity} Kişi`,
            description: r.description,
            floor: 'Kat 1',
            image: r.name.toLowerCase().includes('seminer')
              ? 'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=300&h=200&fit=crop'
              : 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=300&h=200&fit=crop',
            rating: '4.8',
            type: r.name.toLowerCase().includes('seminer') ? 'seminar' : 'lecture'
          }))
        : (university.classrooms || [])

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
      libraryRoomCount: sqlRooms.length > 0 ? sqlRooms.filter((r: any) => r.name.toLowerCase().includes('çalışma') || r.name.toLowerCase().includes('kabin')).length : (u.libraryRooms?.length || 0),
      classroomCount: sqlRooms.length > 0 ? sqlRooms.filter((r: any) => r.name.toLowerCase().includes('derslik') || r.name.toLowerCase().includes('seminer')).length : (u.classrooms?.length || 0)
    }))

    return NextResponse.json(universities)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read rooms data' }, { status: 500 })
  }
}
