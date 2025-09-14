import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/actions/db'
import Product from '@/models/Product'

// GET /api/products - Ürünleri listele
export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const featured = searchParams.get('featured')
    const minPrice = parseFloat(searchParams.get('minPrice') || '0')
    const maxPrice = parseFloat(searchParams.get('maxPrice') || '999999')
    
    // Query oluştur
    const query: any = { isActive: true }
    
    if (category) query.category = category
    if (featured === 'true') query.featured = true
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    }
    
    // Fiyat aralığı
    query.price = { $gte: minPrice, $lte: maxPrice }
    
    // Sorting
    const sort: any = {}
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1
    
    // Pagination
    const skip = (page - 1) * limit
    
    const [products, total] = await Promise.all([
      Product.find(query)
        .sort(sort)
        .limit(limit)
        .skip(skip)
        .lean(),
      Product.countDocuments(query)
    ])
    
    return NextResponse.json({
      success: true,
      products,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        limit,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      }
    })
  } catch (error) {
    console.error('Products GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Ürünler getirilirken hata oluştu' },
      { status: 500 }
    )
  }
}

// POST /api/products - Yeni ürün ekle
export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const body = await request.json()
    
    // Validation
    if (!body.name || !body.price || !body.image || !body.category) {
      return NextResponse.json(
        { success: false, error: 'Gerekli alanlar eksik' },
        { status: 400 }
      )
    }
    
    const product = await Product.create(body)
    
    return NextResponse.json({
      success: true,
      product
    }, { status: 201 })
    
  } catch (error: any) {
    console.error('Product POST error:', error)
    
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'Bu ürün zaten mevcut' },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: 'Ürün eklenirken hata oluştu' },
      { status: 500 }
    )
  }
}