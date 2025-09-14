'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from './ui/button'
import { ImageWithFallback } from './figma/ImageWithFallback'
import { Clock, Sparkles, Gift, Star, ArrowRight } from 'lucide-react'

export function CampaignSection() {
  const [timeLeft, setTimeLeft] = useState({
    days: 7,
    hours: 12,
    minutes: 34,
    seconds: 56
  })

  const ref = useRef(null)

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 }
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <section className="py-20 bg-gray-50 relative overflow-hidden" ref={ref}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-400/10 rounded-full animate-pulse" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-amber-400/10 rounded-full animate-bounce" />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-yellow-400/10 rounded-full animate-spin" style={{ animationDuration: '12s' }} />
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
          {/* Content */}
          <div className="space-y-8">
            {/* Campaign Badge */}
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-600 rounded-full text-white shadow-lg hover:scale-105 transition-all duration-300 animate-pulse">
              <Gift className="w-4 h-4" />
              <span className="font-medium">Sınırlı Süre Kampanya</span>
              <Sparkles className="w-4 h-4" />
            </div>
            
            {/* Title */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl text-gray-900 leading-tight">
              Yeni Sezon 
              <span className="block text-yellow-600 animate-pulse">
                Koleksiyonu
              </span>
            </h2>
            
            {/* Description */}
            <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
              2024 bahar koleksiyonundaki tüm ürünlerde %25'e varan indirim! 
              Modern tasarımlar ve klasik zarafet bir arada. Bu fırsat kaçmaz!
            </p>

            {/* Countdown Timer */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-yellow-600" />
                <span className="text-yellow-600 font-medium">Kampanya Bitimine Kalan Süre</span>
              </div>
              
              <div className="grid grid-cols-4 gap-4">
                {[
                  { value: timeLeft.days, label: 'Gün' },
                  { value: timeLeft.hours, label: 'Saat' },
                  { value: timeLeft.minutes, label: 'Dakika' },
                  { value: timeLeft.seconds, label: 'Saniye' }
                ].map((item, index) => (
                  <div key={index} className="text-center group hover:scale-105 transition-transform">
                    <div className={`bg-yellow-600 text-white rounded-xl p-3 mb-2 text-xl font-bold ${
                      item.label === 'Saniye' ? 'animate-pulse' : ''
                    }`}>
                      {item.value.toString().padStart(2, '0')}
                    </div>
                    <div className="text-sm text-gray-600">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-yellow-600 hover:bg-yellow-700 px-8 py-4 rounded-full shadow-lg text-lg font-medium group transition-all duration-300 hover:scale-105 transform -skew-x-3 hover:skew-x-0"
              >
                <span className="flex items-center gap-2">
                  Kampanyayı İncele
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8 py-4 rounded-full border-2 border-gray-300 hover:border-yellow-500 hover:text-yellow-600 text-lg font-medium backdrop-blur-sm bg-white/50 transition-all duration-300 hover:scale-105 transform skew-x-3 hover:skew-x-0"
              >
                Koleksiyonu Gör
              </Button>
            </div>

            {/* Animated Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8">
              {[
                { value: '%25', label: 'İndirim', icon: Star },
                { value: '150+', label: 'Ürün', icon: Gift },
                { value: '7', label: 'Gün Kaldı', icon: Clock }
              ].map((stat, index) => (
                <div key={index} className="text-center group cursor-pointer hover:scale-110 transition-all duration-300">
                  <div className="flex items-center justify-center mb-2 group-hover:rotate-6 transition-transform">
                    <stat.icon className="w-6 h-6 text-yellow-600 mr-2" />
                    <div className="text-3xl text-yellow-600 font-bold">{stat.value}</div>
                  </div>
                  <div className="text-sm text-gray-600 group-hover:text-yellow-600 transition-colors">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image with 3D Effects */}
          <div className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden bg-white shadow-2xl relative hover:scale-105 transition-all duration-500 transform hover:rotate-1">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1598724168411-9ba1e003a7fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqZXdlbHJ5JTIwd29ya3Nob3AlMjBhcnRpc2FuJTIwY3JhZnRpbmd8ZW58MXx8fHwxNzU3NzQ3NTgyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="New Season Collection"
                className="object-cover"
              />
              
              {/* Overlay Effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-amber-400/20 animate-pulse" />
            </div>
            
            {/* 3D Floating Elements */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-yellow-600 rounded-full opacity-20 animate-bounce" style={{ animationDuration: '6s' }} />
            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-amber-600 rounded-full opacity-20 animate-pulse" style={{ animationDuration: '8s' }} />

            {/* Sparkle Effects */}
            <div className="absolute top-8 left-8 text-yellow-400 animate-spin" style={{ animationDuration: '4s' }}>
              <Sparkles size={24} />
            </div>

            <div className="absolute bottom-8 right-8 text-amber-400 animate-pulse">
              <Star size={20} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}