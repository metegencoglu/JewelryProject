async function testSeed() {
  try {
    console.log('🌱 Seed API\'si test ediliyor...');
    
    const response = await fetch('http://localhost:3000/api/seed', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Başarılı! Veriler eklendi:');
      console.log(JSON.stringify(data, null, 2));
    } else {
      console.log('❌ API Hatası:', data);
    }
    
  } catch (error) {
    console.log('❌ Bağlantı hatası:', error.message);
    console.log('Server çalışıyor mu? http://localhost:3000 kontrol edin');
  }
}

testSeed();