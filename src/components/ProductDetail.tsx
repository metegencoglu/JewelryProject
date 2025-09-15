'use client'

import { useState, useEffect } from 'react'
import { Heart, Share2, ShoppingBag, Plus, Minus, Star, Shield, Truck, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { ImageWithFallback } from './figma/ImageWithFallback'

interface ProductDetailProps {
  productId?: string
}

export function ProductDetail({ productId }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)

  // Navigation functions for image carousel
  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % product.images.length)
  }

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length)
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        prevImage()
      } else if (event.key === 'ArrowRight') {
        nextImage()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Auto-play carousel (optional)
  useEffect(() => {
    if (product.images.length > 1) {
      const interval = setInterval(() => {
        nextImage()
      }, 5000) // 5 saniyede bir otomatik geçiş

      return () => clearInterval(interval)
    }
  }, [selectedImage])

  const product = {
    id: '1',
    name: 'Elegant Diamond Ring',
    price: 8500,
    originalPrice: 9500,
    rating: 4.8,
    reviewCount: 127,
    description: 'Bu zarif pırlanta yüzük, özel günlerinizde ve önemli anlarda size eşlik edecek benzersiz bir parça. 18 ayar altın üzerine yerleştirilen yüksek kaliteli pırlantalar, ışığı en güzel şekilde yansıtır.',
    features: [
      '18 ayar beyaz altın',
      '0.75 karat pırlanta',
      'Sertifikalı taş',
      'El yapımı işçilik',
      'Özel ambalaj ile teslim'
    ],
    images: [
      'https://images.unsplash.com/photo-1721206625396-708fa98dff27?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkJTIwamV3ZWxyeSUyMGVsZWdhbnQlMjBtb2Rlcm58ZW58MXx8fHwxNzU3ODU5NjMxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1728119884904-98bc3caf518d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWFtb25kJTIwamV3ZWxyeSUyMGNvbGxlY3Rpb258ZW58MXx8fHwxNzU3ODU5NjMxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1652340155016-e3c66dcba7f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBqZXdlbHJ5JTIwcmluZ3MlMjBuZWNrbGFjZXxlbnwxfHx8fDE3NTc4NTk2MzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    ],
    inStock: true,
    stockCount: 5
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 relative group">
            <ImageWithFallback
              src={product.images[selectedImage]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Navigation Arrows */}
            {product.images.length > 1 && (
              <>
                {/* Left Arrow */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:shadow-xl"
                  aria-label="Önceki görsel"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                
                {/* Right Arrow */}
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:shadow-xl"
                  aria-label="Sonraki görsel"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
            
            {/* Image Counter */}
            {product.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {selectedImage + 1} / {product.images.length}
              </div>
            )}
          </div>
          
          {/* Thumbnail Images */}
          <div className="grid grid-cols-4 gap-3">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300 hover:scale-105 relative group ${
                  selectedImage === index 
                    ? 'border-yellow-600 shadow-lg scale-105 ring-2 ring-yellow-200' 
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
              >
                <ImageWithFallback
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  fill
                  className="object-cover transition-all duration-300 group-hover:brightness-110"
                />
                {/* Active indicator */}
                {selectedImage === index && (
                  <div className="absolute inset-0 bg-yellow-600/10 flex items-center justify-center">
                    <div className="w-2 h-2 bg-yellow-600 rounded-full animate-pulse"></div>
                  </div>
                )}
                {/* Hover effect */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition-colors">Stokta</Badge>
              <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition-colors animate-pulse">İndirimde</Badge>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
            
            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 transition-all hover:scale-110 ${
                      star <= product.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {product.rating} ({product.reviewCount} değerlendirme)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold text-gray-900">
                ₺{product.price.toLocaleString('tr-TR')}
              </span>
              <span className="text-xl text-gray-500 line-through">
                ₺{product.originalPrice.toLocaleString('tr-TR')}
              </span>
              <span className="text-lg font-semibold text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
                %{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)} indirim
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          {/* Quantity and Actions */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">Adet:</span>
              <div className="flex items-center border border-gray-200 rounded-lg bg-white">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 hover:bg-gray-100"
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-4 py-2 min-w-[3rem] text-center font-semibold">{quantity}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 hover:bg-gray-100"
                  disabled={quantity >= product.stockCount}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-sm text-gray-600">
                ({product.stockCount} adet stokta)
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                size="lg" 
                className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                Sepete Ekle
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setIsFavorite(!isFavorite)}
                className={`transition-all duration-300 hover:scale-105 ${
                  isFavorite 
                    ? 'text-yellow-600 border-yellow-600 bg-yellow-50' 
                    : 'hover:border-yellow-400 hover:text-yellow-600'
                }`}
              >
                <Heart className={`h-5 w-5 transition-all ${isFavorite ? 'fill-current scale-110' : ''}`} />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="hover:border-yellow-400 hover:text-yellow-600 transition-all duration-300 hover:scale-105"
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">Ürün Özellikleri</h3>
            <ul className="space-y-2">
              {product.features.map((feature, index) => (
                <li key={index} className="flex items-center text-sm text-gray-600 group">
                  <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full mr-3 group-hover:scale-150 transition-transform"></div>
                  <span className="group-hover:text-gray-800 transition-colors">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Guarantees */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-3 text-sm text-gray-600 group cursor-pointer">
              <Shield className="h-5 w-5 text-yellow-600 group-hover:scale-110 transition-transform" />
              <span className="group-hover:text-gray-800 transition-colors">Lifetime Garanti</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600 group cursor-pointer">
              <Truck className="h-5 w-5 text-yellow-600 group-hover:scale-110 transition-transform" />
              <span className="group-hover:text-gray-800 transition-colors">Ücretsiz Kargo</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600 group cursor-pointer">
              <RotateCcw className="h-5 w-5 text-yellow-600 group-hover:scale-110 transition-transform" />
              <span className="group-hover:text-gray-800 transition-colors">14 Gün İade</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-16">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-100 rounded-xl p-1">
            <TabsTrigger 
              value="description"
              className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm transition-all duration-300"
            >
              Açıklama
            </TabsTrigger>
            <TabsTrigger 
              value="specifications"
              className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm transition-all duration-300"
            >
              Özellikler
            </TabsTrigger>
            <TabsTrigger 
              value="reviews"
              className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm transition-all duration-300"
            >
              Yorumlar
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="mt-6">
            <div className="prose max-w-none">
              <p className="text-gray-600 leading-relaxed mb-4">
                Bu benzersiz pırlanta yüzük, sadece özel anlar için değil, günlük kullanımda da zarafetinizi yansıtacak şekilde tasarlanmıştır. 
                Ustalarımız tarafından özenle işlenen her detay, yüzüğün kalitesini ve dayanıklılığını artırır.
              </p>
              <p className="text-gray-600 leading-relaxed">
                18 ayar beyaz altın çerçeve, pırlantanın parlaklığını maksimum düzeyde ortaya çıkarırken, 
                konforlu yapısı sayesinde günlük kullanım için idealdir. Her ürün özel sertifika ile garantilidir.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="specifications" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="mb-3 font-semibold text-gray-900">Materyal</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• 18 ayar beyaz altın (750/1000)</li>
                  <li>• Sertifikalı pırlanta</li>
                  <li>• Rodiüm kaplama</li>
                </ul>
              </div>
              <div>
                <h4 className="mb-3 font-semibold text-gray-900">Boyutlar</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Taş boyutu: 5.5mm</li>
                  <li>• Bantı genişliği: 2mm</li>
                  <li>• Ağırlık: 3.2gr</li>
                </ul>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="reviews" className="mt-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-gray-900">Müşteri Yorumları</h4>
                <Button 
                  variant="outline"
                  className="hover:bg-teal-50 hover:border-teal-500 hover:text-yellow-600 transition-all duration-300"
                >
                  Yorum Yaz
                </Button>
              </div>
              
              {/* Sample Reviews */}
              {[
                { name: 'Ayşe K.', rating: 5, comment: 'Harika bir ürün! Kalitesi ve işçiliği gerçekten mükemmel. Kargo da çok hızlıydı. Kesinlikle tavsiye ederim.' },
                { name: 'Mehmet B.', rating: 5, comment: 'Eşim çok beğendi. Paketleme de çok özenli yapılmış. Teşekkürler!' },
                { name: 'Zeynep A.', rating: 4, comment: 'Güzel bir ürün, fakat beklediğimden biraz daha küçük geldi. Yine de memnunum.' }
              ].map((review, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-teal-100 to-rose-100 rounded-full flex items-center justify-center">
                      <span className="text-yellow-600 font-semibold">{review.name.charAt(0)}</span>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900">{review.name}</h5>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className={`h-4 w-4 ${star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
