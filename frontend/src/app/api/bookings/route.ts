import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Helper to parse Turkish textual dates (e.g. "08 Haziran Pazartesi" or "09 Haziran 2026") to YYYY-MM-DD
function parseTurkishDate(dateStr: string): string {
  if (!dateStr) return new Date().toISOString().split('T')[0]
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr

  const months: Record<string, string> = {
    'ocak': '01', 'şubat': '02', 'mart': '03', 'nisan': '04',
    'mayıs': '05', 'haziran': '06', 'temmuz': '07', 'ağustos': '08',
    'eylül': '09', 'ekim': '10', 'kasım': '11', 'aralık': '12'
  }

  const parts = dateStr.trim().split(/\s+/)
  const day = parts[0].padStart(2, '0')
  const monthName = (parts[1] || '').toLowerCase()
  const month = months[monthName] || '06'

  let year = '2026'
  if (parts[2] && /^\d{4}$/.test(parts[2])) {
    year = parts[2]
  }

  return `${year}-${month}-${day}`
}

// Map frontend room/academician ID to backend seeded room ID (1 to 5)
function mapToBackendRoomId(body: any): number {
  if (body.selectedRoom) {
    const rId = body.selectedRoom
    if (rId.includes('-1-1') || rId.includes('-2-1') || rId.includes('-3-1') || rId.includes('-4-1') || rId.includes('-5-1')) return 2 // Bireysel Çalışma Kabini A
    if (rId.includes('-1-2') || rId.includes('-2-2') || rId.includes('-3-2') || rId.includes('-4-2') || rId.includes('-5-2')) return 1 // Grup Çalışma Odası 1
    if (rId.includes('-1-3') || rId.includes('-2-3')) return 3 // Seminer ve Toplantı Odası
    if (rId.includes('cr-') && (rId.includes('-1') || rId.includes('-2'))) return 4 // Derslik 101
  }

  const acadId = body.academicianId
  if (acadId === 'acad-1') return 1 // Grup Çalışma Odası 1 (Albert Ali Salah)
  if (acadId === 'acad-2') return 4 // Derslik 101 (Ayşe Bener)
  if (acadId === 'acad-3') return 3 // Seminer Odası (Kemal Oflazer)
  if (acadId === 'acad-4') return 4 // Derslik 101 (Halhal Öztürk)
  if (acadId === 'acad-5') return 5 // Derslik 202 (Eşref Adalı)

  return 1 // Default to room 1
}

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

    // Map backend DTOs to frontend format
    const mappedBookings = data.map((r: any) => {
      const isRoom = r.roomName.toLowerCase().includes('oda') || 
                     r.roomName.toLowerCase().includes('kabin') || 
                     r.roomName.toLowerCase().includes('derslik') ||
                     r.roomName.toLowerCase().includes('seminer')

      const category = isRoom ? 'library' : 'teacher'
      const timeClean = `${r.startTime.substring(0, 5)} - ${r.endTime.substring(0, 5)}`

      let statusLabel = 'Beklemede'
      let statusColor = 'text-amber-700 bg-amber-50 border-amber-100'

      if (r.reviewed) {
        statusLabel = 'Tamamlandı'
        statusColor = 'text-indigo-700 bg-indigo-50 border-indigo-100'
      } else if (r.status === 'APPROVED') {
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
        academicianName: isRoom ? r.roomName : r.roomName,
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
        price: 'Ücretsiz',
        reviewed: !!r.reviewed
      }
    })

    return NextResponse.json(mappedBookings)
  } catch (error) {
    return NextResponse.json({ error: 'Rezervasyonlar yüklenirken sunucu hatası.' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const cookieStore = await cookies()
    const token = cookieStore.get('rezervo_access_token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Oturum açılmadı.' }, { status: 401 })
    }

    const roomId = mapToBackendRoomId(body)
    const parsedDate = parseTurkishDate(body.date)
    
    // Parse time slot (e.g. "09:00 - 09:15" or "09:00 - 11:00")
    const timeParts = (body.time || '09:00 - 09:15').split(' - ')
    const startTime = timeParts[0] ? `${timeParts[0].trim()}:00` : '09:00:00'
    const endTime = timeParts[1] ? `${timeParts[1].trim()}:00` : '09:15:00'

    const payload = {
      roomId,
      date: parsedDate,
      startTime,
      endTime,
      description: body.details || body.notes || 'Akademik Danışmanlık Görüşmesi'
    }

    const res = await fetch('http://localhost:8081/api/reservations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    })

    if (!res.ok) {
      const errorMsg = await res.text()
      return NextResponse.json({ error: errorMsg || 'Rezervasyon oluşturulamadı.' }, { status: res.status })
    }

    const javaRes = await res.json()
    
    // Return frontend compatible format
    return NextResponse.json({
      id: `res-${javaRes.id}`,
      userId: javaRes.username,
      status: 'Onaylandı',
      ...body
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Rezervasyon oluşturulurken sunucu hatası.' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const rawId = searchParams.get('id')

    if (!rawId) {
      return NextResponse.json({ error: 'Rezervasyon ID gereklidir.' }, { status: 400 })
    }

    const cookieStore = await cookies()
    const token = cookieStore.get('rezervo_access_token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Oturum açılmadı.' }, { status: 401 })
    }

    // Extract numeric ID
    const id = rawId.replace('res-', '').replace('sch-res-', '')

    const res = await fetch(`http://localhost:8081/api/reservations/${id}/reject`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'Rezervasyon iptal edilemedi.' }, { status: res.status })
    }

    return NextResponse.json({ success: true, message: 'Rezervasyon iptal edildi.' })
  } catch (error) {
    return NextResponse.json({ error: 'Rezervasyon silinirken sunucu hatası.' }, { status: 500 })
  }
}
