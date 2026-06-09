import { NextResponse } from 'next/server'
import { readDb, writeDb } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const chatWith = searchParams.get('chatWith')

    if (!userId) {
      return NextResponse.json({ error: 'Kullanıcı kimliği (userId) gereklidir.' }, { status: 400 })
    }

    const db = readDb()
    const messages = db.messages || []
    const users = db.users || []
    const bookings = db.bookings || []

    // If fetching a specific conversation thread
    if (chatWith) {
      const thread = messages.filter(
        (m: any) =>
          (m.senderId === userId && m.receiverId === chatWith) ||
          (m.senderId === chatWith && m.receiverId === userId)
      )
      return NextResponse.json(thread)
    }

    // Otherwise, return all messages and the contact list
    const userMessages = messages.filter((m: any) => m.senderId === userId || m.receiverId === userId)

    // Compile contact list
    // 1. Gather contact IDs from messages
    const contactIds = new Set<string>()
    userMessages.forEach((m: any) => {
      if (m.senderId !== userId) contactIds.add(m.senderId)
      if (m.receiverId !== userId) contactIds.add(m.receiverId)
    })

    // 2. Gather contact IDs from appointments/bookings
    const currentUser = users.find((u: any) => u.id === userId)
    if (currentUser) {
      if (currentUser.role === 'customer') {
        // Find academicians they have bookings with
        bookings.forEach((b: any) => {
          if (b.userId === userId) {
            // Find academician in db.academicians to get their email
            const acadRecord = db.academicians?.find((a: any) => a.id === b.academicianId)
            const acadEmail = acadRecord ? acadRecord.email : 'business@rezervo.com'
            // Find the user record with this email
            const acadUser = users.find((u: any) => u.email === acadEmail)
            if (acadUser) contactIds.add(acadUser.id)
          }
        })
      } else if (currentUser.role === 'business') {
        // Find students they have bookings with
        bookings.forEach((b: any) => {
          // Find student in users by email
          const studUser = users.find((u: any) => u.email === b.studentEmail || u.id === b.userId)
          if (studUser) contactIds.add(studUser.id)
        })
      }
    }

    // Always include standard u-student/u-academician for immediate availability in sandbox if no bookings exist
    if (currentUser?.role === 'customer') {
      contactIds.add('u-academician')
    } else if (currentUser?.role === 'business') {
      contactIds.add('u-student')
    }

    // Explicitly delete userId from contactIds to prevent self-chat listing
    contactIds.delete(userId)

    // Hydrate contacts details
    const contactList = Array.from(contactIds)
      .map((id) => {
        const u = users.find((usr: any) => usr.id === id)
        if (!u) return null
        // Find last message
        const lastMsg = [...userMessages]
          .reverse()
          .find((m: any) => m.senderId === id || m.receiverId === id)

        return {
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          avatar: u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
          lastMessage: lastMsg ? lastMsg.content : 'Henüz mesajlaşma yok.',
          lastMessageTime: lastMsg ? lastMsg.timestamp : ''
        }
      })
      .filter(Boolean)

    return NextResponse.json({
      messages: userMessages,
      contacts: contactList
    })
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

    const db = readDb()
    if (!db.messages) db.messages = []
    if (!db.notifications) db.notifications = []

    const sender = db.users.find((u: any) => u.id === senderId)
    const receiver = db.users.find((u: any) => u.id === receiverId)

    if (!sender || !receiver) {
      return NextResponse.json({ error: 'Gönderici veya alıcı bulunamadı.' }, { status: 404 })
    }

    const timestamp = new Date().toLocaleString('tr-TR', {
      day: 'numeric',
      month: 'long',
      weekday: 'long',
      hour: '2-digit',
      minute: '2-digit'
    })

    const newMsg: any = {
      id: 'msg-' + Math.random().toString(36).substr(2, 9),
      senderId,
      receiverId,
      content,
      timestamp
    }

    db.messages.push(newMsg)

    // Trigger Notification for the receiver
    const newNotif = {
      id: 'notif-' + Math.random().toString(36).substr(2, 9),
      userId: receiverId,
      role: receiver.role,
      title: 'Yeni Mesaj',
      desc: `${sender.name}: ${content.length > 40 ? content.substring(0, 37) + '...' : content}`,
      time: 'Şimdi',
      unread: true
    }
    db.notifications.unshift(newNotif)

    // AI Chatbot Assistant Integration
    // If receiver is an academician (business role) and has active AI mode
    const receiverAcad = db.academicians?.find((a: any) => a.email === receiver.email)
    const isAiActive = receiverAcad ? receiverAcad.aiAssistantActive : false

    if (receiver.role === 'business' && isAiActive) {
      const text = content.toLowerCase()
      let replyContent = ''
      
      const isUrgentOrCritical = /(not|sınav|itiraz|puan|grade|tez|makale|onay|imza|yayın|kayıt|ders seçimi|transkript|harf notu|vize|final)/i.test(text)
      const isOfficeOrRoom = /(oda|ofis|nerede|yer|konum|kat|nası|ulaş|bina|kampüs)/i.test(text)
      const isHoursOrSchedule = /(saat|zaman|randevu|görüşme|müsait|boş|ne zaman)/i.test(text)
      const isGreeting = /(merhaba|selam|iyi günler|hocam|saygılar)/i.test(text)

      const profTitleName = receiverAcad ? `${receiverAcad.title} ${receiverAcad.name}` : receiver.name
      
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

      const aiMsgId = 'msg-' + Math.random().toString(36).substr(2, 9)
      const aiTimestamp = new Date().toLocaleString('tr-TR', {
        day: 'numeric',
        month: 'long',
        weekday: 'long',
        hour: '2-digit',
        minute: '2-digit'
      })

      const aiMsg = {
        id: aiMsgId,
        senderId: receiverId, // Sent by academician
        receiverId: senderId, // Received by student
        content: replyContent,
        timestamp: aiTimestamp,
        isAI: true
      }

      db.messages.push(aiMsg)

      // Add notification for the student
      const aiNotif = {
        id: 'notif-' + Math.random().toString(36).substr(2, 9),
        userId: senderId,
        role: sender.role,
        title: 'Yapay Zeka Asistanı',
        desc: `${receiver.name} (AI): ${replyContent.length > 40 ? replyContent.substring(0, 37) + '...' : replyContent}`,
        time: 'Şimdi',
        unread: true
      }
      db.notifications.unshift(aiNotif)
    }

    writeDb(db)

    return NextResponse.json(newMsg)
  } catch (error) {
    return NextResponse.json({ error: 'Mesaj gönderilirken hata oluştu.' }, { status: 500 })
  }
}
