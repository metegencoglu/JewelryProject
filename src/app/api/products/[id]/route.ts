import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/actions/db'
import Product from '@/models/Product'
import mongoose from 'mongoose'

// GET /api/products/[id] - Tek ürün getir
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    
    const { id } = params
    
    // ID validation
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz ürün ID' },
        { status: 400 }
      )
    }
    
    const product = await Product.findOne({
      _id: id,
      isActive: true
    }).lean()
    
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Ürün bulunamadı' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      product
    })
    
  } catch (error) {
    console.error('Product GET by ID error:', error)
    return NextResponse.json(
      { success: false, error: 'Ürün getirilirken hata oluştu' },
      { status: 500 }
    )
  }
}

// PUT /api/products/[id] - Ürün güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    
    const { id } = params
    const body = await request.json()
    
    // ID validation
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz ürün ID' },
        { status: 400 }
      )
    }
    
    const product = await Product.findOneAndUpdate(
      { _id: id, isActive: true },
      { ...body, updatedAt: new Date() },
      { new: true, runValidators: true }
    )
    
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Ürün bulunamadı' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      product
    })
    
  } catch (error: any) {
    console.error('Product PUT error:', error)
    
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'Bu ürün adı zaten kullanılıyor' },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: 'Ürün güncellenirken hata oluştu' },
      { status: 500 }
    )
  }
}

// DELETE /api/products/[id] - Ürün sil (hard delete - kalıcı silme)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('DELETE request received for ID:', params.id)
    await connectDB()
    
    const { id } = params
    console.log('Processing deletion for ID:', id, 'Type:', typeof id)
    
    // ID validation
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log('Invalid ObjectId:', id)
      return NextResponse.json(
        { success: false, error: 'Geçersiz ürün ID' },
        { status: 400 }
      )
    }

    console.log('Searching for product with ID:', id)
    const product = await Product.findOneAndDelete(
      { _id: id, isActive: true }
    )

    console.log('Found and deleted product:', product ? 'YES' : 'NO')
    
    if (!product) {
      // Ayrıca tüm ürünleri kontrol edelim
      const allProducts = await Product.find({}, '_id name isActive')
      console.log('All products in DB:', allProducts)
      
      return NextResponse.json(
        { success: false, error: 'Ürün bulunamadı' },
        { status: 404 }
      )
    }

    console.log('Product permanently deleted:', product.name)
    return NextResponse.json({
      success: true,
      message: 'Ürün kalıcı olarak silindi'
    })
    
  } catch (error) {
    console.error('Product DELETE error:', error)
    return NextResponse.json(
      { success: false, error: 'Ürün silinirken hata oluştu' },
      { status: 500 }
    )
  }
}