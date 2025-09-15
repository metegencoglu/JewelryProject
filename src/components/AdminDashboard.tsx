'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Plus, Search, Filter, Edit, Trash2, Eye, Package, Users, ShoppingBag, TrendingUp, MessageSquare, AlertCircle, LogOut } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface AdminUser {
  _id: string
  email: string
  name: string
  role: string
}

interface Product {
  _id: string
  name: string
  category: string
  price: number
  stock: number
  image: string
  isActive: boolean
  featured: boolean
}

interface AdminDashboardProps {
  onNavigate?: (page: string) => void
}

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  console.log('🔥 AdminDashboard component loaded!')
  const { data: session, status } = useSession()
  const router = useRouter()
  const [selectedTab, setSelectedTab] = useState('overview')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: '',
    originalPrice: '',
    stock: '',
    description: '',
    image: '',
    images: [''],
    badge: '',
    specifications: {
      material: '',
      weight: '',
      dimensions: ''
    },
    featured: false
  })
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const [isEditProductOpen, setIsEditProductOpen] = useState(false)
  const [isViewProductOpen, setIsViewProductOpen] = useState(false)
  const [viewingProduct, setViewingProduct] = useState<any>(null)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [editProduct, setEditProduct] = useState({
    name: '',
    category: '',
    price: '',
    originalPrice: '',
    stock: '',
    description: '',
    image: '',
    images: [''],
    badge: '',
    specifications: {
      material: '',
      weight: '',
      dimensions: ''
    },
    featured: false
  })

  // Ürünleri yükle
  const fetchProducts = async () => {
    try {
      console.log('🔄 fetchProducts başlatıldı')
      setLoading(true)
      const response = await fetch('/api/products')
      console.log('📡 API response status:', response.status)
      const data = await response.json()
      console.log('📦 Fetched products data:', data)
      if (data.success) {
        console.log('✅ Products başarıyla alındı:', data.products.length, 'adet')
        console.log('🆔 Products with IDs:', data.products.map((p: any) => ({ id: p._id, name: p.name })))
        setProducts(data.products)
        console.log('📋 State güncellendi')
      } else {
        console.error('❌ API başarısız:', data.error)
      }
    } catch (error) {
      console.error('💥 Ürünler yüklenirken hata:', error)
    } finally {
      setLoading(false)
      console.log('✅ fetchProducts tamamlandı')
    }
  }

  useEffect(() => {
    // Middleware zaten auth kontrolü yapıyor, sadece data fetch
    if (status === 'loading') return
    
    if (session?.user?.role === 'admin') {
      console.log('✅ Admin session doğrulandı:', session.user.email)
      fetchProducts()
    }
  }, [session, status])

  // Dosya seçme fonksiyonu
  const handleImageUpload = (file: File, isMainImage: boolean = true, index?: number) => {
    if (!file.type.startsWith('image/')) {
      alert('❌ Lütfen sadece görsel dosyası seçin!')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      
      if (isMainImage) {
        setNewProduct({...newProduct, image: result})
      } else if (index !== undefined) {
        const newImages = [...newProduct.images]
        newImages[index] = result
        setNewProduct({...newProduct, images: newImages})
      }
    }
    reader.readAsDataURL(file)
  }

  // Ürün düzenleme başlat
  const handleEditProduct = (product: any) => {
    console.log('Editing product:', product)
    setEditingProduct(product)
    setEditProduct({
      name: product.name || '',
      category: product.category || '',
      price: product.price?.toString() || '',
      originalPrice: product.originalPrice?.toString() || '',
      stock: product.stock?.toString() || '',
      description: product.description || '',
      image: product.image || '',
      images: product.images || [''],
      badge: product.badge || '',
      specifications: {
        material: product.specifications?.material || '',
        weight: product.specifications?.weight || '',
        dimensions: product.specifications?.dimensions || ''
      },
      featured: product.featured || false
    })
    setIsEditProductOpen(true)
  }

  // Ürün güncelleme fonksiyonu
  const handleUpdateProduct = async () => {
    if (!editingProduct) return

    try {
      console.log('Updating product:', editingProduct._id, editProduct)
      
      // Validation
      if (!editProduct.name || !editProduct.category || !editProduct.price || !editProduct.stock) {
        alert('❌ Lütfen tüm zorunlu alanları doldurun!')
        return
      }

      if (!['rings', 'necklaces', 'earrings', 'bracelets'].includes(editProduct.category)) {
        alert('❌ Geçersiz kategori seçimi!')
        return
      }

      if (!editProduct.image) {
        alert('❌ Ana görsel zorunludur!')
        return
      }

      const productData = {
        name: editProduct.name,
        category: editProduct.category.toLowerCase(),
        price: parseFloat(editProduct.price),
        originalPrice: editProduct.originalPrice ? parseFloat(editProduct.originalPrice) : undefined,
        stock: parseInt(editProduct.stock),
        description: editProduct.description || 'Açıklama yok',
        image: editProduct.image,
        images: editProduct.images.filter(img => img.trim() !== ''),
        badge: editProduct.badge || undefined,
        specifications: {
          material: editProduct.specifications.material || "Belirtilmemiş",
          weight: editProduct.specifications.weight || "Belirtilmemiş",
          dimensions: editProduct.specifications.dimensions || "Belirtilmemiş"
        },
        featured: editProduct.featured,
        isActive: true
      }

      console.log('Sending update data:', productData)
      
      // API'ye güncelleme isteği gönder
      const response = await fetch(`/api/products/${editingProduct._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
      })

      console.log('Update response status:', response.status)
      const result = await response.json()
      console.log('Update response data:', result)
      
      if (result.success) {
        alert('✅ Ürün başarıyla güncellendi!')
        // Ürün listesini yenile
        await fetchProducts()
        setIsEditProductOpen(false)
        setEditingProduct(null)
      } else {
        alert('❌ Ürün güncellenemedi: ' + result.error)
        console.error('Ürün güncelleme hatası:', result.error)
      }
    } catch (error: any) {
      alert('❌ Bağlantı hatası: ' + error.message)
      console.error('API hatası:', error)
    }
  }

  // Edit için dosya upload fonksiyonu
  const handleEditImageUpload = (file: File, isMainImage: boolean = true, index?: number) => {
    if (!file.type.startsWith('image/')) {
      alert('❌ Lütfen sadece görsel dosyası seçin!')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      
      if (isMainImage) {
        setEditProduct({...editProduct, image: result})
      } else if (index !== undefined) {
        const newImages = [...editProduct.images]
        newImages[index] = result
        setEditProduct({...editProduct, images: newImages})
      }
    }
    reader.readAsDataURL(file)
  }

  // Ürün silme fonksiyonu
  const handleDeleteProduct = async (productId: string, productName: string) => {
    console.log('Attempting to delete product:', { productId, productName, type: typeof productId })
    
    if (!confirm(`"${productName}" adlı ürünü silmek istediğinizden emin misiniz?`)) {
      return
    }

    try {
      console.log('Sending DELETE request to:', `/api/products/${productId}`)
      
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      console.log('Response status:', response.status)
      const result = await response.json()
      console.log('Delete response:', result)
      
      if (result.success) {
        alert('✅ Ürün başarıyla silindi!')
        // Ürün listesini yenile
        await fetchProducts()
      } else {
        alert('❌ Ürün silinemedi: ' + result.error)
        console.error('Ürün silme hatası:', result.error)
      }
    } catch (error: any) {
      alert('❌ Bağlantı hatası: ' + error.message)
      console.error('API hatası:', error)
    }
  }

  // Ürün görüntüleme fonksiyonu
  const handleViewProduct = (product: any) => {
    console.log('Viewing product:', product)
    setViewingProduct(product)
    setIsViewProductOpen(true)
  }

  const stats = [
    { title: 'Toplam Ürün', value: products.length.toString(), icon: Package, color: 'text-blue-600', change: '+12%' },
    { title: 'Aktif Kullanıcı', value: '856', icon: Users, color: 'text-green-600', change: '+8%' },
    { title: 'Bugünkü Sipariş', value: '34', icon: ShoppingBag, color: 'text-purple-600', change: '+23%' },
    { title: 'Aylık Gelir', value: '₺125,500', icon: TrendingUp, color: 'text-yellow-600', change: '+15%' },
  ]

  const orders = [
    { id: '1001', customer: 'Ayşe Yılmaz', total: 8500, status: 'completed', date: '2024-01-15', items: 2 },
    { id: '1002', customer: 'Mehmet Kaya', total: 3200, status: 'pending', date: '2024-01-15', items: 1 },
    { id: '1003', customer: 'Zeynep Demir', total: 2800, status: 'processing', date: '2024-01-14', items: 1 },
    { id: '1004', customer: 'Ali Öztürk', total: 1850, status: 'completed', date: '2024-01-14', items: 3 },
  ]

  const complaints = [
    { id: 1, customer: 'Fatma Şen', subject: 'Ürün Kalitesi', message: 'Aldığım yüzük beklediğimden farklı çıktı.', status: 'open', date: '2024-01-15' },
    { id: 2, customer: 'Hasan Yıldız', subject: 'Kargo Sorunu', message: 'Siparişim 10 gündür kargoda bekliyor.', status: 'resolved', date: '2024-01-14' },
    { id: 3, customer: 'Elif Kara', subject: 'İade Talebi', message: 'Ürünü iade etmek istiyorum.', status: 'pending', date: '2024-01-13' },
  ]

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800',
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      open: 'bg-red-100 text-red-800',
      resolved: 'bg-green-100 text-green-800',
    }
    return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800'
  }

  const handleAddProduct = async () => {
    try {
      console.log('Adding product:', newProduct)
      
      // Validation
      if (!newProduct.name || !newProduct.category || !newProduct.price || !newProduct.stock) {
        alert('❌ Lütfen tüm zorunlu alanları doldurun!')
        return
      }

      // Fiyat kontrolü
      const priceValue = parseFloat(newProduct.price)
      if (isNaN(priceValue) || priceValue < 0) {
        alert('❌ Geçerli bir fiyat girin!')
        return
      }

      if (priceValue > Number.MAX_SAFE_INTEGER) {
        alert('❌ Fiyat çok büyük! Maksimum: ' + Number.MAX_SAFE_INTEGER.toLocaleString('tr-TR'))
        return
      }

      if (!['rings', 'necklaces', 'earrings', 'bracelets'].includes(newProduct.category)) {
        alert('❌ Geçersiz kategori seçimi!')
        return
      }

      if (!newProduct.image) {
        alert('❌ Ana görsel URL\'si zorunludur!')
        return
      }

      const productData = {
        name: newProduct.name,
        category: newProduct.category.toLowerCase(),
        price: parseFloat(newProduct.price),
        originalPrice: newProduct.originalPrice ? parseFloat(newProduct.originalPrice) : undefined,
        stock: parseInt(newProduct.stock),
        description: newProduct.description || 'Açıklama yok',
        image: newProduct.image,
        images: newProduct.images.filter(img => img.trim() !== ''),
        badge: newProduct.badge || undefined,
        rating: 0,
        reviews: 0,
        specifications: {
          material: newProduct.specifications.material || "Belirtilmemiş",
          weight: newProduct.specifications.weight || "Belirtilmemiş",
          dimensions: newProduct.specifications.dimensions || "Belirtilmemiş"
        },
        featured: newProduct.featured,
        isActive: true
      }

      console.log('📊 Product data price check:', {
        originalPrice: newProduct.price,
        parsedPrice: parseFloat(newProduct.price),
        type: typeof parseFloat(newProduct.price),
        isNaN: isNaN(parseFloat(newProduct.price))
      })
      console.log('🚀 Sending product data:', productData)
      
      // API'ye ürün ekleme isteği gönder
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
      })

      console.log('Response status:', response.status)
      const result = await response.json()
      console.log('Response data:', result)
      
      if (result.success) {
        alert('✅ Ürün başarıyla eklendi!')
        console.log('✅ Ürün eklendi:', result.product)
        
        // Yeni ürünü listeye manuel ekle (optimistic update)
        setProducts(prevProducts => [...prevProducts, result.product])
        
        console.log('🔄 fetchProducts çağrılıyor...')
        // Ürün listesini yenile (doğrulama için) - kısa gecikme ile
        setTimeout(async () => {
          await fetchProducts()
        }, 500)
        
        console.log('📝 Form temizleniyor...')
        setIsAddProductOpen(false)
        setNewProduct({ 
          name: '', 
          category: '', 
          price: '', 
          originalPrice: '',
          stock: '', 
          description: '',
          image: '',
          images: [''],
          badge: '',
          specifications: {
            material: '',
            weight: '',
            dimensions: ''
          },
          featured: false
        })
      } else {
        alert('❌ Ürün eklenemedi: ' + result.error)
        console.error('Ürün ekleme hatası:', result.error)
      }
    } catch (error: any) {
      alert('❌ Bağlantı hatası: ' + error.message)
      console.error('API hatası:', error)
    }
  }

  // Simple loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onNavigate?.('home')}
                className="hover:bg-gray-100"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Ana Sayfaya Dön
              </Button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              {session?.user && (
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{session.user.name}</p>
                    <p className="text-xs text-gray-500">{session.user.email}</p>
                  </div>
                  <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {session.user.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
              )}
              <Button 
                variant="outline" 
                size="sm"
                onClick={async () => {
                  console.log('🚪 Çıkış yapılıyor...')
                  await signOut({ callbackUrl: '/' })
                }}
                className="text-red-600 hover:bg-red-50 hover:border-red-300"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Çıkış Yap
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtrele
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Add Dialog */}
      <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Yeni Ürün Ekle</DialogTitle>
          </DialogHeader>
                  <div className="space-y-6 py-4">
                    {/* Temel Bilgiler */}
                    <div className="border-b pb-4">
                      <h3 className="text-lg font-semibold mb-4">Temel Bilgiler</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Ürün Adı *</Label>
                          <Input
                            id="name"
                            value={newProduct.name}
                            onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                            placeholder="Ürün adını girin"
                          />
                        </div>
                        <div>
                          <Label htmlFor="category">Kategori *</Label>
                          <select
                            id="category"
                            value={newProduct.category}
                            onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            required
                          >
                            <option value="">Kategori seçin</option>
                            <option value="rings">Yüzükler</option>
                            <option value="necklaces">Kolyeler</option>
                            <option value="earrings">Küpeler</option>
                            <option value="bracelets">Bilezikler</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <Label htmlFor="description">Açıklama</Label>
                        <Textarea
                          id="description"
                          value={newProduct.description}
                          onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                          placeholder="Ürün açıklaması"
                          rows={3}
                        />
                      </div>
                    </div>

                    {/* Fiyat ve Stok */}
                    <div className="border-b pb-4">
                      <h3 className="text-lg font-semibold mb-4">Fiyat ve Stok</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="price">Satış Fiyatı (₺) *</Label>
                          <Input
                            id="price"
                            type="number"
                            min="0"
                            step="0.01"
                            value={newProduct.price}
                            onChange={(e) => {
                              console.log('💰 Price input changed:', e.target.value)
                              setNewProduct({...newProduct, price: e.target.value})
                            }}
                            placeholder="0"
                          />
                          {newProduct.price && (
                            <div className="text-xs text-gray-500 mt-1">
                              Formatlanmış: ₺{parseFloat(newProduct.price || '0').toLocaleString('tr-TR')}
                            </div>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="originalPrice">Orijinal Fiyat (₺)</Label>
                          <Input
                            id="originalPrice"
                            type="number"
                            value={newProduct.originalPrice}
                            onChange={(e) => setNewProduct({...newProduct, originalPrice: e.target.value})}
                            placeholder="İndirim varsa orijinal fiyat"
                          />
                        </div>
                        <div>
                          <Label htmlFor="stock">Stok Adedi *</Label>
                          <Input
                            id="stock"
                            type="number"
                            value={newProduct.stock}
                            onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                            placeholder="0"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Görseller */}
                    <div className="border-b pb-4">
                      <h3 className="text-lg font-semibold mb-4">Görseller</h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="image">Ana Görsel *</Label>
                          <div className="space-y-2">
                            <div className="flex gap-2">
                              <Input
                                id="image"
                                value={newProduct.image.startsWith('data:') ? 'Dosya seçildi' : newProduct.image}
                                onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                                placeholder="https://example.com/image.jpg veya dosya seç"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => document.getElementById('mainImageFile')?.click()}
                              >
                                📁 Dosya Seç
                              </Button>
                            </div>
                            <input
                              id="mainImageFile"
                              type="file"
                              accept="image/*"
                              style={{ display: 'none' }}
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) handleImageUpload(file, true)
                              }}
                            />
                          </div>
                          {newProduct.image && (
                            <div className="mt-2">
                              <img 
                                src={newProduct.image} 
                                alt="Önizleme" 
                                className="w-20 h-20 object-cover rounded border"
                                onError={(e) => e.currentTarget.style.display = 'none'}
                              />
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <Label>Ek Görseller (Galeri)</Label>
                          {newProduct.images.map((img, index) => (
                            <div key={index} className="mt-2">
                              <div className="flex gap-2">
                                <Input
                                  value={img.startsWith('data:') ? 'Dosya seçildi' : img}
                                  onChange={(e) => {
                                    const newImages = [...newProduct.images]
                                    newImages[index] = e.target.value
                                    setNewProduct({...newProduct, images: newImages})
                                  }}
                                  placeholder={`Görsel ${index + 1} URL veya dosya seç`}
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => document.getElementById(`galleryImageFile-${index}`)?.click()}
                                >
                                  📁 Dosya Seç
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const newImages = newProduct.images.filter((_, i) => i !== index)
                                    setNewProduct({...newProduct, images: newImages})
                                  }}
                                >
                                  Sil
                                </Button>
                              </div>
                              <input
                                id={`galleryImageFile-${index}`}
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={(e) => {
                                  const file = e.target.files?.[0]
                                  if (file) handleImageUpload(file, false, index)
                                }}
                              />
                              {img && (
                                <div className="mt-2">
                                  <img 
                                    src={img} 
                                    alt={`Galeri ${index + 1}`} 
                                    className="w-16 h-16 object-cover rounded border"
                                    onError={(e) => e.currentTarget.style.display = 'none'}
                                  />
                                </div>
                              )}
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => setNewProduct({...newProduct, images: [...newProduct.images, '']})}
                          >
                            + Görsel Ekle
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Özellikler */}
                    <div className="border-b pb-4">
                      <h3 className="text-lg font-semibold mb-4">Ürün Özellikleri</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="material">Malzeme</Label>
                          <Input
                            id="material"
                            value={newProduct.specifications.material}
                            onChange={(e) => setNewProduct({
                              ...newProduct, 
                              specifications: {
                                ...newProduct.specifications,
                                material: e.target.value
                              }
                            })}
                            placeholder="Örn: 925 Ayar Gümüş"
                          />
                        </div>
                        <div>
                          <Label htmlFor="weight">Ağırlık</Label>
                          <Input
                            id="weight"
                            value={newProduct.specifications.weight}
                            onChange={(e) => setNewProduct({
                              ...newProduct, 
                              specifications: {
                                ...newProduct.specifications,
                                weight: e.target.value
                              }
                            })}
                            placeholder="Örn: 2.5g"
                          />
                        </div>
                        <div>
                          <Label htmlFor="dimensions">Boyutlar</Label>
                          <Input
                            id="dimensions"
                            value={newProduct.specifications.dimensions}
                            onChange={(e) => setNewProduct({
                              ...newProduct, 
                              specifications: {
                                ...newProduct.specifications,
                                dimensions: e.target.value
                              }
                            })}
                            placeholder="Örn: 15mm x 10mm"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Etiket ve Özellikler */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Etiket ve Özellikler</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="badge">Etiket</Label>
                          <select
                            id="badge"
                            value={newProduct.badge}
                            onChange={(e) => setNewProduct({...newProduct, badge: e.target.value})}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="">Etiket yok</option>
                            <option value="Yeni">Yeni</option>
                            <option value="İndirim">İndirim</option>
                            <option value="Popüler">Popüler</option>
                          </select>
                        </div>
                        <div className="flex items-center space-x-2 pt-6">
                          <input
                            type="checkbox"
                            id="featured"
                            checked={newProduct.featured}
                            onChange={(e) => setNewProduct({...newProduct, featured: e.target.checked})}
                            className="w-4 h-4"
                          />
                          <Label htmlFor="featured">Öne Çıkarılmış Ürün</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button variant="outline" onClick={() => setIsAddProductOpen(false)}>
                      İptal
                    </Button>
                    <Button onClick={handleAddProduct} className="bg-yellow-600 text-white">
                      Ürün Ekle
                    </Button>
                  </div>
        </DialogContent>
      </Dialog>

      {/* Product Edit Dialog */}
      <Dialog open={isEditProductOpen} onOpenChange={setIsEditProductOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ürünü Düzenle: {editingProduct?.name}</DialogTitle>
          </DialogHeader>
                  <div className="space-y-6 py-4">
                    {/* Temel Bilgiler */}
                    <div className="border-b pb-4">
                      <h3 className="text-lg font-semibold mb-4">Temel Bilgiler</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="edit-name">Ürün Adı *</Label>
                          <Input
                            id="edit-name"
                            value={editProduct.name}
                            onChange={(e) => setEditProduct({...editProduct, name: e.target.value})}
                            placeholder="Ürün adını girin"
                          />
                        </div>
                        <div>
                          <Label htmlFor="edit-category">Kategori *</Label>
                          <select
                            id="edit-category"
                            value={editProduct.category}
                            onChange={(e) => setEditProduct({...editProduct, category: e.target.value})}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            required
                          >
                            <option value="">Kategori seçin</option>
                            <option value="rings">Yüzükler</option>
                            <option value="necklaces">Kolyeler</option>
                            <option value="earrings">Küpeler</option>
                            <option value="bracelets">Bilezikler</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <Label htmlFor="edit-description">Açıklama</Label>
                        <Textarea
                          id="edit-description"
                          value={editProduct.description}
                          onChange={(e) => setEditProduct({...editProduct, description: e.target.value})}
                          placeholder="Ürün açıklaması"
                          rows={3}
                        />
                      </div>
                    </div>

                    {/* Fiyat ve Stok */}
                    <div className="border-b pb-4">
                      <h3 className="text-lg font-semibold mb-4">Fiyat ve Stok</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="edit-price">Satış Fiyatı (₺) *</Label>
                          <Input
                            id="edit-price"
                            type="number"
                            value={editProduct.price}
                            onChange={(e) => setEditProduct({...editProduct, price: e.target.value})}
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <Label htmlFor="edit-originalPrice">Orijinal Fiyat (₺)</Label>
                          <Input
                            id="edit-originalPrice"
                            type="number"
                            value={editProduct.originalPrice}
                            onChange={(e) => setEditProduct({...editProduct, originalPrice: e.target.value})}
                            placeholder="İndirim varsa orijinal fiyat"
                          />
                        </div>
                        <div>
                          <Label htmlFor="edit-stock">Stok Adedi *</Label>
                          <Input
                            id="edit-stock"
                            type="number"
                            value={editProduct.stock}
                            onChange={(e) => setEditProduct({...editProduct, stock: e.target.value})}
                            placeholder="0"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Görseller */}
                    <div className="border-b pb-4">
                      <h3 className="text-lg font-semibold mb-4">Görseller</h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="edit-image">Ana Görsel *</Label>
                          <div className="space-y-2">
                            <div className="flex gap-2">
                              <Input
                                id="edit-image"
                                value={editProduct.image.startsWith('data:') ? 'Dosya seçildi' : editProduct.image}
                                onChange={(e) => setEditProduct({...editProduct, image: e.target.value})}
                                placeholder="https://example.com/image.jpg veya dosya seç"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => document.getElementById('editMainImageFile')?.click()}
                              >
                                📁 Dosya Seç
                              </Button>
                            </div>
                            <input
                              id="editMainImageFile"
                              type="file"
                              accept="image/*"
                              style={{ display: 'none' }}
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) handleEditImageUpload(file, true)
                              }}
                            />
                          </div>
                          {editProduct.image && (
                            <div className="mt-2">
                              <img 
                                src={editProduct.image} 
                                alt="Önizleme" 
                                className="w-20 h-20 object-cover rounded border"
                                onError={(e) => e.currentTarget.style.display = 'none'}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Özellikler */}
                    <div className="border-b pb-4">
                      <h3 className="text-lg font-semibold mb-4">Ürün Özellikleri</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="edit-material">Malzeme</Label>
                          <Input
                            id="edit-material"
                            value={editProduct.specifications.material}
                            onChange={(e) => setEditProduct({
                              ...editProduct, 
                              specifications: {
                                ...editProduct.specifications,
                                material: e.target.value
                              }
                            })}
                            placeholder="Örn: 925 Ayar Gümüş"
                          />
                        </div>
                        <div>
                          <Label htmlFor="edit-weight">Ağırlık</Label>
                          <Input
                            id="edit-weight"
                            value={editProduct.specifications.weight}
                            onChange={(e) => setEditProduct({
                              ...editProduct, 
                              specifications: {
                                ...editProduct.specifications,
                                weight: e.target.value
                              }
                            })}
                            placeholder="Örn: 2.5g"
                          />
                        </div>
                        <div>
                          <Label htmlFor="edit-dimensions">Boyutlar</Label>
                          <Input
                            id="edit-dimensions"
                            value={editProduct.specifications.dimensions}
                            onChange={(e) => setEditProduct({
                              ...editProduct, 
                              specifications: {
                                ...editProduct.specifications,
                                dimensions: e.target.value
                              }
                            })}
                            placeholder="Örn: 15mm x 10mm"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Etiket ve Özellikler */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Etiket ve Özellikler</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="edit-badge">Etiket</Label>
                          <select
                            id="edit-badge"
                            value={editProduct.badge}
                            onChange={(e) => setEditProduct({...editProduct, badge: e.target.value})}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="">Etiket yok</option>
                            <option value="Yeni">Yeni</option>
                            <option value="İndirim">İndirim</option>
                            <option value="Popüler">Popüler</option>
                          </select>
                        </div>
                        <div className="flex items-center space-x-2 pt-6">
                          <input
                            type="checkbox"
                            id="edit-featured"
                            checked={editProduct.featured}
                            onChange={(e) => setEditProduct({...editProduct, featured: e.target.checked})}
                            className="w-4 h-4"
                          />
                          <Label htmlFor="edit-featured">Öne Çıkarılmış Ürün</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button variant="outline" onClick={() => setIsEditProductOpen(false)}>
                      İptal
                    </Button>
                    <Button onClick={handleUpdateProduct} className="bg-blue-600 text-white">
                      Güncelle
                    </Button>
                  </div>
        </DialogContent>
      </Dialog>

      {/* Product View Dialog */}
      <Dialog open={isViewProductOpen} onOpenChange={setIsViewProductOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Ürün Detayları</DialogTitle>
          </DialogHeader>
          {viewingProduct && (
            <div className="space-y-6 py-4">
              {/* Ana Layout - Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Sol Taraf - Galeri */}
                <div className="space-y-4">
                  {/* Ana Resim */}
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 border-2 border-gray-200">
                    <img 
                      src={viewingProduct.image || 'https://via.placeholder.com/400?text=No+Image'} 
                      alt={viewingProduct.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/400?text=Image+Error'
                      }}
                    />
                    {viewingProduct.badge && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        {viewingProduct.badge}
                      </div>
                    )}
                    {viewingProduct.featured && (
                      <div className="absolute top-3 right-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        ⭐ Öne Çıkan
                      </div>
                    )}
                  </div>

                  {/* Galeri - Kaydırmalı Fotoğraflar */}
                  {viewingProduct.images && viewingProduct.images.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-700">Galeri</h4>
                      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                        {viewingProduct.images.map((img: string, index: number) => (
                          img && (
                            <div key={index} className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-yellow-400 transition-colors cursor-pointer">
                              <img 
                                src={img} 
                                alt={`${viewingProduct.name} ${index + 1}`}
                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-200"
                                onError={(e) => {
                                  e.currentTarget.src = 'https://via.placeholder.com/80?text=Error'
                                }}
                              />
                            </div>
                          )
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Sağ Taraf - Ürün Bilgileri */}
                <div className="space-y-6">
                  {/* Başlık ve Kategori */}
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{viewingProduct.name}</h1>
                    <div className="flex items-center gap-2 mb-4">
                      <Badge className="bg-yellow-100 text-yellow-800 capitalize">
                        {viewingProduct.category === 'rings' && '💍 Yüzük'}
                        {viewingProduct.category === 'necklaces' && '📿 Kolye'}
                        {viewingProduct.category === 'earrings' && '👂 Küpe'}
                        {viewingProduct.category === 'bracelets' && '📿 Bilezik'}
                      </Badge>
                      <Badge className={viewingProduct.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {viewingProduct.isActive ? '✅ Aktif' : '❌ Pasif'}
                      </Badge>
                    </div>
                  </div>

                  {/* Fiyat Bilgileri */}
                  <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                    <div className="flex items-end gap-3">
                      <div>
                        <p className="text-sm text-gray-600">Satış Fiyatı</p>
                        <p className="text-3xl font-bold text-yellow-600">₺{viewingProduct.price?.toLocaleString('tr-TR')}</p>
                      </div>
                      {viewingProduct.originalPrice && viewingProduct.originalPrice > viewingProduct.price && (
                        <div>
                          <p className="text-sm text-gray-500">Orijinal Fiyat</p>
                          <p className="text-lg text-gray-500 line-through">₺{viewingProduct.originalPrice?.toLocaleString('tr-TR')}</p>
                        </div>
                      )}
                    </div>
                    {viewingProduct.originalPrice && viewingProduct.originalPrice > viewingProduct.price && (
                      <div className="mt-2">
                        <p className="text-sm text-green-600 font-semibold">
                          %{Math.round(((viewingProduct.originalPrice - viewingProduct.price) / viewingProduct.originalPrice) * 100)} İndirim
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Stok ve Durum */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                      <p className="text-sm text-blue-600 font-semibold">Stok Durumu</p>
                      <p className="text-2xl font-bold text-blue-700">{viewingProduct.stock} adet</p>
                      <p className="text-xs text-blue-600 mt-1">
                        {viewingProduct.stock > 10 ? '✅ Stokta Yeterli' : 
                         viewingProduct.stock > 0 ? '⚠️ Stok Azalıyor' : '❌ Stok Tükendi'}
                      </p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                      <p className="text-sm text-purple-600 font-semibold">Değerlendirme</p>
                      <p className="text-2xl font-bold text-purple-700">{viewingProduct.rating || 0}/5</p>
                      <p className="text-xs text-purple-600 mt-1">{viewingProduct.reviews || 0} değerlendirme</p>
                    </div>
                  </div>

                  {/* Açıklama */}
                  {viewingProduct.description && (
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                      <h4 className="font-semibold text-gray-700 mb-2">📄 Açıklama</h4>
                      <p className="text-gray-600 leading-relaxed">{viewingProduct.description}</p>
                    </div>
                  )}

                  {/* Teknik Özellikler */}
                  {viewingProduct.specifications && (
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                      <h4 className="font-semibold text-gray-700 mb-3">🔧 Teknik Özellikler</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {viewingProduct.specifications.material && (
                          <div className="flex justify-between py-1 border-b border-gray-200 last:border-b-0">
                            <span className="text-gray-600">Malzeme:</span>
                            <span className="font-medium text-gray-800">{viewingProduct.specifications.material}</span>
                          </div>
                        )}
                        {viewingProduct.specifications.weight && (
                          <div className="flex justify-between py-1 border-b border-gray-200 last:border-b-0">
                            <span className="text-gray-600">Ağırlık:</span>
                            <span className="font-medium text-gray-800">{viewingProduct.specifications.weight}</span>
                          </div>
                        )}
                        {viewingProduct.specifications.dimensions && (
                          <div className="flex justify-between py-1 border-b border-gray-200 last:border-b-0">
                            <span className="text-gray-600">Boyutlar:</span>
                            <span className="font-medium text-gray-800">{viewingProduct.specifications.dimensions}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Alt Bölüm - ID ve Tarih Bilgileri */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <h4 className="font-semibold text-gray-700 mb-3">📊 Sistem Bilgileri</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Ürün ID:</span>
                    <p className="font-mono text-gray-800 break-all">{viewingProduct._id}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Oluşturma Tarihi:</span>
                    <p className="text-gray-800">{viewingProduct.createdAt ? new Date(viewingProduct.createdAt).toLocaleDateString('tr-TR') : 'Bilinmiyor'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Son Güncelleme:</span>
                    <p className="text-gray-800">{viewingProduct.updatedAt ? new Date(viewingProduct.updatedAt).toLocaleDateString('tr-TR') : 'Bilinmiyor'}</p>
                  </div>
                </div>
              </div>

              {/* Dialog Alt Butonları */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <Button variant="outline" onClick={() => setIsViewProductOpen(false)}>
                  Kapat
                </Button>
                <Button 
                  onClick={() => {
                    setIsViewProductOpen(false)
                    handleEditProduct(viewingProduct)
                  }}
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  Düzenle
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
            <TabsTrigger value="products">Ürün Yönetimi</TabsTrigger>
            <TabsTrigger value="orders">Sipariş Yönetimi</TabsTrigger>
            <TabsTrigger value="customers">Müşteri Yönetimi</TabsTrigger>
            <TabsTrigger value="complaints">Şikayetler</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                        <p className="text-sm text-green-600 mt-1 font-semibold">{stat.change}</p>
                      </div>
                      <div className="p-3 rounded-full bg-gray-50">
                        <stat.icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Son Aktiviteler</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg border border-green-100">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <div className="flex-1">
                        <span className="text-sm font-medium text-gray-900">Yeni sipariş alındı: #1005</span>
                        <p className="text-xs text-gray-500">₺4,200 - Ayşe Demir</p>
                      </div>
                      <span className="text-xs text-gray-400">2 dk önce</span>
                    </div>
                    <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <span className="text-sm font-medium text-gray-900">Ürün stoku güncellendi</span>
                        <p className="text-xs text-gray-500">Diamond Ring - 5 adet kaldı</p>
                      </div>
                      <span className="text-xs text-gray-400">15 dk önce</span>
                    </div>
                    <div className="flex items-center gap-4 p-3 bg-purple-50 rounded-lg border border-purple-100">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <div className="flex-1">
                        <span className="text-sm font-medium text-gray-900">Yeni müşteri kaydı</span>
                        <p className="text-xs text-gray-500">Fatma Şen</p>
                      </div>
                      <span className="text-xs text-gray-400">1 saat önce</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Hızlı İşlemler</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="h-20 flex-col gap-2 hover:scale-105 transition-transform">
                      <Package className="h-6 w-6 text-yellow-600" />
                      <span className="text-sm">Stok Kontrolü</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col gap-2 hover:scale-105 transition-transform">
                      <ShoppingBag className="h-6 w-6 text-yellow-600" />
                      <span className="text-sm">Sipariş Durumu</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col gap-2 hover:scale-105 transition-transform">
                      <Users className="h-6 w-6 text-blue-600" />
                      <span className="text-sm">Müşteri Listesi</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col gap-2 hover:scale-105 transition-transform">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                      <span className="text-sm">Satış Raporu</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="relative w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Ürün ara..." className="pl-10" />
              </div>
              <Button 
                onClick={() => setIsAddProductOpen(true)}
                className="bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ürün Ekle
              </Button>
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ürün</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Fiyat</TableHead>
                    <TableHead>Stok</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        Yükleniyor...
                      </TableCell>
                    </TableRow>
                  ) : products.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        Henüz ürün bulunmuyor
                      </TableCell>
                    </TableRow>
                  ) : (
                    products.map((product) => (
                      <TableRow key={product._id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                            <span className="truncate max-w-48 font-medium">{product.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="capitalize">{product.category}</TableCell>
                        <TableCell className="font-semibold">
                          ₺{product.price ? product.price.toLocaleString('tr-TR') : '0'}
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                            product.stock === 0 ? 'bg-red-100 text-red-800' : 
                            product.stock < 10 ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-green-100 text-green-800'
                          }`}>
                            {product.stock}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge className={product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {product.isActive ? 'Aktif' : 'Pasif'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="hover:bg-yellow-50 hover:text-yellow-600"
                              onClick={() => handleViewProduct(product)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="hover:bg-blue-50 hover:text-blue-600"
                              onClick={() => handleEditProduct(product)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-600 hover:bg-red-50"
                              onClick={() => handleDeleteProduct(product._id, product.name)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sipariş Yönetimi</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sipariş No</TableHead>
                      <TableHead>Müşteri</TableHead>
                      <TableHead>Ürün Sayısı</TableHead>
                      <TableHead>Toplam</TableHead>
                      <TableHead>Durum</TableHead>
                      <TableHead>Tarih</TableHead>
                      <TableHead>İşlemler</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id} className="hover:bg-gray-50">
                        <TableCell className="font-mono font-semibold">#{order.id}</TableCell>
                        <TableCell className="font-medium">{order.customer}</TableCell>
                        <TableCell>{order.items} ürün</TableCell>
                        <TableCell className="font-semibold">₺{order.total.toLocaleString('tr-TR')}</TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(order.status)}>
                            {order.status === 'completed' && 'Tamamlandı'}
                            {order.status === 'pending' && 'Bekliyor'}
                            {order.status === 'processing' && 'İşleniyor'}
                          </Badge>
                        </TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" className="hover:bg-yellow-50 hover:text-yellow-600">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Customers Tab */}
          <TabsContent value="customers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Müşteri Yönetimi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Müşteri Yönetimi</h3>
                  <p className="text-gray-600 mb-4">Müşteri listesi ve detaylı bilgiler yakında eklenecek.</p>
                  <Button variant="outline" className="hover:scale-105 transition-transform">
                    <Plus className="h-4 w-4 mr-2" />
                    Özellik Geliştiriliyor
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Complaints Tab */}
          <TabsContent value="complaints" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Müşteri Şikayetleri
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {complaints.map((complaint) => (
                    <div key={complaint.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-all duration-300 hover:shadow-md">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <AlertCircle className="h-5 w-5 text-orange-500" />
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900">{complaint.subject}</h4>
                            <p className="text-xs text-gray-500">{complaint.customer} • {complaint.date}</p>
                          </div>
                        </div>
                        <Badge className={getStatusBadge(complaint.status)}>
                          {complaint.status === 'open' && 'Açık'}
                          {complaint.status === 'resolved' && 'Çözüldü'}
                          {complaint.status === 'pending' && 'Bekliyor'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700 mb-3 leading-relaxed">{complaint.message}</p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="hover:bg-yellow-50 hover:border-yellow-300">
                          Yanıtla
                        </Button>
                        <Button size="sm" variant="outline" className="hover:bg-green-50 hover:border-green-300">
                          Çözüldü İşaretle
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
