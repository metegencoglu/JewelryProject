'use client'

import { useState, useRef } from 'react'
import { ProductCard } from '@/components/ProductCard'
import { Button } from '@/components/ui/button'
import { Star, TrendingUp, Eye, Filter } from 'lucide-react'

interface FeaturedProductsProps {
  onNavigate?: (page: string, category?: string, productId?: number) => void
}

export function FeaturedProducts({ onNavigate }: FeaturedProductsProps) {
  const [activeFilter, setActiveFilter] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  
  const ref = useRef(null)

  const featuredProducts = [
    {
      id: 1,
      name: 'Elegant Diamond Ring',
      price: 8500,
      originalPrice: 9500,
      image: 'https://images.unsplash.com/photo-1721206625396-708fa98dff27?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkJTIwamV3ZWxyeSUyMGVsZWdhbnQlMjBtb2Rlcm58ZW58MXx8fHwxNzU3ODU5NjMxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      images: [
        'https://images.unsplash.com/photo-1721206625396-708fa98dff27?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
        'https://images.unsplash.com/photo-1598724168411-9ba1e003a7fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800'
      ],
      category: 'Yüzükler',
      badge: 'İndirim',
      rating: 4.8,
      reviews: 127,
      type: 'rings'
    },
    {
      id: 2,
      name: 'Classic Pearl Necklace',
      price: 3200,
      image: 'https://images.unsplash.com/photo-1728119884904-98bc3caf518d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWFtb25kJTIwamV3ZWxyeSUyMGNvbGxlY3Rpb258ZW58MXx8fHwxNzU3ODU5NjMxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'Kolyeler',
      badge: 'Yeni',
      rating: 4.9,
      reviews: 89,
      type: 'necklaces'
    },
    {
      id: 3,
      name: 'Gold Chain Bracelet',
      price: 2800,
      image: 'https://images.unsplash.com/photo-1739664664545-5ea43f486f07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqZXdlbHJ5JTIwc3RvcmUlMjBkaXNwbGF5JTIwZWxlZ2FudHxlbnwxfHx8fDE3NTc4NTk2MzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'Bilezikler',
      rating: 4.7,
      reviews: 156,
      type: 'bracelets'
    },
    {
      id: 4,
      name: 'Silver Drop Earrings',
      price: 1850,
      originalPrice: 2100,
      image: 'https://images.unsplash.com/photo-1721206625396-708fa98dff27?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWx2ZXIlMjBqZXdlbHJ5JTIwbW9kZXJuJTIwbWluaW1hbGlzdHxlbnwxfHx8fDE3NTc4NTk2MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'Küpeler',
      badge: 'İndirim',
      rating: 4.6,
      reviews: 73,
      type: 'earrings'
    },
    {
      id: 5,
      name: 'Vintage Gold Ring',
      price: 4200,
      image: 'https://images.unsplash.com/photo-1598724168411-9ba1e003a7fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqZXdlbHJ5JTIwd29ya3Nob3AlMjBhcnRpc2FuJTIwY3JhZnRpbmd8ZW58MXx8fHwxNzU3NzQ3NTgyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      images: [
        'https://images.unsplash.com/photo-1598724168411-9ba1e003a7fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
        'https://images.unsplash.com/photo-1652340155016-e3c66dcba7f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800'
      ],
      category: 'Yüzükler',
      rating: 4.9,
      reviews: 234,
      type: 'rings'
    },
    {
      id: 6,
      name: 'Modern Diamond Set',
      price: 12500,
      image: 'https://images.unsplash.com/photo-1652340155016-e3c66dcba7f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBqZXdlbHJ5JTIwcmluZ3MlMjBuZWNrbGFjZXxlbnwxfHx8fDE3NTc4NTk2MzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'Setler',
      badge: 'Özel',
      rating: 5.0,
      reviews: 45,
      type: 'collections'
    },
  ]

  const filters = [
    { id: 'all', name: 'Tümü', icon: Star },
    { id: 'rings', name: 'Yüzükler', icon: Star },
    { id: 'necklaces', name: 'Kolyeler', icon: Star },
    { id: 'earrings', name: 'Küpeler', icon: Star },
    { id: 'bracelets', name: 'Bilezikler', icon: Star }
  ]

  const filteredProducts = activeFilter === 'all' 
    ? featuredProducts 
    : featuredProducts.filter(product => product.type === activeFilter)

  return (
    <section className="py-20 bg-gray-50 relative overflow-hidden" ref={ref}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-yellow-100">
            <TrendingUp className="w-5 h-5 text-yellow-600" />
            <span className="text-yellow-600 font-medium">Popüler Ürünler</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl mb-6 text-gray-900">
            <span className="text-yellow-600">
              Öne Çıkan
            </span>
            <br />
            Ürünler
          </h2>
          
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            En sevilen ve özel olarak seçilmiş mücevher koleksiyonumuzdan öne çıkan parçalar. 
            Her biri özenle tasarlanmış ve el yapımı ustalıkla üretilmiş.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105 ${
                activeFilter === filter.id
                  ? 'bg-yellow-600 text-white shadow-lg'
                  : 'bg-white/80 text-gray-600 hover:bg-yellow-50 hover:text-yellow-600 border border-gray-200'
              }`}
            >
              <filter.icon className="w-4 h-4" />
              {filter.name}
            </button>
          ))}
        </div>

        {/* View Mode Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-full p-1 border border-gray-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-full transition-all duration-300 ${
                viewMode === 'grid' ? 'bg-yellow-600 text-white' : 'text-gray-600 hover:text-yellow-600'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-full transition-all duration-300 ${
                viewMode === 'list' ? 'bg-yellow-600 text-white' : 'text-gray-600 hover:text-yellow-600'
              }`}
            >
              Liste
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className={`grid gap-6 mb-16 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1 max-w-4xl mx-auto'
        }`}>
          {filteredProducts.map((product) => (
            <ProductCard 
              key={product.id}
              {...product} 
              onNavigate={onNavigate}
              viewMode={viewMode}
            />
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Button 
            size="lg"
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-12 py-4 rounded-full shadow-xl text-lg font-medium group transition-all duration-300 hover:scale-105"
          >
            <span className="flex items-center gap-3">
              Tüm Ürünleri Görüntüle
              <Eye className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </span>
          </Button>
          
          {/* Stats */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            {[
              { number: "4.8", label: "Ortalama Puan", suffix: "/5" },
              { number: "500+", label: "Mutlu Müşteri" },
              { number: "50+", label: "Benzersiz Ürün" },
              { number: "99%", label: "Memnuniyet" }
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center group cursor-pointer"
              >
                <div className="text-2xl md:text-3xl text-yellow-600 mb-2 group-hover:scale-110 transition-transform">
                  {stat.number}{stat.suffix}
                </div>
                <div className="text-sm text-gray-600 group-hover:text-yellow-600 transition-colors">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Decoration Elements */}
      <div className="absolute top-20 right-20 text-yellow-400/20">
        <Star size={35} className="animate-pulse" />
      </div>

      <div className="absolute bottom-20 left-20 text-yellow-400/20">
        <TrendingUp size={30} className="animate-bounce" />
      </div>
    </section>
  )
}
