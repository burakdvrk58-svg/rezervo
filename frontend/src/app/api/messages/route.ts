import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { readDb } from '@/lib/db'
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8081'


export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const chatWith = searchParams.get('chatWith')

    if (!userId) {
      return NextResponse.json({ error: 'Kullanıcı kimliği (userId) gereklidir.' }, { status: 400 })
    }

    const cookieStore = await cookies()
    const token = cookieStore.get('rezervo_access_token')?.value

    let url = `${BACKEND_URL}/api/messages?userId=${userId}`
    if (chatWith) {
      url += `&chatWith=${chatWith}`
    }

    const headers: Record<string, string> = {}
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const res = await fetch(url, { headers })

    if (!res.ok) {
      return NextResponse.json({ error: 'Spring Boot mesajları yükleyemedi.' }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Mesajlar alınırken hata oluştu.' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { senderId, receiverId, content } = await request.json()

    if (!senderId || !receiverId || !content) {
      return NextResponse.json({ error: 'Eksik mesaj parametreleri.' }, { status: 400 })
    }

    const cookieStore = await cookies()
    const token = cookieStore.get('rezervo_access_token')?.value
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    // 1. Post student's/sender's message to Spring Boot
    const res = await fetch(`${BACKEND_URL}/api/messages`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        senderId,
        receiverId,
        content,
        isAI: false
      })
    })

    if (!res.ok) {
      const errorText = await res.text()
      return NextResponse.json({ error: errorText || 'Mesaj gönderilemedi.' }, { status: res.status })
    }

    const savedMsg = await res.json()

    // 2. AI Chatbot Assistant Integration
    // Check if receiver has AI mode active (using db.json)
    const db = readDb()
    const receiverIsAcademician = receiverId === 'u-academician' || receiverId === 'business' || receiverId.startsWith('acad-')
    
    let isAiActive = false
    let receiverAcadName = 'Prof. Dr. Albert Ali Salah'
    let receiverAcadTitle = 'Prof. Dr.'
    
    if (receiverIsAcademician) {
      const receiverAcad = db.academicians?.find((a: any) => a.id === receiverId || a.email === 'business@rezervo.com')
      if (receiverAcad) {
        isAiActive = !!receiverAcad.aiAssistantActive
        receiverAcadName = receiverAcad.name
        receiverAcadTitle = receiverAcad.title || 'Prof. Dr.'
      } else {
        // Fallback for Albert Ali Salah if acad-1
        const albert = db.academicians?.[0]
        if (albert) {
          isAiActive = !!albert.aiAssistantActive
        }
      }
    }

    if (receiverIsAcademician && isAiActive) {
      const text = content.toLowerCase()
      let replyContent = ''
      
      const isUrgentOrCritical = /(not|sınav|itiraz|puan|grade|tez|makale|onay|imza|yayın|kayıt|ders seçimi|transkript|harf notu|vize|final)/i.test(text)
      const isOfficeOrRoom = /(oda|ofis|nerede|yer|konum|kat|nası|ulaş|bina|kampüs)/i.test(text)
      const isHoursOrSchedule = /(saat|zaman|randevu|görüşme|müsait|boş|ne zaman)/i.test(text)
      const isGreeting = /(merhaba|selam|iyi günler|hocam|saygılar)/i.test(text)

      const profTitleName = `${receiverAcadTitle} ${receiverAcadName}`
      
      if (isUrgentOrCritical) {
        replyContent = `Merhaba, ben ${profTitleName} hocamızın Yapay Zeka Asistanıyım. İlettiğiniz konu (not, sınav, tez veya resmi onay vb.) doğrudan akademik değerlendirme gerektirmektedir. Hocamız bu tür önemli konuları randevu saatlerinizde sizinle doğrudan görüşmek istemektedir. Lütfen paneli kullanarak uygun bir randevu saati belirleyin. Önemli sorularda lütfen hocamıza danışın.`
      } else if (isOfficeOrRoom) {
        replyContent = `Merhaba, ben ${profTitleName} hocamızın Yapay Zeka Asistanıyım. Hocamızın ofisi Boğaziçi Üniversitesi Kuzey Kampüs, ETA Binası, Bilgisayar Mühendisliği Bölümü 3. Katta yer almaktadır. Görüşmelerinizi bu konumda gerçekleştirebilirsiniz.`
      } else if (isHoursOrSchedule) {
        replyContent = `Merhaba, ben ${profTitleName} hocamızın Yapay Zeka Asistanıyım. Güncel görüşme saatleri ve müsaitlik durumu Rezervo profili üzerinde listelenmiştir. Lütfen "Görüşmelerim" veya "Akademisyen Bul" sekmesinden hocamızın profilini ziyaret ederek boş zaman dilimlerinden birine randevu oluşturun.`
      } else if (isGreeting && text.trim().split(/\s+/).length <= 4) {
        replyContent = `Merhaba! Ben ${profTitleName} hocamızın Yapay Zeka Asistanıyım. Hocamız şu an meşgul olduğu için onun adına size ben yardımcı oluyorum. Ofis konumu, randevu saatleri gibi genel konularda yardımcı olmamı ister misiniz? Not, sınav veya tez onayı gibi kritik konularda lütfen randevu alarak doğrudan hocamızla görüşün.`
      } else {
        replyContent = `Merhaba, ben ${profTitleName} hocamızın Yapay Zeka Asistanıyım. Hocamız şu anda meşgul veya ders/toplantı halinde olduğu için bu mesajı onun adına yanıtlıyorum. Genel konularda yardımcı olmamı ister misiniz? Eğer sorunuz sınav notları, ders onayları, tez değerlendirmeleri gibi kritik konulardaysa, lütfen bu konuları doğrudan randevumuzda veya e-posta yoluyla hocamızla görüşün. Önemli sorularda lütfen hocamıza danışın.`
      }

      // Post AI response message back to Spring Boot (so it's saved in the database)
      await fetch(`${BACKEND_URL}/api/messages`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          senderId: receiverId, // Sent by academician
          receiverId: senderId, // Received by student
          content: replyContent,
          isAI: true
        })
      })

      // Trigger a Spring Boot database notification for student if needed (will do this under notifications feature)
    }

    return NextResponse.json(savedMsg)
  } catch (error) {
    return NextResponse.json({ error: 'Mesaj gönderilirken hata oluştu.' }, { status: 500 })
  }
}
