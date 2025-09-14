'use client'

import { useState } from 'react'
import { ArrowLeft, Filter, Grid, List, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/ProductCard'
import { Badge } from '@/components/ui/badge'
import { ImageWithFallback } from '@/components/figma/ImageWithFallback'
import Link from 'next/link'

interface CategoryPageProps {
  category: string
}

export function CategoryPage({ category }: CategoryPageProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('featured')
  const [priceRange, setPriceRange] = useState('all')

  const categoryInfo = {
    rings: {
      name: 'Yüzükler',
      description: 'Özel anlarınız için muhteşem yüzük koleksiyonumuz',
      image: 'https://images.unsplash.com/photo-1721206625396-708fa98dff27?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkJTIwamV3ZWxyeSUyMGVsZWdhbnQlMjBtb2Rlcm58ZW58MXx8fHwxNzU3ODU5NjMxfDA&ixlib=rb-4.1.0&q=80&w=1080',
      count: 127
    },
    necklaces: {
      name: 'Kolyeler',
      description: 'Zarafet ve şıklığın simgesi kolye koleksiyonumuz',
      image: 'https://images.unsplash.com/photo-1728119884904-98bc3caf518d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWFtb25kJTIwamV3ZWxyeSUyMGNvbGxlY3Rpb258ZW58MXx8fHwxNzU3ODU5NjMxfDA&ixlib=rb-4.1.0&q=80&w=1080',
      count: 89
    },
    earrings: {
      name: 'Küpeler',
      description: 'Her tarza uygun küpe modelleri',
      image: 'https://images.unsplash.com/photo-1739664664545-5ea43f486f07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqZXdlbHJ5JTIwc3RvcmUlMjBkaXNwbGF5JTIwZWxlZ2FudHxlbnwxfHx8fDE3NTc4NTk2MzF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      count: 156
    },
    bracelets: {
      name: 'Bilezikler',
      description: 'Şık ve modern bilezik koleksiyonumuz',
      image: 'https://images.unsplash.com/photo-1652340155016-e3c66dcba7f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBqZXdlbHJ5JTIwcmluZ3MlMjBuZWNrbGFjZXxlbnwxfHx8fDE3NTc4NTk2MzB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      count: 73
    },
    collections: {
      name: 'Tüm Koleksiyonlar',
      description: 'En özel tasarımlarımızı keşfedin',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqZXdlbHJ5JTIwc3RvcmUlMjBkaXNwbGF5fGVufDF8fHx8MTczNzcwNDczMnww&ixlib=rb-4.1.0&q=80&w=1080',
      count: 445
    }
  }

  const currentCategory = categoryInfo[category as keyof typeof categoryInfo]

  // Mock products data
  const products = [
    {
      id: 1,
      name: 'Elegant Diamond Ring',
      price: 8500,
      originalPrice: 9500,
      image: 'https://images.unsplash.com/photo-1603561596112-bb4de88e2bee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWFtb25kJTIwcmluZ3xlbnwxfHx8fDE3Mzc4NzI5OTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.8,
      reviews: 124,
      badge: 'Yeni'
    },
    {
      id: 2,
      name: 'Classic Gold Band',
      price: 3200,
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkJTIwcmluZ3xlbnwxfHx8fDE3Mzc4NzI5OTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.9,
      reviews: 89
    },
    {
      id: 3,
      name: 'Vintage Pearl Ring',
      price: 2800,
      originalPrice: 3500,
      image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZWFybCUyMHJpbmd8ZW58MXx8fHwxNzM3ODcyOTkxfDA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.7,
      reviews: 156,
      badge: 'İndirim'
    },
    {
      id: 4,
      name: 'Modern Silver Ring',
      price: 1850,
      image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWx2ZXIlMjByaW5nfGVufDF8fHx8MTczNzg3Mjk5MXww&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.6,
      reviews: 92
    },
    {
      id: 5,
      name: 'Rose Gold Eternity',
      price: 5200,
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb3NlJTIwZ29sZCUyMHJpbmd8ZW58MXx8fHwxNzM3ODcyOTkxfDA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.9,
      reviews: 78,
      badge: 'Popüler'
    },
    {
      id: 6,
      name: 'Solitaire Diamond',
      price: 12500,
      image: 'https://images.unsplash.com/photo-1652340155016-e3c66dcba7f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2xpdGFpcmUlMjBkaWFtb25kfGVufDF8fHx8MTczNzg3Mjk5MXww&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 5.0,
      reviews: 45,
      badge: 'Özel'
    }
  ]

  if (!currentCategory) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Kategori Bulunamadı</h1>
          <Link href="/">
            <Button>Ana Sayfaya Dön</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section */}
      <div className="relative h-80 bg-yellow-800 overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src={currentCategory.image}
            alt={currentCategory.name}
            className="object-cover opacity-50"
          />
        </div>
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="text-white">
            <Link href="/">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-white hover:bg-white/20 mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Ana Sayfaya Dön
              </Button>
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{currentCategory.name}</h1>
            <p className="text-xl text-gray-200 mb-4">{currentCategory.description}</p>
            <Badge className="bg-white text-gray-900">
              {currentCategory.count} Ürün
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters and Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" className="hover:bg-yellow-50">
              <Filter className="h-4 w-4 mr-2" />
              Filtrele
            </Button>
            <Button variant="outline" className="hover:bg-yellow-50">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Sırala
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className={viewMode === 'grid' ? 'bg-yellow-600' : ''}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              className={viewMode === 'list' ? 'bg-yellow-600' : ''}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Products Grid */}
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1 max-w-4xl mx-auto'
        }`}>
          {products.map((product) => (
            <ProductCard 
              key={product.id}
              {...product}
              viewMode={viewMode}
            />
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button 
            size="lg"
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-3"
          >
            Daha Fazla Yükle
          </Button>
        </div>
      </div>
    </div>
  )
}
