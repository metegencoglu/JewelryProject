import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/actions/db'
import Product from '@/models/Product'
import User from '@/models/User'
import bcrypt from 'bcryptjs'

// Sample product data
const sampleProducts = [
  {
    name: "Elmas Solitaire Yüzük",
    price: 15000,
    originalPrice: 18000,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500",
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500",
      "https://images.unsplash.com/photo-1612637132218-90cec3d6ba49?w=500"
    ],
    category: "rings",
    badge: "İndirim",
    rating: 4.8,
    reviews: 127,
    description: "1 karat elmas ile özel tasarım solitaire yüzük. El yapımı ustalık ile modern tasarımın buluştuğu eşsiz parça.",
    specifications: {
      material: "18K Beyaz Altın",
      weight: "3.2g",
      dimensions: "6mm genişlik"
    },
    stock: 5,
    featured: true
  },
  {
    name: "Vintage Altın Kolye",
    price: 8500,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500",
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500"
    ],
    category: "necklaces",
    badge: "Yeni",
    rating: 4.6,
    reviews: 89,
    description: "Vintage tarzında el işçiliği ile hazırlanmış altın kolye.",
    specifications: {
      material: "22K Sarı Altın",
      weight: "5.8g",
      dimensions: "45cm uzunluk"
    },
    stock: 8,
    featured: true
  },
  {
    name: "İnci Küpeler",
    price: 3200,
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500",
    images: [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500"
    ],
    category: "earrings",
    badge: "Popüler",
    rating: 4.4,
    reviews: 56,
    description: "Doğal inci ile hazırlanmış şık küpeler.",
    specifications: {
      material: "925 Ayar Gümüş",
      weight: "2.1g",
      dimensions: "8mm çap"
    },
    stock: 12,
    featured: false
  },
  {
    name: "Zümrüt Bilezik",
    price: 12000,
    originalPrice: 15000,
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500",
    images: [
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500"
    ],
    category: "bracelets",
    badge: "İndirim",
    rating: 4.9,
    reviews: 73,
    description: "Kolombiya zümrüdü ile özel tasarım bilezik.",
    specifications: {
      material: "18K Beyaz Altın",
      weight: "8.5g",
      dimensions: "18cm uzunluk"
    },
    stock: 3,
    featured: true
  }
]

export async function POST() {
  try {
    await connectDB()
    
    // Check if data already exists
    const existingProducts = await Product.countDocuments()
    if (existingProducts > 0) {
      return NextResponse.json({ 
        message: "Veriler zaten mevcut",
        count: existingProducts 
      })
    }

    // Insert sample products
    const products = await Product.insertMany(sampleProducts)
    
    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12)
    const adminUser = new User({
      email: 'admin@jewelry.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'admin'
    })
    
    await adminUser.save()

    return NextResponse.json({ 
      message: "Sample veriler başarıyla eklendi!",
      productsAdded: products.length,
      adminCreated: true
    })
    
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json(
      { error: 'Veriler eklenirken hata oluştu', details: error },
      { status: 500 }
    )
  }
}