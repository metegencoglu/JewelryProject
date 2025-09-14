import connectDB from '@/actions/db'
import Product from '@/models/Product'
import User from '@/models/User'
import bcrypt from 'bcryptjs'

const sampleProducts = [
  {
    name: "Elmas Solitaire Yüzük",
    price: 15000,
    originalPrice: 18000,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e",
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e",
      "https://images.unsplash.com/photo-1612637132218-90cec3d6ba49"
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
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f",
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338"
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
    name: "İnci Damla Küpe",
    price: 3200,
    originalPrice: 4000,
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908",
    images: [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908",
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0"
    ],
    category: "earrings",
    badge: "Popüler",
    rating: 4.9,
    reviews: 156,
    description: "Gerçek inci ile zarif damla küpe tasarımı.",
    specifications: {
      material: "14K Rose Altın, Gerçek İnci",
      weight: "2.1g",
      dimensions: "2cm uzunluk"
    },
    stock: 12,
    featured: false
  },
  {
    name: "Zincir Bilezik Set",
    price: 5500,
    image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d",
    images: [
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d",
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0"
    ],
    category: "bracelets",
    badge: "Yeni",
    rating: 4.4,
    reviews: 73,
    description: "İnce zincir detaylı bilezik seti, günlük kullanım için ideal.",
    specifications: {
      material: "18K Sarı Altın",
      weight: "4.5g",
      dimensions: "18cm çap"
    },
    stock: 6,
    featured: false
  },
  {
    name: "Klasik Alyans Çifti",
    price: 12000,
    image: "https://images.unsplash.com/photo-1594736797933-d0701ba2fe65",
    category: "rings",
    rating: 4.7,
    reviews: 245,
    description: "Evlilik için özel tasarım klasik alyans çifti.",
    specifications: {
      material: "18K Beyaz Altın",
      weight: "6.8g (çift)",
      dimensions: "4mm genişlik"
    },
    stock: 3,
    featured: true
  },
  {
    name: "Geometrik Altın Kolye",
    price: 4800,
    image: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0",
    category: "necklaces",
    badge: "Popüler",
    rating: 4.5,
    reviews: 91,
    description: "Modern geometrik tasarım altın kolye.",
    specifications: {
      material: "14K Sarı Altın",
      weight: "3.9g",
      dimensions: "40cm uzunluk"
    },
    stock: 9,
    featured: false
  }
]

const sampleUsers = [
  {
    email: "admin@luxejewelry.com",
    name: "Admin User",
    password: "admin123",
    role: "admin"
  },
  {
    email: "test@example.com",
    name: "Test User",
    password: "test123",
    role: "user"
  }
]

export async function seedDatabase() {
  try {
    console.log('🌱 Database seeding başlatılıyor...')
    
    await connectDB()
    
    // Mevcut verileri temizle
    await Product.deleteMany({})
    await User.deleteMany({})
    console.log('✅ Mevcut veriler temizlendi')
    
    // Ürünleri ekle
    await Product.insertMany(sampleProducts)
    console.log(`✅ ${sampleProducts.length} ürün eklendi`)
    
    // Kullanıcıları ekle (şifreler hashlenerek)
    for (const userData of sampleUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 12)
      await User.create({
        ...userData,
        password: hashedPassword
      })
    }
    console.log(`✅ ${sampleUsers.length} kullanıcı eklendi`)
    
    console.log('🎉 Database seeding tamamlandı!')
    console.log('\n📋 Test kullanıcıları:')
    console.log('Admin: admin@luxejewelry.com / admin123')
    console.log('User: test@example.com / test123')
    
  } catch (error) {
    console.error('❌ Seeding hatası:', error)
    throw error
  }
}

// Script olarak çalıştırılabilir
if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}