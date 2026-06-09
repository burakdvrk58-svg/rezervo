<div align="center">
  <h1>🗓️ Rezervo</h1>
  <p><strong>Enterprise Reservation Management System</strong></p>
  <p>Tüm rezervasyon ihtiyaçlarınız için hızlı, kolay ve güvenilir bir platform.</p>

  <br/>

  ![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
  ![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)
  ![shadcn/ui](https://img.shields.io/badge/shadcn-ui-000000?style=for-the-badge)

</div>

---

## 📋 Proje Hakkında

**Rezervo**, otel, uçuş, araç ve etkinlik rezervasyonlarını tek platformda yönetmenizi sağlayan enterprise-grade bir rezervasyon yönetim sistemidir.

### 🎯 Roller
- **Müşteri** — Rezervasyon yap, takip et, yönet
- **İşletme** — Rezervasyon onayla, oda yönet, raporla
- **Admin** — Kullanıcı yönetimi, analizler, sistem ayarları

---

## 🛠️ Tech Stack

| Katman | Teknoloji |
|--------|-----------|
| Framework | Next.js 16 (App Router) |
| Dil | TypeScript (Strict Mode) |
| Stil | Tailwind CSS |
| UI Library | shadcn/ui |
| State | Redux Toolkit |
| Server State | TanStack Query |
| Animasyon | Framer Motion |
| Form | React Hook Form + Zod |
| HTTP | Axios |
| Charts | Recharts |
| Theme | next-themes |

---

## 🚀 Başlangıç

### Gereksinimler
- Node.js 20+
- npm 10+

### Kurulum

```bash
# Repository'yi klonla
git clone https://github.com/KULLANICI_ADIN/rezervo.git
cd rezervo

# Bağımlılıkları yükle
npm install

# Environment variables
cp .env.local.example .env.local
# .env.local dosyasını düzenle

# Geliştirme sunucusunu başlat
npm run dev
```

Uygulama **http://localhost:3000** adresinde çalışır.

---

## 📁 Proje Yapısı

```
src/
├── app/              # Next.js App Router sayfaları
├── components/       # Yeniden kullanılabilir UI bileşenleri
├── features/         # Feature-based modüller
├── layouts/          # Layout sarmalayıcılar
├── hooks/            # Custom React hooks
├── services/         # API servis katmanı
├── store/            # Redux Toolkit store
├── types/            # TypeScript tip tanımları
├── constants/        # Uygulama sabitleri
├── utils/            # Yardımcı fonksiyonlar
├── lib/              # Kütüphane konfigürasyonları
└── providers/        # React providers
```

---

## 📜 Geliştirme Komutları

```bash
npm run dev          # Geliştirme sunucusu
npm run build        # Production build
npm run lint         # ESLint kontrolü
npm run type-check   # TypeScript kontrolü
npm run format       # Prettier ile formatlama
npm run validate     # Tüm kontroller (type + lint + format)
```

---

## 🌿 Branch Stratejisi

| Branch | Açıklama |
|--------|----------|
| `main` | Production (korumalı) |
| `develop` | Entegrasyon branch |
| `feature/phase-X-name` | Feature branch'leri |

---

## 📊 Geliştirme Fazları

- ✅ **Phase 1** — Project Setup
- 🔄 **Phase 2** — Design System
- ⏳ **Phase 3** — Reusable Components
- ⏳ **Phase 4** — Landing Page
- ⏳ **Phase 5** — Authentication
- ⏳ **Phase 6** — Customer Dashboard
- ⏳ **Phase 7** — Business Dashboard
- ⏳ **Phase 8** — Admin Dashboard
- ⏳ **Phase 9** — Reservation Module
- ⏳ **Phase 10** — Notification Module
- ⏳ **Phase 11** — Analytics
- ⏳ **Phase 12** — Responsive Optimization
- ⏳ **Phase 13** — Accessibility
- ⏳ **Phase 14** — Performance Optimization
- ⏳ **Phase 15** — Production Ready

---

## 📄 Lisans

Bu proje özel lisanslıdır. Tüm haklar saklıdır.
