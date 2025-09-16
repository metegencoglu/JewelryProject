'use client'

import { useState, useEffect } from 'react'
import { Heart, ShoppingBag, Eye, Star, RotateCw, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ImageWithFallback } from '@/components/figma/ImageWithFallback'
import { useCart } from '@/contexts/CartContext'

interface ProductCardProps {
  id: number | string
  name: string
  price: number
  originalPrice?: number
  image: string
  imagesProp?: string[]
  category?: string
  badge?: string
  rating?: number
  reviews?: number
  isFavorite?: boolean
  onNavigate?: (page: string, category?: any, productId?: number | string) => void
  viewMode?: 'grid' | 'list'
}

export function ProductCard({ 
  id, 
  name, 
  price, 
  originalPrice, 
  image, 
  imagesProp,
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
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const { addItem } = useCart()

  // Build images array from main image + optional additional images
  const images = [image, ...(imagesProp || [])].filter(Boolean)

  const nextImage = () => setSelectedImage((prev) => (images.length ? (prev + 1) % images.length : 0))
  const prevImage = () => setSelectedImage((prev) => (images.length ? (prev - 1 + images.length) % images.length : 0))

  // Keyboard navigation for modal
  useEffect(() => {
    if (!showDetailModal) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevImage()
      if (e.key === 'ArrowRight') nextImage()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [showDetailModal, images.length])

  // Auto-play when modal open
  useEffect(() => {
    if (!showDetailModal || images.length < 2) return
    const iv = setInterval(() => nextImage(), 5000)
    return () => clearInterval(iv)
  }, [showDetailModal, selectedImage, images.length])

  const handleNavigate = () => {
    onNavigate?.('product', undefined, id)
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    console.log('🔍 ProductCard - Adding to cart:', {
      id,
      name,
      price,
      image,
      category
    })
    addItem({
      id,
      name,
      price,
      image,
      category
    })
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
                  onClick={handleAddToCart}
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
    <>
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
                setShowDetailModal(true)
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
              onClick={handleAddToCart}
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

    {/* Product Detail Modal (customer) */}
    {showDetailModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto p-8 relative animate-fade-in">
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
            onClick={() => setShowDetailModal(false)}
            aria-label="Kapat"
          >
            ×
          </button>
          <h2 className="text-2xl font-bold mb-6">Ürün Detayları</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Carousel */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 border-2 border-gray-200 group">
                <ImageWithFallback
                  src={images[selectedImage] || image}
                  alt={name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); prevImage(); }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:shadow-xl"
                      aria-label="Önceki görsel"
                    >
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"/></svg>
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); nextImage(); }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:shadow-xl"
                      aria-label="Sonraki görsel"
                    >
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
                    </button>
                  </>
                )}
                {images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {selectedImage + 1} / {images.length}
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-700 flex items-center gap-2">🖼️ Galeri ({images.length} görsel)</h4>
                  <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => { e.stopPropagation(); setSelectedImage(idx); }}
                        className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 cursor-pointer group ${selectedImage === idx ? 'border-yellow-500 shadow-lg ring-2 ring-yellow-200 scale-105' : 'border-gray-300 hover:border-yellow-400 hover:shadow-md hover:scale-102'}`}
                      >
                        <ImageWithFallback src={img} alt={`${name} ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                        {selectedImage === idx && (
                          <div className="absolute inset-0 bg-yellow-500/20 border border-yellow-500/50 rounded-lg flex items-center justify-center">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full shadow-lg"></div>
                          </div>
                        )}
                        <div className="absolute bottom-1 right-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">{idx + 1}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{name}</h1>
                <div className="flex items-center gap-2 mb-4">
                  <Badge className="bg-yellow-100 text-yellow-800 capitalize">{category}</Badge>
                </div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                <div className="flex items-end gap-3">
                  <div>
                    <p className="text-sm text-gray-600">Satış Fiyatı</p>
                    <p className="text-3xl font-bold text-yellow-600">₺{price?.toLocaleString('tr-TR')}</p>
                  </div>
                  {originalPrice && originalPrice > price && (
                    <div>
                      <p className="text-sm text-gray-500">Orijinal Fiyat</p>
                      <p className="text-lg text-gray-500 line-through">₺{originalPrice?.toLocaleString('tr-TR')}</p>
                    </div>
                  )}
                </div>
                {originalPrice && originalPrice > price && (
                  <div className="mt-2">
                    <p className="text-sm text-green-600 font-semibold">%{Math.round(((originalPrice - price) / originalPrice) * 100)} İndirim</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                  <p className="text-sm text-blue-600 font-semibold">Stok Durumu</p>
                  <p className="text-2xl font-bold text-blue-700">-</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                  <p className="text-sm text-purple-600 font-semibold">Değerlendirme</p>
                  <p className="text-2xl font-bold text-purple-700">{rating || 0}/5</p>
                  <p className="text-xs text-purple-600 mt-1">{reviews || 0} değerlendirme</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <h4 className="font-semibold text-gray-700 mb-2">📄 Açıklama</h4>
                <p className="text-gray-600 leading-relaxed">-</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <h4 className="font-semibold text-gray-700 mb-3">🔧 Teknik Özellikler</h4>
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex justify-between py-1 border-b border-gray-200 last:border-b-0">
                    <span className="text-gray-600">Malzeme:</span>
                    <span className="font-medium text-gray-800">-</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-200 last:border-b-0">
                    <span className="text-gray-600">Ağırlık:</span>
                    <span className="font-medium text-gray-800">-</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-200 last:border-b-0">
                    <span className="text-gray-600">Boyutlar:</span>
                    <span className="font-medium text-gray-800">-</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <h4 className="font-semibold text-gray-700 mb-3">📊 Sistem Bilgileri</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Ürün ID:</span>
                    <p className="font-mono text-gray-800 break-all">{id}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Oluşturma Tarihi:</span>
                    <p className="text-gray-800">-</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Son Güncelleme:</span>
                    <p className="text-gray-800">-</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  )
}
