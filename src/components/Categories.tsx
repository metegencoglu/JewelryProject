"use client";

import { useState, useRef } from 'react'
import { CategoryCard } from '@/components/CategoryCard'
import { Sparkles, TrendingUp } from 'lucide-react'
import type { Page, Category } from '@/types'

interface CategoriesProps {
  onNavigate?: (page: Page, category?: Category) => void
}

export function Categories({ onNavigate }: CategoriesProps) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
  const ref = useRef(null)

  const categories = [
    {
      name: 'Yüzükler',
      image: 'https://images.unsplash.com/photo-1721206625396-708fa98dff27?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkJTIwamV3ZWxyeSUyMGVsZWdhbnQlMjBtb2Rlcm58ZW58MXx8fHwxNzU3ODU5NjMxfDA&ixlib=rb-4.1.0&q=80&w=1080',
      productCount: 127,
      category: 'rings' as Category,
      isPopular: true
    },
    {
      name: 'Kolyeler',
      image: 'https://images.unsplash.com/photo-1728119884904-98bc3caf518d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWFtb25kJTIwamV3ZWxyeSUyMGNvbGxlY3Rpb258ZW58MXx8fHwxNzU3ODU5NjMxfDA&ixlib=rb-4.1.0&q=80&w=1080',
      productCount: 89,
      category: 'necklaces' as Category,
      isNew: true
    },
    {
      name: 'Küpeler',
      image: 'https://images.unsplash.com/photo-1739664664545-5ea43f486f07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqZXdlbHJ5JTIwc3RvcmUlMjBkaXNwbGF5JTIwZWxlZ2FudHxlbnwxfHx8fDE3NTc4NTk2MzF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      productCount: 156,
      category: 'earrings' as Category,
      isPopular: true
    },
    {
      name: 'Bilezikler',
      image: 'https://images.unsplash.com/photo-1652340155016-e3c66dcba7f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBqZXdlbHJ5JTIwcmluZ3MlMjBuZWNrbGFjZXxlbnwxfHx8fDE3NTc4NTk2MzB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      productCount: 73,
      category: 'bracelets' as Category
    }
  ]

  return (
    <section className="py-20 bg-gray-50 relative overflow-hidden" ref={ref}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-yellow-100">
              <Sparkles className="w-5 h-5 text-yellow-600" />
              <span className="text-yellow-600 font-medium">Özel Koleksiyonlar</span>
            </div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            <span className="text-yellow-600">
              Kategoriler
            </span>
          </h2>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Her tarza uygun, özenle seçilmiş mücevher kategorilerimizi keşfedin. 
            El yapımı ustalık ile modern tasarımın kusursuz buluşması.
          </p>
        </div>

        {/* Asymmetric Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-7xl mx-auto">
          {/* First category - Large */}
          <div
            className="md:col-span-7 relative group"
            onMouseEnter={() => setHoveredCategory(categories[0].name)}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <div className="relative h-80 md:h-96">
              <CategoryCard 
                name={categories[0].name}
                image={categories[0].image}
                productCount={categories[0].productCount}
                onClick={() => onNavigate?.('category', categories[0].category)}
                isHovered={hoveredCategory === categories[0].name}
                size="large"
                badge={categories[0].isPopular ? "Popüler" : undefined}
              />
            </div>
          </div>

          {/* Second category - Medium */}
          <div
            className="md:col-span-5 relative group"
            onMouseEnter={() => setHoveredCategory(categories[1].name)}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <div className="relative h-80 md:h-96">
              <CategoryCard 
                name={categories[1].name}
                image={categories[1].image}
                productCount={categories[1].productCount}
                onClick={() => onNavigate?.('category', categories[1].category)}
                isHovered={hoveredCategory === categories[1].name}
                size="medium"
                badge={categories[1].isNew ? "Yeni" : undefined}
              />
            </div>
          </div>

          {/* Third category - Medium */}
          <div
            className="md:col-span-5 relative group"
            onMouseEnter={() => setHoveredCategory(categories[2].name)}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <div className="relative h-80">
              <CategoryCard 
                name={categories[2].name}
                image={categories[2].image}
                productCount={categories[2].productCount}
                onClick={() => onNavigate?.('category', categories[2].category)}
                isHovered={hoveredCategory === categories[2].name}
                size="medium"
                badge={categories[2].isPopular ? "Trend" : undefined}
              />
            </div>
          </div>

          {/* Fourth category - Large */}
          <div
            className="md:col-span-7 relative group"
            onMouseEnter={() => setHoveredCategory(categories[3].name)}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <div className="relative h-80">
              <CategoryCard 
                name={categories[3].name}
                image={categories[3].image}
                productCount={categories[3].productCount}
                onClick={() => onNavigate?.('category', categories[3].category)}
                isHovered={hoveredCategory === categories[3].name}
                size="large"
              />
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {[
            { number: "500+", label: "Benzersiz Ürün" },
            { number: "50+", label: "Yeni Tasarım" },
            { number: "10k+", label: "Mutlu Müşteri" },
            { number: "15+", label: "Yıllık Deneyim" }
          ].map((stat, index) => (
            <div
              key={index}
              className="text-center group hover:scale-105 transition-transform duration-200"
            >
              <div className="text-2xl md:text-3xl font-bold text-yellow-600 mb-2">
                {stat.number}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 right-20 text-yellow-400/20 animate-spin-slow">
        <Sparkles size={40} />
      </div>

      <div className="absolute bottom-20 left-20 text-amber-400/20 animate-bounce">
        <TrendingUp size={35} />
      </div>
    </section>
  )
}