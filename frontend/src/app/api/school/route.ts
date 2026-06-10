import { NextResponse } from 'next/server'
import { readDb, writeDb } from '@/lib/db'

export async function GET() {
  try {
    const db = readDb()
    return NextResponse.json(db.universities || [])
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read universities' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { name, shortName, campus, logo } = await request.json()

    if (!name || !shortName || !campus) {
      return NextResponse.json({ error: 'Eksik üniversite parametreleri.' }, { status: 400 })
    }

    const db = readDb()
    
    // Check if university shortName already exists
    const exists = db.universities?.some((u: any) => u.shortName.toLowerCase() === shortName.toLowerCase())
    if (exists) {
      return NextResponse.json({ error: 'Bu kısa ada sahip bir üniversite zaten eklenmiş.' }, { status: 400 })
    }

    const newUniv = {
      id: `univ-${Date.now()}`,
      name,
      shortName: shortName.toUpperCase(),
      logo: logo || '🎓',
      campus,
      image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=250&fit=crop',
      libraryRooms: [],
      classrooms: []
    }

    db.universities = [...(db.universities || []), newUniv]
    writeDb(db)

    return NextResponse.json(newUniv)
  } catch (error: any) {
    return NextResponse.json({ error: 'Üniversite ekleme hatası: ' + error.message }, { status: 500 })
  }
}
