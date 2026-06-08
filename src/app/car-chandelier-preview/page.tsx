'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Play, Pause, Sparkles, Shield, ChevronRight, HelpCircle } from 'lucide-react'
import Link from 'next/link'

const IMAGES = [
  {
    src: '/car-chandelier-1.jpg',
    title: 'Porsche 911 Crystal Chandelier Edition',
    subtitle: 'Kristal avize taşlarıyla kaplı, tavan askı düzeneği ve dikey kristal hatları ile premium aydınlatma.'
  },
  {
    src: '/car-chandelier-2.jpg',
    title: 'Porsche 911 Industrial Chains Edition',
    subtitle: 'Ağır çelik zincirlerle tavandan asılı, aktif far aydınlatmalı, endüstriyel beton mimari konsept.'
  }
]

export default function CarChandelierPreviewPage() {
  const [index, setIndex] = useState(0)
  const [isLooping, setIsLooping] = useState(true)

  useEffect(() => {
    if (!isLooping) return
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % IMAGES.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [isLooping])

  return (
    <div className="relative min-h-screen bg-slate-950 text-white overflow-hidden flex flex-col justify-between font-sans">
      
      {/* ── Background Grid & Glowing Neon Lights ── */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35" />
      
      <div className="absolute top-[-10%] left-[10%] w-[30rem] h-[30rem] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-[-10%] right-[10%] w-[30rem] h-[30rem] rounded-full bg-amber-500/10 blur-[120px] pointer-events-none" />

      {/* ── Header ── */}
      <header className="relative z-10 px-6 py-4 flex items-center justify-between border-b border-white/5 bg-slate-950/80 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Ana Sayfaya Dön
        </Link>
        <div className="text-center">
          <h1 className="text-sm font-extrabold tracking-wider uppercase bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">
            Car Chandelier Preview
          </h1>
          <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Tavandan Asılı Araba Avize Konsept Önizlemesi</p>
        </div>
        <div className="w-24 flex justify-end">
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </header>

      {/* ── Main Canvas View ── */}
      <main className="relative flex-1 flex flex-col items-center justify-center p-6 lg:p-12">
        <div className="relative w-full max-w-5xl aspect-[16/9] rounded-3xl overflow-hidden border border-white/10 bg-slate-900/40 shadow-2xl shadow-black/80 flex items-center justify-center">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
              className="absolute inset-0 w-full h-full flex items-center justify-center"
            >
              {/* Floating Container */}
              <motion.div
                animate={{
                  y: [0, -12, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-full h-full relative"
              >
                {/* Image */}
                <img
                  src={IMAGES[index].src}
                  alt={IMAGES[index].title}
                  className="w-full h-full object-cover"
                />

                {/* Ambient Shadow Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Interactive Info Overlay */}
          <div className="absolute bottom-6 left-6 right-6 z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-950/80 backdrop-blur-md rounded-2xl p-4 border border-white/5">
            <div className="space-y-1">
              <h2 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                {index === 0 ? <Sparkles className="h-4 w-4 text-amber-400" /> : <Shield className="h-4 w-4 text-blue-400" />}
                {IMAGES[index].title}
              </h2>
              <p className="text-[11px] text-slate-400 leading-normal max-w-xl">
                {IMAGES[index].subtitle}
              </p>
            </div>
            
            {/* Index indicator */}
            <div className="flex gap-1">
              {IMAGES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`h-1.5 rounded-full transition-all ${index === i ? 'w-6 bg-amber-400' : 'w-2 bg-white/20'}`}
                />
              ))}
            </div>
          </div>

        </div>
      </main>

      {/* ── Control Bar ── */}
      <footer className="relative z-10 px-6 py-6 border-t border-white/5 bg-slate-950/90 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Toggle play/pause */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsLooping(!isLooping)}
            className="flex items-center gap-2 rounded-xl bg-white/5 hover:bg-white/10 px-4 py-2.5 text-xs font-bold transition-all border border-white/15 cursor-pointer"
          >
            {isLooping ? <Pause className="h-4 w-4 text-amber-400" /> : <Play className="h-4 w-4 text-emerald-400" />}
            <span>{isLooping ? 'Döngüyü Duraklat' : 'Döngüyü Başlat'}</span>
          </button>
          
          <button
            onClick={() => setIndex((index + 1) % IMAGES.length)}
            className="flex items-center gap-1 rounded-xl bg-white text-slate-950 hover:bg-slate-200 px-4 py-2.5 text-xs font-bold transition-all cursor-pointer"
          >
            <span>Sıradaki Konsept</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Informative text */}
        <div className="flex items-center gap-2 text-slate-500 text-[10px] font-semibold max-w-md text-center md:text-right">
          <HelpCircle className="h-4 w-4 shrink-0 text-slate-600" />
          <span>Framer Motion & CSS Salınım (floating) keyframe animasyonları kullanılarak hazırlanmış interaktif önizleme.</span>
        </div>

      </footer>

    </div>
  )
}
