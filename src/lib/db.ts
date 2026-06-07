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
        id: 'u-business',
        name: 'Mehmet Demir',
        email: 'business@rezervo.com',
        password: 'business123',
        role: 'business',
        status: 'aktif'
      },
      {
        id: 'u-customer',
        name: 'Ahmet Yılmaz',
        email: 'customer@rezervo.com',
        password: 'customer123',
        role: 'customer',
        status: 'aktif'
      }
    ],
    bookings: [
      {
        id: 'res-1',
        userId: 'u-customer',
        category: 'hotel',
        title: 'Grand Deluxe Resort',
        subtitle: 'Antalya, Türkiye',
        date: '15 Haziran 2026',
        time: '5 Gece',
        details: 'Her Şey Dahil Ultra • 2 Yetişkin',
        status: 'Onaylandı',
        statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-100',
        image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=300&h=200&fit=crop',
        price: '12.500 TL'
      },
      {
        id: 'res-2',
        userId: 'u-customer',
        category: 'flight',
        title: 'İstanbul (IST) - Londra (LHR)',
        subtitle: 'Türk Hava Yolları • TK1979',
        date: '22 Haziran 2026',
        time: '13:00',
        details: 'Ekonomi Sınıfı • 1 Yolcu',
        status: 'Onaylandı',
        statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-100',
        image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=300&h=200&fit=crop',
        price: '4.200 TL'
      },
      {
        id: 'sch-res-1',
        userId: 'u-customer',
        category: 'teacher',
        title: 'Ahmet Yılmaz ile Görüşme',
        subtitle: 'Matematik Zümre Odası',
        date: '08 Haziran 2026',
        time: '09:30',
        details: 'Matematik Dersi Yazılı Sınav Değerlendirmesi • Öğrenci No: 1420',
        status: 'Onaylandı',
        statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-100',
        image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=200&h=150&fit=crop',
        price: 'Ücretsiz'
      },
      {
        id: 'sch-res-2',
        userId: 'u-customer',
        category: 'library',
        title: 'Oda 101 (Grup Çalışma)',
        subtitle: 'Kat 1, Doğu Kanadı',
        date: '10 Haziran 2026',
        time: '14:00 - 16:00',
        details: 'Proje Sunumu Ön Hazırlığı • 6 Kişi',
        status: 'Onaylandı',
        statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-100',
        image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=200&h=150&fit=crop',
        price: 'Ücretsiz'
      }
    ]
  }

  // Force overwrite or write if not exists
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2), 'utf-8')
  } else {
    // Merge or verify users & bookings key exist
    try {
      const current = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'))
      if (!current.users || !current.bookings) {
        fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2), 'utf-8')
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
