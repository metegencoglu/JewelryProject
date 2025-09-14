'use client'

import { useState } from 'react'
import { Heart, ShoppingBag, Eye, Star, RotateCw, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ImageWithFallback } from '@/components/figma/ImageWithFallback'

interface ProductCardProps {
  id: number
  name: string
  price: number
  originalPrice?: number
  image: string
  category?: string
  badge?: string
  rating?: number
  reviews?: number
  isFavorite?: boolean
  onNavigate?: (page: string, category?: any, productId?: number) => void
  viewMode?: 'grid' | 'list'
}

export function ProductCard({ 
  id, 
  name, 
  price, 
  originalPrice, 
  image, 
  category, 
  badge,
  rating,
  reviews,
  isFavorite = false,
  onNavigate,
  viewMode = 'grid'
}: ProductCardProps) {
  const [favorite, setFavorite] = useState(isFavorite)
  const [isHovered, setIsHovered] = useState(false)
  const [is360View, setIs360View] = useState(false)

  const handleNavigate = () => {
    onNavigate?.('product', undefined, id)
  }

  if (viewMode === 'list') {
    return (
      <div className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 p-4 hover:-translate-y-1">
        <div className="flex gap-4">
          <div className="relative w-32 h-32 overflow-hidden rounded-lg flex-shrink-0 hover:scale-105 transition-transform">
            <ImageWithFallback
              src={image}
              alt={name}
              className="object-cover transition-transform duration-300"
            />
            {badge && (
              <Badge className={`absolute top-2 left-2 text-xs ${
                badge === 'Yeni' ? 'bg-yellow-600 text-white' :
                badge === 'İndirim' ? 'bg-yellow-700 text-white' :
                'bg-yellow-600 text-white'
              }`}>
                {badge}
              </Badge>
            )}
          </div>
          
          <div className="flex-1 flex flex-col justify-between">
            <div>
              {category && <p className="text-sm text-gray-500 mb-1">{category}</p>}
              <h3 
                className="text-lg text-gray-900 mb-2 cursor-pointer hover:text-yellow-600 transition-colors"
                onClick={handleNavigate}
              >
                {name}
              </h3>
              {rating && (
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">({reviews})</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl text-gray-900">
                  ₺{price.toLocaleString('tr-TR')}
                </span>
                {originalPrice && originalPrice > price && (
                  <span className="text-sm text-gray-500 line-through">
                    ₺{originalPrice.toLocaleString('tr-TR')}
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setFavorite(!favorite)}
                  className="h-8 w-8 p-0 hover:scale-110 transition-transform"
                >
                  <Heart className={`h-4 w-4 transition-colors ${favorite ? 'fill-yellow-500 text-yellow-500' : 'text-gray-600'}`} />
                </Button>
                <Button
                  size="sm"
                  onClick={handleNavigate}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white transition-all duration-300 hover:scale-105"
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Sepete Ekle
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 cursor-pointer transition-all duration-300 hover:scale-105 hover:-translate-y-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleNavigate}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden">
        <ImageWithFallback
          src={image}
          alt={name}
          className="object-cover transition-all duration-500 group-hover:scale-110"
        />
        
        {/* Shimmer Effect */}
        <div 
          className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-800 ${
            isHovered ? 'translate-x-full' : '-translate-x-full'
          }`}
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {badge && (
            <Badge className={`${
              badge === 'Yeni' ? 'bg-yellow-600 text-white shadow-lg animate-pulse' :
              badge === 'İndirim' ? 'bg-yellow-700 text-white shadow-lg animate-pulse' :
              'bg-yellow-600 text-white shadow-lg animate-pulse'
            }`}>
              <Sparkles className="w-3 h-3 mr-1" />
              {badge}
            </Badge>
          )}
        </div>

        {/* Action Icons */}
        {isHovered && (
          <div className="absolute top-3 right-3 flex flex-col gap-2 animate-fade-in-scale">
            <Button
              size="sm"
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation()
                setFavorite(!favorite)
              }}
              className="h-10 w-10 p-0 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg hover:scale-110 transition-all"
            >
              <Heart className={`h-4 w-4 transition-all ${favorite ? 'fill-yellow-500 text-yellow-500 scale-110' : 'text-gray-600'}`} />
            </Button>
            
            <Button
              size="sm"
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation()
                setIs360View(true)
                setTimeout(() => setIs360View(false), 2000)
              }}
              className="h-10 w-10 p-0 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg hover:scale-110 transition-all"
            >
              <RotateCw className={`h-4 w-4 text-gray-600 ${is360View ? 'animate-spin' : ''}`} />
            </Button>
            
            <Button
              size="sm"
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation()
                handleNavigate()
              }}
              className="h-10 w-10 p-0 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg hover:scale-110 transition-all"
            >
              <Eye className="h-4 w-4 text-gray-600" />
            </Button>
          </div>
        )}

        {/* Quick Add Button */}
        {isHovered && (
          <div className="absolute bottom-3 left-3 right-3 animate-fade-in-up">
            <Button 
              onClick={(e) => e.stopPropagation()}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white shadow-lg backdrop-blur-sm transition-all duration-300 group hover:scale-105"
            >
              <ShoppingBag className="h-4 w-4 mr-2 group-hover:animate-bounce" />
              Sepete Ekle
            </Button>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        {category && (
          <p className="text-sm text-gray-500 mb-1">{category}</p>
        )}
        
        <h3 className="mb-2 text-gray-900 line-clamp-2 hover:text-yellow-600 transition-colors group-hover:translate-x-1">
          {name}
        </h3>
        
        {rating && (
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 transition-all hover:scale-125 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-600">({reviews})</span>
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <span className="text-lg text-gray-900 group-hover:scale-105 transition-transform">
            ₺{price.toLocaleString('tr-TR')}
          </span>
          {originalPrice && originalPrice > price && (
            <span className="text-sm text-gray-500 line-through">
              ₺{originalPrice.toLocaleString('tr-TR')}
            </span>
          )}
        </div>
      </div>

      {/* Glow Effect */}
      <div 
        className={`absolute inset-0 rounded-xl pointer-events-none transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: 'rgba(234, 179, 8, 0.1)',
          boxShadow: '0 0 30px rgba(20, 184, 166, 0.2)'
        }}
      />
    </div>
  )
}
