import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { readDb, writeDb } from '@/lib/db'
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8081'


export async function GET() {
  try {
    const db = readDb()
    const universities = db.universities || []
    const staticAcademicians = db.academicians || []

    const cookieStore = await cookies()
    const token = cookieStore.get('rezervo_access_token')?.value

    const headers: Record<string, string> = {}
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    // Fetch reviews from Spring Boot MySQL
    let reviewsList: any[] = []
    try {
      const reviewsRes = await fetch(`${BACKEND_URL}/api/reviews`, { headers })
      if (reviewsRes.ok) {
        reviewsList = await reviewsRes.json()
      }
    } catch (err) {
      console.error('Spring Boot reviews fetch failed, using fallback empty list:', err)
    }

    // Merge reviews into academicians dynamically
    const dynamicAcademicians = staticAcademicians.map((acad: any) => {
      const acadReviews = reviewsList.filter((r: any) => r.academicianId === acad.id)
      
      if (acadReviews.length > 0) {
        const totalRatingSum = acadReviews.reduce((sum: number, r: any) => sum + r.rating, 0)
        const avgRating = Math.round((totalRatingSum / acadReviews.length) * 10) / 10
        
        return {
          ...acad,
          reviews: acadReviews.length,
          rating: avgRating,
          reviewsList: acadReviews.map((r: any) => ({
            studentName: r.studentName || 'Anonim Öğrenci',
            rating: r.rating,
            reviewText: r.reviewText || '',
            date: r.createdAt ? new Date(r.createdAt).toLocaleDateString('tr-TR') : new Date().toLocaleDateString('tr-TR')
          }))
        }
      }
      return {
        ...acad,
        reviews: 0,
        rating: 0.0,
        reviewsList: []
      }
    })

    return NextResponse.json({
      universities,
      academicians: dynamicAcademicians
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Akademisyen bilgileri alınırken hata oluştu.' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const { id, slots, aiAssistantActive } = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: 'Kimlik (ID) gereklidir.' },
        { status: 400 }
      )
    }

    const db = readDb()
    const index = db.academicians.findIndex((a: any) => a.id === id)

    if (index === -1) {
      return NextResponse.json(
        { error: 'Akademisyen bulunamadı.' },
        { status: 404 }
      )
    }

    if (Array.isArray(slots)) {
      db.academicians[index].slots = slots
    }

    if (typeof aiAssistantActive === 'boolean') {
      db.academicians[index].aiAssistantActive = aiAssistantActive
    }

    writeDb(db)

    return NextResponse.json({ success: true, academician: db.academicians[index] })
  } catch (error) {
    return NextResponse.json(
      { error: 'Bilgiler güncellenirken hata oluştu.' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { academicianId, rating, reviewText, studentName, bookingId } = body

    if (!academicianId || !rating || !bookingId) {
      return NextResponse.json(
        { error: 'Gerekli bilgiler eksik.' },
        { status: 400 }
      )
    }

    const cookieStore = await cookies()
    const token = cookieStore.get('rezervo_access_token')?.value

    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    // Save review in Spring Boot MySQL
    const res = await fetch(`${BACKEND_URL}/api/reviews`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        academicianId,
        rating,
        reviewText,
        studentName,
        bookingId
      })
    })

    if (!res.ok) {
      const errText = await res.text()
      return NextResponse.json(
        { error: errText || 'Değerlendirme Spring Boot veritabanına kaydedilemedi.' },
        { status: res.status }
      )
    }

    // Return success
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Değerlendirme eklenirken hata oluştu.' },
      { status: 500 }
    )
  }
}
