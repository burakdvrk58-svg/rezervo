import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('rezervo_access_token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Oturum açılmadı.' }, { status: 401 })
    }

    const res = await fetch('http://localhost:8081/api/reservations', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'Spring Boot rezervasyonları yükleyemedi.' }, { status: res.status })
    }

    const data = await res.json()

    const mappedBookings = data.map((r: any) => {
      const isRoom = r.roomName.toLowerCase().includes('oda') || 
                     r.roomName.toLowerCase().includes('kabin') || 
                     r.roomName.toLowerCase().includes('derslik') ||
                     r.roomName.toLowerCase().includes('seminer')

      const category = isRoom ? 'library' : 'teacher'
      const timeClean = `${r.startTime.substring(0, 5)} - ${r.endTime.substring(0, 5)}`

      let statusLabel = 'Beklemede'
      let statusColor = 'text-amber-700 bg-amber-50 border-amber-100'

      if (r.status === 'APPROVED') {
        statusLabel = 'Onaylandı'
        statusColor = 'text-emerald-700 bg-emerald-50 border-emerald-100'
      } else if (r.status === 'REJECTED') {
        statusLabel = 'Reddedildi'
        statusColor = 'text-red-700 bg-red-50 border-red-100'
      }

      return {
        id: `res-${r.id}`,
        userId: r.username,
        studentName: r.userFullName || r.username,
        studentNo: '1420',
        studentEmail: `${r.username}@rezervo.com`,
        category: category,
        academicianId: `acad-${r.roomId}`,
        academicianName: r.roomName,
        universityId: 'univ-1',
        universityName: 'Boğaziçi Üniversitesi',
        title: isRoom ? `${r.roomName} Rezervasyonu` : `${r.roomName} ile Görüşme`,
        subtitle: 'Boğaziçi Üniversitesi',
        date: r.date,
        time: timeClean,
        details: r.description || 'Akademik Görüşme',
        status: statusLabel,
        statusColor: statusColor,
        image: isRoom 
          ? 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=300&h=200&fit=crop'
          : 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=faces',
        price: 'Ücretsiz'
      }
    })

    return NextResponse.json(mappedBookings)
  } catch (error) {
    return NextResponse.json({ error: 'Rezervasyonlar yüklenirken sunucu hatası.' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const { id: rawId, action } = await request.json()

    if (!rawId || !action) {
      return NextResponse.json({ error: 'Kimlik (ID) ve işlem (action) gereklidir.' }, { status: 400 })
    }

    const cookieStore = await cookies()
    const token = cookieStore.get('rezervo_access_token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Oturum açılmadı.' }, { status: 401 })
    }

    const id = rawId.replace('res-', '').replace('sch-res-', '')
    const springAction = action === 'approve' ? 'approve' : 'reject'

    const res = await fetch(`http://localhost:8081/api/reservations/${id}/${springAction}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'Rezervasyon güncellenemedi.' }, { status: res.status })
    }

    const javaRes = await res.json()

    let statusLabel = 'Beklemede'
    let statusColor = 'text-amber-700 bg-amber-50 border-amber-100'

    if (javaRes.status === 'APPROVED') {
      statusLabel = 'Onaylandı'
      statusColor = 'text-emerald-700 bg-emerald-50 border-emerald-100'
    } else if (javaRes.status === 'REJECTED') {
      statusLabel = 'Reddedildi'
      statusColor = 'text-red-700 bg-red-50 border-red-100'
    }

    return NextResponse.json({
      id: rawId,
      status: statusLabel,
      statusColor: statusColor
    }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Rezervasyon güncellenirken sunucu hatası.' }, { status: 500 })
  }
}
