import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Helper to parse Turkish textual dates
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

function mapToBackendRoomId(body: any): number {
  if (body.title) {
    const title = body.title.toLowerCase()
    if (title.includes('sessiz çalışma') || title.includes('bireysel kabin')) return 2 // Bireysel Çalışma Kabini A
    if (title.includes('grup çalışma') || title.includes('takım odası') || title.includes('kolaborasyon')) return 1 // Grup Çalışma Odası 1
    if (title.includes('seminer') || title.includes('toplantı')) return 3 // Seminer ve Toplantı Odası
    if (title.includes('derslik 101') || title.includes('derslik eeb') || title.includes('amfi')) return 4 // Derslik 101
    if (title.includes('derslik 202') || title.includes('lab dersliği')) return 5 // Derslik 202
  }
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

    const mappedBookings = data.map((r: any) => {
      const isRoom = r.roomName.toLowerCase().includes('oda') || 
                     r.roomName.toLowerCase().includes('kabin') || 
                     r.roomName.toLowerCase().includes('derslik') ||
                     r.roomName.toLowerCase().includes('seminer')

      const category = isRoom ? 'library' : 'teacher'
      const timeClean = `${r.startTime.substring(0, 5)} - ${r.endTime.substring(0, 5)}`

      let statusLabel = 'Beklemede'
      if (r.status === 'APPROVED') statusLabel = 'Onaylandı'
      else if (r.status === 'REJECTED') statusLabel = 'Reddedildi'

      return {
        id: `sch-res-${r.id}`,
        userId: r.username,
        category: category,
        title: isRoom ? `${r.roomName} Rezervasyonu` : `${r.roomName} ile Görüşme`,
        subtitle: `Boğaziçi Üniversitesi • Kat 1`,
        date: r.date,
        time: timeClean,
        details: r.description || 'Akademik Rezervasyon',
        image: isRoom 
          ? 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=300&h=200&fit=crop'
          : 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=faces',
        status: statusLabel
      }
    })

    return NextResponse.json(mappedBookings)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read bookings' }, { status: 500 })
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
    
    const timeParts = (body.time || '09:00 - 11:00').split(' - ')
    const startTime = timeParts[0] ? `${timeParts[0].trim()}:00` : '09:00:00'
    const endTime = timeParts[1] ? `${timeParts[1].trim()}:00` : '11:00:00'

    const payload = {
      roomId,
      date: parsedDate,
      startTime,
      endTime,
      description: body.details || 'Kütüphane / Derslik Rezervasyonu'
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

    return NextResponse.json({
      id: `sch-res-${javaRes.id}`,
      status: 'Onaylandı',
      ...body
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
  }
}
