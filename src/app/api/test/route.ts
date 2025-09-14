import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/actions/db'
import { seedDatabase } from '@/lib/seedDatabase'

// GET /api/test - Database bağlantısını test et
export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    return NextResponse.json({
      success: true,
      message: 'Database bağlantısı başarılı!',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV
    })
    
  } catch (error) {
    console.error('Database test error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Database bağlantısı başarısız',
        message: error instanceof Error ? error.message : 'Bilinmeyen hata'
      },
      { status: 500 }
    )
  }
}

// POST /api/test - Test verilerini yükle
export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()
    
    if (action === 'seed') {
      await seedDatabase()
      
      return NextResponse.json({
        success: true,
        message: 'Test verileri başarıyla yüklendi!',
        data: {
          products: 6,
          users: 2
        }
      })
    }
    
    return NextResponse.json(
      { success: false, error: 'Geçersiz action' },
      { status: 400 }
    )
    
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Test verileri yüklenirken hata oluştu',
        message: error instanceof Error ? error.message : 'Bilinmeyen hata'
      },
      { status: 500 }
    )
  }
}