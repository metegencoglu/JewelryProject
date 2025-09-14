'use client'

import { useState } from 'react'
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

interface AdminUser {
  _id: string
  email: string
  name: string
  role: string
}

interface AdminDashboardProps {
  onNavigate?: (page: string) => void
  adminUser?: AdminUser | null
}

export function AdminDashboard({ onNavigate, adminUser }: AdminDashboardProps) {
  const [selectedTab, setSelectedTab] = useState('overview')
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    description: ''
  })
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)

  const stats = [
    { title: 'Toplam Ürün', value: '1,247', icon: Package, color: 'text-blue-600', change: '+12%' },
    { title: 'Aktif Kullanıcı', value: '856', icon: Users, color: 'text-green-600', change: '+8%' },
    { title: 'Bugünkü Sipariş', value: '34', icon: ShoppingBag, color: 'text-purple-600', change: '+23%' },
    { title: 'Aylık Gelir', value: '₺125,500', icon: TrendingUp, color: 'text-yellow-600', change: '+15%' },
  ]

  const products = [
    { id: 1, name: 'Elegant Diamond Ring', category: 'Yüzükler', price: 8500, stock: 5, status: 'active', image: 'https://images.unsplash.com/photo-1603561596112-bb4de88e2bee?w=100' },
    { id: 2, name: 'Classic Pearl Necklace', category: 'Kolyeler', price: 3200, stock: 12, status: 'active', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=100' },
    { id: 3, name: 'Gold Chain Bracelet', category: 'Bilezikler', price: 2800, stock: 0, status: 'inactive', image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=100' },
    { id: 4, name: 'Silver Drop Earrings', category: 'Küpeler', price: 1850, stock: 8, status: 'active', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=100' },
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

  const handleAddProduct = () => {
    console.log('Adding product:', newProduct)
    setIsAddProductOpen(false)
    setNewProduct({ name: '', category: '', price: '', stock: '', description: '' })
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
              {adminUser && (
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{adminUser.name}</p>
                    <p className="text-xs text-gray-500">{adminUser.email}</p>
                  </div>
                  <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {adminUser.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
              )}
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onNavigate?.('logout')}
                className="text-red-600 hover:bg-red-50 hover:border-red-300"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Çıkış Yap
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtrele
              </Button>
              <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-yellow-600 hover:bg-yellow-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Yeni Ürün
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Yeni Ürün Ekle</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <Label htmlFor="name">Ürün Adı</Label>
                      <Input
                        id="name"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                        placeholder="Ürün adını girin"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Kategori</Label>
                      <Input
                        id="category"
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                        placeholder="Kategori seçin"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="price">Fiyat (₺)</Label>
                        <Input
                          id="price"
                          type="number"
                          value={newProduct.price}
                          onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="stock">Stok</Label>
                        <Input
                          id="stock"
                          type="number"
                          value={newProduct.stock}
                          onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                          placeholder="0"
                        />
                      </div>
                    </div>
                    <div>
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
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddProductOpen(false)}>
                      İptal
                    </Button>
                    <Button onClick={handleAddProduct} className="bg-yellow-600 text-white">
                      Ürün Ekle
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

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
                  {products.map((product) => (
                    <TableRow key={product.id} className="hover:bg-gray-50">
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
                      <TableCell>{product.category}</TableCell>
                      <TableCell className="font-semibold">₺{product.price.toLocaleString('tr-TR')}</TableCell>
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
                        <Badge className={getStatusBadge(product.status)}>
                          {product.status === 'active' ? 'Aktif' : 'Pasif'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" className="hover:bg-yellow-50 hover:text-yellow-600">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="hover:bg-blue-50 hover:text-blue-600">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
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
