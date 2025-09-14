"use client";

import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { Button } from '@/components/ui/button'
import { Sparkles, Star, Gem } from 'lucide-react'
import Image from 'next/image'
import type { Page, Category } from '@/types'

interface HeroProps {
  onNavigate?: (page: Page, category?: Category) => void
}

const heroTexts = [
  {
    title: "Zamanın Işığında",
    subtitle: "Her parça özenle seçilmiş, el yapımı mücevherler ile stilinizi tamamlayın. Modern tasarımın zarafeti ile geleneksel ustalığın buluştuğu yer."
  },
  {
    title: "Işıltının Dansı",
    subtitle: "Işığın her açısında farklı bir güzellik sunan özel tasarım mücevherler. Sizin için özenle yaratılmış eşsiz koleksiyonlar."
  },
  {
    title: "Sanatın Kaynağı",
    subtitle: "El yapımı mücevherlerin büyüsü ile tanışın. Her parça, ustalarımızın deneyimi ve sanatsal vizyonuyla hayat buluyor."
  }
]

export function Hero({ onNavigate }: HeroProps) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 300], [0, 100])
  const opacity = useTransform(scrollY, [0, 300], [1, 0.3])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % heroTexts.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const currentText = heroTexts[currentTextIndex]

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Parallax Background */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ y }}
      >
        <Image
          src="https://images.unsplash.com/photo-1652340155016-e3c66dcba7f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBqZXdlbHJ5JTIwcmluZ3MlMjBuZWNrbGFjZXxlbnwxfHx8fDE3NTc4NTk2MzB8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Luxury Jewelry Collection"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/30 to-yellow-900/40"></div>
      </motion.div>

      {/* Floating Elements */}
      <div className="absolute inset-0 z-5 pointer-events-none">
        <motion.div
          className="absolute top-20 left-20 text-yellow-400/30"
          animate={{ 
            y: [-10, 10, -10],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Sparkles size={32} />
        </motion.div>
        
        <motion.div
          className="absolute top-40 right-32 text-yellow-400/30"
          animate={{ 
            y: [10, -10, 10],
            rotate: [0, -5, 5, 0]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        >
          <Star size={28} />
        </motion.div>

        <motion.div
          className="absolute bottom-32 left-1/4 text-yellow-400/30"
          animate={{ 
            y: [-5, 15, -5],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ 
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        >
          <Gem size={30} />
        </motion.div>
      </div>

      {/* Main Content */}
      <motion.div 
        className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto"
        style={{ opacity }}
      >
        <motion.div
          key={currentTextIndex}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl mb-6 tracking-tight font-bold"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.span
              className="block text-transparent text-yellow-600"
              style={{
                backgroundSize: '200% 200%',
              }}
            >
              {currentText.title}
            </motion.span>
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl mb-8 text-gray-200 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            {currentText.subtitle}
          </motion.p>
        </motion.div>

        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              size="lg" 
              className="relative overflow-hidden bg-yellow-600 hover:bg-yellow-700 px-8 py-4 text-lg font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
              onClick={() => onNavigate?.('category', 'collections')}
            >
              <span className="relative z-10">Koleksiyonu Keşfet</span>
              <motion.div
                className="absolute inset-0 bg-white/20"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
              />
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              variant="outline" 
              size="lg" 
              className="border-2 border-white/50 text-white hover:bg-white hover:text-gray-900 px-8 py-4 text-lg font-medium rounded-full backdrop-blur-sm bg-white/10 transition-all duration-300 hover:shadow-lg"
              onClick={() => onNavigate?.('category', 'collections')}
            >
              Özel Tasarım
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Background Pattern Overlay */}
      <div className="absolute inset-0 z-1 opacity-5">
        <div className="absolute inset-0" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>
    </section>
  )
}
