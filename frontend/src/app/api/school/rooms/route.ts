import { NextResponse } from 'next/server'
import { readDb } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const universityId = searchParams.get('universityId')

    const db = readDb()

    if (universityId) {
      const university = db.universities?.find((u: any) => u.id === universityId)
      if (!university) {
        return NextResponse.json({ error: 'Üniversite bulunamadı' }, { status: 404 })
      }
      return NextResponse.json({
        university: {
          id: university.id,
          name: university.name,
          shortName: university.shortName,
          campus: university.campus,
          logo: university.logo,
          image: university.image
        },
        libraryRooms: university.libraryRooms || [],
        classrooms: university.classrooms || [],
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
      libraryRoomCount: u.libraryRooms?.length || 0,
      classroomCount: u.classrooms?.length || 0
    }))

    return NextResponse.json(universities)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read rooms data' }, { status: 500 })
  }
}
