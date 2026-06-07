import { NextResponse } from 'next/server'
import { readDb, writeDb } from '@/lib/db'

export async function GET() {
  try {
    const db = readDb()
    return NextResponse.json({
      universities: db.universities || [],
      academicians: db.academicians || []
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
    const { id, slots } = await request.json()

    if (!id || !Array.isArray(slots)) {
      return NextResponse.json(
        { error: 'Kimlik (ID) ve slot listesi gereklidir.' },
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

    db.academicians[index].slots = slots
    writeDb(db)

    return NextResponse.json({ success: true, academician: db.academicians[index] })
  } catch (error) {
    return NextResponse.json(
      { error: 'Müsaitlik saatleri güncellenirken hata oluştu.' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { academicianId, rating, reviewText, studentName, bookingId } = await request.json()

    if (!academicianId || !rating || !bookingId) {
      return NextResponse.json(
        { error: 'Gerekli bilgiler eksik.' },
        { status: 400 }
      )
    }

    const db = readDb()
    const acadIndex = db.academicians.findIndex((a: any) => a.id === academicianId)
    const bookingIndex = db.bookings.findIndex((b: any) => b.id === bookingId)

    if (acadIndex === -1) {
      return NextResponse.json(
        { error: 'Akademisyen bulunamadı.' },
        { status: 404 }
      )
    }

    // Update academician rating & review count
    const acad = db.academicians[acadIndex]
    const currentReviewsCount = acad.reviews || 0
    const currentRating = acad.rating || 0.0

    // Recalculate average rating
    const totalRatingSum = currentRating * currentReviewsCount + Number(rating)
    const newReviewsCount = currentReviewsCount + 1
    const newRating = Math.round((totalRatingSum / newReviewsCount) * 10) / 10

    db.academicians[acadIndex].reviews = newReviewsCount
    db.academicians[acadIndex].rating = newRating

    // Store review item details in academician profile
    if (!db.academicians[acadIndex].reviewsList) {
      db.academicians[acadIndex].reviewsList = []
    }
    db.academicians[acadIndex].reviewsList.push({
      studentName: studentName || 'Anonim Öğrenci',
      rating: Number(rating),
      reviewText: reviewText || '',
      date: new Date().toLocaleDateString('tr-TR')
    })

    // Mark booking as reviewed
    if (bookingIndex !== -1) {
      db.bookings[bookingIndex].reviewed = true
      db.bookings[bookingIndex].status = 'Tamamlandı'
    }

    writeDb(db)

    return NextResponse.json({ success: true, academician: db.academicians[acadIndex] })
  } catch (error) {
    return NextResponse.json(
      { error: 'Değerlendirme eklenirken hata oluştu.' },
      { status: 500 }
    )
  }
}

