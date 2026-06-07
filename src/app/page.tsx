import type { Metadata } from 'next'
import { Navbar } from '@/components/common/Navbar'
import { HeroSection } from '@/features/landing/components/HeroSection'
import { FeaturesSection } from '@/features/landing/components/FeaturesSection'
import { ServicesSection } from '@/features/landing/components/ServicesSection'
import { StatsSection } from '@/features/landing/components/StatsSection'
import { TestimonialsSection } from '@/features/landing/components/TestimonialsSection'
import { FaqSection } from '@/features/landing/components/FaqSection'
import { NewsletterSection } from '@/features/landing/components/NewsletterSection'
import { Footer } from '@/components/common/Footer'

export const metadata: Metadata = {
  title: 'Rezervo — Üniversite Akademik Danışmanlık ve Randevu Sistemi',
  description:
    'Öğrenciler ve akademisyenler için hızlı, kolay ve güvenilir görüşme randevusu yönetim portalı.',
}

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <ServicesSection />
        <StatsSection />
        <TestimonialsSection />
        <FaqSection />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  )
}

