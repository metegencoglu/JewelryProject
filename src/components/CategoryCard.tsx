"use client";

import Image from 'next/image'
import { ArrowRight, Sparkles, TrendingUp, Star } from 'lucide-react'

interface CategoryCardProps {
  name: string
  image: string
  productCount: number
  onClick: () => void
  isHovered: boolean
  size?: 'small' | 'medium' | 'large'
  badge?: string
}

export function CategoryCard({ 
  name, 
  image, 
  productCount, 
  onClick, 
  isHovered,
  size = 'medium',
  badge
}: CategoryCardProps) {
  const getBadgeIcon = (badgeText: string) => {
    switch (badgeText) {
      case 'Popüler':
        return <TrendingUp className="w-3 h-3" />
      case 'Yeni':
        return <Sparkles className="w-3 h-3" />
      case 'Trend':
        return <Star className="w-3 h-3" />
      default:
        return <Sparkles className="w-3 h-3" />
    }
  }

  const getBadgeColor = (badgeText: string) => {
    switch (badgeText) {
      case 'Popüler':
        return 'bg-yellow-500 text-white shadow-lg'
      case 'Yeni':
        return 'bg-yellow-600 text-white shadow-lg'
      case 'Trend':
        return 'bg-amber-500 text-white shadow-lg'
      default:
        return 'bg-yellow-600 text-white shadow-lg'
    }
  }

  return (
    <button 
      onClick={onClick}
      className={`group relative block overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 w-full h-full ${
        isHovered ? 'scale-102' : ''
      }`}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <div className={`w-full h-full transition-transform duration-500 ${isHovered ? 'scale-110' : ''}`}>
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
          />
        </div>
        
        {/* Multi-layered Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        <div className={`absolute inset-0 bg-gradient-to-br from-yellow-600/20 to-amber-500/20 transition-opacity duration-500 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}></div>
        
        {/* Badge */}
        {badge && (
          <div className="absolute top-4 left-4">
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getBadgeColor(badge)} animate-pulse`}>
              {getBadgeIcon(badge)}
              <span>{badge}</span>
            </span>
          </div>
        )}

        {/* Floating Sparkle Effects */}
        <div className={`absolute top-6 right-6 text-white/30 transition-all duration-500 ${
          isHovered ? 'scale-150 opacity-80' : 'opacity-30'
        }`}>
          <Sparkles size={20} />
        </div>

        {/* Shimmer Effect */}
        <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 ${
          isHovered ? 'translate-x-full' : '-translate-x-full'
        }`} />

        {/* Animated Border Glow */}
        <div className={`absolute inset-0 rounded-2xl transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`} 
        style={{
          background: 'linear-gradient(45deg, transparent, rgba(234, 179, 8, 0.5), transparent, rgba(245, 158, 11, 0.5), transparent)',
          backgroundSize: '300% 300%',
          animation: isHovered ? 'gradient-shift 3s ease-in-out infinite' : 'none'
        }} />
      </div>
      
      {/* Content Section */}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <div className={`flex items-center justify-between mb-2 transition-transform duration-300 ${
          isHovered ? 'translate-x-1' : ''
        }`}>
          <h3 className={`${
            size === 'large' ? 'text-2xl md:text-3xl' :
            size === 'medium' ? 'text-xl md:text-2xl' :
            'text-lg md:text-xl'
          } font-medium mb-1`}>
            {name}
          </h3>
          
          <div className={`transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-x-1' : 'opacity-0'
          }`}>
            <ArrowRight className="w-5 h-5" />
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-200">
            <span className="font-medium">{productCount}</span> ürün
          </p>
          
          <div className={`transition-all duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Progress Bar Animation */}
        <div className="mt-3 h-1 bg-white/20 rounded-full overflow-hidden">
          <div className={`h-full bg-gradient-to-r from-yellow-400 to-amber-400 rounded-full transition-all duration-800 ${
            isHovered ? 'w-full' : 'w-3/5'
          }`} />
        </div>
      </div>

      {/* Interactive Highlight Effect */}
      <div className={`absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300 ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
      }} />

      {/* 3D Depth Shadow */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300"
        style={{
          background: 'linear-gradient(135deg, rgba(0,0,0,0.1) 0%, transparent 50%, rgba(255,255,255,0.1) 100%)',
          opacity: isHovered ? 0.5 : 0,
        }}
      />
    </button>
  )
}