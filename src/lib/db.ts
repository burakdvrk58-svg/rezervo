import fs from 'fs'
import path from 'path'

const DB_FILE = path.join(process.cwd(), 'src/data/db.json')

// Helper to ensure database file exists with initial mock data
function ensureDb() {
  const dir = path.dirname(DB_FILE)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  if (!fs.existsSync(DB_FILE)) {
    const defaultData = {
      bookings: [
        {
          id: 'sch-res-1',
          category: 'teacher',
          title: 'Ahmet Yılmaz ile Görüşme',
          subtitle: 'Matematik Zümre Odası',
          date: '08 Haziran 2026',
          time: '09:30',
          details: 'Matematik Dersi Yazılı Sınav Değerlendirmesi • Öğrenci No: 1420',
          status: 'Onaylandı',
          statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-100',
          image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=200&h=150&fit=crop'
        },
        {
          id: 'sch-res-2',
          category: 'library',
          title: 'Oda 101 (Grup Çalışma)',
          subtitle: 'Kat 1, Doğu Kanadı',
          date: '10 Haziran 2026',
          time: '14:00 - 16:00',
          details: 'Proje Sunumu Ön Hazırlığı • 6 Kişi',
          status: 'Onaylandı',
          statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-100',
          image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=200&h=150&fit=crop'
        }
      ]
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2), 'utf-8')
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
