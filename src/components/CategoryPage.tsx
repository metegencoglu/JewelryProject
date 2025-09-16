'use client'

import React, { useState, useEffect } from 'react'
import { ProductCard } from '@/components/ProductCard'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Filter, Grid, List, SortAsc, SortDesc } from 'lucide-react'
// Kategori mapping - Database'deki gerçek değerlerle
const categoryMapping: Record<string, string> = {
  'yuzukler': 'rings',        // Database'de "rings" olarak kayıtlı
  'kolyeler': 'necklaces',    // Database'de "necklaces" olarak kayıtlı  
  'kupeler': 'earrings',      // Database'de "earrings" olarak kayıtlı
  'bilezikler': 'bracelets',  // Database'de "bracelets" olarak kayıtlı
  'alyanslar': 'wedding-rings', // Database'de "wedding-rings" olarak kayıtlı
  'altin-takilar': 'gold',    // Material bazlı kategori
  'gumus-takilar': 'silver',  // Material bazlı kategori
  'pirlanta-takilar': 'diamond', // Material bazlı kategori
  'koleksiyonlar': 'all'
}

interface Product {
  _id: string
  name: string
  price: number
  image: string
  images?: string[]
  category: string
  description?: string
  material?: string
  stock?: number
}

interface CategoryPageProps {
  category: string
  slug?: string
}

export function CategoryPage({ category, slug }: CategoryPageProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [loading, setLoading] = useState(true)

  const isSlugBased = !!slug
  
  // Türkçe slug kullanılıyorsa database kategori değerini al
  const dbCategory = categoryMapping[category] || category
  
  console.log('🔍 Category Mapping Debug:', {
    category,
    dbCategory,
    mappingExists: !!categoryMapping[category]
  })

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)

        console.log('🔍 CategoryPage Debug:', {
          slug,
          category,
          isSlugBased,
          dbCategory
        })

        // API'den ürünleri getir - kategori parametresi ile filtrele
        const response = await fetch(`/api/products?category=${encodeURIComponent(dbCategory)}`)

        // Ayrıca tüm ürünleri de kontrol et (debug için)
        let allProductsData: any = { products: [] }
        try {
          const allProductsResponse = await fetch('/api/products')
          if (allProductsResponse.ok) {
            allProductsData = await allProductsResponse.json()
            console.log('🗂️ All Products Categories:', 
              allProductsData.products?.map((p: any) => ({
                name: p.name,
                category: p.category
              })) || []
            )
          } else {
            const text = await allProductsResponse.text()
            console.warn('All products fetch returned non-ok:', allProductsResponse.status, text)
          }
        } catch (innerErr) {
          console.warn('All products debug fetch failed:', innerErr)
        }

        // Log status for main category request
        console.log('Category products response status:', response.status, response.statusText)

        if (!response.ok) {
          // try to read response body for more context
          let bodyText = ''
          try {
            bodyText = await response.text()
          } catch (readErr) {
            bodyText = `<unable to read response body: ${String(readErr)}>`
          }
          console.error('Category products fetch failed', { status: response.status, bodyText })
          throw new Error(`Ürünler yüklenirken hata oluştu (status: ${response.status})`)
        }

        // Parse JSON and validate shape
        const data = await response.json()
        if (!data || !Array.isArray(data.products)) {
          console.error('API returned unexpected payload for category products:', data)
          throw new Error('Ürünler yüklenirken beklenmeyen yanıt alındı')
        }

        console.log('📦 API Response:', {
          success: data.success,
          totalProducts: data.products.length,
          requestedCategory: dbCategory
        })

        setProducts(data.products || [])
        setFilteredProducts(data.products || [])

      } catch (error) {
        console.error('Ürünler yüklenirken hata:', error)
        setProducts([])
        setFilteredProducts([])
      } finally {
        setLoading(false)
      }
    }

    if (dbCategory) {
      fetchProducts()
    } else {
      setLoading(false)
    }
  }, [dbCategory])

  useEffect(() => {
    const sorted = [...filteredProducts].sort((a, b) => {
      let aValue: any = a[sortBy as keyof Product]
      let bValue: any = b[sortBy as keyof Product]
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })
    setFilteredProducts(sorted)
  }, [sortBy, sortOrder, products])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Kategori display bilgileri
  const categoryNames: Record<string, string> = {
    'yuzukler': 'Yüzükler',
    'kolyeler': 'Kolyeler',
    'kupeler': 'Küpeler',
    'bilezikler': 'Bilezikler',
    'alyanslar': 'Alyanslar',
    'altin-takilar': 'Altın Takılar',
    'gumus-takilar': 'Gümüş Takılar',
    'pirlanta-takilar': 'Pırlanta Takılar',
    'koleksiyonlar': 'Koleksiyonlar'
  }

  if (!dbCategory) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Kategori Bulunamadı</h1>
          <p className="text-gray-600">Aradığınız kategori mevcut değil.</p>
        </div>
      </div>
    )
  }

  const categoryDisplayName = categoryNames[category] || 'Takılar'

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{categoryDisplayName}</h1>
        <p className="text-gray-600 mb-4">{categoryDisplayName} koleksiyonumuzdan en özel tasarımları keşfedin.</p>
        <Badge variant="secondary" className="text-sm">
          {filteredProducts.length} ürün bulundu
        </Badge>
      </div>

      {/* Controls */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Sırala:</span>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm border rounded px-2 py-1"
              >
                <option value="name">İsim</option>
                <option value="price">Fiyat</option>
                <option value="stock">Stok</option>
              </select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Görünüm:</span>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Bu kategoride henüz ürün bulunmuyor.</p>
        </div>
      ) : (
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {filteredProducts.map((product) => (
            <ProductCard 
              key={product._id} 
              id={parseInt(product._id)}
              name={product.name}
              price={product.price}
              image={product.image}
              imagesProp={product.images}
              category={product.category}
            />
          ))}
        </div>
      )}
    </div>
  )
}