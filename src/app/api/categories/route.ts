import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/actions/db'
import Product from '@/models/Product'

// GET /api/categories - Kategorileri ve ürün sayılarını getir
export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    // Kategori başına ürün sayısı
    const categoryStats = await Product.aggregate([
      { $match: { isActive: true } },
      { $group: { 
          _id: '$category', 
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        } 
      },
      { $sort: { count: -1 } }
    ])
    
    // Kategori bilgileri
    const categories = [
      {
        id: 'rings',
        name: 'Yüzükler',
        slug: 'yuzukler',
        description: 'El yapımı zarif yüzük koleksiyonu',
        image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e'
      },
      {
        id: 'necklaces',
        name: 'Kolyeler',
        slug: 'kolyeler',
        description: 'Şık ve modern kolye tasarımları',
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f'
      },
      {
        id: 'earrings',
        name: 'Küpeler',
        slug: 'kupeler',
        description: 'Zarif küpe koleksiyonu',
        image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908'
      },
      {
        id: 'bracelets',
        name: 'Bilezikler',
        slug: 'bilezikler',
        description: 'El yapımı bilezik çeşitleri',
        image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d'
      }
    ]
    
    // Kategori bilgileri ile istatistikleri birleştir
    const categoriesWithStats = categories.map(category => {
      const stats = categoryStats.find(stat => stat._id === category.id)
      return {
        ...category,
        productCount: stats?.count || 0,
        avgPrice: stats?.avgPrice || 0,
        priceRange: {
          min: stats?.minPrice || 0,
          max: stats?.maxPrice || 0
        }
      }
    })
    
    return NextResponse.json({
      success: true,
      categories: categoriesWithStats,
      totalCategories: categories.length,
      totalProducts: categoryStats.reduce((sum, cat) => sum + cat.count, 0)
    })
    
  } catch (error) {
    console.error('Categories GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Kategoriler getirilirken hata oluştu' },
      { status: 500 }
    )
  }
}