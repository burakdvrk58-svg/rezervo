import fs from 'fs'
import path from 'path'

// On Vercel / Serverless environments, write to /tmp to avoid EROFS (Read-only file system)
const isServerless = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1'
const DB_FILE = isServerless
  ? path.join('/tmp', 'db.json')
  : path.join(process.cwd(), 'src/data/db.json')

// Helper to ensure database file exists with initial mock data
function ensureDb() {
  const dir = path.dirname(DB_FILE)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  const defaultData = {
    users: [
      {
        id: 'u-admin',
        name: 'Can Ertekin',
        email: 'admin@rezervo.com',
        password: 'admin123',
        role: 'admin',
        status: 'aktif'
      },
      {
        id: 'u-academician',
        name: 'Prof. Dr. Albert Ali Salah',
        email: 'business@rezervo.com',
        password: 'business123',
        role: 'business',
        status: 'aktif',
        universityId: 'univ-1',
        department: 'Bilgisayar Mühendisliği',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=faces'
      },
      {
        id: 'u-student',
        name: 'Ahmet Yılmaz',
        email: 'customer@rezervo.com',
        password: 'customer123',
        role: 'customer',
        status: 'aktif',
        studentNo: '1420',
        universityId: 'univ-2'
      }
    ],
    universities: [
      { id: 'univ-1', name: 'Boğaziçi Üniversitesi', shortName: 'BOUN', logo: '🎓' },
      { id: 'univ-2', name: 'Orta Doğu Teknik Üniversitesi', shortName: 'ODTÜ', logo: '🔬' },
      { id: 'univ-3', name: 'İstanbul Teknik Üniversitesi', shortName: 'İTÜ', logo: '⚙️' },
      { id: 'univ-4', name: 'Koç Üniversitesi', shortName: 'KU', logo: '🏛️' },
      { id: 'univ-5', name: 'Bilkent Üniversitesi', shortName: 'BİLKENT', logo: '📚' }
    ],
    academicians: [
      {
        id: 'acad-1',
        name: 'Prof. Dr. Albert Ali Salah',
        title: 'Prof. Dr.',
        department: 'Bilgisayar Mühendisliği',
        email: 'business@rezervo.com',
        universityId: 'univ-1',
        rating: 4.9,
        reviews: 124,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
        tag: 'Yapay Zeka & Bilgisayarlı Görme',
        amenities: ['Birebir Görüşme', 'Tez Danışmanlığı', '15 Dk Görüşme'],
        slots: ['09:00 - 09:15', '09:15 - 09:30', '09:30 - 09:45', '10:00 - 10:15', '10:15 - 10:30', '10:30 - 10:45', '11:00 - 11:15', '11:15 - 11:30'],
        aiAssistantActive: false
      },
      {
        id: 'acad-2',
        name: 'Doç. Dr. Ayşe Bener',
        title: 'Doç. Dr.',
        department: 'Yazılım Mühendisliği',
        email: 'ayse.bener@boun.edu.tr',
        universityId: 'univ-1',
        rating: 4.8,
        reviews: 95,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
        tag: 'Yazılım Kalitesi & Empirik Analiz',
        amenities: ['Proje Danışmanlığı', '15 Dk Görüşme'],
        slots: ['14:00 - 14:15', '14:15 - 14:30', '14:30 - 14:45', '15:00 - 15:15']
      },
      {
        id: 'acad-3',
        name: 'Prof. Dr. Kemal Oflazer',
        title: 'Prof. Dr.',
        department: 'Bilgisayar Mühendisliği',
        email: 'kemal.oflazer@metu.edu.tr',
        universityId: 'univ-2',
        rating: 4.9,
        reviews: 140,
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces',
        tag: 'Doğal Dil İşleme',
        amenities: ['Tez Danışmanlığı', 'Yapay Zeka', '15 Dk Görüşme'],
        slots: ['10:00 - 10:15', '10:15 - 10:30', '10:30 - 10:45', '11:00 - 11:15', '11:15 - 11:30']
      },
      {
        id: 'acad-4',
        name: 'Dr. Öğr. Üyesi Halhal Öztürk',
        title: 'Dr. Öğr. Üyesi',
        department: 'Matematik',
        email: 'halhal.ozturk@metu.edu.tr',
        universityId: 'univ-2',
        rating: 4.7,
        reviews: 64,
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces',
        tag: 'Soyut Cebir & Analiz',
        amenities: ['Soru Çözümü & Destek', '15 Dk Görüşme'],
        slots: ['09:00 - 09:15', '09:15 - 09:30', '09:30 - 09:45']
      },
      {
        id: 'acad-5',
        name: 'Prof. Dr. Eşref Adalı',
        title: 'Prof. Dr.',
        department: 'Bilgisayar Mühendisliği',
        email: 'eadali@itu.edu.tr',
        universityId: 'univ-3',
        rating: 4.9,
        reviews: 180,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces',
        tag: 'Bilgisayar Mimarisi & Türkçe İşleme',
        amenities: ['15 Dk Görüşme', 'Birebir Görüşme'],
        slots: ['13:00 - 13:15', '13:15 - 13:30', '13:30 - 13:45', '14:00 - 14:15']
      },
      {
        id: 'acad-6',
        name: 'Doç. Dr. Gözde Şensoy',
        title: 'Doç. Dr.',
        department: 'Endüstri Mühendisliği',
        email: 'gozde.sensoy@itu.edu.tr',
        universityId: 'univ-3',
        rating: 4.8,
        reviews: 75,
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=faces',
        tag: 'Yöneylem Araştırması & Karar Verme',
        amenities: ['Staj Danışmanlığı', '15 Dk Görüşme'],
        slots: ['10:00 - 10:15', '10:15 - 10:30', '10:30 - 10:45']
      },
      {
        id: 'acad-7',
        name: 'Prof. Dr. Attila Gürsoy',
        title: 'Prof. Dr.',
        department: 'Bilgisayar Mühendisliği',
        email: 'agursoy@ku.edu.tr',
        universityId: 'univ-4',
        rating: 4.9,
        reviews: 110,
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=faces',
        tag: 'Biyoenformatik & Paralel Sistemler',
        amenities: ['Tez Danışmanlığı', '15 Dk Görüşme'],
        slots: ['15:00 - 15:15', '15:15 - 15:30', '15:30 - 15:45']
      },
      {
        id: 'acad-8',
        name: 'Doç. Dr. Deniz Yuret',
        title: 'Doç. Dr.',
        department: 'Bilgisayar Mühendisliği',
        email: 'dyuret@ku.edu.tr',
        universityId: 'univ-4',
        rating: 5.0,
        reviews: 154,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
        tag: 'Knet & Derin Öğrenme Frameworkleri',
        amenities: ['Derin Öğrenme', 'Yapay Zeka', '15 Dk Görüşme'],
        slots: ['09:30 - 09:45', '09:45 - 10:00', '10:00 - 10:15', '10:15 - 10:30']
      },
      {
        id: 'acad-9',
        name: 'Prof. Dr. Özcan Öztürk',
        title: 'Prof. Dr.',
        department: 'Bilgisayar Mühendisliği',
        email: 'ozturk@bilkent.edu.tr',
        universityId: 'univ-5',
        rating: 4.9,
        reviews: 115,
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces',
        tag: 'Gömülü Sistemler & Derleyiciler',
        amenities: ['Tez Danışmanlığı', '15 Dk Görüşme'],
        slots: ['10:30 - 10:45', '10:45 - 11:00', '11:00 - 11:15']
      },
      {
        id: 'acad-10',
        name: 'Doç. Dr. Eray Tüzün',
        title: 'Doç. Dr.',
        department: 'Bilgisayar Mühendisliği',
        email: 'tuzun@bilkent.edu.tr',
        universityId: 'univ-5',
        rating: 4.8,
        reviews: 90,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces',
        tag: 'Ampirik Yazılım Mühendisliği & Oyun Tasarımı',
        amenities: ['Oyun Geliştirme', '15 Dk Görüşme', 'Staj Danışmanlığı'],
        slots: ['14:00 - 14:15', '14:15 - 14:30', '14:30 - 14:45', '14:45 - 15:00']
      }
    ],
    bookings: [
      {
        id: 'res-1',
        userId: 'u-student',
        studentName: 'Ahmet Yılmaz',
        studentNo: '1420',
        studentEmail: 'customer@rezervo.com',
        category: 'teacher',
        academicianId: 'acad-1',
        academicianName: 'Prof. Dr. Albert Ali Salah',
        universityId: 'univ-1',
        universityName: 'Boğaziçi Üniversitesi',
        title: 'Prof. Dr. Albert Ali Salah ile Görüşme',
        subtitle: 'Boğaziçi Üniversitesi',
        date: '08 Haziran Pazartesi',
        time: '09:00 - 09:15',
        details: 'Bitirme Projesi Detayları ve Yapay Zeka Modelleri',
        status: 'Onaylandı',
        statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-100',
        image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=faces',
        price: 'Ücretsiz'
      },
      {
        id: 'res-2',
        userId: 'u-student',
        studentName: 'Ahmet Yılmaz',
        studentNo: '1420',
        studentEmail: 'customer@rezervo.com',
        category: 'teacher',
        academicianId: 'acad-3',
        academicianName: 'Prof. Dr. Kemal Oflazer',
        universityId: 'univ-2',
        universityName: 'Orta Doğu Teknik Üniversitesi',
        title: 'Prof. Dr. Kemal Oflazer ile Görüşme',
        subtitle: 'Orta Doğu Teknik Üniversitesi',
        date: '10 Haziran Çarşamba',
        time: '10:15 - 10:30',
        details: 'Doğal Dil İşleme Tez Konusu Belirleme',
        status: 'Beklemede',
        statusColor: 'text-amber-700 bg-amber-50 border-amber-100',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces',
        price: 'Ücretsiz'
      }
    ],
    messages: [
      {
        id: 'msg-1',
        senderId: 'u-student',
        receiverId: 'u-academician',
        content: 'Merhabalar Albert hocam, proje raporunu size e-posta üzerinden ilettim. Randevu saatimizde inceleyebilir miyiz?',
        timestamp: '08 Haziran Pazartesi, 14:20'
      },
      {
        id: 'msg-2',
        senderId: 'u-academician',
        receiverId: 'u-student',
        content: 'Selam Ahmet. Raporu aldım ve göz gezdirdim. Görüşmede detayları tartışırız, hazır gel.',
        timestamp: '08 Haziran Pazartesi, 15:45'
      }
    ],
    notifications: [
      {
        id: 'notif-1',
        userId: 'u-academician',
        role: 'business',
        title: 'Yeni İstek',
        desc: 'Ahmet Yılmaz bitirme projesi için randevu talebi gönderdi.',
        time: '3s önce',
        unread: true
      },
      {
        id: 'notif-2',
        userId: 'u-student',
        role: 'customer',
        title: 'Randevu Onaylandı',
        desc: 'Prof. Dr. Albert Ali Salah randevunuzu onayladı.',
        time: '1s önce',
        unread: true
      }
    ]
  }

  // Force overwrite or write if not exists
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2), 'utf-8')
  } else {
    // Merge or verify users & bookings & universities key exist
    try {
      const current = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'))
      let modified = false
      if (!current.users || !current.bookings || !current.universities) {
        fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2), 'utf-8')
      } else {
        if (!current.messages) {
          current.messages = defaultData.messages
          modified = true
        }
        if (!current.notifications) {
          current.notifications = defaultData.notifications
          modified = true
        }
        if (!current.academicians) {
          current.academicians = defaultData.academicians
          modified = true
        } else {
          current.academicians = current.academicians.map((a: any) => {
            if (a.aiAssistantActive === undefined) {
              modified = true
              return { ...a, aiAssistantActive: false }
            }
            return a
          })
        }
        if (modified) {
          fs.writeFileSync(DB_FILE, JSON.stringify(current, null, 2), 'utf-8')
        }
      }
    } catch {
      fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2), 'utf-8')
    }
  }
}

export function readDb() {
  ensureDb()
  const data = fs.readFileSync(DB_FILE, 'utf-8')
  return JSON.parse(data)
}

export function writeDb(data: any) {
  ensureDb()
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8')
}
