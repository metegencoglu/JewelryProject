// Admin Panel Ürün Yönetimi Test Script'i
async function testAdminProducts() {
  const baseUrl = 'http://localhost:3001/api';
  
  console.log('🔐 Admin Panel Ürün Yönetimi Test Ediliyor...\n');
  
  // 1. Mevcut ürünleri listele
  console.log('📋 1. Mevcut ürünleri getiriliyor...');
  try {
    const response = await fetch(`${baseUrl}/products`);
    const data = await response.json();
    console.log(`✅ ${data.products?.length || 0} ürün bulundu`);
    console.log('İlk ürün:', data.products?.[0]?.name || 'Ürün yok');
  } catch (error) {
    console.log('❌ Ürünler getirilemedi:', error.message);
  }
  
  // 2. Yeni ürün ekleme testi
  console.log('\n➕ 2. Yeni ürün ekleniyor...');
  const newProduct = {
    name: "Test Yüzük " + Date.now(),
    price: 2500,
    originalPrice: 3000,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500",
    images: ["https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500"],
    category: "rings",
    badge: "Yeni",
    rating: 4.5,
    reviews: 0,
    description: "Admin panelinden eklenen test ürünü",
    specifications: {
      material: "925 Ayar Gümüş",
      weight: "2.0g",
      dimensions: "5mm genişlik"
    },
    stock: 10,
    featured: false
  };
  
  try {
    const response = await fetch(`${baseUrl}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newProduct)
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Ürün başarıyla eklendi!');
      console.log('Ürün ID:', data.product._id);
      console.log('Ürün Adı:', data.product.name);
      
      // Eklenen ürünü test için sakla
      window.testProductId = data.product._id;
      
      // 3. Ürün güncelleme testi
      console.log('\n📝 3. Ürün güncelleniyor...');
      const updateData = {
        price: 2800,
        description: "Güncellenmiş test ürünü - Admin panel test"
      };
      
      const updateResponse = await fetch(`${baseUrl}/products/${data.product._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });
      
      const updateResult = await updateResponse.json();
      
      if (updateResult.success) {
        console.log('✅ Ürün başarıyla güncellendi!');
        console.log('Yeni fiyat:', updateResult.product.price);
      } else {
        console.log('❌ Ürün güncellenemedi:', updateResult.error);
      }
      
      // 4. Ürün silme testi (soft delete)
      console.log('\n🗑️ 4. Ürün siliniyor...');
      const deleteResponse = await fetch(`${baseUrl}/products/${data.product._id}`, {
        method: 'DELETE'
      });
      
      const deleteResult = await deleteResponse.json();
      
      if (deleteResult.success) {
        console.log('✅ Ürün başarıyla silindi!');
        console.log('Mesaj:', deleteResult.message);
      } else {
        console.log('❌ Ürün silinemedi:', deleteResult.error);
      }
      
    } else {
      console.log('❌ Ürün eklenemedi:', data.error);
    }
    
  } catch (error) {
    console.log('❌ API hatası:', error.message);
  }
  
  // 5. Final kontrol - ürün listesi
  console.log('\n📊 5. Final kontrol - güncel ürün listesi:');
  try {
    const finalResponse = await fetch(`${baseUrl}/products`);
    const finalData = await finalResponse.json();
    console.log(`✅ Toplam ${finalData.products?.length || 0} aktif ürün`);
    
    console.log('\n🎉 Admin panel ürün yönetimi testi tamamlandı!');
  } catch (error) {
    console.log('❌ Final kontrol hatası:', error.message);
  }
}

// Kategori listesi test
async function testCategories() {
  console.log('\n📂 Kategori Testi:');
  try {
    const response = await fetch('http://localhost:3001/api/categories');
    const data = await response.json();
    console.log(`✅ ${data.categories?.length || 0} kategori bulundu`);
    data.categories?.forEach(cat => {
      console.log(`- ${cat.name} (${cat.slug})`);
    });
  } catch (error) {
    console.log('❌ Kategoriler getirilemedi:', error.message);
  }
}

// Testleri başlat
console.log('🚀 Test başlatılıyor...');
testAdminProducts();
setTimeout(() => testCategories(), 3000);